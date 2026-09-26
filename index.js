const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector(".search__button");
const menuOpen = document.querySelector(".menu__open");
const menuClose = document.querySelector(".menu__close");
const menu = document.querySelector(".burger");

menuOpen.addEventListener("click", function () {
    menu.classList.add("active");
    console.log('button works')
});

menuClose.addEventListener("click", function () {
    menu.classList.remove("active");
    console.log('button works')
});

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