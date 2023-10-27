import '../css/styles.css'
import '../assets/images/arrow.svg'
import '../assets/images/loader.svg'

import axios from 'axios'

//VARIABLE 
let showP = document.getElementById('show-paragraph');
let info = document.getElementById('info');
let input = document.getElementById('search-box');
let searchBtn = document.getElementById('search-button')
let result = document.querySelector('.result-container');
let errorContainer = document.getElementById('error-container');
let err = document.getElementById('error');
let previousBtn = document.getElementById('previous-button')
let nextBtn = document.getElementById('next-button')
let imgArrow = document.getElementById('arrow')
let resultSection = document.getElementById('result-section')
let loader = document.getElementById('loader')
let inputValue = input.value.toLowerCase();
// PAGINATION VARIABLES
let baseURL = process.env.base;
let postPerPage = 4
let offset = 0

//Show paragraph listener
showP.addEventListener('click', () => {
    if (info.style.display === 'none') {
        info.style.display = 'block';
        showP.innerText = 'HIDE'
    } else {
        info.style.display = 'none';
        showP.innerText = 'SHOW MORE'
    }
})

//BOOK CLASS
class Book {
    constructor(title, author, key, description) {
        this.title = title;
        this.author = author;
        this.key = key;
        this.description = description;
    }
}

//Create Element function
function createElement(type, className, id, text) {
    let newElem = document.createElement(type);
    newElem.classList.add(className);
    newElem.id = id;
    newElem.innerText = text;
    result.append(newElem);
    return newElem;
}

//GetData
// Fetches data from the Open Library API
async function getData(url) {
    try {
        // Checks if input value is empty
        if (input.value.length === 0) {
            errorContainer.style.display = 'block';
            err.innerText = 'Please enter a category.';
            return;
        }
        // Fetches data from Open Library API
        let response = await axios.get(`${url}/subjects/${(input.value).toLowerCase()}.json?&limit=${postPerPage}&offset=${offset}`);
        // Checks if request was successful
        if (response.status === 200) {
            // JSON response
            let data = response.data
            const works = data.works
            // Checks if there are any works
            if (works.length > 0) {
                return works
            }
            else {
                errorContainer.style.display = 'block';
                err.innerText = 'No books found.';
                return
            }
        }
    } catch (e) {
        onErr(e)
    }
}

//Create data
async function createData(data) {
    let books = [];
    try {
        if (data === undefined) {
            return
        }
        else {
            data.map(element => {
                let title = element.title
                let author = element.authors.map(author => author.name)
                let key = element.key
                let description = element.description
                let book = new Book(title, author, key, description)
                books.push(book)
            });
            return books
        }
    } catch (e) {
        onErr(e)
    }
}

//Create description
async function createDescription(books) {
    try {
        if (books === undefined) {
            return;
        }
        await Promise.all(books.map(async book => {
            let response = await axios.get(`${baseURL}${book.key}.json`);
            let data =  response.data;
 
            if (typeof data.description === 'string') {
                book.description = data.description;
            } else if (typeof data.description === 'object') {
                book.description = data.description.value;
            } else {
                book.description = 'No description';
            }
        }));
        return books
    }
    catch (e) {
        onErr(e)
    }
}

//Show/hide Description
function showDescription(element) {
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

//Show data
function showData(element) {
    if (element === undefined) {
        imgArrow.style.display = 'none'
        resultSection.style.display = 'none'
        nextBtn.style.display = 'none'
        previousBtn.style.display = 'none'
        return
    }
    else {
        resultSection.style.display = 'flex'
        imgArrow.style.display = 'flex'
        nextBtn.style.display = 'block'
        previousBtn.style.display = 'block'
        element.forEach(book => {
            let cardResult = createElement('div', 'card-result', '', ``);
            let title = createElement('div', 'title', 'title', `${book.title}`);
            let author = createElement('div', 'author', 'author', `${book.author}`);
            let infoBtn = createElement('button', 'button', 'infoBtn', 'Info');
            let description = createElement('div', 'description', 'description', `${book.description}`);
            description.style.display = 'none';
            infoBtn.addEventListener('click', () => {
                showDescription(description)
            })
            cardResult.append(title, author, infoBtn, description);
        });
    }
}

//Next
async function nextPage() {
    offset += postPerPage;
    const data = await getData(baseURL);
    const books = await createData(data);
    const description = await createDescription(books)
    const existingBooks = document.querySelectorAll('.card-result');
    for (const book of existingBooks) {
        book.remove();
    }
    showData(description)
}

//Previous 
async function previousPage() {
    offset -= postPerPage;
    const data = await getData(baseURL);
    const books = await createData(data);
    const description = await createDescription(books)
    const existingBooks = document.querySelectorAll('.card-result');
    for (const book of existingBooks) {
        book.remove();
    }
    showData(description)
}

//Next and previous button listener
nextBtn.addEventListener('click', () => {
    nextPage()
})

previousBtn.addEventListener('click', () => {
    previousPage()
})

//Error
function onErr(error) {
    errorContainer.style.display = 'block'
    switch (error.name) {
        default:
            console.error(error.message)
            err.innerText = 'Error'
    }
}

// Show loader
function showLoader() {
    loader.style.display = 'block';
}

// Hide loader
function hideLoader() {
    loader.style.display = 'none';
}

//MAIN
async function main() {
    showLoader();
    imgArrow.style.display = 'none'
    result.innerHTML = '';
    err.innerText = '';
    const data = await getData(baseURL);
    const books = await createData(data);
    const description = await createDescription(books)
    showData(description)
    hideLoader();
}

//Search button listener
searchBtn.addEventListener('click', () => {
    main()
})