const API_KEY = "b8294bb2";
const API_URL = "https://www.omdbapi.com/";

const movieList = document.querySelector(".movie__list");
const genre = document.body.dataset.genre;
const movieNames = document.body.dataset.movies.split(",");

async function getMoviesByGenre() {
    if (!movieList) {
        console.error("Could not find .movie__list");
        return;
    }

    movieList.innerHTML = `<p>Loading ${genre} movies...</p>`;

    try {
        const movieRequests = movieNames.map(function (movieName) {
            const title = movieName.trim();

            return fetch(
                `${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`
            ).then(function (response) {
                return response.json();
            });
        });

        const movieDetails = await Promise.all(movieRequests);

        const validMovies = movieDetails.filter(function (movie) {
            return movie.Response === "True";
        });

        if (validMovies.length === 0) {
            movieList.innerHTML = `<p>No ${genre} movies found.</p>`;
            return;
        }

        movieList.innerHTML = validMovies.map(function (movie) {
            const poster =
                movie.Poster && movie.Poster !== "N/A"
                    ? movie.Poster
                    : "assets/no-poster.jpg";

            return `
                <div class="movie">
                    <img src="${poster}" alt="${movie.Title}">
                    <h2>${movie.Title}</h2>
                    <p>Year: ${movie.Year}</p>
                    <p>${movie.Genre}</p>
                    <p>${movie.Plot}</p>
                </div>
            `;
        }).join("");

    } catch (error) {
        console.error(error);

        movieList.innerHTML =
            "<p>Something went wrong while loading the movies.</p>";
    }
}

getMoviesByGenre();