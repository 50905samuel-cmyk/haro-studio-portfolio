# Samuel HUANG — Architecture Portfolio

A bilingual architecture portfolio for Samuel HUANG (黃同榮), built as a lightweight static website.

## Pages

- `index.html` — introduction and selected projects
- `work.html` — individual project pages, selected with `?id=`
- `about.html` — profile, education, and areas of interest

## Updating content

Edit `data/projects.json` to change project titles, descriptions, locations, years, or the graphic key. The page layout and project content are separate: JavaScript reads the JSON file and renders the cards and project page. Edit the HTML only when changing the structure, and edit `assets/site.css` to change the visual style.

The current project illustrations are original concept graphics made for the draft. They are clearly identified as concept graphics and should be replaced with the author's project images before final submission.

## Tools

- HTML, CSS, and JavaScript
- JSON content data
- Git for version control

## Local preview

Run a local static server from this folder, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

The final public website URL and GitHub repository URL will be added after deployment.
