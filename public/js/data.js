/**
 * Data Management Module
 * Handles localStorage operations and data persistence
 */

const DataManager = {
  
  // Storage key for pledges in localStorage
  STORAGE_KEY: 'climatePledges',
  
  /**
   * Initialize data storage with sample pledges if empty
   */
  init() {
    if (!this.getPledges().length) {
      this.seedInitialData();
    }
  },

  /**
   * Generate unique pledge ID
   * Format: CPL-XXXXX (Climate Pledge - 5 digit number)
   */
  generateId() {
    const pledges = this.getPledges();
    const nextNumber = pledges.length + 1;
    return `CPL-${String(nextNumber).padStart(5, '0')}`;
  },

  /**
   * Get all pledges from localStorage
   * Returns array of pledge objects
   */
  getPledges() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading pledges from storage:', error);
      return [];
    }
  },

  /**
   * Save pledge to localStorage
   * Accepts pledge object and adds metadata
   */
  savePledge(pledgeData) {
    try {
      const pledges = this.getPledges();
      
      const pledge = {
        id: this.generateId(),
        name: pledgeData.name,
        email: pledgeData.email,
        mobile: pledgeData.mobile,
        state: pledgeData.state || 'Other',
        profileType: pledgeData.profileType,
        commitments: pledgeData.commitments,
        hearts: this.calculateHearts(pledgeData.commitments.length),
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
      };

      pledges.unshift(pledge);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pledges));
      
      return pledge;
    } catch (error) {
      console.error('Error saving pledge:', error);
      return null;
    }
  },

  /**
   * Calculate heart rating based on number of commitments
   * 1-3 commitments = 1 heart
   * 4-6 commitments = 2 hearts
   * 7-9 commitments = 3 hearts
   */
  calculateHearts(commitmentCount) {
    if (commitmentCount <= 3) return 1;
    if (commitmentCount <= 6) return 2;
    return 3;
  },

  /**
   * Get pledges filtered by state
   */
  getPledgesByState(state) {
    return this.getPledges().filter(pledge => pledge.state === state);
  },

  /**
   * Get pledges filtered by profile type
   */
  getPledgesByProfile(profileType) {
    return this.getPledges().filter(pledge => pledge.profileType === profileType);
  },

  /**
   * Get KPI statistics
   */
  getKPIs() {
    const pledges = this.getPledges();
    return {
      total: pledges.length,
      students: this.getPledgesByProfile('student').length,
      professionals: this.getPledgesByProfile('working').length,
      others: this.getPledgesByProfile('other').length
    };
  },

  /**
   * Get recent pledges for ticker
   */
  getRecentPledges(count = 10) {
    return this.getPledges().slice(0, count);
  },

  /**
   * Get state-wise pledge count
   */
  getStateWiseCounts() {
    const pledges = this.getPledges();
    const stateCounts = {};
    
    pledges.forEach(pledge => {
      const state = pledge.state || 'Other';
      stateCounts[state] = (stateCounts[state] || 0) + 1;
    });
    
    return stateCounts;
  },

  /**
   * Seed initial sample data for demonstration
   */
  seedInitialData() {
    const samplePledges = [
      {
        name: 'Aarav Kumar',
        email: 'aarav@example.com',
        mobile: '9876543210',
        state: 'Tamil Nadu',
        profileType: 'student',
        commitments: ['eco-lights', 'eco-reusable', 'eco-transport', 'nature-tree']
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        mobile: '9876543211',
        state: 'Maharashtra',
        profileType: 'working',
        commitments: ['eco-lights', 'conscious-buy', 'conscious-reuse', 'nature-water', 'nature-green']
      },
      {
        name: 'Rohan Patel',
        email: 'rohan@example.com',
        mobile: '9876543212',
        state: 'Gujarat',
        profileType: 'student',
        commitments: ['eco-reusable', 'eco-transport', 'nature-tree']
      },
      {
        name: 'Ananya Reddy',
        email: 'ananya@example.com',
        mobile: '9876543213',
        state: 'Telangana',
        profileType: 'working',
        commitments: ['eco-lights', 'eco-reusable', 'conscious-buy', 'conscious-reuse', 'conscious-influence', 'nature-tree', 'nature-water']
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        mobile: '9876543214',
        state: 'Punjab',
        profileType: 'other',
        commitments: ['eco-transport', 'conscious-influence', 'nature-green']
      }
    ];

    samplePledges.forEach(pledgeData => {
      this.savePledge(pledgeData);
    });
  },

  /**
   * Clear all data from storage
   * Used for testing or reset functionality
   */
  clearAllData() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};

// Initialize data manager on load
DataManager.init();
