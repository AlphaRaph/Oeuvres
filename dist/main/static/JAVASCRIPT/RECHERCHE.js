function effectuerRecherche() {
    const searchedValue = searchBar.value;
    var urlRecherche = "/catalogue?search=" + encodeURIComponent(searchedValue);
    window.location.href = urlRecherche;
}

var searchBar, loupe;
window.addEventListener("load", () => {
    searchBar = document.querySelector("#search-bar");
    searchBar.addEventListener("change", effectuerRecherche);
    loupe = document.querySelector(".loupe-image");
    loupe.addEventListener("click", effectuerRecherche);
});

