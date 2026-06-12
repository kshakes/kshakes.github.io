/* ── DATA LOADING ─────────────────────────────────────── */
async function loadContent() {
  const res = await fetch('./data/content.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('Failed to load content.json');
  return res.json();
}

/* ── CARD BUILDER (certs & VWE) ───────────────────────── */
function buildCertCard({ image, alt, title, issuer, summaryHtml, details, link }) {
  const card = document.createElement('div');
  card.className = 'c-card';

  const img = document.createElement('img');
  img.src = image;
  img.alt = alt || title;
  img.className = 'c-card-img';
  card.appendChild(img);

  const body = document.createElement('div');
  body.className = 'c-card-body';

  const h3 = document.createElement('h3');
  h3.textContent = title;
  body.appendChild(h3);

  if (issuer) {
    const iss = document.createElement('span');
    iss.className = 'issuer';
    iss.textContent = issuer;
    body.appendChild(iss);
  }
  if (summaryHtml) {
    const p = document.createElement('p');
    p.innerHTML = summaryHtml;
    body.appendChild(p);
  }
  if (details && (details.summary || details.bullets?.length)) {
    const det = document.createElement('details');
    if (details.summary) {
      const sum = document.createElement('summary');
      sum.textContent = details.summary;
      det.appendChild(sum);
    }
    if (details.bullets?.length) {
      const ul = document.createElement('ul');
      details.bullets.forEach(b => {
        const li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
      det.appendChild(ul);
    }
    body.appendChild(det);
  }
  if (link?.href) {
    const a = document.createElement('a');
    a.href = link.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = link.label || 'Source';
    a.className = 'src-link';
    body.appendChild(a);
  }

  card.appendChild(body);
  return card;
}

/* ── POPULATE A CAROUSEL TRACK ────────────────────────── */
function populateTrack(trackId, items, builder) {
  const track = document.getElementById(trackId);
  if (!track) return;
  items.forEach(item => track.appendChild(builder(item)));
}

/* ── CAROUSEL LOGIC ───────────────────────────────────── */
function initCarousels() {
  document.querySelectorAll('.carousel-outer').forEach(outer => {
    const prevBtn = outer.querySelector('.carousel-arrow.prev');
    const nextBtn = outer.querySelector('.carousel-arrow.next');
    const targetId = prevBtn?.dataset.target;
    const track = document.getElementById(targetId);
    if (!track) return;

    let idx = 0;

    function cardWidth() {
      const first = track.firstElementChild;
      if (!first) return 376; // fallback: card width + gap
      return first.offsetWidth + 16;
    }

    function visibleCount() {
      return Math.floor(outer.offsetWidth / cardWidth()) || 1;
    }

    function maxIdx() {
      return Math.max(0, track.children.length - visibleCount());
    }

    function go(dir) {
      idx = idx + dir;
      if (idx < 0) idx = maxIdx();
      if (idx > maxIdx()) idx = 0;
      track.style.transform = `translateX(-${idx * cardWidth()}px)`;
    }

    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));

    window.addEventListener('resize', () => {
      idx = 0;
      track.style.transform = 'translateX(0)';
    });
  });
}

/* ── INIT ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await loadContent();
    populateTrack('cert-track', data.certifications || [], buildCertCard);
    populateTrack('vwe-track', data.virtualWorkExperience || [], buildCertCard);
  } catch (err) {
    console.error('Failed to load content.json:', err);
  }
  initCarousels();
});
