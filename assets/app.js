const labels = (lang) => {
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
  document.querySelectorAll('[data-zh][data-en]').forEach((el) => {
    el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.zh;
  });
  document.querySelectorAll('[data-language]').forEach((button) => button.textContent = lang === 'en' ? '中' : 'EN');
  localStorage.setItem('portfolio-language', lang);
  window.dispatchEvent(new CustomEvent('portfolio-language-change', { detail: { lang } }));
};

async function renderProjects() {
  const grid = document.querySelector('#project-grid');
  if (!grid) return;
  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) throw new Error('Project data could not be loaded');
    const projects = await response.json();
    const lang = localStorage.getItem('portfolio-language') || 'zh';
    grid.innerHTML = projects.map((project) => `<a class="project-card" href="work.html?id=${encodeURIComponent(project.id)}">
      <div class="project-image"><img src="${project.image}" alt="${lang === 'en' ? project.imageAltEn : project.imageAltZh}" loading="lazy"></div>
      <div class="project-meta"><span>${project.number} / ${lang === 'en' ? project.typeEn : project.typeZh}</span><span>${project.year}</span></div>
      <h3>${lang === 'en' ? project.titleEn : project.titleZh}</h3><p>${lang === 'en' ? project.locationEn : project.locationZh}</p>
    </a>`).join('');
    labels(lang);
  } catch (error) {
    grid.innerHTML = '<p class="load-error">作品資料載入失敗，請確認網站是透過本機伺服器或部署網址開啟。</p>';
  }
}

const toggleLanguage = () => labels((localStorage.getItem('portfolio-language') || 'zh') === 'zh' ? 'en' : 'zh');
document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', toggleLanguage));
labels(localStorage.getItem('portfolio-language') || 'zh');
renderProjects();
