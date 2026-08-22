const API_KEY = "b8294bb2";
const API_URL = "https://www.omdbapi.com/";

const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector(".search__button");

function goToMoviePage() {
    const movieName = searchInput.value.trim();

    if (movieName === "") {
        alert("Please type a movie name.");
        return;
    }

    window.location.href = `movie.html?search=${encodeURIComponent(movieName)}`;
}

searchButton.addEventListener("click", goToMoviePage);

searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        goToMoviePage();
    }
});