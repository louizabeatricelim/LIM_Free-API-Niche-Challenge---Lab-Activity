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
   cp config.example.js config.js
   ```

   Then open `config.js` and replace `YOUR_API_KEY_HERE` with your [Google Books API key](https://console.cloud.google.com/apis/credentials).

2. Serve the folder with a local static server (recommended so scripts load reliably):

   - **VS Code / Cursor:** use the Live Server extension and open `index.html`
   - **Node:** from the project root run `npx serve .` then visit the URL it prints
   - **Python:** `python -m http.server 5500` then open `http://localhost:5500`

3. Search for a book, apply filters, or choose a subject from Library Explorer.

## How the API key is handled

- The real key lives only in **`config.js`**.
- **`config.js` is listed in `.gitignore`**, so it is **not** on GitHub or Render by default.
- The repo includes **`config.example.js`** with a placeholder so others can set up their own key.
- Never paste your key into `README.md`, commit messages, or public issues.

If you previously shared a key publicly, rotate it in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

## Deploy on Render (static site)

The live site will keep showing “Missing API key” until **both** of these are true:

1. Your latest code is **committed and pushed** (including `api.js`, `app.js`, `styles.css`, `build-config.js`, `config.example.js`, and the updated `index.html`).
2. Render creates `config.js` at build time from an environment variable.

**Render settings**

| Setting | Value |
|--------|--------|
| Build Command | `node build-config.js` |
| Publish Directory | `.` |

**Environment variable**

| Key | Value |
|-----|--------|
| `GOOGLE_BOOKS_API_KEY` | your Google Books API key |

Then trigger a **Manual Deploy**. Check the build logs for `Wrote config.js for deploy.`

## Project structure

```
├── index.html
├── styles.css
├── config.js           # local only / generated on Render (gitignored)
├── config.example.js
├── build-config.js     # Render build: writes config.js from env
├── api.js
├── app.js
├── .gitignore
└── README.md
```
