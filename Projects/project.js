/* ════════════════════════════════════════════════════════════════
   PROJECT DETAIL PAGE
   Reads content.json, finds the project by ?id=, and renders the
   title, description, and media preview.

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

/* ── Render the whole page ───────────────────────────────────────── */
function renderProject(project) {
  document.title = `Kyle Shakespeare | ${project.title}`;

  document.getElementById('project-title').textContent = project.title;

  const descBody = document.getElementById('project-desc-body');
  descBody.textContent = project.description || '';

  // Stage: media pane
  const mediaPane = document.getElementById('stage-media');
  mediaPane.appendChild(buildMedia(project.media, project.title));
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
