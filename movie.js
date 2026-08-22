const API_KEY = "55244497";
const API_URL = "https://www.omdbapi.com/";

const movieList = document.querySelector(".movie__list");
const genreFilter = document.querySelector("#genreFilter");

let movies = [];

const movieSearchTerms = [
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
    "grown",
];

async function searchMovies() {
    const params = new URLSearchParams(window.location.search);
    const movieName = params.get("search");

    if (movieName && movieName.trim() !== "") {
        await fetchMovies(movieName.trim());
    } else {
        await loadMovieCatalog();
    }
}

async function fetchMovies(searchTerm) {
    showLoadingMessage();

    try {
        const searchResponse = await fetch(
            `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
                searchTerm
            )}&type=movie`
        );

        if (!searchResponse.ok) {
            throw new Error(`HTTP error: ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();

        console.log("Search response:", searchData);

        if (searchData.Response === "False") {
            movies = [];
            movieList.innerHTML = `<p>${searchData.Error}</p>`;
            return;
        }

        const movieDetails = await Promise.all(
            searchData.Search.map(function (movie) {
                return getMovieDetails(movie.imdbID);
            })
        );

        movies = movieDetails.filter(function (movie) {
            return movie !== null;
        });

        displayMovies(movies);
    } catch (error) {
        console.error("Search error:", error);

        movieList.innerHTML = `
            <p>Something went wrong while searching for movies.</p>
            <p>${error.message}</p>
        `;
    }
}

async function getMovieDetails(imdbID) {
    try {
        const response = await fetch(
            `${API_URL}?apikey=${API_KEY}&i=${imdbID}&plot=short`
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === "True") {
            return data;
        }

        console.error("Movie details error:", data.Error);
        return null;
    } catch (error) {
        console.error("Details error:", error);
        return null;
    }
}

async function loadMovieCatalog() {
    showLoadingMessage();

    try {
        const searchRequests = movieSearchTerms.map(function (term) {
            return fetch(
                `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
                    term
                )}&type=movie&page=1`
            ).then(function (response) {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                return response.json();
            });
        });

        const searchResults = await Promise.all(searchRequests);

        let searchMovies = [];

        searchResults.forEach(function (result) {
            if (result.Response === "True" && result.Search) {
                searchMovies.push(...result.Search);
            }
        });

        const uniqueMovies = [];
        const movieIDs = new Set();

        searchMovies.forEach(function (movie) {
            if (!movieIDs.has(movie.imdbID)) {
                movieIDs.add(movie.imdbID);
                uniqueMovies.push(movie);
            }
        });

        const movieDetails = await Promise.all(
            uniqueMovies.map(function (movie) {
                return getMovieDetails(movie.imdbID);
            })
        );

        movies = movieDetails.filter(function (movie) {
            return movie !== null;
        });

        displayMovies(movies);
    } catch (error) {
        console.error("Catalog error:", error);

        movieList.innerHTML = `
            <p>Something went wrong while loading movies.</p>
            <p>${error.message}</p>
        `;
    }
}

function showLoadingMessage() {
    movieList.innerHTML = "<p>Loading movies...</p>";
}

function displayMovies(movieArray) {
    movieList.innerHTML = "";

    if (!movieArray || movieArray.length === 0) {
        movieList.innerHTML = "<p>No movies found.</p>";
        return;
    }

    movieArray.forEach(function (movie) {
        const poster =
            movie.Poster && movie.Poster !== "N/A"
                ? movie.Poster
                : "assets/no-poster.jpg";

        const movieElement = document.createElement("div");
        movieElement.className = "movie";

        movieElement.innerHTML = `
            <img
                src="${poster}"
                alt="${movie.Title || "Movie poster"}"
                loading="lazy"
            >

            <h2>${movie.Title || "Unknown title"}</h2>

            <p>
                <strong>Year:</strong>
                ${movie.Year || "Unknown"}
            </p>

            <p>
                <strong>Genre:</strong>
                ${movie.Genre || "Unknown"}
            </p>

            <p>
                <strong>Rating:</strong>
                ${
                    movie.imdbRating && movie.imdbRating !== "N/A"
                        ? movie.imdbRating
                        : "Not rated"
                }
            </p>
        `;

        movieList.appendChild(movieElement);
    });
}

function filterMoviesByGenre() {
    const selectedGenre = genreFilter.value.toLowerCase();

    if (selectedGenre === "all") {
        displayMovies(movies);
        return;
    }

    const filteredMovies = movies.filter(function (movie) {
        return (
            movie.Genre &&
            movie.Genre.toLowerCase().includes(selectedGenre)
        );
    });

    displayMovies(filteredMovies);
}

if (genreFilter) {
    genreFilter.addEventListener("change", filterMoviesByGenre);
}

if (movieList) {
    searchMovies();
}