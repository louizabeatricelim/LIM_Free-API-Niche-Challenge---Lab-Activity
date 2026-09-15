/**
 * Creates config.js from GOOGLE_BOOKS_API_KEY during Render deploy.
 * Locally you use a hand-written config.js instead (gitignored).
 */
const fs = require("fs");

const key = process.env.GOOGLE_BOOKS_API_KEY;

if (!key || key === "YOUR_API_KEY_HERE") {
  console.error(
    "Missing GOOGLE_BOOKS_API_KEY. Add it in Render → Environment, then redeploy."
  );
  process.exit(1);
}

fs.writeFileSync(
  "config.js",
  `// Generated at build time — do not commit\nconst GOOGLE_BOOKS_API_KEY = ${JSON.stringify(key)};\n`,
  "utf8"
);

console.log("Wrote config.js for deploy.");
