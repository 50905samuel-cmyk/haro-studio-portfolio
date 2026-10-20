const text = (id) => document.getElementById(id);

const projectLoadMessage = () => location.protocol === 'file:'
  ? 'Open this site with VS Code Live Server or view the published GitHub Pages website.'
  : 'Projects could not be loaded. Check that data/projects.json is in the site folder.';

const newestFirst = (projects) => [...projects].sort((a, b) => Number(b.year) - Number(a.year));

async function loadProjects() {
  const response = await fetch('data/projects.json');
  if (!response.ok) throw new Error('Project data could not be loaded');
  const projects = await response.json();
  if (!Array.isArray(projects) || projects.length === 0) throw new Error('No projects found');
  return projects;
}

async function renderShowcase() {
  const stage = text('image-stage');
  if (!stage) return;

  try {
    const projects = newestFirst(await loadProjects());
    const image = text('active-project-image');
    const showcase = stage.closest('.showcase-main');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let active = 0;
    let timer;
    let isHovered = false;
    let hasFocus = false;

    const setActive = (nextIndex) => {
      active = (nextIndex + projects.length) % projects.length;
      const project = projects[active];
      image.classList.add('is-changing');
      window.setTimeout(() => {
        image.onload = () => image.classList.remove('is-changing');
        image.src = project.image;
        image.alt = project.imageAltEn || project.titleEn;
        if (image.complete) image.classList.remove('is-changing');
      }, 150);

      const detailUrl = `work.html?id=${encodeURIComponent(project.id)}`;
      text('stage-link').href = detailUrl;
      text('stage-link').setAttribute('aria-label', `View ${project.titleEn}`);
      text('project-title').textContent = project.titleEn;
      text('project-title').href = detailUrl;
    };

    const startTimer = () => {
      window.clearInterval(timer);
      if (!reducedMotion && !isHovered && !hasFocus && document.visibilityState === 'visible') {
        timer = window.setInterval(() => setActive(active + 1), 6500);
      }
    };

    showcase.addEventListener('mouseenter', () => { isHovered = true; startTimer(); });
    showcase.addEventListener('mouseleave', () => { isHovered = false; startTimer(); });
    showcase.addEventListener('focusin', () => { hasFocus = true; startTimer(); });
    showcase.addEventListener('focusout', (event) => {
      if (!showcase.contains(event.relatedTarget)) { hasFocus = false; startTimer(); }
    });
    document.addEventListener('visibilitychange', startTimer);

    setActive(0);
    startTimer();
  } catch (error) {
    const notice = document.createElement('p');
    notice.className = 'load-error';
    notice.textContent = projectLoadMessage();
    stage.after(notice);
  }
}

async function renderWorks() {
  const list = text('works-list');
  if (!list) return;

  try {
    const projects = newestFirst(await loadProjects());
    const years = text('works-years');
    const yearLinks = new Map();
    projects.forEach((project, i) => {
      const detailUrl = `work.html?id=${encodeURIComponent(project.id)}`;
      const item = document.createElement('article');
      item.className = 'works-entry';
      const year = String(project.year);
      if (!yearLinks.has(year)) {
        item.id = `year-${encodeURIComponent(year)}`;
        const link = document.createElement('a');
        link.href = `#${item.id}`;
        link.textContent = year;
        link.setAttribute('aria-label', `Jump to projects from ${year}`);
        years.append(link);
        yearLinks.set(year, link);
      }
      const imageLink = document.createElement('a');
      imageLink.className = 'works-entry-image';
      imageLink.href = detailUrl;
      imageLink.setAttribute('aria-label', `View ${project.titleEn}`);
      const image = document.createElement('img');
      image.src = project.image;
      image.alt = project.imageAltEn || project.titleEn;
      image.loading = i === 0 ? 'eager' : 'lazy';
      imageLink.append(image);

      const info = document.createElement('dl');
      info.className = 'works-entry-info';
      const titleRow = document.createElement('div');
      const titleLabel = document.createElement('dt');
      titleLabel.textContent = 'Project';
      const titleValue = document.createElement('dd');
      const titleLink = document.createElement('a');
      titleLink.href = detailUrl;
      titleLink.textContent = project.titleEn;
      titleValue.append(titleLink);
      titleRow.append(titleLabel, titleValue);

      const yearRow = document.createElement('div');
      const yearLabel = document.createElement('dt');
      yearLabel.textContent = 'Year';
      const yearValue = document.createElement('dd');
      yearValue.textContent = project.year;
      yearRow.append(yearLabel, yearValue);
      info.append(titleRow, yearRow);
      item.append(imageLink, info);
      list.append(item);
    });

    const setActiveYear = (year) => {
      yearLinks.forEach((link, key) => {
        if (key === year) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    const updateActiveYear = () => {
      const anchors = [...list.querySelectorAll('.works-entry[id]')];
      const current = anchors.reduce((selected, anchor) =>
        anchor.getBoundingClientRect().top <= 180 ? anchor : selected, anchors[0]);
      if (current) setActiveYear(current.id.slice(5));
    };
    window.addEventListener('scroll', updateActiveYear, { passive: true });
    window.addEventListener('resize', updateActiveYear);
    updateActiveYear();
  } catch (error) {
    list.textContent = projectLoadMessage();
    list.classList.add('load-error');
  }
}

async function renderProjectDetail() {
  const container = document.querySelector('#project-detail');
  if (!container) return;
  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) throw new Error('Project data could not be loaded');
    const projects = await response.json();
    const project = projects.find((item) => item.id === new URLSearchParams(location.search).get('id')) || projects[0];
    if (!project) throw new Error('No project found');
    document.title = `${project.titleEn} — HARO-STUDIO`;
    container.innerHTML = `
      <p class="eyebrow">${project.number} / ${project.typeEn}</p>
      <h1>${project.titleEn}</h1>
      <p class="detail-location">${project.locationEn} <span>·</span> ${project.year}</p>
      <div class="detail-art"><img src="${project.image}" alt="${project.imageAltEn}"></div>
      <div class="detail-description"><p class="eyebrow">PROJECT NOTE</p><p>${project.descriptionEn}</p></div>`;
  } catch (error) {
    container.textContent = projectLoadMessage();
    container.classList.add('load-error');
  }
}

renderShowcase();
renderWorks();
renderProjectDetail();
