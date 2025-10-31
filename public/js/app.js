/**
 * Main Application Module
 * Coordinates all components and handles user interactions
 */

const App = {

  /**
   * Initialize application on page load
   */
  init() {
    console.log('Climate Pledge App initializing...');
    
    this.setupEventListeners();
    this.updateKPIs();
    PledgeWall.init();
    
    console.log('Application ready');
  },

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    const form = document.getElementById('pledgeForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Close modal when clicking outside
    const modal = document.getElementById('certificateModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeCertificate();
        }
      });
    }

    // Handle escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCertificate();
      }
    });
  },

  /**
   * Handle pledge form submission
   */
  handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = this.getFormData();
    
    // Validate form data
    if (!this.validateForm(formData)) {
      return;
    }

    // Save pledge to storage
    const pledge = DataManager.savePledge(formData);
    
    if (pledge) {
      // Update UI components
      this.updateKPIs();
      PledgeWall.refresh();
      
      // Show certificate
      CertificateGenerator.generate(pledge);
      
      // Reset form
      document.getElementById('pledgeForm').reset();
      
      // Show success feedback
      this.showSuccessMessage();
    } else {
      alert('Error saving pledge. Please try again.');
    }
  },

  /**
   * Extract data from form
   */
  getFormData() {
    const form = document.getElementById('pledgeForm');
    const formData = new FormData(form);
    
    // Get all selected commitments
    const commitments = [];
    form.querySelectorAll('input[name="commitments"]:checked').forEach(checkbox => {
      commitments.push(checkbox.value);
    });

    return {
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      mobile: formData.get('mobile').trim(),
      state: formData.get('state'),
      profileType: formData.get('profileType'),
      commitments: commitments
    };
  },

  /**
   * Validate form data
   */
  validateForm(formData) {
    // Check required fields
    if (!formData.name) {
      alert('Please enter your name');
      return false;
    }

    if (!formData.email) {
      alert('Please enter your email address');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    if (!formData.mobile) {
      alert('Please enter your mobile number');
      return false;
    }

    // Validate mobile number (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      alert('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (!formData.profileType) {
      alert('Please select your profile type');
      return false;
    }

    // Check if at least one commitment is selected
    if (formData.commitments.length === 0) {
      alert('Please select at least one commitment to make your pledge meaningful');
      return false;
    }

    return true;
  },

  /**
   * Update KPI display
   */
  updateKPIs() {
    const kpis = DataManager.getKPIs();
    
    const elements = {
      achieved: document.getElementById('kpi-achieved'),
      students: document.getElementById('kpi-students'),
      professionals: document.getElementById('kpi-professionals')
    };

    // Animate numbers
    if (elements.achieved) {
      this.animateNumber(elements.achieved, kpis.total);
    }
    if (elements.students) {
      this.animateNumber(elements.students, kpis.students);
    }
    if (elements.professionals) {
      this.animateNumber(elements.professionals, kpis.professionals);
    }
  },

  /**
   * Animate number counting up
   */
  animateNumber(element, targetValue) {
    const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const duration = 1000;
    const steps = 30;
    const stepValue = (targetValue - currentValue) / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newValue = Math.round(currentValue + (stepValue * currentStep));
      element.textContent = this.formatNumber(Math.min(newValue, targetValue));

      if (currentStep >= steps) {
        clearInterval(interval);
        element.textContent = this.formatNumber(targetValue);
      }
    }, stepDuration);
  },

  /**
   * Format number with commas
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * Show success message briefly
   */
  showSuccessMessage() {
    // Create temporary success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: var(--color-success);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 2000;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = 'Pledge submitted successfully!';
    
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
};

/**
 * Global function for smooth scroll to pledge form
 * Called from CTA button
 */
function scrollToPledgeForm() {
  const pledgeSection = document.getElementById('pledge');
  if (pledgeSection) {
    pledgeSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * Initialize app when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

/**
 * Additional CSS animations for notifications
 */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
