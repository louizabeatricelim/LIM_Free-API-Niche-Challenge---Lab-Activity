const BOOKS_API_BASE = "https://www.googleapis.com/books/v1/volumes";

/**
 * Build a Google Books q parameter from search mode + optional genre subject.
 * @param {string} rawQuery
 * @param {"all"|"title"|"author"} mode
 * @param {string} [genre]
 * @returns {string}
 */
function buildQuery(rawQuery, mode, genre) {
  const trimmed = (rawQuery || "").trim();
  let q = "";

  if (trimmed) {
    if (mode === "title") {
      q = `intitle:${trimmed}`;
    } else if (mode === "author") {
      q = `inauthor:${trimmed}`;
    } else {
      q = trimmed;
    }
  }

  if (genre) {
    const subject = `subject:${genre}`;
    q = q ? `${q}+${subject}` : subject;
  }

  return q;
}

/**
 * Fetch volumes from Google Books.
 * @param {object} options
 * @param {string} [options.query] - free text (ignored if options.q is set)
 * @param {"all"|"title"|"author"} [options.mode]
 * @param {string} [options.genre]
 * @param {string} [options.q] - fully built q string (for explorer lists)
 * @param {"relevance"|"newest"} [options.orderBy]
 * @param {number} [options.maxResults]
 * @returns {Promise<{ items: object[], totalItems: number }>}
 */
async function searchBooks(options = {}) {
  if (
    typeof GOOGLE_BOOKS_API_KEY === "undefined" ||
    !GOOGLE_BOOKS_API_KEY ||
    GOOGLE_BOOKS_API_KEY === "YOUR_API_KEY_HERE"
  ) {
    throw new Error(
      "Missing API key. Locally: copy config.example.js to config.js. On Render: set GOOGLE_BOOKS_API_KEY and Build Command `node build-config.js`."
    );
  }

  const {
    query = "",
    mode = "all",
    genre = "",
    q: explicitQ,
    orderBy = "relevance",
    maxResults = 20,
  } = options;

  const q = explicitQ != null ? explicitQ : buildQuery(query, mode, genre);

  if (!q) {
    throw new Error("Enter a search term or choose a genre / explorer list.");
  }

  const params = new URLSearchParams({
    q,
    key: GOOGLE_BOOKS_API_KEY,
    maxResults: String(maxResults),
    printType: "books",
  });

  if (orderBy === "newest") {
    params.set("orderBy", "newest");
  }

  const url = `${BOOKS_API_BASE}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    let detail = "";
    try {
      const errBody = await response.json();
      detail = errBody?.error?.message ? `: ${errBody.error.message}` : "";
    } catch {
      /* ignore */
    }
    throw new Error(`Google Books request failed (${response.status})${detail}`);
  }

  const data = await response.json();
  return {
    items: Array.isArray(data.items) ? data.items : [],
    totalItems: typeof data.totalItems === "number" ? data.totalItems : 0,
  };
}

/**
 * Keep only volumes whose publishedDate starts with the given year.
 * @param {object[]} items
 * @param {string|number} year
 * @returns {object[]}
 */
function filterByYear(items, year) {
  const y = String(year || "").trim();
  if (!y) return items;
  return items.filter((item) => {
    const published = item?.volumeInfo?.publishedDate || "";
    return published.startsWith(y);
  });
}

/** Current calendar year (used for trending-in-a-year lists). */
function getCurrentYear() {
  return new Date().getFullYear();
}

/**
 * Sort books by Google Books ratingsCount (best public proxy for "hits").
 * @param {object[]} books - normalized books
 * @returns {object[]}
 */
function sortByHits(books) {
  return [...books].sort((a, b) => (b.ratingsCount || 0) - (a.ratingsCount || 0));
}

/**
 * Sum of ratingsCount on raw API items (for ranking explorer genres).
 * @param {object[]} items
 * @returns {number}
 */
function sumHits(items) {
  return items.reduce((sum, item) => {
    const count = item?.volumeInfo?.ratingsCount;
    return sum + (typeof count === "number" ? count : 0);
  }, 0);
}

/**
 * Normalize a volume into a flat book object for the UI.
 * @param {object} item
 */
function normalizeBook(item) {
  const info = item.volumeInfo || {};
  const imageLinks = info.imageLinks || {};
  const cover =
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail ||
    "";

  return {
    id: item.id,
    title: info.title || "Untitled",
    authors: Array.isArray(info.authors) ? info.authors : [],
    publishedDate: info.publishedDate || "",
    categories: Array.isArray(info.categories) ? info.categories : [],
    description: info.description || "",
    publisher: info.publisher || "",
    pageCount: info.pageCount || null,
    previewLink: info.previewLink || info.infoLink || "",
    cover: cover ? cover.replace("http:", "https:") : "",
    ratingsCount: typeof info.ratingsCount === "number" ? info.ratingsCount : 0,
    averageRating: typeof info.averageRating === "number" ? info.averageRating : null,
  };
}
