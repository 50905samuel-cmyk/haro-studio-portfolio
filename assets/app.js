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
    const dots = text('carousel-dots');

    const setActive = (nextIndex) => {
      active = (nextIndex + projects.length) % projects.length;
      const project = projects[active];
      image.classList.add('is-changing');
      window.setTimeout(() => {
        image.src = project.image;
        image.alt = project.imageAltZh || project.titleZh;
        image.onload = () => image.classList.remove('is-changing');
      }, 150);

      text('stage-number').textContent = `${String(active + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
      text('project-category').textContent = project.typeZh;
      text('project-title').textContent = project.titleZh;
      text('project-location').innerHTML = `${project.locationZh} <span>·</span> ${project.year}`;
      text('project-description').textContent = project.descriptionZh;
      text('panel-mark').textContent = String(active + 1).padStart(2, '0');
      text('stage-link').href = `work.html?id=${encodeURIComponent(project.id)}`;
      text('project-detail-link').href = `work.html?id=${encodeURIComponent(project.id)}`;

      index.querySelectorAll('[data-project-index]').forEach((button, i) => {
        button.classList.toggle('is-active', i === active);
        button.setAttribute('aria-current', i === active ? 'true' : 'false');
      });
      dots.querySelectorAll('button').forEach((button, i) => {
        button.classList.toggle('is-active', i === active);
        button.setAttribute('aria-label', `顯示第 ${i + 1} 件作品`);
        button.setAttribute('aria-pressed', i === active ? 'true' : 'false');
      });
    };

    projects.forEach((project, i) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'index-item';
      item.dataset.projectIndex = String(i);
      item.innerHTML = `<span class="index-item-number">${String(i + 1).padStart(2, '0')}</span><span class="index-item-title"></span><span class="index-item-arrow" aria-hidden="true">↗</span>`;
      item.querySelector('.index-item-title').textContent = project.titleZh;
      item.addEventListener('click', () => {
        setActive(i);
        restartTimer();
      });
      index.append(item);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `顯示第 ${i + 1} 件作品`);
      dot.setAttribute('aria-pressed', 'false');
      dot.addEventListener('click', () => {
        setActive(i);
        restartTimer();
      });
      dots.append(dot);
    });

    text('index-count').textContent = `01 — ${String(projects.length).padStart(2, '0')}`;
    text('previous-project').addEventListener('click', () => { setActive(active - 1); restartTimer(); });
    text('next-project').addEventListener('click', () => { setActive(active + 1); restartTimer(); });

    const startTimer = () => {
      window.clearInterval(timer);
      if (!paused && document.visibilityState === 'visible') {
        timer = window.setInterval(() => setActive(active + 1), 6500);
      }
      pauseButton.textContent = paused ? '播放輪播' : '暫停輪播';
      pauseButton.setAttribute('aria-pressed', paused ? 'true' : 'false');
    };
    const restartTimer = () => startTimer();
    pauseButton.addEventListener('click', () => { paused = !paused; startTimer(); });
    stage.addEventListener('mouseenter', () => window.clearInterval(timer));
    stage.addEventListener('mouseleave', startTimer);
    stage.addEventListener('focusin', () => window.clearInterval(timer));
    stage.addEventListener('focusout', startTimer);
    document.addEventListener('visibilitychange', startTimer);

    setActive(0);
    startTimer();
  } catch (error) {
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
