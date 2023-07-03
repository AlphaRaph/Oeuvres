window.addEventListener("load", async () => {
    const sectionContainer = document.querySelector(".container");
    const json = await fetch(window.location.href+"/json");
    console.log("json : ", json);
    const article = await json.json();
    console.log("article : ", article);


    /// création de la div "Image"
    const imageDiv = document.createElement("div");
    imageDiv.classList = ["image-div"];

    /* Création de l'image */
    const srcElement = document.createElement("img");
    console.log("article.src", article.src);
    srcElement.src = article.src;
    imageDiv.appendChild(srcElement)
    sectionContainer.appendChild(imageDiv)
    

    /// création de la div "information" dans laquelle se trouve toutes les informations 
    /// telles que le nom de l'auteur, la date, le lieu de conservation ...
    const infoDiv = document.createElement("div");
    infoDiv.classList = ["info-div"];

    // Sous div "title"
    const titleDiv = document.createElement("div");
    titleDiv.classList = ["title-div"];

    const nomElt = document.createElement("h1");
    nomElt.innerText = article.name;
    const authorElt = document.createElement("h2");
    authorElt.innerText = article.author;

    // Sous div "detail"
    const detailDiv = document.createElement("div");
    detailDiv.classList = ["detail-div"];

    const titleDetailsElt = document.createElement("h3");
    titleDetailsElt.innerText = "Informations : ";
    const materiauEtSupportElt = document.createElement("p");
    materiauEtSupportElt.innerText = "materiau et support : " + article["materiau et support"];
    const dimensionsElt = document.createElement("p");
    dimensionsElt.innerText = "dimensions : " + article["dimensions"];
    const dateElt = document.createElement("p");
    dateElt.innerText = "date : " + article["date"];
    const lieuDeConservationElt = document.createElement("p");
    lieuDeConservationElt.innerText = "lieu de conservation : " + article["lieu de conservation"];

    // Ajout des élements à la div "information"
    titleDiv.appendChild(nomElt);
    titleDiv.appendChild(authorElt);
    detailDiv.appendChild(titleDetailsElt);
    detailDiv.appendChild(materiauEtSupportElt);
    detailDiv.appendChild(dimensionsElt);
    detailDiv.appendChild(dateElt);
    detailDiv.appendChild(lieuDeConservationElt);
    infoDiv.appendChild(titleDiv);
    infoDiv.appendChild(detailDiv);
    sectionContainer.appendChild(infoDiv);



    /* Ajout des éléments créés à l'HTML */


    /// Création de la div "Categories" dans laquelle se trouve les filtres des différentes catégories
    const categoriesDiv = document.createElement("div");
    categoriesDiv.classList = ["categories-div"];

    // Création de tous les éléments de cette div
    const titleCategoriesElt = document.createElement("h3");
    titleCategoriesElt.innerText = "Caractéristiques : ";
    const representationElement = document.createElement("p");
    representationElement.innerText =  `Représentation: ${article.representation}/5`
    const imageElement = document.createElement("p");
    imageElement.innerText =  `Image: ${article.image}/5`
    const materialiteElement = document.createElement("p");
    materialiteElement.innerText =  `Matérialité: ${article.materialite}/5`
    const processusElement = document.createElement("p");
    processusElement.innerText = `Procéssus: ${article.processus}/5`
    const presentationElement = document.createElement("p");
    presentationElement.innerText =  `Représentation: ${article.presentation}/5`
    
    // Ajout des filtres à la div "Categories"
    sectionContainer.appendChild(categoriesDiv)
    categoriesDiv.appendChild(titleCategoriesElt)
    categoriesDiv.appendChild(representationElement)
    categoriesDiv.appendChild(imageElement)
    categoriesDiv.appendChild(materialiteElement)
    categoriesDiv.appendChild(processusElement)
    categoriesDiv.appendChild(presentationElement)
});