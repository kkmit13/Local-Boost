// app.js — minimal & readable: live search + render + bookmarks (localStorage) + AI recommendations

// storage
const STORAGE_KEY = 'locallink_bookmarks_v1';
const VIEWED_KEY = 'locallink_viewed_v1';
const INTERACTIONS_KEY = 'locallink_interactions_v1';

function loadSavedIds() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveSavedIds(arr) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch {}
}

// Tracking functions for AI
function trackBusinessView(businessId) {
  try {
    const viewed = JSON.parse(localStorage.getItem(VIEWED_KEY) || '{}');
    viewed[businessId] = (viewed[businessId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
  } catch(e) { console.error('trackBusinessView error', e); }
}

function trackInteraction(businessId, type = 'view') {
  try {
    const interactions = JSON.parse(localStorage.getItem(INTERACTIONS_KEY) || '[]');
    interactions.push({
      businessId: businessId,
      type: type,
      timestamp: Date.now()
    });
    if (interactions.length > 100) interactions.shift();
    localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(interactions));
  } catch(e) { console.error('trackInteraction error', e); }
}

// AI Recommendation Engine
function generateAIRecommendations() {
  if (typeof LISTINGS === 'undefined') {
    return { recommendations: [], reason: 'no-data' };
  }

  const bookmarked = LISTINGS.filter(b => b.bookmarked);
  const viewed = JSON.parse(localStorage.getItem(VIEWED_KEY) || '{}');
  const interactions = JSON.parse(localStorage.getItem(INTERACTIONS_KEY) || '[]');

  // If no user data, show top-rated businesses
  if (bookmarked.length === 0 && Object.keys(viewed).length === 0) {
    const topRated = LISTINGS
      .filter(b => !b.bookmarked)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map(b => ({
        business: b,
        score: 95,
        reason: `Top-rated business with ${b.rating}⭐ rating`
      }));
    return { recommendations: topRated, reason: 'top-rated' };
  }

  // Build user preferences from bookmarked businesses
  const userPreferences = {
    categories: {},
    tags: {},
    priceRange: [],
    avgRating: 0
  };

  bookmarked.forEach(b => {
    if (b.category) {
      userPreferences.categories[b.category] = (userPreferences.categories[b.category] || 0) + 1;
    }
    if (b.tags) {
      b.tags.forEach(tag => {
        userPreferences.tags[tag] = (userPreferences.tags[tag] || 0) + 1;
      });
    }
    if (b.priceRange) {
      userPreferences.priceRange.push(b.priceRange);
    }
    userPreferences.avgRating += b.rating || 0;
  });

  if (bookmarked.length > 0) {
    userPreferences.avgRating /= bookmarked.length;
  }

  // Score each business based on user preferences
  const recommendations = LISTINGS
    .filter(b => !b.bookmarked)
    .map(business => {
      let score = 0;
      let reasons = [];

      // Category match
      if (business.category && userPreferences.categories[business.category]) {
        const categoryScore = Math.min(40, userPreferences.categories[business.category] * 20);
        score += categoryScore;
        reasons.push(`Similar category (${business.category})`);
      }

      // Tags match
      if (business.tags) {
        let tagMatches = 0;
        business.tags.forEach(tag => {
          if (userPreferences.tags[tag]) {
            tagMatches += userPreferences.tags[tag];
          }
        });
        if (tagMatches > 0) {
          const tagScore = Math.min(30, tagMatches * 10);
          score += tagScore;
          reasons.push(`Matches your interests`);
        }
      }

      // Price range match
      if (business.priceRange && userPreferences.priceRange.includes(business.priceRange)) {
        score += 10;
      }

      // Rating match
      if (business.rating >= userPreferences.avgRating) {
        score += Math.min(20, (business.rating - userPreferences.avgRating) * 10);
        if (business.rating >= 4.5) {
          reasons.push(`Highly rated (${business.rating}⭐)`);
        }
      }

      // Previously viewed
      if (viewed[business.id]) {
        score += Math.min(10, viewed[business.id] * 5);
        reasons.push(`You've shown interest before`);
      }

      // Has deals
      if (business.deal) {
        score += 5;
        reasons.push(`Has active deals`);
      }

      return {
        business: business,
        score: Math.min(100, Math.round(score)),
        reason: reasons.length > 0 ? reasons.join(', ') : 'Good match for you'
      };
    })
    .filter(rec => rec.score > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return { recommendations, reason: 'personalized' };
}

// Display AI Recommendations Modal
function displayAIRecommendations() {
  const modal = document.getElementById('ai-recommendations-modal');
  const container = document.getElementById('ai-recommendations-container');
  
  if (!modal || !container) return;

  const { recommendations, reason } = generateAIRecommendations();

  container.innerHTML = '';

  if (recommendations.length === 0) {
    container.innerHTML = `
      <div class="ai-no-data">
        <h3>🔍 No recommendations yet!</h3>
        <p>Start by bookmarking businesses you like, and our AI will suggest similar ones you might enjoy.</p>
        <p class="ai-suggestion">Visit the <a href="BusinessListing.html">Business Listings</a> page to explore!</p>
      </div>
    `;
  } else {
    recommendations.forEach(rec => {
      const card = document.createElement('div');
      card.className = 'ai-recommendation-card';
      
      card.innerHTML = `
        <div class="ai-match-score">${rec.score}% Match</div>
        <h3>${escapeHtml(rec.business.name)}</h3>
        <p><strong>${escapeHtml(rec.business.category)}</strong></p>
        <p>${escapeHtml(rec.business.shortDescription || '')}</p>
        <p>⭐ ${rec.business.rating} (${rec.business.reviewCount || 0} reviews)</p>
        <p>💰 ${"$".repeat(rec.business.priceRange || 1)}</p>
        ${rec.business.deal ? `<p style="color: var(--color-success); font-weight: 600;">🎉 Deal Available!</p>` : ''}
        <div class="ai-reason">
          <strong>Why?</strong> ${escapeHtml(rec.reason)}
        </div>
        <button class="review-btn" style="margin-top: 10px; width: 100%;" onclick="window.location.href='BusinessListing.html'">View Details</button>
      `;
      
      container.appendChild(card);
      
      card.addEventListener('click', () => {
        trackInteraction(rec.business.id, 'recommendation-view');
      });
    });
  }

  modal.style.display = 'block';
}

// Initialize AI features
function initAIRecommendations() {
  const aiBtn = document.getElementById('ai-explore-btn');
  const modal = document.getElementById('ai-recommendations-modal');
  const closeBtn = document.querySelector('.ai-close-btn');

  if (aiBtn) {
    aiBtn.addEventListener('click', (e) => {
      e.preventDefault();
      displayAIRecommendations();
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (modal) {
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  // Track business views
  if (typeof LISTINGS !== 'undefined') {
    const cards = document.querySelectorAll('.business-card');
    cards.forEach(card => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const checkbox = card.querySelector('.bookmark-checkbox');
            if (checkbox && checkbox.dataset.id) {
              trackBusinessView(checkbox.dataset.id);
            }
          }
        });
      }, { threshold: 0.5 });
      observer.observe(card);
    });
  }
}

// Utility function for escaping HTML
function escapeHtml(s) {
  if (!s && s !== 0) return '';
  return String(s).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
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
  
  // Initialize AI recommendations
  initAIRecommendations();
});