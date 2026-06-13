/* ════════════════════════════════════════════════════════════════
   PROJECT DETAIL PAGE
   Reads content.json, finds the project by ?id=, and renders the
   title, description, media preview and an interactive IDE replica.

   This page lives in /Projects, one level below the site root, so all
   paths that point back to the root (data/, images/, index.html) are
   prefixed with ROOT. If you ever move this file, change ROOT only:
     - same folder as index.html  ->  ROOT = './'
     - one folder deep (current)  ->  ROOT = '../'
   ════════════════════════════════════════════════════════════════ */

const ROOT = '../';

/* Resolve a content.json path (e.g. "./images/x.gif") against the site
   root, leaving absolute URLs untouched. */
function toRoot(p) {
  if (!p) return p;
  if (/^(https?:)?\/\//.test(p)) return p;        // absolute URL
  return ROOT + p.replace(/^\.?\//, '');          // strip leading ./ or /
}

/* ── File-type metadata (icon label + highlight.js language) ─────── */
const FILE_TYPES = {
  js:   { label: 'JS',  cls: 'fi-js',   lang: 'javascript' },
  mjs:  { label: 'JS',  cls: 'fi-js',   lang: 'javascript' },
  jsx:  { label: 'JS',  cls: 'fi-js',   lang: 'javascript' },
  json: { label: '{ }', cls: 'fi-json', lang: 'json' },
  css:  { label: '#',   cls: 'fi-css',  lang: 'css' },
  html: { label: '<>',  cls: 'fi-html', lang: 'xml' },
  ejs:  { label: '<>',  cls: 'fi-ejs',  lang: 'xml' },
  sql:  { label: 'SQL', cls: 'fi-sql',  lang: 'sql' },
  md:   { label: 'MD',  cls: 'fi-md',   lang: 'markdown' },
  txt:  { label: 'TXT', cls: 'fi-txt',  lang: 'plaintext' },
};

function fileType(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  return FILE_TYPES[ext] || { label: '·', cls: 'fi-txt', lang: 'plaintext' };
}

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/* ── Media (gif / image / video) ─────────────────────────────────── */
function buildMedia(media, title) {
  const src = media?.src || '';
  const isVideo = media?.type === 'video' || /\.(mp4|webm|ogg)$/i.test(src);

  if (isVideo) {
    const v = document.createElement('video');
    v.src = toRoot(src);
    v.controls = true;
    v.autoplay = true;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'metadata';
    return v;
  }
  const img = document.createElement('img');
  img.src = toRoot(src);
  img.alt = `${title} preview`;
  img.loading = 'lazy';
  return img;
}

/* ── IDE: render one file into the body (gutter + highlighted code) ─ */
function renderFile(bodyEl, file) {
  bodyEl.innerHTML = '';
  const code = (file.code || '').replace(/\n$/, '');
  const lineCount = code.split('\n').length;

  const gutter = document.createElement('div');
  gutter.className = 'ide-gutter';
  gutter.setAttribute('aria-hidden', 'true');
  gutter.textContent = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');

  const pre = document.createElement('pre');
  const codeEl = document.createElement('code');
  const { lang } = fileType(file.name);
  codeEl.className = `hljs language-${lang}`;
  codeEl.textContent = code; // textContent => safe, no HTML injection

  pre.appendChild(codeEl);
  bodyEl.appendChild(gutter);
  bodyEl.appendChild(pre);
  bodyEl.scrollTop = 0;
  bodyEl.scrollLeft = 0;

  if (window.hljs) {
    try { window.hljs.highlightElement(codeEl); } catch (_) { /* plain text fallback */ }
  }
}

/* ── IDE: build the whole component ──────────────────────────────── */
function buildIDE(files) {
  const ide = document.createElement('div');
  ide.className = 'ide';

  // window chrome
  const chrome = document.createElement('div');
  chrome.className = 'ide-chrome';
  chrome.innerHTML =
    '<span class="ide-dot r"></span><span class="ide-dot y"></span><span class="ide-dot g"></span>';
  const activeName = document.createElement('span');
  activeName.className = 'ide-active-name';
  chrome.appendChild(activeName);

  // tab strip
  const tabs = document.createElement('div');
  tabs.className = 'ide-tabs';
  tabs.setAttribute('role', 'tablist');

  // code body
  const body = document.createElement('div');
  body.className = 'ide-body';

  function activate(i) {
    tabs.querySelectorAll('.ide-tab').forEach((t, j) => {
      const on = j === i;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    activeName.textContent = files[i].name;
    renderFile(body, files[i]);
  }

  files.forEach((file, i) => {
    const ft = fileType(file.name);
    const tab = document.createElement('button');
    tab.className = 'ide-tab';
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.title = file.name;

    const icon = document.createElement('span');
    icon.className = `ide-fi ${ft.cls}`;
    icon.textContent = ft.label;

    const label = document.createElement('span');
    label.textContent = file.name.split('/').pop(); // show filename, full path in title

    const close = document.createElement('span');
    close.className = 'close';
    close.textContent = '×';

    tab.append(icon, label, close);
    tab.addEventListener('click', () => activate(i));
    tabs.appendChild(tab);
  });

  ide.append(chrome, tabs, body);
  if (files.length) activate(0);
  return ide;
}

/* ── Render the whole page ───────────────────────────────────────── */
function renderProject(project) {
  document.title = `Kyle Shakespeare | ${project.title}`;

  document.getElementById('project-title').textContent = project.title;

  const descBody = document.getElementById('project-desc-body');
  descBody.textContent = project.description || '';

  // Stage: media pane + IDE pane
  const mediaPane = document.getElementById('stage-media');
  mediaPane.appendChild(buildMedia(project.media, project.title));

  const idePane = document.getElementById('stage-ide');
  const files = project.files || [];
  const toggleBtn = document.getElementById('toggle-source');

  if (files.length) {
    idePane.appendChild(buildIDE(files));
  } else {
    toggleBtn.style.display = 'none';
  }

  // Toggle behaviour: Source Code <-> Show Video
  let showingCode = false;
  toggleBtn.addEventListener('click', () => {
    showingCode = !showingCode;
    mediaPane.hidden = showingCode;
    idePane.hidden = !showingCode;
    toggleBtn.setAttribute('aria-pressed', String(showingCode));
    toggleBtn.querySelector('.label').textContent = showingCode ? 'Show Video' : 'Source Code';
  });
}

function renderNotFound(id) {
  const main = document.getElementById('project-detail');
  main.innerHTML =
    `<div class="project-empty">
       <p>Sorry — no project found${id ? ` for “${id}”` : ''}.</p>
       <p><a href="${ROOT}index.html">← Back to the portfolio</a></p>
     </div>`;
}

/* ── Init ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  const id = getParam('id');
  try {
    const res = await fetch(`${ROOT}data/content.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to load content.json');
    const data = await res.json();
    const project = (data.projects || []).find(p => p.id === id);
    if (!project) return renderNotFound(id);
    renderProject(project);
  } catch (err) {
    console.error(err);
    renderNotFound(id);
  }
});
