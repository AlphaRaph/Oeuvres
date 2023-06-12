function effectuerRecherche() {
    const searchedValue = searchBar.value;
    var urlRecherche = "/HTML/catalogue.html?search=" + encodeURIComponent(searchedValue);
    window.location.href = urlRecherche;
}

const searchBar = document.querySelector("#search-bar");
console.log("searchBAR : ", searchBar);
searchBar.addEventListener("change", effectuerRecherche);
const loupe = document.querySelector(".loupe-image");
loupe.addEventListener("click", effectuerRecherche);
console.log("He he !")
