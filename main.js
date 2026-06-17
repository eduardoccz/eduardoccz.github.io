'use strict';

/* ===== ICONS ===== */
const ICONS = {
  email: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
  location: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
};

/* ===== I18N ===== */
const UI_STRINGS = {
  en: {
    nav_about:      'About',
    nav_experience: 'Experience',
    nav_skills:     'Skills',
    nav_education:  'Education',
    nav_contact:    'Contact',
    section_experience:  'Experience',
    section_skills:      'Skills',
    section_education:   'Education & Certifications',
    section_contact:     'Contact',
    label_graduation:    'Degree',
    label_certification: 'Certification',
    label_languages:     'Languages',
    skill_categories: {
      languages_platforms: 'Languages & Platforms',
      frameworks:          'Frameworks & Libraries',
      cloud_infra:         'Cloud & Infrastructure',
      data_streaming:      'Data & Streaming',
      databases:           'Databases',
      observability:       'Observability & Quality',
      tools_methodologies: 'Tools & Methodologies',
    },
    footer: (name) => `${name} © ${new Date().getFullYear()} — Built with vanilla JS`,
    title: 'Eduardo Cazangi — Tech Lead | Senior Software Engineer',
    terminal_lines: [
      '15 years building resilient systems',
      'Tech Lead who still opens the terminal',
      '15 years writing code that cannot stop',
      'I like hard problems',
      '15 years, millions of users, zero tolerance for failure',
      'Currently Tech Lead @ CWI Software',
      'Kafka · Kubernetes · AWS · Java',
    ],
  },
  pt: {
    nav_about:      'Sobre',
    nav_experience: 'Experiência',
    nav_skills:     'Skills',
    nav_education:  'Formação',
    nav_contact:    'Contato',
    section_experience:  'Experiência',
    section_skills:      'Skills',
    section_education:   'Formação & Certificações',
    section_contact:     'Contato',
    label_graduation:    'Graduação',
    label_certification: 'Certificação',
    label_languages:     'Idiomas',
    skill_categories: {
      languages_platforms: 'Linguagens & Plataformas',
      frameworks:          'Frameworks & Bibliotecas',
      cloud_infra:         'Cloud & Infraestrutura',
      data_streaming:      'Dados & Streaming',
      databases:           'Bancos de Dados',
      observability:       'Observabilidade & Qualidade',
      tools_methodologies: 'Ferramentas & Metodologias',
    },
    footer: (name) => `${name} © ${new Date().getFullYear()} — Feito com JS puro`,
    title: 'Eduardo Cazangi — Tech Lead | Engenheiro de Software Sênior',
    terminal_lines: [
      '15 anos construindo sistemas resilientes',
      'Tech Lead que ainda abre o terminal',
      '15 anos escrevendo código que não pode parar',
      'Gosto de problema difícil',
      '15 anos, milhões de usuários, zero tolerância a falhas',
      'Atualmente Tech Lead @ CWI Software',
      'Kafka · Kubernetes · AWS · Java',
    ],
  },
};

/* ===== LANG STATE ===== */
function getInitialLang() {
  const saved = localStorage.getItem('portfolio-lang');
  if (saved === 'pt' || saved === 'en') return saved;
  return navigator.language?.startsWith('pt') ? 'pt' : 'en';
}

let currentLang = getInitialLang();
let typewriterTimer = null;

/* ===== LOAD PROFILE ===== */
async function loadProfile(lang) {
  const file = lang === 'pt' ? './data/profile.pt.json' : './data/profile.json';
  const res = await fetch(file);
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${file}`);
  return res.json();
}

/* ===== TYPEWRITER ===== */
function startTypewriter(lines) {
  if (typewriterTimer !== null) {
    clearTimeout(typewriterTimer);
    typewriterTimer = null;
  }

  const output = document.getElementById('terminal-output');
  if (!output) return;

  const TYPING_SPEED = 55;
  const ERASE_SPEED  = 30;
  const PAUSE_AFTER  = 1800;
  const PAUSE_BEFORE = 400;

  let lineIdx = 0;
  let charIdx = 0;
  let erasing = false;
  let displayed = '';
  let active = true;

  output._stopTypewriter = () => { active = false; };

  function tick() {
    if (!active) return;
    const line = lines[lineIdx];

    if (!erasing) {
      if (charIdx <= line.length) {
        displayed = line.slice(0, charIdx++);
        output.textContent = displayed;
        typewriterTimer = setTimeout(tick, TYPING_SPEED);
      } else {
        erasing = true;
        typewriterTimer = setTimeout(tick, PAUSE_AFTER);
      }
    } else {
      if (displayed.length > 0) {
        displayed = displayed.slice(0, -1);
        output.textContent = displayed;
        typewriterTimer = setTimeout(tick, ERASE_SPEED);
      } else {
        erasing = false;
        charIdx = 0;
        lineIdx = (lineIdx + 1) % lines.length;
        typewriterTimer = setTimeout(tick, PAUSE_BEFORE);
      }
    }
  }

  tick();
}

function stopTypewriter() {
  if (typewriterTimer !== null) {
    clearTimeout(typewriterTimer);
    typewriterTimer = null;
  }
  const output = document.getElementById('terminal-output');
  if (output?._stopTypewriter) output._stopTypewriter();
}

/* ===== INTERSECTION OBSERVER (run once) ===== */
let revealObserver = null;

function setupReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal:not(.visible)').forEach((el) => revealObserver.observe(el));
}

/* ===== NAV HIGHLIGHT (run once) ===== */
let navObserver = null;

function setupNavHighlight() {
  if (navObserver) return;
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => a.removeAttribute('aria-current'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.setAttribute('aria-current', 'page');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => navObserver.observe(s));
}

/* ===== HELPERS ===== */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'className') node.className = v;
    else if (k === 'innerHTML') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  children.forEach((child) => {
    if (typeof child === 'string') node.insertAdjacentHTML('beforeend', child);
    else if (child) node.appendChild(child);
  });
  return node;
}

/* ===== RENDER SECTIONS ===== */
function renderHero(p, t) {
  const nameEl = document.getElementById('hero-name');
  if (nameEl) nameEl.textContent = p.name;

  const titleEl = document.getElementById('hero-title');
  if (titleEl) titleEl.textContent = p.subtitle;

  const locEl = document.getElementById('hero-location');
  if (locEl) locEl.innerHTML = `${ICONS.location} ${esc(p.location)}`;

  const linksEl = document.getElementById('hero-links');
  if (linksEl) {
    linksEl.innerHTML = `
      <a href="mailto:${esc(p.email)}" aria-label="Email: ${esc(p.email)}">
        ${ICONS.email} ${esc(p.email)}
      </a>
      <a href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        ${ICONS.linkedin} LinkedIn
      </a>
      <a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        ${ICONS.github} GitHub
      </a>
    `;
  }

  const summaryEl = document.getElementById('hero-summary');
  if (summaryEl) summaryEl.textContent = p.summary;
}

function buildExpCard(exp, withDot = true) {
  const card = el('article', { className: 'exp-card' });
  if (withDot) card.appendChild(el('div', { className: 'timeline-dot', 'aria-hidden': 'true' }));

  const header = el('div', { className: 'exp-header' });
  header.appendChild(el('h3', { className: 'exp-role' }, esc(exp.role)));
  header.appendChild(el('span', { className: 'exp-period' }, esc(exp.period)));
  card.appendChild(header);

  card.appendChild(el('p', { className: 'exp-company' }, esc(exp.company)));
  card.appendChild(el('p', { className: 'exp-location' }, esc(exp.location)));

  const ul = el('ul', { className: 'exp-highlights' });
  exp.highlights.forEach((h) => ul.appendChild(el('li', {}, esc(h))));
  card.appendChild(ul);

  const tags = el('div', { className: 'exp-tags' });
  exp.skills.forEach((s) => tags.appendChild(el('span', { className: 'tag' }, esc(s))));
  card.appendChild(tags);

  return card;
}

function renderExperience(experience) {
  const container = document.getElementById('timeline-container');
  if (!container) return;
  container.innerHTML = '';

  const groups = [];
  for (const exp of experience) {
    const last = groups[groups.length - 1];
    if (last && last.company === exp.company) {
      last.roles.push(exp);
    } else {
      groups.push({ company: exp.company, roles: [exp] });
    }
  }

  groups.forEach((group, i) => {
    const wrapper = el('div', { className: 'reveal', style: `transition-delay:${i * 0.06}s` });

    if (group.roles.length === 1) {
      wrapper.appendChild(buildExpCard(group.roles[0], true));
    } else {
      const groupDiv = el('div', { className: 'company-group' });
      groupDiv.appendChild(el('div', { className: 'timeline-dot', 'aria-hidden': 'true' }));
      groupDiv.appendChild(el('p', { className: 'company-group-label' }, esc(group.company)));
      const bracket = el('div', { className: 'company-group-bracket' });
      group.roles.forEach((role) => bracket.appendChild(buildExpCard(role, false)));
      groupDiv.appendChild(bracket);
      wrapper.appendChild(groupDiv);
    }

    container.appendChild(wrapper);
  });
}

function renderSkills(skills, t) {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;
  grid.innerHTML = '';

  let delay = 0;
  for (const [key, items] of Object.entries(skills)) {
    const label = t.skill_categories[key] || key;
    const catEl = el('div', { className: 'skill-category reveal', style: `transition-delay:${delay}s` });
    catEl.appendChild(el('p', { className: 'skill-cat-title' }, esc(label)));
    const badges = el('div', { className: 'skill-badges' });
    items.forEach((item) => badges.appendChild(el('span', { className: 'skill-badge' }, esc(item))));
    catEl.appendChild(badges);
    grid.appendChild(catEl);
    delay += 0.06;
  }
}

function renderEducation(education, certifications, languages, t) {
  const grid = document.getElementById('edu-grid');
  if (!grid) return;
  grid.innerHTML = '';

  education.forEach((edu) => {
    const card = el('div', { className: 'edu-card reveal' });
    card.appendChild(el('p', { className: 'edu-section-label' }, t.label_graduation));
    card.appendChild(el('p', { className: 'edu-degree' }, esc(edu.degree)));
    card.appendChild(el('p', { className: 'edu-institution' }, esc(edu.institution)));
    card.appendChild(el('p', { className: 'edu-period' }, esc(edu.period)));
    grid.appendChild(card);
  });

  certifications.forEach((cert, idx) => {
    const card = el('div', { className: 'edu-card reveal', style: `transition-delay:${(idx + 1) * 0.1}s` });
    card.appendChild(el('p', { className: 'edu-section-label' }, t.label_certification));
    card.appendChild(el('p', { className: 'cert-name' }, esc(cert.name)));
    card.appendChild(el('p', { className: 'cert-issuer' }, esc(cert.issuer)));
    grid.appendChild(card);
  });

  if (languages && languages.length) {
    const langCard = el('div', { className: 'edu-card reveal', style: 'transition-delay:0.2s' });
    langCard.appendChild(el('p', { className: 'edu-section-label' }, t.label_languages));
    const langList = el('div', { className: 'lang-list' });
    languages.forEach((l) => {
      const item = el('div', { className: 'lang-item' });
      item.appendChild(el('span', { className: 'lang-name' }, esc(l.lang)));
      item.appendChild(el('span', { className: 'lang-level' }, esc(l.level)));
      langList.appendChild(item);
    });
    langCard.appendChild(langList);
    grid.appendChild(langCard);
  }
}

function renderContact(p) {
  const linksEl = document.getElementById('contact-links');
  if (!linksEl) return;
  linksEl.innerHTML = `
    <a href="mailto:${esc(p.email)}" class="contact-link" aria-label="Email">
      ${ICONS.email} ${esc(p.email)}
    </a>
    <a href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer" class="contact-link" aria-label="LinkedIn">
      ${ICONS.linkedin} LinkedIn
    </a>
    <a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer" class="contact-link" aria-label="GitHub">
      ${ICONS.github} GitHub
    </a>
  `;
}

/* ===== UPDATE STATIC UI TEXT ===== */
function updateStaticText(t) {
  // Nav links
  const navLinks = document.querySelectorAll('.nav-links a');
  const navKeys = ['nav_about', 'nav_experience', 'nav_skills', 'nav_education', 'nav_contact'];
  navLinks.forEach((a, i) => { if (navKeys[i]) a.textContent = t[navKeys[i]]; });

  // Section headings — preserve the <span class="section-num"> and update text node
  const headings = {
    'exp-heading':     t.section_experience,
    'skills-heading':  t.section_skills,
    'edu-heading':     t.section_education,
    'contact-heading': t.section_contact,
  };
  for (const [id, text] of Object.entries(headings)) {
    const heading = document.getElementById(id);
    if (!heading) continue;
    const numSpan = heading.querySelector('.section-num');
    heading.textContent = ' ' + text;
    if (numSpan) heading.prepend(numSpan);
  }

  // Footer
  const footerEl = document.getElementById('footer-text');
  if (footerEl) footerEl.textContent = t.footer('Eduardo Cazangi');
}

/* ===== LANG SWITCHER ===== */
function updateLangSwitcher(lang) {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const pressed = btn.dataset.lang === lang;
    btn.setAttribute('aria-pressed', String(pressed));
  });
}

function setupLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const newLang = btn.dataset.lang;
      if (newLang === currentLang) return;
      currentLang = newLang;
      localStorage.setItem('portfolio-lang', currentLang);
      render(currentLang);
    });
  });
}

/* ===== MAIN RENDER ===== */
async function render(lang) {
  const t = UI_STRINGS[lang] || UI_STRINGS.en;

  try {
    const p = await loadProfile(lang);

    // Update <html> lang and <title>
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = t.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', p.summary);

    // Render dynamic sections
    renderHero(p, t);
    renderExperience(p.experience);
    renderSkills(p.skills, t);
    renderEducation(p.education, p.certifications, p.languages, t);
    renderContact(p);

    // Update static UI text (nav, headings, footer)
    updateStaticText(t);
    updateLangSwitcher(lang);

    // Re-observe new reveal elements (sections were re-rendered)
    setupReveal();

    // Hero reveals: make visible immediately (above fold)
    document.querySelectorAll('.hero .reveal').forEach((node) => {
      requestAnimationFrame(() => node.classList.add('visible'));
    });

    // Restart typewriter with correct language lines
    stopTypewriter();
    startTypewriter(t.terminal_lines);

  } catch (err) {
    console.error('Failed to render:', err);
  }
}

/* ===== BOOT ===== */
document.addEventListener('DOMContentLoaded', () => {
  setupLangSwitcher();
  setupNavHighlight();
  render(currentLang);
});
