from ItemManager import *


ITEM_FOLDER_PATH = "data"
ITEM_FILE_PATH = "data/oeuvres.json"

itemManager = ItemManager(ITEM_FILE_PATH, ITEM_FOLDER_PATH)
itemManager.update_item_urls()
itemManager.save_as_new_file("oeuvres-2.json")
