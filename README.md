# ShelfSearch — Book Search App

A simple static web app that searches books using the **Google Books API**. The UI is intentionally lightweight (similar in spirit to Open Library): search by title or author, filter by genre or publication year, and browse curated subjects from a **Library Explorer** dropdown.

## What the API does

This project uses the [Google Books API](https://developers.google.com/books/docs/v1/using) **Volumes** endpoint:

```
GET https://www.googleapis.com/books/v1/volumes?q=...&key=...
```

The API returns book metadata such as title, authors, cover image, description, published date, categories, publisher, and page count.

**How this app uses it:**

- **Search** — queries with optional `intitle:` / `inauthor:` prefixes
- **Genre filter** — appends `subject:` to the search query
- **Publication year** — filters results in the browser using each volume’s `publishedDate`
- **Library Explorer** — a dropdown of curated subjects (Fiction, Science, History, etc.); choosing one runs a `subject:` search ordered by newest

## How to run locally

No build step or package install is required.

1. Copy the example config and add your API key:

   ```bash
   cp js/config.example.js js/config.js
   ```

   Then open `js/config.js` and replace `YOUR_API_KEY_HERE` with your [Google Books API key](https://console.cloud.google.com/apis/credentials).

2. Serve the folder with a local static server (recommended so scripts load reliably):

   - **VS Code / Cursor:** use the Live Server extension and open `index.html`
   - **Node:** from the project root run `npx serve .` then visit the URL it prints
   - **Python:** `python -m http.server 5500` then open `http://localhost:5500`

3. Search for a book, apply filters, or choose a subject from Library Explorer.

## How the API key is handled

- The real key lives only in **`js/config.js`**.
- **`js/config.js` is listed in `.gitignore`**, so it is not committed to GitHub.
- The repo includes **`js/config.example.js`** with a placeholder so others can set up their own key.
- Never paste your key into `README.md`, commit messages, or public issues.

If you previously shared a key publicly, rotate it in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

## Project structure

```
├── index.html
├── css/styles.css
├── js/
│   ├── config.js           # your API key (gitignored)
│   ├── config.example.js   # template for others
│   ├── api.js              # Google Books fetch helpers
│   └── app.js              # UI logic
├── .gitignore
└── README.md
```
