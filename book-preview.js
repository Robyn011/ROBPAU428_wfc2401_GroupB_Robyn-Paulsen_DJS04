// Import necessary data from external module
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Function to get query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id') // Get the 'id' parameter from the URL query string
    };
}

// Function to display book details on the preview page
function displayBookDetails() {
    const { id } = getQueryParams(); // Retrieve the book ID from the URL query parameters
    const book = books.find(book => book.id === id); // Find the book with the given ID from the imported books array

    if (book) { // If the book is found
        // Set the book details on the preview page elements
        document.getElementById('preview-image').src = book.image; // Set the book image
        document.getElementById('preview-title').innerText = book.title; // Set the book title
        document.getElementById('preview-author').innerText = authors[book.author]; // Set the book author
        document.getElementById('preview-description').innerText = book.description; // Set the book description
        document.getElementById('preview-published').innerText = `Published: ${new Date(book.published).toDateString()}`; // Set the book publication date
    }
}

// Function to navigate back to the original page
function goBack() {
    window.history.back(); // Go back to the previous page using browser history
}

// Add event listener to the back button
document.getElementById('back-button').addEventListener('click', goBack); // Listen for click event on the back button and call the goBack function

// Display book details on page load
window.onload = displayBookDetails; // When the window is loaded, call the displayBookDetails function to show book details on the preview page