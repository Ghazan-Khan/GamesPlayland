/**
 * Site UI: mobile navigation and client-side search.
 * No dependencies, no tracking.
 */
(function () {
  /* ---------------- Mobile navigation ---------------- */
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  function setNav(open) {
    if (!header || !toggle) return;
    header.classList.toggle('nav-open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      setNav(!header.classList.contains('nav-open'));
    });
  }

  if (nav) {
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setNav(false);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header && header.classList.contains('nav-open')) {
      setNav(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!header || !header.classList.contains('nav-open')) return;
    if (!header.contains(e.target)) setNav(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) setNav(false);
  });

  /* ---------------- Header search shortcut ---------------- */
  const headerSearch = document.querySelector('.header-search input');
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && headerSearch && document.activeElement !== headerSearch) {
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      headerSearch.focus();
    }
  });

  /* ---------------- Search page ---------------- */
  const searchInput = document.getElementById('search-input');
  const indexEl = document.getElementById('search-index');
  const resultsEl = document.getElementById('search-results');
  const statusEl = document.getElementById('search-status');
  const emptyEl = document.getElementById('search-empty');

  if (!searchInput || !indexEl || !resultsEl) return;

  let index = [];
  try {
    index = JSON.parse(indexEl.textContent);
  } catch (err) {
    console.error(err);
  }

  const params = new URLSearchParams(window.location.search);
  const initial = params.get('q') || '';
  searchInput.value = initial;

  function esc(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function hit(item) {
    return `<a class="related-card" href="${item.url}">
      ${
        item.image
          ? `<img src="${item.image}" alt="" width="640" height="400" loading="lazy" decoding="async">`
          : '<span class="search-kind" aria-hidden="true">' +
            esc((item.kind || 'Page').slice(0, 1)) +
            '</span>'
      }
      <span><b>${esc(item.title)}</b><span>${esc(item.kind)} · ${esc(item.text)}</span></span>
    </a>`;
  }

  function run() {
    const q = searchInput.value.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    const matches = terms.length
      ? index.filter((item) => {
          const haystack = `${item.title} ${item.kind} ${item.text}`.toLowerCase();
          return terms.every((term) => haystack.includes(term));
        })
      : index.filter((item) => item.kind !== 'Page');

    resultsEl.innerHTML = matches.map(hit).join('');
    if (statusEl) {
      statusEl.textContent = q
        ? `${matches.length} result${matches.length === 1 ? '' : 's'} for “${searchInput.value.trim()}”`
        : 'Showing all games, categories and guides.';
    }
    if (emptyEl) emptyEl.hidden = matches.length !== 0;

    const url = new URL(window.location.href);
    if (q) url.searchParams.set('q', searchInput.value.trim());
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }

  searchInput.addEventListener('input', run);
  run();
})();
