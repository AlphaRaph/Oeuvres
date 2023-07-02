
function createItem (item) {
    // Création d'un bloque pour l'item
    const itemElement = document.createElement("div");
    itemElement.classList = ["item"];

    // Ajout d'une image en fond
    itemElement.style.backgroundImage = "url(" + item.src + ")";
    
    // Creation du nom et du prix qui s'afficheront par dessus l'image grâce à la position absolue
    const itemContentDiv = document.createElement("div");
    itemContentDiv.classList = ["item-content"];

    const nameElement = document.createElement("h3");
    nameElement.innerText = item.name;
    const authorElement = document.createElement("p");
    authorElement.innerText = item.author;

    itemContentDiv.appendChild(nameElement);  
    itemContentDiv.appendChild(authorElement);

    itemElement.appendChild(itemContentDiv);

    // Ajout de l'item au html
    ITEMS_SECTION.appendChild(itemElement);
}

function updateItems (items) {
    /* Fonction qui supprime tous les articles de la page puis réaffiche la liste des articles
    passés en paramètre */
    ITEMS_SECTION.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
        createItem(items[i]);
    }
}


function similarity(wordA, wordB) {
    /* Fonction qui compare deux mots et qui dit s'ils sont similaires ou différents
    Retourne une valeur en 0 et 1:
    - 1 : les deux mots sont identiques
    - 0 : les deux mots n'ont rien à voir 
    Complexité : wordA.length * wordB.length 
    Inventé par Raphaël BELLIOT (j'en suis très fier)*/

    // On met tout en minuscule pour éviter les problèmes
    wordA = wordA.toLowerCase();
    wordB = wordB.toLowerCase();
    // On regarde quel mot est le plus petit
    var shortWord = (wordA.length <= wordB.length) ? wordA : wordB;
    var longWord =  (wordA.length > wordB.length) ? wordA : wordB;
    var shortSize = shortWord.length;
    var longSize = longWord.length;

    let caracters = wordA.split("");

    // On parcourt le plus grand mot pour calculer les différences avec le petit
    // On le parcours plusieurs fois en décalant le petit mot pour faire face au préfixe
    // Les espaces on s'en fout
    var maxSimi = 0;
    for (let start = -shortSize; start < longSize; start++) {
        var cptSimi = 0;
        for (let i = 0; i < shortSize; i++) {
            // A chaque on compare avec la lettre avant et après pour éviter d'éliminer les fautes de frappes
            for (let j = -1; j <= 1; j++) {
                var pos = start + i + j;
                if (pos >= 0 && pos < longSize) {
                    if (shortWord[i] == longWord[pos]) {
                        cptSimi += 1;
                        break;
                    }
                }
            }
        }
        if (cptSimi > maxSimi) {
            maxSimi = cptSimi;
        }
        // console.log(`simi ${shortWord} vs ${longWord} start ${start} : ${cptSimi}`);
    }

    console.log(`simi ${longWord} vs ${shortWord} : `, maxSimi);
    var ratio = maxSimi / longSize;
    console.log("ratio : " + ratio);
    var similarity = ratio ** 2;
    console.log("similarity : " + similarity);

    return similarity;
}
function sentenceSimiliraty(sentenceA, sentenceB) {
    console.log("sentence A : ", sentenceA);
    console.log("sentence B : ", sentenceB);
    let wordsA = sentenceA.split(" ");
    let wordsB = sentenceB.split(" ");
    console.log("words A : ", wordsA);
    console.log("words B : ", wordsB);

    let somme = 0 // Somme des différences entre les mots
    for (let i = 0; i < wordsA.length; i++) {
        let wordA = wordsA[i];
        for (let j = 0; j < wordsB.length; j++) {
            let wordB = wordsB[j];
            somme += similarity(wordA, wordB) ** 2;
        }
    }

    if (wordsA.length > wordsB.length) {
        console.log("Moyenne : " + somme/wordsA.length);
        return somme / wordsA.length;
    }
    else {
        console.log("Moyenne : " + somme/wordsB.length);
        return somme / wordsB.length;
    }
}

function compareSearchItem(search, item) {
    return sentenceSimiliraty(search, item.author) + sentenceSimiliraty(search, item.name);
}

function search(words, items) {
    /* (str, list) -> list
    Renvoie la liste d'items triée pour correspondre au mieux aux mots recherchés */
    let ordonnedItems = Array.from(items);
    console.log(ordonnedItems);
    ordonnedItems = ordonnedItems.filter(item => compareSearchItem(words, item) >= 0);
    ordonnedItems.sort((itemB, itemA) => compareSearchItem(words, itemA) - compareSearchItem(words, itemB));
    return ordonnedItems;
}

function distance(categories, item) {
    /* (dict, jsonObject) 
    pré-condtion : les clés des catégories doivent correspondre aux nom des variables dans le fichier JSON */

    // On fait la somme des carrés en xA et xB par exemple 
    let sum = 0;
    for (var[name, value] of categories) {
        sum += (value - item[name]) ** 2;
    }
    // Puis on fait la racine carré de cette somme pour obtenir la distance
    return sum ** 0.5;
}

function filter(maxPrice, minPrice, categories, items) {
    /* (bool, int, int, dict, list) -> list
    Renvoie la liste d'items triée pour correspondre au mieux au filtres sélectionées */
    const ordonnedItems = Array.from(items);

    /// On commence par les filtres qui suppriment des ouevres
    // On sélectionne seulement les oeuvres dans la tranche de prix
    ordonnedItems.filter(item => item.price >= minPrice && item.price <= maxPrice);

    console.log(categories);
    /// Ensuite on s'attaque aux filtres qui ordonnent les oeuvres (les catégories)
    // Pour cela on calcule la distance en N dimensions entre les filtres sélectionnées et l'oeuvre pour ne pas les calculer plusieurs fois
    // (N est le nombre de catégories)
    // const distances = new Map(items, ordonnedItems.map(item => distance(categories, item))); // sert à rien pour l'instant car jsp comment faire pour l'inclure dans la fonction sort !!!
    //                                                                                     // Et marche surement pas
    
    //ordonnedItems.sort((a, b) => distance(categories, a) - distance(categories, b)) // a est avant b si a est plus proche que b des catégories 
    ordonnedItems.sort(function (a, b) {
        console.log("distance a", distance(categories, a));
        console.log("distance b", distance(categories, b));
        return distance(categories, a) - distance(categories, b);
    });
    
    // On renvoie la liste de nos items ordonnés
    return ordonnedItems;
}

function update() {
    /* Fonction principale qui affiche tous les éléments en fonction des filtres et de la recherche */

    // On récupère tous les valeurs de tous les filtres
    const categories = new Map();
    for (let i = 0; i < categoriesInputs.length; i++) {
        categories.set(CATEGORIES_NAMES[i], categoriesInputs[i].value);
    }
    console.log(categories);

    let searchedItems = items;
    if (searchBarInput.value != "") {
        searchedItems  = search(searchBarInput.value, items);
    }
    // const ordonnedItems = filter(maxPrice, minPrice, categories, searchedItems);
    
    updateItems(searchedItems);
}

function changeURL() {
    /* Fonction qui change l'url pour pour actualiser les filtres */
    
    // On récupère tous les valeurs de tous les filtres
    const maxPrice = maxPriceInput.input;
    const minPrice = minPriceInput.input;
    const categories = new Map();
    for (let i = 0; i < categoriesInputs.length; i++) {
        categories.set(CATEGORIES_NAMES[i], categoriesInputs[i].value);
    }

    const filtersForm = document.querySelector(".filters");
    filtersForm.submit();
}

function initialize() {
    /* Fonction qui s'occupe de récupérer les paramètres dans l'url pour afficher la bonne page */
    var parameters = location.search.substring(1).split("&"); // .substring(1) pour enlever le "?"
    console.log("location.search : " + location.search);

    for (let i = 0; i < parameters.length; i++) {
        let parameter = parameters[i].split("=");
        let pName = parameter[0]; // Car name il ne voulait pas
        let value = parameter[1];
        console.log("name : " + pName);
        value = decodeURIComponent(decodeURIComponent(value));
        console.log("value : ", value);

        if (pName == "search") {
            searchBarInput.value = decodeURI(value);
        }
        else if (CATEGORIES_NAMES.includes(pName)) {
            let index = CATEGORIES_NAMES.indexOf(pName);
            categoriesInputs[index].value = value;
        }
    }
}


var items;
var FILTERS_SECTION, ITEMS_SECTION;
var searchBarInput;
const CATEGORIES_NAMES = ["representation", "image", "materialite", "processus", "presentation"];
var categoriesInputs;

window.addEventListener("load", async () => {
    const reponse = await fetch("/oeuvres");
    items = await reponse.json();

    FILTERS_SECTION = document.querySelector(".filters-section");
    ITEMS_SECTION = document.querySelector(".items-section");


    /// On s'occupe des FILTRES et de la Search bar
    // Search bar 
    searchBarInput = document.querySelector("#search-bar");
    console.log("searchBarInput : ", searchBarInput);
    //searchBarInput.addEventListener("input", update);

    // Catégories
    categoriesInputs = [];
    // On récupère d'abord les catégories et on les relie à la fonction filter
    for (let i = 0; i < CATEGORIES_NAMES.length; i++) {
        const categoryInput = document.querySelector("#" + CATEGORIES_NAMES[i] + "-filter")
        categoryInput.addEventListener("change", changeURL)
        categoriesInputs.push(categoryInput); // .append
    }

    initialize(); // Actualisation des filtres et de la seach bar en fonction de l'URL
    update(); // Acualisation des oeuvres en fonction des filtres et de la search bar

    console.log("apparamment tout c'est bien passé");
});




