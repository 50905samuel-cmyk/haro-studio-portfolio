# HARO-STUDIO — Architecture Portfolio

A Chinese-language architecture portfolio for Samuel HUANG (黃同榮), built as a lightweight static website. The white, image-led home page rotates through the three project images. Its left-side Works and About links lead to the project index and profile pages.

## Pages

- `index.html` — minimal home page with an automatic project image carousel
- `works.html` — projects sorted by completion year (newest first), with a year timeline that jumps to each year's first project
- `work.html` — individual project detail page, selected with `?id=`
- `about.html` — profile, education, and areas of interest

## Updating project content

Edit `data/projects.json` to update project titles, descriptions, locations, years, image paths, or image alt text. Project order on the home carousel and Works page is calculated from `year`, newest first; the timeline is generated automatically. Keep the Traditional Chinese fields complete. English project fields are retained in the data for the planned bilingual version; the current interface displays Chinese only.

Add project image files to `assets/images/` and update the corresponding `image` path in `data/projects.json`. The JavaScript reads the JSON and updates the home carousel, the complete project list, and the detail pages without requiring routine edits to the HTML structure. The Works page currently displays only the Chinese title and completion year; project category labels can be added later.

## Tools

- HTML for page structure
- CSS for layout, responsive behavior, and visual styling
- JavaScript for automatic image rotation and JSON rendering
- JSON for project content
- Git for version history

## Run locally

In VS Code, open this project folder, install the Live Server extension, then right-click `index.html` and choose **Open with Live Server**. Alternatively, if Python is installed, run from the project folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. Do not open `index.html` directly as a `file://` URL: a local server is required because the site loads `data/projects.json` with `fetch`. Keep the `data` folder beside the HTML files when copying the site.

## Deployment

The site is published with GitHub Pages from the `main` branch and the repository root.

- Repository: <https://github.com/50905samuel-cmyk/haro-studio-portfolio>
- Website: <https://50905samuel-cmyk.github.io/haro-studio-portfolio/>
