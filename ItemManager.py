import os, json
from werkzeug.utils import secure_filename


class ItemManager:
    ITEM_ATTRIBUTES = ["materiau et support", "dimensions", "date", "lieu de conservation", "representation", "image",
                       "materialite", "presentation", "processus"]

    def __init__(self, item_file_path, item_folder_path):
        self.item_file_path = item_file_path
        self.item_folder_path = item_folder_path

        # On récupère tous les items sous forme d'une liste de dictionnaires
        self.items = self.read_items()

        # On indexe tous les items en fonction de leur id et de leur url pour pouvoir y accéder plus rapidement
        self.itemsById = {}
        self.itemsByUrl = {}
        self.lastId = 0
        self.index_items()

    @staticmethod
    def get_path(folder_path, file_name):
        return os.path.join(folder_path, file_name).replace("\\", "/")

    def read_json(self):
        with open(self.item_file_path, 'r') as file:
            content = file.read()
        content += "]" # Car on enregistre sans ça pour pouvoir écrire plus simplement à la fin
        return content  # Tout le fichier en string

    def read_items(self):
        return json.loads(self.read_json())

    def index_items(self):
        ''' Remplie deux dictionnaire avec les oeuvres en fonction de leur id et en fonction de leur url
        Si deux oeuvres ont le même id ou le même url alors c'est la dernière oeuvre ayant l'id/l'url qui est gardée '''

        for item in self.items:
            if "id" not in item:
                print("Impossible de charger l'oeuvre puisqu'elle n'a pas d'id :", item)
                continue
            if "url" not in item:
                print("Impossible de charger l'oeuvre puisqu'elle n'a pas d'url :", item)
                continue
            # id
            id = item["id"]
            self.itemsById[id] = item
            if id > self.lastId:
                self.lastId = id
            # url
            self.itemsByUrl[item["url"]] = item

    def create_url_name(self, name, incrementation=1):
        url_name = name.lower()
        url_name = secure_filename(url_name)
        url_name = url_name.replace("_", "-")
        url_name = url_name.replace(".", "-")
        if incrementation > 1:
            url_name = url_name + "-" + str(incrementation)

        if url_name in self.itemsByUrl:
            return self.create_url_name(name, incrementation + 1)
        else:
            return url_name

    def get_item(self, url_name):
        return self.itemsByUrl[url_name]

    @staticmethod
    def item_to_json(item):
        return json.dumps(item, sort_keys=True, indent=4)

    def save_item(self, name, author, attributes, file, upload_manager):
        try:
            # Tout d'abord on crée deux noms : un nom de fichier pour le stocker sur le serveur et un nom d'url
            # pour y accéder depuis un url
            url_name = self.create_url_name(name)

            # On enregistre l'image de l'oeuvre
            upload_path = upload_manager.upload_artwork(name, author, file)

            # Puis on crée l'objet json contenant toutes les informations à propos de l'oeuvre
            item = {
                "id": self.lastId + 1,
                "name": name,
                "author": author,
                "url": url_name,
                "src": "/" + upload_path
            }
            for attribute_name in attributes:
                if attribute_name not in self.ITEM_ATTRIBUTES:
                    print("Pour l'oeuvre", name, "quelqu'un n'est pas passé par le formulaire afin d'essayer d'ajouter"
                          " l'attribut :", attribute_name, "de valeur :", attributes[attribute_name])
                    continue
                item[attribute_name] = attributes[attribute_name]

            json_item = json.dumps(item, sort_keys=True, indent=4)
            with open(self.item_file_path, "a") as baseFile:
                baseFile.write(",\n")
                baseFile.write(json_item)

            self.items.append(item)
            self.itemsById[item["id"]] = item
            self.lastId += 1
            self.itemsByUrl[item["url"]] = item

            return True  # Pas d'erreur

        except Exception as e:
            print("Erreur lors de l'enregistrement de l'oeuvre", name, ":")
            print(e)
            return False  # Erreur

    def update_item_urls(self):
        """ Fonction qui recréer les urls de tous les items en fonction de leur nom.
        À utiliser avec précaution pour éviter que l'utilisateur ne puisse plus accéder à certaine œuvre avec des urls
        préalablement enregistrée maintenant obsolete."""
        for item in self.items:
            if "url" not in item:
                print(item)
                item["url"] = self.create_url_name(item["name"])

    def save_as_new_file(self, file_name):
        if os.path.exists(self.get_path(self.item_folder_path, file_name)):
            print("Impossible de créer le nouveau fichier car un fichier du même nom existe déjà.")
            return
        with open(self.get_path(self.item_folder_path, file_name), "x") as file:
            # for item in items:
            #    jsonItem = json.dumps(item, sort_keys=True, indent=4)
            #    file.write(jsonItem)
            json_string = json.dumps(self.items, sort_keys=True, indent=4)
            file.write(json_string)
