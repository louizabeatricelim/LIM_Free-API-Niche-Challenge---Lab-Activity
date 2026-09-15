/* =========================
   API SETTINGS
========================= */

const SEARCH_API = "https://openlibrary.org/search.json";
const SUBJECT_API = "https://openlibrary.org/subjects";
const TRENDING_API = "https://openlibrary.org/trending/daily.json";


/* =========================
   GET HTML ELEMENTS
========================= */

const searchForm =
    document.getElementById("searchForm");

const searchInput =
    document.getElementById("searchInput");

const discoverBtn =
    document.getElementById("discoverBtn");

const bookGrid =
    document.getElementById("bookGrid");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const resultsTitle =
    document.getElementById("resultsTitle");

const resultCount =
    document.getElementById("resultCount");


/* =========================
   API FETCH HELPER
========================= */

async function fetchJSON(url) {

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Request failed: ${response.status}`
        );
    }

    return await response.json();
}


/* =========================
   SEARCH BOOKS
========================= */

async function searchBooks(query) {

    if (!query.trim()) {

        showError(
            "Please enter a book title, author, or subject."
        );

        return;
    }

    showLoading();

    try {

        const url =
            `${SEARCH_API}?q=${encodeURIComponent(query)}&limit=20`;

        const data = await fetchJSON(url);

        resultsTitle.textContent =
            `Results for "${query}"`;

        resultCount.textContent =
            `${Number(data.numFound || 0).toLocaleString()} books found`;

        displayBooks(data.docs || []);

    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to load books. Please check your internet connection and try again."
        );

    }

    finally {

        hideLoading();

    }
}


/* =========================
   BROWSE SUBJECT
========================= */

async function browseSubject(subject) {

    showLoading();

    try {

        const url =
            `${SUBJECT_API}/${encodeURIComponent(subject)}.json?limit=20`;

        const data = await fetchJSON(url);

        resultsTitle.textContent =
            capitalize(subject);

        resultCount.textContent =
            `${Number(data.work_count || 0).toLocaleString()} books in this subject`;

        displaySubjectBooks(data.works || []);

    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to load this subject. Please try again."
        );

    }

    finally {

        hideLoading();

    }
}


/* =========================
   TRENDING BOOKS
========================= */

async function loadTrending() {

    showLoading();

    try {

        const data =
            await fetchJSON(
                `${TRENDING_API}?limit=20`
            );

        resultsTitle.textContent =
            "Trending Books";

        resultCount.textContent =
            "Popular books from Open Library";

        displayTrendingBooks(
            data.works || []
        );

    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to load trending books right now."
        );

    }

    finally {

        hideLoading();

    }
}


/* =========================
   DISPLAY SEARCH RESULTS
========================= */

function displayBooks(books) {

    bookGrid.innerHTML = "";

    if (!books.length) {

        showNoBooks(
            "No books found. Try another search."
        );

        return;
    }


    books.forEach(book => {

        const title =
            book.title || "Untitled";

        const author =
            book.author_name
                ? book.author_name
                    .slice(0, 2)
                    .join(", ")
                : "Unknown Author";

        const year =
            book.first_publish_year ||
            "Unknown";

        const editions =
            book.edition_count ||
            0;

        const bookKey =
            book.key ||
            "";

        const cover =
            getCover(book.cover_i);

        const card =
            createBookCard({

                title: title,

                author: author,

                year: year,

                meta: `${editions} editions`,

                cover: cover,

                key: bookKey

            });


        bookGrid.appendChild(card);

    });
}


/* =========================
   DISPLAY SUBJECT RESULTS
========================= */

function displaySubjectBooks(books) {

    bookGrid.innerHTML = "";

    if (!books.length) {

        showNoBooks(
            "No books found for this subject."
        );

        return;
    }


    books.forEach(book => {

        const title =
            book.title ||
            "Untitled";

        const author =
            book.authors &&
            book.authors.length

                ? book.authors
                    .slice(0, 2)
                    .map(author => author.name)
                    .join(", ")

                : "Unknown Author";


        const year =
            getSubjectYear(book);

        const editions =
            book.edition_count ||
            0;

        const cover =
            getCover(book.cover_id);


        const card =
            createBookCard({

                title: title,

                author: author,

                year: year,

                meta: `${editions} editions`,

                cover: cover,

                key: book.key

            });


        bookGrid.appendChild(card);

    });
}


/* =========================
   DISPLAY TRENDING
========================= */

function displayTrendingBooks(books) {

    bookGrid.innerHTML = "";

    if (!books.length) {

        showNoBooks(
            "No trending books are available right now."
        );

        return;
    }


    books.forEach(book => {

        const title =
            book.title ||
            "Untitled";


        const author =
            book.author_name
                ? book.author_name
                    .slice(0, 2)
                    .join(", ")

                : book.authors &&
                  book.authors.length

                    ? book.authors
                        .slice(0, 2)
                        .map(author => author.name)
                        .join(", ")

                    : "Unknown Author";


        const year =
            book.first_publish_year ||
            "Unknown";


        const coverId =
            book.cover_i ||
            book.cover_id ||
            null;


        const card =
            createBookCard({

                title: title,

                author: author,

                year: year,

                meta: "Trending",

                cover: getCover(coverId),

                key: book.key || ""

            });


        bookGrid.appendChild(card);

    });
}


/* =========================
   CREATE BOOK CARD
========================= */

function createBookCard(book) {

    const card =
        document.createElement("article");

    card.className =
        "book-card";


    const coverHTML =
        book.cover

            ? `
                <img
                    src="${book.cover}"
                    alt="Cover of ${escapeHTML(book.title)}"
                    loading="lazy"
                >
            `

            : `
                <div class="no-cover">
                    📖<br>
                    No cover available
                </div>
            `;


    card.innerHTML = `

        <div class="cover-container">
            ${coverHTML}
        </div>


        <div class="book-info">

            <h3 class="book-title">
                ${escapeHTML(book.title)}
            </h3>


            <p class="book-author">
                ${escapeHTML(book.author)}
            </p>


            <div class="book-meta">

                <span>
                    ${escapeHTML(String(book.year))}
                </span>

                <span>
                    ${escapeHTML(String(book.meta))}
                </span>

            </div>


            <div class="book-actions">

                <a
                    class="view-btn"
                    href="${getBookURL(book.key)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View Book
                </a>


                <button
                    class="save-btn"
                    type="button"
                >
                    + My Books
                </button>

            </div>

        </div>

    `;


    const saveButton =
        card.querySelector(".save-btn");


    saveButton.addEventListener(
        "click",
        () => {

            saveBook({

                key: book.key,

                title: book.title,

                author: book.author,

                year: book.year,

                meta: book.meta,

                cover: book.cover

            });

        }
    );


    return card;
}


/* =========================
   MY BOOKS
========================= */

function getMyBooks() {

    try {

        return JSON.parse(
            localStorage.getItem("myBooks") || "[]"
        );

    }

    catch (error) {

        console.error(error);

        return [];

    }
}


/* =========================
   SAVE BOOK
========================= */

function saveBook(book) {

    if (!book.key) {

        alert(
            "This book cannot be saved because it has no Open Library ID."
        );

        return;
    }


    const myBooks =
        getMyBooks();


    const alreadySaved =
        myBooks.some(
            savedBook =>
                savedBook.key === book.key
        );


    if (alreadySaved) {

        alert(
            `"${book.title}" is already in My Books.`
        );

        return;
    }


    myBooks.push(book);


    localStorage.setItem(
        "myBooks",
        JSON.stringify(myBooks)
    );


    alert(
        `"${book.title}" was added to My Books!`
    );

}


/* =========================
   SHOW MY BOOKS
========================= */

function showMyBooks(event) {

    if (event) {
        event.preventDefault();
    }


    const myBooks =
        getMyBooks();


    resultsTitle.textContent =
        "My Books";


    resultCount.textContent =
        `${myBooks.length} saved book${
            myBooks.length === 1
                ? ""
                : "s"
        }`;


    displayMyBooks(myBooks);

}


/* =========================
   DISPLAY MY BOOKS
========================= */

function displayMyBooks(books) {

    bookGrid.innerHTML = "";


    if (!books.length) {

        bookGrid.innerHTML = `

            <div class="empty-books">

                <div class="empty-icon">
                    📚
                </div>


                <h3>
                    Your bookshelf is empty.
                </h3>


                <p>
                    Search for a book and click
                    "+ My Books" to start building
                    your personal collection.
                </p>

            </div>

        `;

        return;
    }


    books.forEach(book => {

        const card =
            document.createElement("article");

        card.className =
            "book-card";


        const coverHTML =
            book.cover

                ? `
                    <img
                        src="${book.cover}"
                        alt="Cover of ${escapeHTML(book.title)}"
                        loading="lazy"
                    >
                `

                : `
                    <div class="no-cover">
                        📖<br>
                        No cover available
                    </div>
                `;


        card.innerHTML = `

            <div class="cover-container">
                ${coverHTML}
            </div>


            <div class="book-info">

                <h3 class="book-title">
                    ${escapeHTML(book.title)}
                </h3>


                <p class="book-author">
                    ${escapeHTML(book.author)}
                </p>


                <div class="book-meta">

                    <span>
                        ${escapeHTML(
                            String(book.year)
                        )}
                    </span>

                    <span>
                        Saved
                    </span>

                </div>


                <div class="book-actions">

                    <a
                        class="view-btn"
                        href="${getBookURL(book.key)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Book
                    </a>


                    <button
                        class="remove-btn"
                        type="button"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;


        const removeButton =
            card.querySelector(".remove-btn");


        removeButton.addEventListener(
            "click",
            () => {

                removeBook(book.key);

            }
        );


        bookGrid.appendChild(card);

    });

}


/* =========================
   REMOVE BOOK
========================= */

function removeBook(bookKey) {

    const updatedBooks =
        getMyBooks().filter(
            book =>
                book.key !== bookKey
        );


    localStorage.setItem(
        "myBooks",
        JSON.stringify(updatedBooks)
    );


    showMyBooks();

}


/* =========================
   DISCOVER BOOKS
========================= */

discoverBtn.addEventListener(
    "click",
    () => {

        const subjects = [

            "fiction",

            "fantasy",

            "romance",

            "mystery",

            "horror",

            "history",

            "science fiction",

            "adventure",

            "poetry",

            "psychology",

            "philosophy",

            "biography",

            "art",

            "music"

        ];


        const randomSubject =
            subjects[
                Math.floor(
                    Math.random() *
                    subjects.length
                )
            ];


        searchInput.value =
            randomSubject;


        browseSubject(
            randomSubject
        );

    }
);


/* =========================
   SEARCH FORM
========================= */

searchForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        searchBooks(
            searchInput.value
        );

    }
);


/* =========================
   HOME
========================= */

function goHome() {

    searchInput.value = "";

    resultsTitle.textContent =
        "Popular Books";

    resultCount.textContent =
        "Discover something new";


    searchBooks(
        "popular books"
    );

}


/* =========================
   LIBRARY EXPLORER
========================= */

function loadLibraryExplorer() {

    searchInput.value = "";

    resultsTitle.textContent =
        "Library Explorer";

    resultCount.textContent =
        "Explore books through different subjects";


    const subjects = [

        "fiction",
        "fantasy",
        "romance",
        "mystery",
        "science fiction",
        "history",
        "biography",
        "poetry",
        "philosophy",
        "art",
        "music",
        "psychology"

    ];


    bookGrid.innerHTML = "";


    subjects.forEach(subject => {

        const button =
            document.createElement("button");

        button.className =
            "discover-btn";

        button.style.color =
            "#292722";

        button.style.borderColor =
            "#b8b1a5";

        button.textContent =
            capitalize(subject);


        button.addEventListener(
            "click",
            () => {

                browseSubject(
                    subject
                );

            }
        );


        const wrapper =
            document.createElement("div");

        wrapper.style.display =
            "flex";

        wrapper.style.justifyContent =
            "center";

        wrapper.style.marginBottom =
            "10px";


        wrapper.appendChild(
            button
        );


        bookGrid.appendChild(
            wrapper
        );

    });

}


/* =========================
   LISTS
========================= */

async function loadLists() {

    showLoading();


    try {

        const url =
            "https://openlibrary.org/search/lists.json?q=books&limit=20";


        const data =
            await fetchJSON(url);


        resultsTitle.textContent =
            "Lists";

        resultCount.textContent =
            "Public reading lists from Open Library";


        bookGrid.innerHTML = "";


        if (
            !data.docs ||
            !data.docs.length
        ) {

            showNoBooks(
                "No public lists were found."
            );

            return;
        }


        data.docs.forEach(list => {

            const card =
                document.createElement("article");

            card.className =
                "book-card";


            card.innerHTML = `

                <div class="cover-container">

                    <div class="no-cover">

                        📚

                        <br>

                        Reading List

                    </div>

                </div>


                <div class="book-info">

                    <h3 class="book-title">
                        ${escapeHTML(
                            list.name ||
                            "Untitled List"
                        )}
                    </h3>


                    <p class="book-author">
                        Public Open Library list
                    </p>


                    <div class="book-meta">

                        <span>
                            ${
                                list.seed_count ||
                                0
                            } books
                        </span>

                    </div>


                    <div class="book-actions">

                        <a
                            class="view-btn"
                            href="https://openlibrary.org${
                                list.full_url ||
                                list.url ||
                                ""
                            }"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View List
                        </a>

                    </div>

                </div>

            `;


            bookGrid.appendChild(
                card
            );

        });

    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to load public lists."
        );

    }

    finally {

        hideLoading();

    }

}


/* =========================
   COVER URL
========================= */

function getCover(coverId) {

    if (!coverId) {
        return null;
    }


    return `
        https://covers.openlibrary.org/b/id/${coverId}-M.jpg
    `;
}


/* =========================
   BOOK URL
========================= */

function getBookURL(key) {

    if (!key) {

        return "https://openlibrary.org";

    }


    if (key.startsWith("http")) {

        return key;

    }


    return `https://openlibrary.org${key}`;

}


/* =========================
   SUBJECT YEAR
========================= */

function getSubjectYear(book) {

    if (
        book.first_publish_year
    ) {

        return book.first_publish_year;

    }


    if (
        book.publish_year &&
        book.publish_year.length
    ) {

        return Math.min(
            ...book.publish_year
        );

    }


    return "Unknown";

}


/* =========================
   NO BOOKS
========================= */

function showNoBooks(message) {

    bookGrid.innerHTML = `

        <div class="error">
            ${escapeHTML(message)}
        </div>

    `;

}


/* =========================
   LOADING
========================= */

function showLoading() {

    loading.classList.remove(
        "hidden"
    );

    errorMessage.classList.add(
        "hidden"
    );

    bookGrid.innerHTML = "";

}


/* =========================
   HIDE LOADING
========================= */

function hideLoading() {

    loading.classList.add(
        "hidden"
    );

}


/* =========================
   ERROR
========================= */

function showError(message) {

    loading.classList.add(
        "hidden"
    );


    errorMessage.textContent =
        message;


    errorMessage.classList.remove(
        "hidden"
    );


    bookGrid.innerHTML = "";

}


/* =========================
   CAPITALIZE
========================= */

function capitalize(text) {

    return text
        .replace(/-/g, " ")
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text == null
            ? ""
            : String(text);

    return div.innerHTML;

}


/* =========================
   INITIAL LOAD
========================= */

searchBooks(
    "popular books"
);