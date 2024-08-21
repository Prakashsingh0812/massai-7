const apiKey = 'a9615070'; // Replace with your actual OMDB API key
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const errorDiv = document.getElementById('error');
const paginationDiv = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

let currentPage = 1;
let totalResults = 0;
let totalPages = 0;
let currentQuery = '';

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    currentQuery = searchInput.value.trim();
    if (currentQuery) {
        searchMovies(currentQuery, 1);
    }
});

prevPageBtn.addEventListener('click', function () {
    if (currentPage > 1) {
        searchMovies(currentQuery, currentPage - 1);
    }
});

nextPageBtn.addEventListener('click', function () {
    if (currentPage < totalPages) {
        searchMovies(currentQuery, currentPage + 1);
    }
});

function searchMovies(query, page) {
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                displayResults(data.Search);
                currentPage = page;
                totalResults = data.totalResults;
                totalPages = Math.ceil(totalResults / 10);
                updatePagination();
                errorDiv.textContent = '';
            } else {
                displayError(data.Error);
            }
        })
        .catch(() => displayError('Failed to fetch data. Please try again.'));
}

function displayResults(movies) {
    resultsDiv.innerHTML = movies.map(movie => `
        <div class="movie">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/50x75?text=No+Image'}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        </div>
    `).join('');
}

function updatePagination() {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

function displayError(message) {
    resultsDiv.innerHTML = '';
    paginationDiv.style.display = 'none';
    errorDiv.textContent = message;
}

