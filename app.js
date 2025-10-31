const STORAGE_KEY = 'locallink_bookmarks_v1';

function loadSavedIds(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch(e){ console.error('loadSavedIds error', e); return []; }
}
function saveSavedIds(arr){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
  catch(e){ console.error('saveSavedIds error', e); }
}

function renderBookmarks() {
  const out = document.getElementById('bookmarked-businesses');
  if (!out) return;

  out.innerHTML = '';

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

  const savedIds = loadSavedIds();
  if (savedIds.length === 0) {
    out.innerHTML = '<p>No bookmarks yet.</p>';
    return;
  }
  savedIds.forEach(id => {
    const d = document.createElement('div');
    d.className = 'business-card small';
    d.textContent = id;
    out.appendChild(d);
  });
}

function escapeHtml(s){ if(!s && s !== 0) return ''; return String(s).replace(/[&<>"']/g, m=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function restoreSavedToListings(){
  if (typeof LISTINGS === 'undefined') return;
  const saved = loadSavedIds();
  LISTINGS.forEach(l => l.bookmarked = saved.includes(l.id));
}

function syncCheckboxesFromSaved() {
  const boxes = document.querySelectorAll('.bookmark-checkbox');
  const saved = loadSavedIds();
  boxes.forEach(cb => {
    const id = cb.dataset.id;
    if (!id) return;
    if (typeof LISTINGS !== 'undefined') {
      const item = LISTINGS.find(x => String(x.id) === String(id));
      if (item) cb.checked = !!item.bookmarked;
      else cb.checked = saved.includes(id);
    } else {
      cb.checked = saved.includes(id);
    }
  });
}

function attachCheckboxListeners() {
  const boxes = document.querySelectorAll('.bookmark-checkbox');
  boxes.forEach(cb => {
    if (cb.dataset.bound === 'true') return;
    cb.dataset.bound = 'true';
    cb.addEventListener('change', () => {
      const id = cb.dataset.id;
      if (!id) return;
      if (typeof LISTINGS !== 'undefined') {
        const item = LISTINGS.find(x => String(x.id) === String(id));
        if (item) item.bookmarked = cb.checked;
      }
      let savedIds;
      if (typeof LISTINGS !== 'undefined') {
        savedIds = LISTINGS.filter(x => x.bookmarked).map(x => x.id);
      } else {
        savedIds = Array.from(document.querySelectorAll('.bookmark-checkbox:checked')).map(n => n.dataset.id);
      }
      saveSavedIds(savedIds);
      const name = (typeof LISTINGS !== 'undefined') ? (LISTINGS.find(x => String(x.id) === String(id)) || {}).name : id;
      if (cb.checked) console.log(`Bookmarked: ${name || id}`);
      else console.log(`Removed bookmark: ${name || id}`);
      renderBookmarks();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof LISTINGS !== 'undefined') {
    restoreSavedToListings();
  }
  syncCheckboxesFromSaved();
  attachCheckboxListeners();
  renderBookmarks();
  initAIRecommendations();
});

const VIEWED_KEY = 'locallink_viewed_v1';
const INTERACTIONS_KEY = 'locallink_interactions_v1';

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

function generateAIRecommendations() {
  if (typeof LISTINGS === 'undefined') {
    return { recommendations: [], reason: 'no-data' };
  }

  const bookmarked = LISTINGS.filter(b => b.bookmarked);
  const viewed = JSON.parse(localStorage.getItem(VIEWED_KEY) || '{}');
  const interactions = JSON.parse(localStorage.getItem(INTERACTIONS_KEY) || '[]');

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

  const recommendations = LISTINGS
    .filter(b => !b.bookmarked)
    .map(business => {
      let score = 0;
      let reasons = [];

      if (business.category && userPreferences.categories[business.category]) {
        const categoryScore = Math.min(40, userPreferences.categories[business.category] * 20);
        score += categoryScore;
        reasons.push(`Similar category (${business.category})`);
      }

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

      if (business.priceRange && userPreferences.priceRange.includes(business.priceRange)) {
        score += 10;
      }

      if (business.rating >= userPreferences.avgRating) {
        score += Math.min(20, (business.rating - userPreferences.avgRating) * 10);
        if (business.rating >= 4.5) {
          reasons.push(`Highly rated (${business.rating}⭐)`);
        }
      }

      if (viewed[business.id]) {
        score += Math.min(10, viewed[business.id] * 5);
        reasons.push(`You've shown interest before`);
      }

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

  if (typeof LISTINGS !== 'undefined') {
    LISTINGS.forEach(business => {
      const cards = document.querySelectorAll(`.business-card`);
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
    });
  }
}
