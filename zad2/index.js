const fetchSearchResults = async (value) => {
    const result = await fetch(`https://dummyjson.com/products/search?q=${value}&limit=10&delay=1000`);
    return await result.json();
};

const loaderElement = document.querySelector('#loader');
const resultsContainerElement = document.querySelector('#resultsContainer');
const searchInputElement = document.querySelector('#searchInput');
const searchButtonElement = document.querySelector('#searchButton');

const clearResults = () => {
    resultsContainerElement.innerHTML = '';
};

searchInputElement.addEventListener('input', clearResults);
searchInputElement.addEventListener('click', clearResults);
searchInputElement.addEventListener('blur', clearResults);

const displayResults = (results) => {
    resultsContainerElement.innerHTML = '';

    if (results && results.products && results.products.length > 0) {
        const arrowElement = document.createElement('div');
        arrowElement.classList.add('arrow');
        resultsContainerElement.appendChild(arrowElement);

        const ulElement = document.createElement('ul');
        results.products.forEach((result) => {
            const liElement = document.createElement('li');

            const titleSpan = document.createElement('span');
            titleSpan.textContent = result.title;
            liElement.appendChild(titleSpan);

            const priceSpan = document.createElement('span');
            priceSpan.textContent = `$${result.price}`;
            liElement.appendChild(priceSpan);

            ulElement.appendChild(liElement);
        });

        resultsContainerElement.appendChild(ulElement);
    } else {
        resultsContainerElement.textContent = 'No results found';
    }
};

const performSearch = async () => {
    loaderElement.classList.add('is-visible');
    const searchInputValue = searchInputElement.value;
    const results = await fetchSearchResults(searchInputValue);
    loaderElement.classList.remove('is-visible');
    displayResults(results);
};

searchInputElement.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

searchButtonElement.addEventListener('click', async () => {
    performSearch();
});