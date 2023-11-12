#!/usr/bin/env node

import fs from "fs";
import args from "args";
import { marked } from "marked";

const flags = args
  .option("input-file", "The input file", "README.md")
  .option("output-file", "The output file", "index.html")
  .option("template-file", "The template file", "template.html")
  .option("insert-title", "Insert the title from the markdown file", true)
  .command("build", "Build the HTML file from the template and markdown files")
  .example(
    "markdown-to-html-via-template --input-file docs/README.md --output-file dist/index.html --template-file src/template.html --insert-title",
    "Build a HTML file from a markdown file using a template"
  )
  .parse(process.argv);

// Read the template file
const template = fs.readFileSync(flags["templateFile"], "utf8");

// does the template file have a {{markdown}} placeholder?
if (!template.includes("{{markdown}}")) {
  console.error("Template file must include {{markdown}} placeholder");
  process.exit(1);
}

// Read the markdown file
const markdown = fs.readFileSync(flags["inputFile"], "utf8");

// Convert markdown to HTML
const html = markdownify(markdown);

// Replace the {{markdown}} placeholder with the HTML
let output = template.replace("{{markdown}}", html);

// do we need to insert the title?
if (flags["insertTitle"]) {
  try {
    // get the title from the markdown file
    const title = markdown.match(/^# (.*)$/m)[1];

    // insert the title into the output's head tag
    const titleTag = `<title>${title}</title>`;
    const headTagEnd = output.indexOf("</head>");
    output = output.slice(0, headTagEnd) + titleTag + output.slice(headTagEnd);
  } catch (error) {
    console.warn("⚠️ Could not insert title for:", flags["inputFile"]);
  }
}

// replace links to markdown files with HTML files
output = output.replace(/href="(.*)\.md"/g, 'href="$1.html"');

// replace links to README.html with index.html
output = output.replace(/href="(.*)README\.html"/g, 'href="$1index.html"');

// do we have a directory for the output file?
const outputDir = flags["outputFile"].split("/").slice(0, -1).join("/");

if (outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

// Write the output file
fs.writeFileSync(flags["outputFile"], output);

// exit cleanly
console.log("✅ Wrote", flags["outputFile"]);
process.exit(0);

/**
 * Convert markdown to HTML using marked
 *
 * @param {string} content
 *
 * @returns {string}
 */
function markdownify(content) {
  marked.use({
    gfm: true, // GitHub Flavored Markdown
    breaks: false, // add <br> on single line breaks (GFM)
  });

  return marked.parse(content);
}
