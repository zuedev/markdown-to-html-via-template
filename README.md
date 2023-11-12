# markdown-to-html-via-template

> A simple CLI tool to convert Markdown to HTML using a template.

## Installation

```bash
npm install -g markdown-to-html-via-template
```

## Usage

```bash
Usage: markdown-to-html-via-template [options] [command]

Commands:
    build    Build the HTML file from the template and markdown files
    help     Display help
    version  Display version

Options:
    -h, --help                   Output usage information
    -i, --input-file [value]     The input file (defaults to "README.md")
    -I, --insert-title           Insert the title from the markdown file (enabled by default)
    -o, --output-file [value]    The output file (defaults to "index.html")
    -t, --template-file [value]  The template file (defaults to "template.html")
    -v, --version                Output the version number

Examples:
    - Build a HTML file from a markdown file using a template
    $ markdown-to-html-via-template --input-file docs/README.md --output-file dist/index.html --template-file src/template.html --insert-title
```
