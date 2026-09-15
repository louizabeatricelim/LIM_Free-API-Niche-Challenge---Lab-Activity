(function () {
  const EXPLORER_LISTS = [
    { id: "fiction", label: "Fiction", blurb: "Newest fiction", q: "subject:fiction", orderBy: "newest" },
    { id: "science", label: "Science", blurb: "Discoveries & ideas", q: "subject:science", orderBy: "newest" },
    { id: "history", label: "History", blurb: "Past made present", q: "subject:history", orderBy: "newest" },
    { id: "mystery", label: "Mystery", blurb: "Whodunits", q: "subject:mystery", orderBy: "newest" },
    { id: "ya", label: "Young Adult", blurb: "Stories for YA", q: "subject:young adult", orderBy: "newest" },
    { id: "selfhelp", label: "Self-Help", blurb: "Practical reads", q: "subject:self-help", orderBy: "newest" },
  ];

  const form = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const searchMode = document.getElementById("search-mode");
  const genreFilter = document.getElementById("genre-filter");
  const yearFilter = document.getElementById("year-filter");
  const clearFiltersBtn = document.getElementById("clear-filters");
  const explorerSelect = document.getElementById("explorer-select");
  const bookGrid = document.getElementById("book-grid");
  const statusEl = document.getElementById("status");
  const resultsMeta = document.getElementById("results-meta");
  const modal = document.getElementById("book-modal");
  const modalBody = document.getElementById("modal-body");
  const brandLink = document.getElementById("brand-link");

  /** @type {Map<string, object>} */
  const bookCache = new Map();
  let activeExplorerId = null;

  function setStatus(message, type) {
    statusEl.textContent = message || "";
    statusEl.classList.remove("is-error", "is-loading");
    if (type === "error") statusEl.classList.add("is-error");
    if (type === "loading") statusEl.classList.add("is-loading");
  }

  function clearActiveExplorer() {
    activeExplorerId = null;
    if (explorerSelect) explorerSelect.value = "";
  }

  function renderExplorer() {
    explorerSelect.innerHTML = [
      `<option value="">Choose a subject…</option>`,
      ...EXPLORER_LISTS.map(
        (list) =>
          `<option value="${escapeAttr(list.id)}">${escapeHtml(list.label)} — ${escapeHtml(list.blurb)}</option>`
      ),
    ].join("");
  }

  function coverHtml(book, className) {
    if (book.cover) {
      return `<img class="${className}" src="${escapeAttr(book.cover)}" alt="" loading="lazy" />`;
    }
    return `<div class="${className} placeholder" aria-hidden="true">No cover</div>`;
  }

  function renderBooks(books) {
    bookCache.clear();
    books.forEach((b) => bookCache.set(b.id, b));

    if (!books.length) {
      bookGrid.innerHTML = "";
      return;
    }

    bookGrid.innerHTML = books
      .map(
        (book) => `
      <button type="button" class="book-card" data-book-id="${escapeAttr(book.id)}">
        ${coverHtml(book, "book-cover")}
        <div class="book-info">
          <h3>${escapeHtml(book.title)}</h3>
          <p>${escapeHtml(book.authors.join(", ") || "Unknown author")}</p>
          <p class="book-meta">${escapeHtml(formatMeta(book))}</p>
        </div>
      </button>`
      )
      .join("");
  }

  function formatMeta(book) {
    const year = (book.publishedDate || "").slice(0, 4);
    const genre = book.categories[0] || "";
    return [year, genre].filter(Boolean).join(" · ");
  }

  function openModal(book) {
    const facts = [];
    if (book.publisher) facts.push(`<li><strong>Publisher:</strong> ${escapeHtml(book.publisher)}</li>`);
    if (book.publishedDate) facts.push(`<li><strong>Published:</strong> ${escapeHtml(book.publishedDate)}</li>`);
    if (book.pageCount) facts.push(`<li><strong>Pages:</strong> ${escapeHtml(String(book.pageCount))}</li>`);
    if (book.categories.length) {
      facts.push(`<li><strong>Categories:</strong> ${escapeHtml(book.categories.join(", "))}</li>`);
    }

    const desc = book.description
      ? truncate(stripHtml(book.description), 480)
      : "No description available.";

    const preview = book.previewLink
      ? `<a class="btn-link" href="${escapeAttr(book.previewLink)}" target="_blank" rel="noopener noreferrer">View on Google Books</a>`
      : "";

    modalBody.innerHTML = `
      <div class="modal-layout">
        ${coverHtml(book, "modal-cover")}
        <div>
          <h2 id="modal-title">${escapeHtml(book.title)}</h2>
          <p class="modal-authors">${escapeHtml(book.authors.join(", ") || "Unknown author")}</p>
          <ul class="modal-facts">${facts.join("")}</ul>
          <p class="modal-desc">${escapeHtml(desc)}</p>
          ${preview}
        </div>
      </div>`;

    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    modalBody.innerHTML = "";
    document.body.style.overflow = "";
  }

  async function runSearch({ fromExplorer } = {}) {
    const query = searchInput.value.trim();
    const mode = searchMode.value;
    const genre = genreFilter.value;
    const year = yearFilter.value.trim();

    setStatus("Searching…", "loading");
    resultsMeta.textContent = "";
    bookGrid.innerHTML = "";

    try {
      let result;
      let books;

      if (fromExplorer) {
        const list = EXPLORER_LISTS.find((l) => l.id === fromExplorer);
        if (!list) throw new Error("Unknown explorer list.");

        result = await searchBooks({
          q: list.q,
          orderBy: list.orderBy,
          maxResults: 20,
        });

        books = result.items.map(normalizeBook);
        resultsMeta.textContent = `Explorer · ${list.label}`;

        if (!books.length) {
          setStatus("No books found. Try a different search or explorer subject.");
          renderBooks([]);
          return;
        }

        setStatus(`Found ${books.length} book${books.length === 1 ? "" : "s"}.`);
        renderBooks(books);
        return;
      }

      result = await searchBooks({
        query,
        mode,
        genre,
        maxResults: 20,
      });
      resultsMeta.textContent = query
        ? `Search · “${query}”`
        : genre
          ? `Genre · ${genre}`
          : "";

      let items = result.items;
      const beforeYear = items.length;
      if (year) {
        items = filterByYear(items, year);
      }
      books = items.map(normalizeBook);

      if (year && beforeYear && !books.length) {
        setStatus(`No books from ${year} in these results. Try another year or clear the year filter.`, "error");
        renderBooks([]);
        return;
      }

      if (!books.length) {
        setStatus("No books found. Try a different search or explorer subject.");
        renderBooks([]);
        return;
      }

      const yearNote = year ? ` (showing ${books.length} from ${year})` : "";
      setStatus(`Found ${books.length} book${books.length === 1 ? "" : "s"}${yearNote}.`);
      renderBooks(books);
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Something went wrong.", "error");
      renderBooks([]);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearActiveExplorer();
    runSearch();
  });

  clearFiltersBtn.addEventListener("click", () => {
    genreFilter.value = "";
    yearFilter.value = "";
    if (searchInput.value.trim() || activeExplorerId) {
      if (activeExplorerId) {
        runSearch({ fromExplorer: activeExplorerId });
      } else {
        runSearch();
      }
    } else {
      setStatus("");
      resultsMeta.textContent = "";
    }
  });

  explorerSelect.addEventListener("change", () => {
    const id = explorerSelect.value;
    if (!id) {
      activeExplorerId = null;
      return;
    }
    activeExplorerId = id;
    searchInput.value = "";
    runSearch({ fromExplorer: id });
  });

  bookGrid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-book-id]");
    if (!card) return;
    const book = bookCache.get(card.getAttribute("data-book-id"));
    if (book) openModal(book);
  });

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-modal]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  brandLink.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    searchMode.value = "all";
    genreFilter.value = "";
    yearFilter.value = "";
    clearActiveExplorer();
    bookGrid.innerHTML = "";
    resultsMeta.textContent = "";
    setStatus("Search for a book or choose a Library Explorer subject.");
    closeModal();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  function truncate(text, max) {
    if (text.length <= max) return text;
    return `${text.slice(0, max).trim()}…`;
  }

  renderExplorer();
  setStatus("Search for a book or choose a Library Explorer subject.");
})();
