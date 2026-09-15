# ShelfSearch — Book Search App

A simple static web app that searches books using the **Google Books API**. Search by title or author, filter by genre or publication year, and browse curated subjects from a Library Explorer dropdown.

## What the API does

This project uses the [Google Books API](https://developers.google.com/books/docs/v1/using) **Volumes** endpoint:

```
GET https://www.googleapis.com/books/v1/volumes?q=...&key=...
```

It returns book metadata such as title, authors, cover image, description, published date, categories, publisher, and page count.

**How this app uses it:**

- **Search** — queries with optional `intitle:` / `inauthor:` prefixes
- **Genre filter** — appends `subject:` to the search query
- **Publication year** — filters results in the browser using each volume’s `publishedDate`
- **Library Explorer** — curated `subject:` searches ordered by newest

## How to run locally

No package install is required.

1. Copy the example config and add your API key:

   ```bash
   cp config.example.js config.js
   ```

   Then open `config.js` and replace `YOUR_API_KEY_HERE` with your [Google Books API key](https://console.cloud.google.com/apis/credentials).

2. Serve the folder with a local static server:

   - **VS Code / Cursor:** Live Server → open `index.html`
   - **Node:** `npx serve .`
   - **Python:** `python -m http.server 5500`

3. Search for a book, apply filters, or choose a subject from Library Explorer.

## How the API key is handled

- The key is **required** and lives in **`config.js`**.
- **`config.js` is listed in `.gitignore`**, so it is never committed to GitHub.
- The repo includes **`config.example.js`** as a placeholder template.
- **On Render:** set an environment variable `GOOGLE_BOOKS_API_KEY`, and set **Build Command** to `node build-config.js` (Publish Directory: `.`). At deploy time that script writes `config.js` on the server from the env var, so the key stays off GitHub but still works on the live site.
- Never paste your key into `README.md`, commit messages, or public issues.
