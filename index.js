/// ==============================
/// CONSTANTS
/// ==============================

const API_KEY = "55244497";
const API_URL = "https://www.omdbapi.com/";

const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector(".search__button");
const movieList = document.querySelector(".movie__list");
const genreFilter = document.querySelector("#genreFilter");

const menuOpen = document.querySelector(".menu__open");
const menuClose = document.querySelector(".menu__close");
const menu = document.querySelector(".burger");

let allMovies = [];

/// ==============================
/// BURGER MENU
/// ==============================

if (menuOpen && menuClose && menu) {
    menuOpen.addEventListener("click", () => {
        menu.classList.add("active");
    });

    menuClose.addEventListener("click", () => {
        menu.classList.remove("active");
    });
}

/// ==============================
/// MOVIE SEARCH TAGS
/// ==============================

const searchTerms = [
    "star",
    "love",
    "man",
    "girl",
    "night",
    "world",
    "life",
    "home",
    "dark",
    "war",
    "king",
    "scream",
    "spider",
    "grown"
];

/// ==============================
/// LOAD DEFAULT MOVIES
/// ==============================

async function loadMovies() {

    if (!movieList) return;

    movieList.innerHTML = "<p>Loading movies...</p>";

    const moviesMap = new Map();

    for (const term of searchTerms) {

        const response = await fetch(
            `${API_URL}?apikey=${API_KEY}&s=${term}`
        );

        const data = await response.json();

        if (!data.Search) continue;

        const detailedMovies = await Promise.all(

            data.Search.map(async movie => {

                const details = await fetch(
                    `${API_URL}?apikey=${API_KEY}&i=${movie.imdbID}`
                );

                return await details.json();

            })

        );

        detailedMovies.forEach(movie => {
            moviesMap.set(movie.imdbID, movie);
        });

    }

    allMovies = [...moviesMap.values()];
    displayMovies(allMovies);

}

/// ==============================
/// SEARCH BUTTON
/// ==============================

function goToMoviePage() {

    if (!searchInput) return;

    const movieName = searchInput.value.trim();

    if (movieName === "") {
        alert("Please type a movie name.");
        return;
    }

    window.location.href =
        `movie.html?search=${encodeURIComponent(movieName)}`;

}

if (searchButton) {
    searchButton.addEventListener("click", goToMoviePage);
}

if (searchInput) {

    searchInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            goToMoviePage();
        }

    });

}

/// ==============================
/// LOAD SEARCHED MOVIE
/// ==============================

async function loadSearchedMovie() {

    if (!movieList) return;

    const params = new URLSearchParams(window.location.search);
    const movieName = params.get("search");

    if (!movieName) {
        loadMovies();
        return;
    }

    movieList.innerHTML = "<p>Searching...</p>";

    const response = await fetch(
        `${API_URL}?apikey=${API_KEY}&s=${movieName}`
    );

    const data = await response.json();

    if (!data.Search) {

        movieList.innerHTML = "<p>No movies found.</p>";
        return;

    }

    const searchedMovies = await Promise.all(

        data.Search.map(async movie => {

            const details = await fetch(
                `${API_URL}?apikey=${API_KEY}&i=${movie.imdbID}`
            );

            return await details.json();

        })

    );

    allMovies = searchedMovies;
    displayMovies(searchedMovies);

}

/// ==============================
/// DISPLAY MOVIES
/// ==============================

function displayMovies(movieArray) {

    movieList.innerHTML = "";

    movieArray.forEach(movie => {

        movieList.innerHTML += `

    <div class="movie">

        <img
        src="${movie.Poster !== "N/A"
                ? movie.Poster
                : "https://placehold.co/300x450?text=No+Poster"}"
    alt="${movie.Title}"
        

        <h2>${movie.Title}</h2>

        <p>${movie.Year}</p>

        <p><strong>${movie.Genre}</strong></p>

    </div>

    `;

    });

}

/// ==============================
/// GENRE FILTER
/// ==============================

if (genreFilter) {

    genreFilter.addEventListener("change", () => {

        const selectedGenre = genreFilter.value;

        if (selectedGenre === "all") {

            displayMovies(allMovies);
            return;

        }

        const filteredMovies = allMovies.filter(movie =>
            movie.Genre.includes(selectedGenre)
        );

        displayMovies(filteredMovies);

    });

}

/// ==============================
/// START APP
/// ==============================

loadSearchedMovie();