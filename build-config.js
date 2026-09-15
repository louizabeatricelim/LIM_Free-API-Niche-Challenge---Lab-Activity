/**
 * Generates config.js from GOOGLE_BOOKS_API_KEY (used on Render deploy).
 * Locally you can keep using a hand-written config.js instead.
 */
const fs = require("fs");

const key = process.env.GOOGLE_BOOKS_API_KEY;

if (!key || key === "YOUR_API_KEY_HERE") {
  console.error(
    "Missing GOOGLE_BOOKS_API_KEY. Set it in the Render Environment Variables dashboard."
  );
  process.exit(1);
}

const contents = `// Generated at build time — do not edit on the server
const GOOGLE_BOOKS_API_KEY = ${JSON.stringify(key)};
`;

fs.writeFileSync("config.js", contents, "utf8");
console.log("Wrote config.js for deploy.");
