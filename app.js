// app.js — minimal & readable: live search + render + bookmarks (localStorage)

// storage
const STORAGE_KEY = 'locallink_bookmarks_v1';
function loadSavedIds() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveSavedIds(arr) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch {}
}

// main
document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('search-bar');
  const listContainer = document.getElementById('business-list');
  const bookmarksContainer = document.getElementById('bookmarked-businesses');

  if (typeof LISTINGS === 'undefined') {
    if (listContainer) listContainer.textContent = 'Listings data not available.';
    return;
  }

  // restore bookmarked flags from storage
  const saved = loadSavedIds();
  LISTINGS.forEach(item => item.bookmarked = saved.includes(item.id));

  // render bookmarks (very small)
  function renderBookmarks() {
    if (!bookmarksContainer) return;
    bookmarksContainer.innerHTML = '';
    const marked = LISTINGS.filter(b => b.bookmarked);
    if (marked.length === 0) {
      bookmarksContainer.textContent = 'No bookmarks yet.';
      return;
    }
    marked.forEach(b => {
      const d = document.createElement('div');
      d.className = 'business-card small';
      const h = document.createElement('h3'); h.textContent = b.name;
      const p = document.createElement('p'); p.textContent = b.shortDescription || b.category || '';
      d.appendChild(h); d.appendChild(p);
      bookmarksContainer.appendChild(d);
    });
  }

  // render results into listContainer
  function renderResults(items) {
    listContainer.innerHTML = '';
    if (!items || items.length === 0) {
      const no = document.createElement('div');
      no.className = 'no-results-card';
      no.textContent = 'No businesses found.';
      listContainer.appendChild(no);
      return;
    }

    items.forEach(b => {
      const card = document.createElement('div');
      card.className = 'business-card';

      const row = document.createElement('div');
      row.className = 'business-row';

      const main = document.createElement('div');
      main.className = 'business-main';
      const title = document.createElement('h3'); title.className = 'biz-name'; title.textContent = b.name;
      const meta = document.createElement('p'); meta.className = 'biz-meta'; meta.textContent = `${b.category} • ${b.address}`;
      const desc = document.createElement('p'); desc.className = 'biz-desc'; desc.textContent = b.shortDescription || '';
      const stats = document.createElement('p'); stats.className = 'biz-stats'; stats.textContent = `Rating: ${b.rating} (${b.reviewCount}) • ${'$'.repeat(b.priceRange || 1)}`;
      main.appendChild(title); main.appendChild(meta); main.appendChild(desc); main.appendChild(stats);

      const actions = document.createElement('div');
      actions.className = 'business-actions';
      const link = document.createElement('a');
      link.className = 'biz-site';
      link.textContent = 'Website';
      if (b.website) { link.href = b.website; link.target = '_blank'; } else { link.href = '#'; link.onclick = (e) => e.preventDefault(); }
      const lbl = document.createElement('label');
      lbl.style.fontSize = '0.9rem';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'bookmark-checkbox';
      cb.dataset.id = b.id;
      cb.checked = !!b.bookmarked;
      lbl.appendChild(cb);
      lbl.appendChild(document.createTextNode(' Bookmark'));
      actions.appendChild(link);
      actions.appendChild(lbl);

      row.appendChild(main);
      row.appendChild(actions);
      card.appendChild(row);
      card.appendChild(document.createElement('hr'));

      listContainer.appendChild(card);

      // checkbox listener
      cb.addEventListener('change', () => {
        b.bookmarked = cb.checked;
        const ids = LISTINGS.filter(x => x.bookmarked).map(x => x.id);
        saveSavedIds(ids);
        renderBookmarks();
      });
    });
  }

  // filter function
  function filterByQuery(q) {
    if (!q) return [];
    const ql = q.trim().toLowerCase();
    if (ql === '') return [];
    return LISTINGS.filter(b => {
      return (b.name && b.name.toLowerCase().includes(ql)) ||
             (b.category && b.category.toLowerCase().includes(ql)) ||
             (b.shortDescription && b.shortDescription.toLowerCase().includes(ql)) ||
             (Array.isArray(b.tags) && b.tags.some(t => t.toLowerCase().includes(ql)));
    });
  }

  // live update
  function update() {
    const q = searchBar ? searchBar.value : '';
    if (!q || q.trim() === '') {
      listContainer.innerHTML = ''; // show nothing when empty
      return;
    }
    const results = filterByQuery(q);
    renderResults(results);
  }

  // wire input
  if (searchBar) searchBar.addEventListener('input', update);

  // initial render of bookmarks only
  renderBookmarks();
});
