// app.js
// LocalLink — minimal readable app script:
// - storage for bookmarks (localStorage)
// - simple live search + render results
// - bookmarks UI (persists)
// - review-only AI recommendations (modal)

const STORAGE_KEY = 'locallink_bookmarks_v1';
const VIEWED_KEY = 'locallink_viewed_v1';
const INTERACTIONS_KEY = 'locallink_interactions_v1';

/* ---------------------------
   Storage helpers
   --------------------------- */
function loadSavedIds() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveSavedIds(arr) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch {}
}

function trackBusinessView(businessId) {
  try {
    const viewed = JSON.parse(localStorage.getItem(VIEWED_KEY) || '{}');
    viewed[businessId] = (viewed[businessId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
  } catch(e) { /* ignore */ }
}

function trackInteraction(businessId, type = 'view') {
  try {
    const interactions = JSON.parse(localStorage.getItem(INTERACTIONS_KEY) || '[]');
    interactions.push({
      businessId: businessId,
      type: type,
      timestamp: Date.now()
    });
    if (interactions.length > 200) interactions.shift();
    localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(interactions));
  } catch(e) { /* ignore */ }
}

/* ---------------------------
   Review-based AI recommender
   (replaces previous personalized engine)
   --------------------------- */
function generateAIRecommendations() {
  if (typeof LISTINGS === 'undefined') {
    return { recommendations: [], reason: 'no-data' };
  }

  // only businesses with reviews are considered
  const withReviews = LISTINGS.filter(b => Array.isArray(b.reviews) && b.reviews.length > 0);

  // fallback: no reviews at all -> top-rated by rating field
  if (withReviews.length === 0) {
    const topRated = LISTINGS
      .slice()
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6)
      .map(b => ({
        business: b,
        score: Math.round(((b.rating || 0) / 5) * 100),
        reason: `Top-rated (${b.rating || '—'}★)`
      }));
    return { recommendations: topRated, reason: 'fallback-top-rated' };
  }

  const recomputed = withReviews.map(b => {
    const total = b.reviews.length;
    const sum = b.reviews.reduce((s, r) => s + (r.rating || 0), 0);
    const avg = total ? sum / total : 0;
    const positive = b.reviews.filter(r => (r.rating || 0) >= 4).length;

    // most recent review date (if available)
    let mostRecentDate = null;
    for (const r of b.reviews) {
      if (r.date) {
        const d = new Date(r.date);
        if (!isNaN(d)) {
          if (!mostRecentDate || d > mostRecentDate) mostRecentDate = d;
        }
      }
    }
    let recencyBonus = 0;
    if (mostRecentDate) {
      const days = Math.floor((Date.now() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (days <= 30) recencyBonus = 10;
      else if (days <= 90) recencyBonus = 6;
      else if (days <= 365) recencyBonus = 3;
    }

    const avgScore = (avg / 5) * 60;                     // 0..60
    const posShareScore = (positive / total) * 25;       // 0..25
    const countBoost = Math.min(5, Math.log10(total + 1) * 5); // up to ~5
    const rawScore = avgScore + posShareScore + countBoost + recencyBonus;
    const score = Math.min(100, Math.round(rawScore));

    const exampleReview = b.reviews.find(r => (r.rating || 0) >= 4) || b.reviews[0];
    const snippet = exampleReview && exampleReview.text ? String(exampleReview.text).slice(0, 160) : '';

    const reasonParts = [];
    reasonParts.push(`Avg ${avg.toFixed(1)}★ (${total} reviews)`);
    if (positive > 0) reasonParts.push(`${positive}/${total} positive`);
    if (recencyBonus > 0) reasonParts.push('Recent review');
    const reason = reasonParts.join(' · ');

    return {
      business: b,
      score,
      reason,
      snippet,
      mostRecent: mostRecentDate ? mostRecentDate.toISOString().slice(0, 10) : null
    };
  });

  recomputed.sort((a, b) => b.score - a.score);
  return { recommendations: recomputed.slice(0, 6), reason: 'review-based' };
}

function displayAIRecommendations() {
  const modal = document.getElementById('ai-recommendations-modal');
  const container = document.getElementById('ai-recommendations-container');

  if (!modal || !container) return;

  const { recommendations } = generateAIRecommendations();
  container.innerHTML = '';

  if (!recommendations || recommendations.length === 0) {
    container.innerHTML = `
      <div class="ai-no-data">
        <h3>🔍 No recommendations yet</h3>
        <p>We use customer reviews to recommend places. Add some reviews or explore the Business Listings to help the system.</p>
        <p class="ai-suggestion">Visit the <a href="BusinessListing.html">Business Listings</a> to explore and leave reviews.</p>
      </div>
    `;
  } else {
    recommendations.forEach(rec => {
      const card = document.createElement('div');
      card.className = 'ai-recommendation-card';

      card.innerHTML = `
        <div class="ai-match-score">${rec.score}% Match</div>
        <h3>${escapeHtml(rec.business.name)}</h3>
        <p><strong>${escapeHtml(rec.business.category || '')}</strong> ${rec.mostRecent ? `<small>· recent: ${rec.mostRecent}</small>` : ''}</p>
        <p>${escapeHtml(rec.business.shortDescription || '')}</p>
        <p>⭐ ${rec.business.rating || '—'} (${rec.business.reviewCount || rec.business.reviews.length || 0} reviews)</p>
        <p>💰 ${"$".repeat(rec.business.priceRange || 1)}</p>
        ${rec.business.deal ? `<p style="color: var(--color-success); font-weight: 600;">🎉 Deal Available!</p>` : ''}
        ${rec.snippet ? `<blockquote class="ai-review-snippet">“${escapeHtml(rec.snippet)}”</blockquote>` : ''}
        <div class="ai-reason"><strong>Why?</strong> ${escapeHtml(rec.reason)}</div>
        <button class="review-btn ai-view-btn" style="margin-top: 10px; width: 100%;">View Details</button>
      `;

      // View Details should go to BusinessListing focused (add focus param)
      const viewBtn = card.querySelector('.ai-view-btn');
      viewBtn.addEventListener('click', () => {
        window.location.href = `BusinessListing.html?focus=${encodeURIComponent(rec.business.id)}`;
      });

      container.appendChild(card);

      // track that user saw the recommendation
      card.addEventListener('click', () => {
        try { trackInteraction(rec.business.id, 'recommendation-view'); } catch (e) {}
      });
    });
  }

  modal.style.display = 'block';
}

/* ---------------------------
   Small utility
   --------------------------- */
function escapeHtml(s) {
  if (!s && s !== 0) return '';
  return String(s).replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
}

/* ---------------------------
   Rendering + Search + Bookmarks
   --------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('search-bar');
  const listContainer = document.getElementById('business-list');
  const bookmarksContainer = document.getElementById('bookmarked-businesses');
  const aiBtn = document.getElementById('ai-explore-btn');
  const aiModal = document.getElementById('ai-recommendations-modal');
  const aiClose = aiModal ? aiModal.querySelector('.ai-close-btn') : null;

  if (typeof LISTINGS === 'undefined') {
    if (listContainer) listContainer.textContent = 'Listings data not available.';
    return;
  }

  // restore bookmarked flags from storage
  const saved = loadSavedIds();
  LISTINGS.forEach(item => item.bookmarked = saved.includes(item.id));

  // render bookmarks
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

  // render results
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

      // track view when card is in view (one-time)
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            trackBusinessView(b.id);
            observer.disconnect();
          }
        });
      }, { threshold: 0.6 });
      observer.observe(card);

      // checkbox listener
      cb.addEventListener('change', () => {
        b.bookmarked = cb.checked;
        const ids = LISTINGS.filter(x => x.bookmarked).map(x => x.id);
        saveSavedIds(ids);
        renderBookmarks();
      });
    });
  }

  // simple substring search across name/category/description/tags
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

  // live update (debounced)
  function debounce(fn, wait=200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  const doUpdate = debounce(() => {
    const q = searchBar ? searchBar.value : '';
    if (!q || q.trim() === '') {
      listContainer.innerHTML = ''; // show nothing when empty (as before)
      return;
    }
    const results = filterByQuery(q);
    renderResults(results);
  }, 160);

  if (searchBar) searchBar.addEventListener('input', doUpdate);

  // initialize AI button / modal wiring
  if (aiBtn) {
    aiBtn.addEventListener('click', (e) => {
      e.preventDefault();
      displayAIRecommendations();
    });
  }
  if (aiClose && aiModal) {
    aiClose.addEventListener('click', () => { aiModal.style.display = 'none'; });
  }
  if (aiModal) {
    window.addEventListener('click', (e) => {
      if (e.target === aiModal) aiModal.style.display = 'none';
    });
  }

  // initial bookmarks render
  renderBookmarks();

  // if page loaded with ?focus=id, scroll & highlight that card after a short delay
  (function handleFocusParam() {
    const params = new URLSearchParams(window.location.search);
    const focus = params.get('focus');
    if (!focus) return;
    // navigate to listings page if not on it
    // but if we're on this page and business cards render, try to scroll to it
    // We'll attempt to render all listings and then find the card by dataset id
    renderResults(LISTINGS);
    setTimeout(() => {
      const allCards = Array.from(document.querySelectorAll('.business-card'));
      for (const card of allCards) {
        const cb = card.querySelector('.bookmark-checkbox');
        if (cb && cb.dataset.id === focus) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.transition = 'background-color 0.6s ease';
          const original = card.style.backgroundColor;
          card.style.backgroundColor = '#fff8c6';
          setTimeout(() => { card.style.backgroundColor = original || ''; }, 1200);
          break;
        }
      }
    }, 250);
  })();

});
