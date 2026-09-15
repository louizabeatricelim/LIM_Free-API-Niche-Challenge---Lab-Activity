# BookFinder

A web-based book discovery application built using HTML, CSS, and JavaScript. BookFinder uses the Open Library public API to search and explore real book data.

## Live Demo

**Live Website:**
Add your Render URL here after deployment.

Example:

`https://bookfinder.onrender.com`

## GitHub Repository

**GitHub:**
Add your GitHub repository link here.

---

## About the Project

BookFinder is a simple book discovery website that allows users to search for books and explore different categories using real data from the Open Library API.

The application was created for the **ITCC 14 A Free API Niche Challenge - Lab Activity**.

The project demonstrates how a frontend application can communicate with a public API using JavaScript `fetch()` and display the returned JSON data dynamically.

---

## Features

### 1. Book Search

Users can search for books using:

* Book title
* Author
* Subject
* Keyword

The application retrieves real book information from the Open Library Search API.

### 2. Book Information

Search results display:

* Book cover
* Book title
* Author
* First publication year
* Number of editions
* View Book button

### 3. My Books

Users can save books to their personal **My Books** collection.

Saved books can be:

* Viewed from the My Books section
* Opened through the View Book button
* Removed from the collection

The My Books feature uses the browser's `localStorage` to save the user's selected books.

> My Books is stored locally in the user's browser. It is not connected to an online user account or database.

### 4. Browse by Subjects

Users can browse books based on different subjects, including:

* Fiction
* Fantasy
* Romance
* Mystery
* Science Fiction
* History
* Biography
* Poetry
* Philosophy
* Art
* Music
* Psychology

### 5. Trending Books

Users can view currently trending books using Open Library's trending data.

### 6. Library Explorer

Users can explore different book subjects directly within BookFinder.

### 7. Public Lists

Users can browse public reading lists available through Open Library.

### 8. Discover Books

The **Discover Books** button randomly selects a subject and displays books from that category.

### 9. Responsive Design

The website is designed to work on:

* Desktop
* Tablet
* Mobile devices

### 10. Loading and Error States

The application provides feedback while retrieving API data and displays an error message when a request fails.

---

## API Used

### Open Library API

BookFinder uses the **Open Library API**, a free and public API provided by Internet Archive's Open Library project.

**Official API Documentation:**

https://openlibrary.org/developers/api

### APIs Used in the Project

#### Search API

Used to search for books.

```text
https://openlibrary.org/search.json
```

#### Subjects API

Used to browse books by subject.

```text
https://openlibrary.org/subjects/{subject}.json
```

#### Trending API

Used to retrieve trending books.

```text
https://openlibrary.org/trending/daily.json
```

#### Lists API

Used to search public reading lists.

```text
https://openlibrary.org/search/lists.json
```

#### Covers API

Used to display book covers.

```text
https://covers.openlibrary.org/b/id/{cover_id}-M.jpg
```

---

## API Key Requirement

The Open Library API does **not require an API key** for the API requests used by this project.

The application communicates with the API using JavaScript `fetch()` requests.

Example:

```javascript
const response = await fetch(
    "https://openlibrary.org/search.json?q=harry+potter&limit=20"
);

const data = await response.json();
```

---

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Fetch API
* Open Library API
* Browser localStorage
* Git
* GitHub
* Render

No frontend frameworks or libraries are required.

---

## Project Structure

```text
BookFinder/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

### `index.html`

Contains the structure and content of the BookFinder website, including the navigation bar, search section, book results, and footer.

### `style.css`

Contains the visual design, layout, responsive styles, book cards, buttons, navigation dropdown, loading screen, and other interface elements.

### `script.js`

Handles:

* API requests
* Book searching
* Subject browsing
* Trending books
* Public lists
* Book rendering
* My Books
* localStorage
* Loading states
* Error handling
* User interactions

### `README.md`

Contains information about the project, API, features, technologies, and setup instructions.

---

## How to Run Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project folder

```bash
cd BookFinder
```

### 3. Open the website

Open `index.html` in a web browser.

A local development server such as VS Code Live Server can also be used.

---

## How to Deploy

BookFinder can be deployed as a static website using Render.

### Render Settings

Create a **Static Site** and connect the GitHub repository.

Use the following settings:

```text
Branch: main
Root Directory: .
Build Command: Leave blank
Publish Directory: .
```

After deployment, Render provides a public URL that can be used as the live website.

---

## How the Application Works

The basic flow of the application is:

```text
User enters a search
        ↓
JavaScript sends GET request
        ↓
Open Library API
        ↓
API returns JSON data
        ↓
JavaScript processes the data
        ↓
Book cards are generated
        ↓
Books are displayed on the webpage
```

For My Books:

```text
User clicks "+ My Books"
        ↓
Book information is saved
        ↓
Browser localStorage
        ↓
User opens "My Books"
        ↓
Saved books are displayed
```

---

## Example API Request

A search for books about Harry Potter can be performed using:

```text
https://openlibrary.org/search.json?q=harry%20potter&limit=20
```

The API returns JSON data containing information about matching books.

The JavaScript application then extracts information such as:

```text
Title
Author
First Publication Year
Edition Count
Cover ID
Open Library Work ID
```

and displays it as book cards.

---

## Limitations

* My Books is stored only in the user's browser.
* Saved books are not synchronized between different devices or browsers.
* The application does not have user accounts or authentication.
* Book information depends on data available through Open Library.
* Internet access is required for API requests.
* The application does not modify or store Open Library's book records.

---

## Learning Objectives

This project demonstrates the following concepts:

* Working with a public API
* Sending GET requests
* Using JavaScript `fetch()`
* Processing JSON responses
* Dynamically creating HTML elements
* Handling API errors
* Implementing loading states
* Creating interactive search and browsing features
* Using browser `localStorage`
* Creating a responsive web interface
* Deploying a static website
* Using Git and GitHub

---

## Credits

Book data is provided by **Open Library**.

Open Library:
https://openlibrary.org/

Open Library API Documentation:
https://openlibrary.org/developers/api

This project was created for educational purposes as part of **ITCC 14 A**.
