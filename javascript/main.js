const apiKey = `ebcf5c408d8052c002cc7ab66e830c85`;

const getMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;
const searchButton = document.querySelector('.search')
const input = document.querySelector('input')
const moviesContainer = document.querySelector('.main-container')
const checkboxInput = document.querySelector('input[type="checkbox"]')


const getMovies = async () => {
    const fetchResponse = await fetch(getMoviesUrl)
    const { results } = await fetchResponse.json()
    return results


}

// FUNÇÃO PROCURAR O FILME 
const searchMovie = async () => {
    const inputValue = input.value
    if (inputValue != '') {
        cleanAllMovies()
        const movies = await searchMovieByName(inputValue)
        movies.forEach(movie => renderMovie(movie))
    }
}

searchButton.addEventListener('click', searchMovie)
input.addEventListener('keyup', (event) => {
    console.log(event.key)
    if (event.keyCode == 13) {
        searchMovie()
        return
    }
})

const cleanAllMovies = () => {
    moviesContainer.innerHTML = ''
}

const searchMovieByName = async (title) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&l&query=${title}&language=en-US&page=1`
    const fetchResponse = await fetch(url)
    const { results } = await fetchResponse.json()
    return results
}
const getPopularMovies = async (title) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&l&query=${title}&language=en-US&page=1`
    const fetchResponse = await fetch(url)
    const { results } = await fetchResponse.json()
    return results
}

// FUNÇÃO BOTÃO FAVORITO
const favoriteButtonPressed = (event, movie) => {
    const favoriteState = {
        favorited: 'images/heart-fill.svg',
        notFavorited: 'images/heart.svg'
    }

    if (event.target.src.includes(favoriteState.notFavorited)) {
        event.target.src = favoriteState.favorited
        saveToLocalStorage(movie)

    } else {
        event.target.src = favoriteState.notFavorited
        removeFromLocalStorage(movie.id)

    }
}

function getFavoriteMovies() {
    return JSON.parse(localStorage.getItem('favoriteMovies'))
}

function saveToLocalStorage(movie) {
    const movies = getFavoriteMovies() || []
    movies.push(movie)
    const moviesJSON = JSON.stringify(movies)
    localStorage.setItem('favoriteMovies', moviesJSON)
}

function checkMovieIsFavorited(id) {
    const movies = getFavoriteMovies() || []
    return movies.find(movie => movie.id == id)
}

function removeFromLocalStorage(id) {
    const movies = getFavoriteMovies() || []
    const findMovie = movies.find(movie => movie.id == id)
    const newMovies = movies.filter(movie => movie.id != findMovie.id)
    localStorage.setItem('favoriteMovies', JSON.stringify(newMovies))
}

checkboxInput.addEventListener('change', checkCheckboxStatus)
searchButton.addEventListener('click', searchMovie)
input.addEventListener('keyup', function (event) {
    console.log(event.key)
    if (event.keycode == 13) {
        searchMovie()
        return
    }
})

function checkCheckboxStatus() {
    const isChecked = checkboxInput.checked
    if (isChecked) {
        cleanAllMovies()
        const movies = getFavoriteMovies() || []
        movies.forEach(movie => renderMovie(movie))

    } else {
        cleanAllMovies()
        getAllmovies()
    }
}

async function getAllmovies() {
    const movies = await getMovies()
    movies.forEach(movie => renderMovie(movie))
}


window.onload = function () {
    getAllmovies()
}

const seleciona = (elemento) => document.querySelector(elemento)


// FUNÇÃO QUE PREENCHE O CARD DOS FILMES COM DADOS CONTIDOS NA API

function preencheCard(movieItem, movie) {
    const { poster_path } = movie
    const image = `https://image.tmdb.org/t/p/w500${poster_path}`;

    movieItem.querySelector('.card-container h2').innerHTML = movie.title
    movieItem.querySelector('.card-img img').src = image
    movieItem.querySelector('.card-container p').innerHTML = movie.overview
    movieItem.querySelector('.rate').innerHTML = movie.vote_average
}


// FUNÇÃO QUE RENDERIZA OS FILMES NA TELA

function renderMovie(movie, index) {
    const movieItem = seleciona('.model .card-container').cloneNode(true)
    preencheCard(movieItem, movie, index)
    seleciona('.main-container').append(movieItem)

    const { id } = movie
    const isFavorited = checkMovieIsFavorited(id)


    const btnShow = movieItem.querySelector('.img-container')
    const btnDown = movieItem.querySelector('.down')
    const btnUp = movieItem.querySelector('.up')
    movieItem.classList.add('hide')


    btnShow.addEventListener('click', () => {
        show()
        btnUpDown()
    })


    // FUNÇÃO QUE MOSTRA A DESCRICAO DO FILME E TROCA A SETA PARA CIMA OU PARA BAIXO
    function show() {

        if (movieItem.classList.contains('hide')) {
            movieItem.classList.add('show')
            movieItem.classList.remove('hide')
        } else {
            movieItem.classList.remove('show')
            movieItem.classList.add('hide')
        }
    }

    function btnUpDown() {
        if (btnUp.classList.contains('hide-menu')) {
            btnUp.classList.remove('hide-menu')
            btnUp.classList.add('show-menu')
            btnDown.classList.add('hide-menu')

        } else if (btnDown.classList.contains('hide-menu')) {
            btnUp.classList.remove('show-menu')
            btnUp.classList.add('hide-menu')
            btnDown.classList.remove('hide-menu')
            btnDown.classList.add('show-menu')
        }
    }


    const btnLike = movieItem.querySelector('.like')
    btnLike.addEventListener('click', (event) => {
        favoriteButtonPressed(event, movie)
        console.log(localStorage)
    })

    btnLike.src = isFavorited ? 'images/heart-fill.svg' : 'images/heart.svg'

}