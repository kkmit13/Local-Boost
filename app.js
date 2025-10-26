// app.js — bookmark persistence + wiring
// Requires: If you want names/details on every page, include SampleData.js BEFORE this file.


const STORAGE_KEY = 'locallink_bookmarks_v1';


// --- LocalStorage helpers ---
function loadSavedIds(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch(e){ console.error('loadSavedIds error', e); return []; }
}
function saveSavedIds(arr){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
  catch(e){ console.error('saveSavedIds error', e); }
}


// --- Render bookmarks UI on the current page ---
function renderBookmarks() {
  const out = document.getElementById('bookmarked-businesses');
  if (!out) return;


  out.innerHTML = '';


  // Prefer using LISTINGS (if available) so we show names/details
  if (typeof LISTINGS !== 'undefined') {
    const saved = LISTINGS.filter(b => b.bookmarked);
    if (saved.length === 0) {
      out.innerHTML = '<p>No bookmarks yet. Click "Save" on a listing to add it.</p>';
      return;
    }
    saved.forEach(b => {
      const d = document.createElement('div');
      d.className = 'business-card small';
      d.innerHTML = `<h3>${escapeHtml(b.name)}</h3><p>${escapeHtml(b.shortDescription || b.category || '')}</p>`;
      out.appendChild(d);
    });
    return;
  }


  // If LISTINGS not defined, try to show minimal info using saved IDs
  const savedIds = loadSavedIds();
  if (savedIds.length === 0) {
    out.innerHTML = '<p>No bookmarks yet.</p>';
    return;
  }
  savedIds.forEach(id => {
    const d = document.createElement('div');
    d.className = 'business-card small';
    d.textContent = id; // fallback: show the id only
    out.appendChild(d);
  });
}


// --- Utility: HTML escape ---
function escapeHtml(s){ if(!s && s !== 0) return ''; return String(s).replace(/[&<>"']/g, m=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }


// --- Sync saved IDs into LISTINGS.bookmarked flags ---
function restoreSavedToListings(){
  if (typeof LISTINGS === 'undefined') return;
  const saved = loadSavedIds();
  LISTINGS.forEach(l => l.bookmarked = saved.includes(l.id));
}


// --- Make checkboxes reflect LISTINGS.bookmarked (if we have LISTINGS) or saved ids ---
function syncCheckboxesFromSaved() {
  const boxes = document.querySelectorAll('.bookmark-checkbox');
  const saved = loadSavedIds();
  boxes.forEach(cb => {
    const id = cb.dataset.id;
    if (!id) return;
    // prefer LISTINGS flag if present
    if (typeof LISTINGS !== 'undefined') {
      const item = LISTINGS.find(x => String(x.id) === String(id));
      if (item) cb.checked = !!item.bookmarked;
      else cb.checked = saved.includes(id);
    } else {
      cb.checked = saved.includes(id);
    }
  });
}


// --- Attach change listeners to checkboxes (id comes from data-id) ---
function attachCheckboxListeners() {
  const boxes = document.querySelectorAll('.bookmark-checkbox');
  boxes.forEach(cb => {
    if (cb.dataset.bound === 'true') return; // avoid double-binding
    cb.dataset.bound = 'true';
    cb.addEventListener('change', () => {
      const id = cb.dataset.id;
      if (!id) return;
      // update LISTINGS if available
      if (typeof LISTINGS !== 'undefined') {
        const item = LISTINGS.find(x => String(x.id) === String(id));
        if (item) item.bookmarked = cb.checked;
      }
      // compute saved ids to persist
      let savedIds;
      if (typeof LISTINGS !== 'undefined') {
        savedIds = LISTINGS.filter(x => x.bookmarked).map(x => x.id);
      } else {
        savedIds = Array.from(document.querySelectorAll('.bookmark-checkbox:checked')).map(n => n.dataset.id);
      }
      saveSavedIds(savedIds);
      // console log for debugging/demonstration
      const name = (typeof LISTINGS !== 'undefined') ? (LISTINGS.find(x => String(x.id) === String(id)) || {}).name : id;
      if (cb.checked) console.log(`Bookmarked: ${name || id}`);
      else console.log(`Removed bookmark: ${name || id}`);
      // update bookmarks area on this page
      renderBookmarks();
    });
  });
}


// --- Initialization wiring ---
document.addEventListener('DOMContentLoaded', () => {
  // If we have LISTINGS loaded (SampleData.js), restore flags into it
  if (typeof LISTINGS !== 'undefined') {
    restoreSavedToListings();
  }
  // Make checkboxes reflect persisted state
  syncCheckboxesFromSaved();
  // Attach listeners (works for boxes created inline or rendered by JS)
  attachCheckboxListeners();
  // Render bookmark area (if present)
  renderBookmarks();
});


