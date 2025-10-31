/**
 * Pledge Wall Module
 * Handles interactive visualization of pledges including map, ticker, and cards
 */

const PledgeWall = {
  
  // Track currently selected state for filtering
  selectedState: null,

  /**
   * Initialize pledge wall components
   */
  init() {
    this.renderTicker();
    this.renderMap();
    this.renderPledgeCards();
    this.renderBadges();
    
    // Refresh ticker every 10 seconds for dynamic feel
    setInterval(() => this.updateTicker(), 10000);
  },

  /**
   * Render scrolling ticker with recent pledges
   */
  renderTicker() {
    const tickerContainer = document.getElementById('pledgeTicker');
    if (!tickerContainer) return;

    const recentPledges = DataManager.getRecentPledges(10);
    
    if (recentPledges.length === 0) {
      tickerContainer.innerHTML = '<div class="ticker-item">Be the first to take the pledge!</div>';
      return;
    }

    // Duplicate content for seamless infinite scroll
    const tickerContent = this.generateTickerContent(recentPledges);
    tickerContainer.innerHTML = tickerContent + tickerContent;
  },

  /**
   * Generate ticker HTML content
   */
  generateTickerContent(pledges) {
    return pledges.map(pledge => {
      const hearts = '❤️'.repeat(pledge.hearts);
      return `<div class="ticker-item">${this.escapeHtml(pledge.name)} from ${pledge.state} just pledged ${hearts}</div>`;
    }).join('');
  },

  /**
   * Update ticker content dynamically
   */
  updateTicker() {
    const tickerContainer = document.getElementById('pledgeTicker');
    if (!tickerContainer) return;

    // Reset animation by removing and re-adding content
    const recentPledges = DataManager.getRecentPledges(10);
    const content = this.generateTickerContent(recentPledges);
    tickerContainer.innerHTML = content + content;
  },

  /**
   * Render interactive India map as state buttons
   */
  renderMap() {
    const mapContainer = document.getElementById('indiaMap');
    if (!mapContainer) return;

    const states = this.getIndianStates();
    const stateCounts = DataManager.getStateWiseCounts();

    mapContainer.innerHTML = states.map(state => {
      const count = stateCounts[state] || 0;
      return `
        <button class="state-button" 
                data-state="${state}" 
                onclick="PledgeWall.filterByState('${state}')"
                title="${count} pledges">
          ${state}
          ${count > 0 ? `<br><small>(${count})</small>` : ''}
        </button>
      `;
    }).join('');

    this.updateStateInfo();
  },

  /**
   * Get list of Indian states
   */
  getIndianStates() {
    return [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Other'
    ];
  },

  /**
   * Filter pledge cards by state
   */
  filterByState(state) {
    this.selectedState = this.selectedState === state ? null : state;
    
    // Update state button active state
    document.querySelectorAll('.state-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.state === this.selectedState);
    });

    this.updateStateInfo();
    this.renderPledgeCards();
  },

  /**
   * Update state information display
   */
  updateStateInfo() {
    const infoContainer = document.getElementById('stateInfo');
    if (!infoContainer) return;

    if (!this.selectedState) {
      const total = DataManager.getPledges().length;
      infoContainer.innerHTML = `<p>Showing all ${total} pledges from across India. Click a state to filter.</p>`;
    } else {
      const statePledges = DataManager.getPledgesByState(this.selectedState);
      infoContainer.innerHTML = `<p>Showing ${statePledges.length} pledges from <strong>${this.selectedState}</strong>. Click again to show all.</p>`;
    }
  },

  /**
   * Render pledge cards with flip effect
   */
  renderPledgeCards() {
    const gridContainer = document.getElementById('pledgesGrid');
    if (!gridContainer) return;

    const pledges = this.selectedState 
      ? DataManager.getPledgesByState(this.selectedState)
      : DataManager.getPledges();

    if (pledges.length === 0) {
      gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-secondary);">No pledges yet from this state. Be the first!</p>';
      return;
    }

    gridContainer.innerHTML = pledges.map(pledge => 
      this.createPledgeCard(pledge)
    ).join('');

    // Add click handlers for flip effect
    this.attachCardFlipHandlers();
  },

  /**
   * Create individual pledge card HTML
   */
  createPledgeCard(pledge) {
    const hearts = '❤️'.repeat(pledge.hearts);
    const date = new Date(pledge.createdAt).toLocaleDateString('en-IN');
    const profileLabel = this.getProfileLabel(pledge.profileType);

    return `
      <div class="pledge-card" data-pledge-id="${pledge.id}">
        <div class="card-inner">
          
          <div class="card-front">
            <div>
              <div class="pledge-id">${pledge.id}</div>
              <div class="pledge-name">${this.escapeHtml(pledge.name)}</div>
              <div class="pledge-meta">${date} • ${pledge.state}</div>
              <div class="pledge-meta">${profileLabel}</div>
            </div>
            <div class="pledge-hearts" title="${pledge.hearts} hearts">${hearts}</div>
          </div>

          <div class="card-back">
            <h4 style="margin-bottom: 8px; color: var(--color-accent); font-size: 16px;">Commitments</h4>
            <ul class="commitment-list">
              ${pledge.commitments.map(c => `<li>${this.getCommitmentLabel(c)}</li>`).join('')}
            </ul>
          </div>

        </div>
      </div>
    `;
  },

  /**
   * Get readable profile type label
   */
  getProfileLabel(profileType) {
    const labels = {
      'student': 'Student',
      'working': 'Working Professional',
      'other': 'Community Member'
    };
    return labels[profileType] || profileType;
  },

  /**
   * Get readable commitment label
   */
  getCommitmentLabel(commitmentCode) {
    const labels = {
      'eco-lights': 'Switch off lights & unplug devices',
      'eco-reusable': 'Use reusable items',
      'eco-transport': 'Prefer eco-friendly transport',
      'conscious-buy': 'Buy sustainable products',
      'conscious-reuse': 'Repair, reuse, donate',
      'conscious-influence': 'Influence others',
      'nature-tree': 'Plant/care for trees',
      'nature-water': 'Save water',
      'nature-green': 'Protect green spaces'
    };
    return labels[commitmentCode] || commitmentCode;
  },

  /**
   * Attach click handlers for card flip effect
   */
  attachCardFlipHandlers() {
    document.querySelectorAll('.pledge-card').forEach(card => {
      card.addEventListener('click', function() {
        this.classList.toggle('flipped');
      });
    });
  },

  /**
   * Render achievement badges
   */
  renderBadges() {
    const badgesContainer = document.getElementById('badgesContainer');
    if (!badgesContainer) return;

    const totalPledges = DataManager.getPledges().length;
    const badges = this.calculateBadges(totalPledges);

    badgesContainer.innerHTML = badges.map(badge => 
      this.createBadgeHTML(badge)
    ).join('');
  },

  /**
   * Calculate which badges should be unlocked
   */
  calculateBadges(totalPledges) {
    return [
      {
        title: 'Green Warrior',
        description: '3+ pledges taken',
        icon: '🌿',
        unlocked: totalPledges >= 3,
        progress: totalPledges
      },
      {
        title: 'Eco Ninja',
        description: '5+ pledges taken',
        icon: '🥷',
        unlocked: totalPledges >= 5,
        progress: totalPledges
      },
      {
        title: 'Climate Champion',
        description: '10+ pledges taken',
        icon: '🏆',
        unlocked: totalPledges >= 10,
        progress: totalPledges
      }
    ];
  },

  /**
   * Create badge HTML
   */
  createBadgeHTML(badge) {
    const lockedClass = badge.unlocked ? '' : 'locked';
    const status = badge.unlocked ? 'Unlocked!' : `${badge.progress} / ${badge.description.match(/\d+/)[0]}`;

    return `
      <div class="badge ${lockedClass}">
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-title">${badge.title}</div>
        <div class="badge-description">${badge.description}</div>
        <div style="margin-top: 8px; font-size: 12px;">${status}</div>
      </div>
    `;
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Refresh all components (called after new pledge)
   */
  refresh() {
    this.renderTicker();
    this.renderMap();
    this.renderPledgeCards();
    this.renderBadges();
  }
};
