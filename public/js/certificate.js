/**
 * Certificate Generation Module
 * Handles creation, display, and download of pledge certificates
 */

const CertificateGenerator = {
  
  /**
   * Generate and display certificate for a pledge
   * Shows modal with personalized certificate content
   */
  generate(pledge) {
    const container = document.getElementById('certificateContainer');
    const modal = document.getElementById('certificateModal');
    
    if (!container || !modal) {
      console.error('Certificate container or modal not found');
      return;
    }

    const heartIcons = this.getHeartIcons(pledge.hearts);
    const date = this.formatDate(pledge.createdAt);
    
    container.innerHTML = `
      <div class="certificate-content">
        <h2 class="certificate-title">Certificate of Climate Action</h2>
        <div class="certificate-name">${this.escapeHtml(pledge.name)}</div>
        <div class="certificate-statement">Cool Enough to Care!</div>
        <div class="certificate-hearts" title="${pledge.hearts} out of 3 hearts">${heartIcons}</div>
        <p style="color: var(--color-text-secondary); margin: 16px 0;">
          Thank you for pledging to make a difference. Your ${pledge.commitments.length} commitment${pledge.commitments.length !== 1 ? 's' : ''} 
          will help create a sustainable future for all.
        </p>
        <div class="certificate-date">Pledge ID: ${pledge.id} | Date: ${date}</div>
      </div>
    `;
    
    modal.classList.add('active');
    
    // Store current pledge for download functionality
    this.currentPledge = pledge;
  },

  /**
   * Generate heart icons based on rating
   * Returns string of heart symbols
   */
  getHeartIcons(hearts) {
    const filledHeart = '❤️';
    const emptyHeart = '🤍';
    let icons = '';
    
    for (let i = 0; i < 3; i++) {
      icons += i < hearts ? filledHeart : emptyHeart;
    }
    
    return icons;
  },

  /**
   * Format ISO date to readable format
   */
  formatDate(isoString) {
    const date = new Date(isoString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-IN', options);
  },

  /**
   * Escape HTML to prevent XSS attacks
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Download certificate as text file
   * Future enhancement: Generate as PNG/PDF using canvas or library
   */
  download() {
    if (!this.currentPledge) {
      alert('No certificate to download');
      return;
    }

    const pledge = this.currentPledge;
    const content = this.generateTextContent(pledge);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `climate-pledge-${pledge.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Generate text content for certificate download
   */
  generateTextContent(pledge) {
    const hearts = '♥'.repeat(pledge.hearts) + '♡'.repeat(3 - pledge.hearts);
    const date = this.formatDate(pledge.createdAt);
    
    return `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          CLIMATE ACTION PLEDGE CERTIFICATE                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

This certifies that

${pledge.name}

Has pledged to take climate action and make sustainable choices
for the benefit of our planet and future generations.

Cool Enough to Care!

Planet Love Rating: ${hearts}

Commitments Made: ${pledge.commitments.length}

Pledge ID: ${pledge.id}
Date: ${date}

Together, we can make a difference.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Climate Action Pledge Initiative
Every action counts. Every choice matters.
    `;
  },

  /**
   * Share certificate using Web Share API
   * Falls back to alert if not supported
   */
  share() {
    if (!this.currentPledge) {
      alert('No certificate to share');
      return;
    }

    const pledge = this.currentPledge;
    const text = `I just took the Climate Action Pledge! Join me in making sustainable choices for our planet. 🌍\n\nPledge ID: ${pledge.id}\nCommitments: ${pledge.commitments.length}\nPlanet Love: ${'❤️'.repeat(pledge.hearts)}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Climate Action Pledge Certificate',
        text: text,
        url: window.location.href
      }).catch(error => {
        console.log('Error sharing:', error);
      });
    } else {
      // Fallback for browsers without Web Share API
      this.copyToClipboard(text);
      alert('Certificate details copied to clipboard! Share it with your friends.');
    }
  },

  /**
   * Copy text to clipboard
   */
  copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  },

  /**
   * Close certificate modal
   */
  close() {
    const modal = document.getElementById('certificateModal');
    if (modal) {
      modal.classList.remove('active');
    }
    this.currentPledge = null;
  }
};

/**
 * Global functions for HTML onclick handlers
 */
function downloadCertificate() {
  CertificateGenerator.download();
}

function shareCertificate() {
  CertificateGenerator.share();
}

function closeCertificate() {
  CertificateGenerator.close();
  
  // Scroll to pledge wall after closing certificate
  const pledgeWall = document.getElementById('pledge-wall');
  if (pledgeWall) {
    pledgeWall.scrollIntoView({ behavior: 'smooth' });
  }
}
