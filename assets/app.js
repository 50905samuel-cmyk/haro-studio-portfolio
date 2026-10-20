const text = (id) => document.getElementById(id);

async function renderShowcase() {
  const index = text('project-index');
  if (!index) return;

  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) throw new Error('Project data could not be loaded');
    const projects = await response.json();
    if (!Array.isArray(projects) || projects.length === 0) throw new Error('No projects found');

    let active = 0;
    let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer;
    const image = text('active-project-image');
    const stage = text('image-stage');
    const pauseButton = text('pause-carousel');
    const worksToggle = text('works-toggle');

    const setActive = (nextIndex) => {
      active = (nextIndex + projects.length) % projects.length;
      const project = projects[active];
      image.classList.add('is-changing');
      window.setTimeout(() => {
        image.onload = () => image.classList.remove('is-changing');
        image.src = project.image;
        image.alt = project.imageAltZh || project.titleZh;
        if (image.complete) image.classList.remove('is-changing');
      }, 150);

      const detailUrl = `work.html?id=${encodeURIComponent(project.id)}`;
      text('stage-number').textContent = `${String(active + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
      text('stage-link').href = detailUrl;
      text('stage-link').setAttribute('aria-label', `閱讀${project.titleZh}作品介紹`);
      text('project-title').textContent = project.titleZh;
      text('project-title').href = detailUrl;
      text('project-detail-link').href = detailUrl;

      index.querySelectorAll('[data-project-index]').forEach((button, i) => {
        button.classList.toggle('is-active', i === active);
        button.setAttribute('aria-current', i === active ? 'true' : 'false');
      });
    };

    const startTimer = () => {
      window.clearInterval(timer);
      if (!paused && document.visibilityState === 'visible') {
        timer = window.setInterval(() => setActive(active + 1), 6500);
      }
      pauseButton.textContent = paused ? '播放' : '暫停';
      pauseButton.setAttribute('aria-pressed', paused ? 'true' : 'false');
    };

    projects.forEach((project, i) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'index-item';
      item.dataset.projectIndex = String(i);
      item.textContent = `${String(i + 1).padStart(2, '0')}　${project.titleZh}`;
      item.addEventListener('click', () => {
        setActive(i);
        index.hidden = true;
        worksToggle.setAttribute('aria-expanded', 'false');
        startTimer();
      });
      index.append(item);
    });

    worksToggle.addEventListener('click', () => {
      index.hidden = !index.hidden;
      worksToggle.setAttribute('aria-expanded', String(!index.hidden));
    });
    text('previous-project').addEventListener('click', () => { setActive(active - 1); startTimer(); });
    text('next-project').addEventListener('click', () => { setActive(active + 1); startTimer(); });
    pauseButton.addEventListener('click', () => { paused = !paused; startTimer(); });
    stage.addEventListener('mouseenter', () => window.clearInterval(timer));
    stage.addEventListener('mouseleave', startTimer);
    stage.addEventListener('focusin', () => window.clearInterval(timer));
    stage.addEventListener('focusout', startTimer);
    document.addEventListener('visibilitychange', startTimer);

    setActive(0);
    startTimer();
  } catch (error) {
    index.hidden = false;
    index.innerHTML = '<p class="load-error">作品資料載入失敗，請確認網站已部署並重新整理。</p>';
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
    document.title = `${project.titleZh} — HARO-STUDIO`;
    container.innerHTML = `
      <p class="eyebrow">${project.number} / ${project.typeZh}</p>
      <h1>${project.titleZh}</h1>
      <p class="detail-location">${project.locationZh} <span>·</span> ${project.year}</p>
      <div class="detail-art"><img src="${project.image}" alt="${project.imageAltZh}"></div>
      <div class="detail-description"><p class="eyebrow">PROJECT NOTE</p><p>${project.descriptionZh}</p></div>`;
  } catch (error) {
    container.innerHTML = '<p class="load-error">作品資料載入失敗，請確認網站已部署並重新整理。</p>';
  }
}

renderShowcase();
renderProjectDetail();
