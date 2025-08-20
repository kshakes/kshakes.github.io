$(document).ready(function() {
    $("h3").mouseenter(function(evt) {
        var bgImage = "";

        if ($(this).hasClass("firstProject")) {
            bgImage = "./images/mts-shorts-preview.gif";
            bgSize  = "cover";
        } else if ($(this).hasClass("secondProject")) {
            bgImage = "./images/portfolio-management-preview.gif";
            bgSize  = "130%";
        } else if ($(this).hasClass("thirdProject")) {
            bgImage = "./images/mts-salary-preview.gif";
            bgSize  = "cover";
        }

        $(this).closest(".card-cover").css({
            "background-image":  `url('${bgImage}')`,
            "background-size":   bgSize,
            "background-position":"center",
            "background-repeat": "no-repeat"
        });

        $(this).css("opacity", "0");
        $(this).siblings("p").css("opacity", "0");
    });

    $("h3").mouseleave(function(evt) {
        $(this).closest(".card-cover").css({
            "background-image": "",
        });

        $(this).css("opacity", "1");
        $(this).siblings("p").css("opacity", "1");
    });      
});

async function loadContent() {
  const res = await fetch('/data/content.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('Failed to load content.json');
  return res.json();
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

function card({ image, imageHeight = 400, alt = '', title, summaryHtml, issuer, details, link }) {
  const col = el('div', 'col');
  const card = el('div', 'card shadow-sm');

  const wrapper = el('div', 'wrapper');
  const img = el('img');
  img.src = image;
  img.alt = alt || title || '';
  img.height = imageHeight;
  wrapper.appendChild(img);

  const body = el('div', 'card-body');
  const h2 = el('h2', null, title);
  body.appendChild(h2);

  if (issuer) body.appendChild(el('p', null, `<em>${issuer}</em>`));
  if (summaryHtml) body.appendChild(el('p', null, summaryHtml));

  if (details && (details.summary || (details.bullets && details.bullets.length))) {
    const det = el('details');
    if (details.summary) det.appendChild(el('summary', null, details.summary));
    if (details.bullets?.length) {
      const ul = el('ul');
      details.bullets.forEach(b => ul.appendChild(el('li', null, b)));
      det.appendChild(ul);
    }
    body.appendChild(det);
  }

  if (link?.href) {
    const a = el('a');
    a.href = link.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = link.label || 'Source';
    body.appendChild(a);
  }

  card.append(wrapper, body);
  col.appendChild(card);
  return col;
}

function renderGrid(targetId, items) {
  const root = document.getElementById(targetId);
  if (!root) return;
  root.innerHTML = ''; // clear existing
  const frag = document.createDocumentFragment();
  items.forEach(item => frag.appendChild(card(item)));
  root.appendChild(frag);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await loadContent();
    renderGrid('certifications-grid', data.certifications || []);
    renderGrid('vwe-grid', data.virtualWorkExperience || []);
  } catch (err) {
    console.error(err);
  }
});

