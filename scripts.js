// Import necessary data from external module
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Application state variables
let page = 1; // Current page number for pagination
let matches = books; // Array to hold the filtered books, initially all books

// Function to create book preview elements
function createBookPreview(book) {
    const element = document.createElement('button'); // Create a button element for the book preview
    element.classList = 'preview'; // Add CSS class for styling
    element.setAttribute('data-preview', book.id); // Set a data attribute with the book's ID

    // Set the inner HTML of the button element with book details
    element.innerHTML = `
        <img class="preview__image" src="${book.image}" />
        <div class="preview__info">
            <h3 class="preview__title">${book.title}</h3>
            <div class="preview__author">${authors[book.author]}</div>
        </div>
    `;

    return element; // Return the created element
}

// Function to render book previews
function renderBookPreviews(bookList) {
    const fragment = document.createDocumentFragment(); // Create a document fragment to hold preview elements
    bookList.slice(0, BOOKS_PER_PAGE).forEach(book => {
        const previewElement = createBookPreview(book); // Create a preview element for each book
        fragment.appendChild(previewElement); // Append the preview element to the fragment
    });
    document.querySelector('[data-list-items]').appendChild(fragment); // Append the fragment to the DOM
}

// Function to populate dropdown with genres or authors
function populateDropdown(elementSelector, data, defaultOptionText = 'All') {
    const dropdown = document.querySelector(elementSelector); // Get the dropdown element
    const fragment = document.createDocumentFragment(); // Create a document fragment
    const firstOption = document.createElement('option'); // Create the default option element
    firstOption.value = 'any'; // Set value for the default option
    firstOption.innerText = `${defaultOptionText}`; // Set text for the default option
    fragment.appendChild(firstOption); // Append the default option to the fragment

    // Loop through the data and create an option element for each entry
    for (const [id, name] of Object.entries(data)) {
        const option = document.createElement('option'); // Create an option element
        option.value = id; // Set value attribute with the entry ID
        option.innerText = name; // Set text with the entry name
        fragment.appendChild(option); // Append the option to the fragment
    }
    dropdown.appendChild(fragment); // Append the fragment to the dropdown
}

// Function to handle form submission and filtering
function handleFormSubmission(event, itemList) {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData(event.target); // Create a FormData object from the form
    const filters = Object.fromEntries(formData); // Convert FormData to an object
    const result = books.filter(book => {
        let genreMatch = filters.genre === 'any'; // Check if the genre filter is set to 'any'

        // Loop through the genres of the book and check for a match
        for (const singleGenre of book.genres) {
            if (genreMatch) break; // Break the loop if a match is found
            if (singleGenre === filters.genre) { genreMatch = true; } // Set genreMatch to true if a match is found
        }

        // Return true if the book matches the filters, false otherwise
        return (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
            (filters.author === 'any' || book.author === filters.author) &&
            genreMatch
        );
    });

    page = 1; // Reset page number to 1
    matches = result; // Update matches with the filtered results
    itemList.innerHTML = ''; // Clear the current list of items
    renderBookPreviews(matches); // Render the filtered book previews
    updateShowMoreButton(); // Update the state of the "Show More" button
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
    document.querySelector('[data-search-overlay]').open = false; // Close the search overlay
}

// Function to update the theme
function updateTheme(theme) {
    // Define color schemes for 'night' and 'day' themes
    const colorScheme = theme === 'night' ? ['255, 255, 255', '10, 10, 20'] : ['10, 10, 20', '255, 255, 255'];
    document.documentElement.style.setProperty('--color-dark', colorScheme[0]); // Set CSS variable for dark color
    document.documentElement.style.setProperty('--color-light', colorScheme[1]); // Set CSS variable for light color
}

// Function to update the "Show More" button state
function updateShowMoreButton() {
    const remainingBooks = matches.length - (page * BOOKS_PER_PAGE); // Calculate remaining books to be displayed
    const button = document.querySelector('[data-list-button]'); // Get the "Show More" button element
    button.innerText = `Show more (${remainingBooks > 0 ? remainingBooks : 0})`; // Update button text with remaining books
    button.disabled = remainingBooks <= 0; // Disable button if no more books to show
}

// Event listeners for UI interactions
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false; // Close search overlay on cancel
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false; // Close settings overlay on cancel
});

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true; // Open search overlay
    document.querySelector('[data-search-title]').focus(); // Focus on the search title input
});

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true; // Open settings overlay
});

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false; // Close active book details overlay
});

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData(event.target); // Create a FormData object from the form
    const { theme } = Object.fromEntries(formData); // Convert FormData to an object and get the theme
    updateTheme(theme); // Update the theme based on the selected value
    document.querySelector('[data-settings-overlay]').open = false; // Close settings overlay
});

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    handleFormSubmission(event, document.querySelector('[data-list-items]')); // Handle search form submission
});

document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment(); // Create a document fragment to hold new preview elements
    const startIndex = page * BOOKS_PER_PAGE; // Calculate start index for the next set of books
    const endIndex = (page + 1) * BOOKS_PER_PAGE; // Calculate end index for the next set of books
    matches.slice(startIndex, endIndex).forEach(book => {
        const previewElement = createBookPreview(book); // Create a preview element for each book
        fragment.appendChild(previewElement); // Append the preview element to the fragment
    });
    document.querySelector('[data-list-items]').appendChild(fragment); // Append the fragment to the DOM
    page += 1; // Increment the page number
    updateShowMoreButton(); // Update the state of the "Show More" button
});

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const target = event.target.closest('[data-preview]'); // Get the closest preview element from the click event
    if (target) {
        const active = matches.find(book => book.id === target.dataset.preview); // Find the clicked book in matches
        if (active) {
            const { image, title, author, published, description } = active; // Destructure book details
            const listActive = document.querySelector('[data-list-active]'); // Get the active book details overlay
            listActive.open = true; // Open the active book details overlay
            document.querySelector('[data-list-blur]').src = image; // Set the blur image source
            document.querySelector('[data-list-image]').src = image; // Set the main image source
            document.querySelector('[data-list-title]').innerText = title; // Set the book title
            document.querySelector('[data-list-subtitle]').innerText = `${authors[author]} (${new Date(published).getFullYear()})`; // Set the subtitle with author and published year
            document.querySelector('[data-list-description]').innerText = description; // Set the book description
        }
    }
});

// Initial setup on page load
renderBookPreviews(matches); // Render initial set of book previews
populateDropdown('[data-search-genres]', genres, 'All Genres'); // Populate genre dropdown
populateDropdown('[data-search-authors]', authors, 'All Authors'); // Populate author dropdown
updateShowMoreButton(); // Update the state of the "Show More" button
