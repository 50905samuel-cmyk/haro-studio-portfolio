# HARO-STUDIO — Architecture Portfolio

A Chinese-language architecture portfolio for Samuel HUANG (黃同榮), built as a lightweight static website. The editorial home page places a project index on the left, a rotating project image in the center, and project notes on the right.

## Pages

- `index.html` — portfolio home page with a selectable project index and automatic image carousel
- `work.html` — individual project detail page, selected with `?id=`
- `about.html` — profile, education, and areas of interest

## Updating project content

Edit `data/projects.json` to update project titles, descriptions, locations, years, image paths, or image alt text. Keep the Traditional Chinese fields complete. English project fields are retained in the data for the planned bilingual version; the current interface displays Chinese only.

Add project image files to `assets/images/` and update the corresponding `image` path in `data/projects.json`. The JavaScript reads the JSON and updates the home page index, carousel, project notes, and detail pages without requiring routine edits to the HTML structure.

## Tools

- HTML for page structure
- CSS for layout, responsive behavior, and visual styling
- JavaScript for project selection, automatic image rotation, and JSON rendering
- JSON for project content
- Git for version history

## Run locally

From the project folder, run:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. A local server is required because the site loads `data/projects.json` with `fetch`.

## Deployment

The site is published with GitHub Pages from the `main` branch and the repository root.

- Repository: <https://github.com/50905samuel-cmyk/haro-studio-portfolio>
- Website: <https://50905samuel-cmyk.github.io/haro-studio-portfolio/>
