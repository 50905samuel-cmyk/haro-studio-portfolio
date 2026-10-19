const labels = (lang) => {
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
  document.querySelectorAll('[data-zh][data-en]').forEach((el) => {
    el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.zh;
  });
  document.querySelectorAll('[data-language]').forEach((button) => button.textContent = lang === 'en' ? '中' : 'EN');
  localStorage.setItem('portfolio-language', lang);
};

const visual = {
  music: `<svg viewBox="0 0 800 500" role="img" aria-label="音樂園區概念圖形"><rect width="800" height="500" fill="#c4b49b"/><path d="M0 337h800v163H0z" fill="#9f8d73"/><path d="M44 173h295v164H44z" fill="#3c3e3b"/><path d="M60 190h263v130H60z" fill="#b56845"/><path d="M355 111h395v226H355z" fill="#eee9df"/><path d="M382 145h336v192H382z" fill="#6c716a"/><path d="M406 165h288v172H406z" fill="#ded6c8"/><path d="M0 341h800" stroke="#31332f" stroke-width="8"/><path d="M52 370h690" stroke="#d7c8ae" stroke-width="2" stroke-dasharray="6 10"/><circle cx="95" cy="104" r="25" fill="#d9d0be"/><text x="38" y="450" fill="#f4eee5" font-size="14" letter-spacing="3">OLD CITY / MUSIC / REUSE</text></svg>`,
  bridge: `<svg viewBox="0 0 800 500" role="img" aria-label="高架橋下公共空間概念圖形"><rect width="800" height="500" fill="#d9d6ce"/><rect y="0" width="800" height="100" fill="#383b39"/><path d="M0 99h800" stroke="#a3a097" stroke-width="7"/><path d="M112 100v300M286 100v300M472 100v300M661 100v300" stroke="#4b4e4b" stroke-width="25"/><path d="M0 400h800v100H0z" fill="#b8b5aa"/><path d="M0 423h800" stroke="#eee9df" stroke-width="4"/><path d="M65 351h151v49H65z" fill="#cf7652"/><path d="M316 325h174v75H316z" fill="#7f9587"/><path d="M567 344h163v56H567z" fill="#d4bb83"/><path d="M216 400v-49m274 49v-75m77 75v-56" stroke="#383b39" stroke-width="5"/><text x="37" y="466" fill="#383b39" font-size="14" letter-spacing="3">INFRASTRUCTURE / COMMON GROUND</text></svg>`,
  taitung: `<svg viewBox="0 0 800 500" role="img" aria-label="部落共同建造概念圖形"><rect width="800" height="500" fill="#d7d9c9"/><path d="M0 287 140 170l117 117 141-154 167 154 109-99 126 99v213H0z" fill="#7a8974"/><path d="M0 336 169 225l113 102 145-116 162 120 120-96 91 76v173H0z" fill="#a1a98c"/><path d="M0 380h800v120H0z" fill="#c6b590"/><path d="M198 271h404v14H198zM233 201v82m334-82v82" stroke="#754f34" stroke-width="11"/><path d="M216 201h370l-36-76H253z" fill="#b78049" stroke="#754f34" stroke-width="8"/><path d="M260 222h278m-250 0v60m220-60v60" stroke="#eee4cf" stroke-width="4"/><path d="M614 370h88v-47h-88z" fill="#936a46"/><path d="M629 323v-40m57 40v-40" stroke="#754f34" stroke-width="7"/><text x="38" y="466" fill="#fff9ed" font-size="14" letter-spacing="3">TAITUNG / MAKING TOGETHER</text></svg>`
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
      <div class="project-image ${project.visual}">${visual[project.visual]}<span class="image-caption" data-zh="概念圖形・非作品照片" data-en="CONCEPT GRAPHIC · NOT A PROJECT PHOTO">概念圖形・非作品照片</span></div>
      <div class="project-meta"><span>${project.number} / ${project.typeZh}</span><span>${project.year}</span></div>
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
