## Open Library API

[Site](https://priotts.github.io/JsOpenLibrary/) application with the aim of promoting book reading through the external Open Library service.
## Description
The application consists of a simple textbox to allow the user to search for all books in a specific category.
    
Once the user clicks on the button, the application contacts the API of the external Open Library service, and searches for the category entered by the user. Once the application retrieves the list of books, it displays the title and the list of authors and the description retrieved via a new API request.
## Project features
- The application is developed with JavaScript, css, html
- The application makes an initial API request, and in case there are books it saves in a Book class. After that it retrieves the data from the Book class and makes a second API call passing the key of the individual book to retrieve the description and updates the class
- To improve performance, a paging system was implemented
## Installation
- Clone the repository

```bash
    git clone https://github.com/Priotts/JsOpenLibrary
```

- Type 

```bash
    npm init -y
```

- Install the project dependencies (you can find them in the requirements.txt file): 

```bash
    npm install webpack webpack-cli webpack-dev-server style-loader html-webpack-plugin gh-pages dotenv-webpack css-loader -D
```

- Create the `.env` file and enter the OpenLibrary url (.env_example)

- Create the JavaScript bundle file by typing

```bash
    npm run build 
```

- Start a demo by typing
```bash
    npm run dev
```

- If you want to create a github page go to `package.json` and change the homepage link to your repo link
