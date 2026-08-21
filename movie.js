//http://www.omdbapi.com/?apikey=b8294bb2&s=
//http://img.omdbapi.com/?apikey=b8294bb2&


const movieList = document.querySelector(".movie__list");

async function scream() {

    const response = await fetch(
        `http://www.omdbapi.com/?apikey=b8294bb2&s=scream`
    );

    const data = await response.json();

    movieList.innerHTML = data.Search.map(movie => {
        return `
            <div class="movie">
                <img src="${movie.Poster}" class="movie__img">
                <h2>${movie.Title}</h2>
                <p>${movie.Year}</p>
            </div>
        `;
    }).join("");

}

scream();