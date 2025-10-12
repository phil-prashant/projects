// Application data
const packagesData = {
  essential: {
    name: "Essential",
    price: 2999,
    metrics: {
      impressions: "25,000-50,000",
      communityReach: "5,000-8,000 developers",
      engagement: "500-1,000 interactions",
      platforms: "8-10 developer platforms"
    }
  },
  growth: {
    name: "Growth", 
    price: 4999,
    metrics: {
      impressions: "75,000-125,000",
      communityReach: "15,000-25,000 developers", 
      engagement: "2,000-3,500 interactions",
      platforms: "15-20 developer platforms"
    }
  },
  enterprise: {
    name: "Enterprise",
    price: 8999,
    metrics: {
      impressions: "150,000-300,000",
      communityReach: "40,000-75,000 developers",
      engagement: "5,000-10,000 interactions", 
      platforms: "25+ developer platforms"
    }
  }
};

// Application state
let selectedPackage = null;
let selectedAddons = new Set();
let totalInvestment = 0;

// DOM elements
const packageCheckboxes = document.querySelectorAll('.package-checkbox');
const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
const packageCards = document.querySelectorAll('.package-card');
const addonItems = document.querySelectorAll('.addon-item');

// Metric elements
const totalInvestmentEl = document.getElementById('total-investment');
const expectedImpressionsEl = document.getElementById('expected-impressions');
const communityReachEl = document.getElementById('community-reach');
const platformCoverageEl = document.getElementById('platform-coverage');

// CTA elements
const ctaTotalEl = document.getElementById('cta-total');
const ctaReachEl = document.getElementById('cta-reach');

// Initialize the application
function init() {
  setupPackageListeners();
  setupAddonListeners();
  updateMetrics();
  setupCTATracking();
}

// Setup package selection listeners
function setupPackageListeners() {
  packageCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handlePackageSelection);
  });
}

// Setup addon listeners
function setupAddonListeners() {
  addonCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handleAddonSelection);
  });
}

// Handle package selection (exclusive)
function handlePackageSelection(event) {
  const clickedCheckbox = event.target;
  const packageName = clickedCheckbox.id;
  
  // Uncheck all other packages
  packageCheckboxes.forEach(checkbox => {
    if (checkbox !== clickedCheckbox) {
      checkbox.checked = false;
      const card = checkbox.closest('.package-card');
      card.classList.remove('selected');
    }
  });
  
  // Update selected package
  if (clickedCheckbox.checked) {
    selectedPackage = packageName;
    const card = clickedCheckbox.closest('.package-card');
    card.classList.add('selected');
    enhancedPackageSelection(packageName);
  } else {
    selectedPackage = null;
    const card = clickedCheckbox.closest('.package-card');
    card.classList.remove('selected');
  }
  
  updateMetrics();
  updateTotalInvestment();
  validateSelection();
}

// Handle addon selection (multiple allowed)
function handleAddonSelection(event) {
  const checkbox = event.target;
  const addonId = checkbox.id;
  const addonItem = checkbox.closest('.addon-item');
  
  if (checkbox.checked) {
    selectedAddons.add(addonId);
    addonItem.classList.add('selected');
    enhancedAddonSelection(addonId, true);
  } else {
    selectedAddons.delete(addonId);
    addonItem.classList.remove('selected');
    enhancedAddonSelection(addonId, false);
  }
  
  updateTotalInvestment();
}

// Calculate total investment
function calculateTotalInvestment() {
  let total = 0;
  
  // Add package cost
  if (selectedPackage && packagesData[selectedPackage]) {
    total += packagesData[selectedPackage].price;
  }
  
  // Add addon costs
  selectedAddons.forEach(addonId => {
    const addonCheckbox = document.getElementById(addonId);
    if (addonCheckbox) {
      const price = parseInt(addonCheckbox.dataset.price);
      const type = addonCheckbox.dataset.type;
      
      if (type === 'quarterly') {
        // For quarterly items, show the monthly equivalent
        total += Math.round(price / 3);
      } else {
        total += price;
      }
    }
  });
  
  return total;
}

// Update total investment display
function updateTotalInvestment() {
  totalInvestment = calculateTotalInvestment();
  
  // Format the number with commas
  const formattedTotal = totalInvestment.toLocaleString('en-US');
  
  // Update header
  totalInvestmentEl.textContent = totalInvestment > 0 ? `$${formattedTotal}` : '$0';
  
  // Update CTA
  ctaTotalEl.textContent = totalInvestment > 0 ? `$${formattedTotal}` : '$0';
  
  // Add animation effect
  animateValueChange(totalInvestmentEl);
  animateValueChange(ctaTotalEl);
}

// Update metrics based on selected package
function updateMetrics() {
  if (selectedPackage && packagesData[selectedPackage]) {
    const metrics = packagesData[selectedPackage].metrics;
    
    expectedImpressionsEl.textContent = metrics.impressions;
    communityReachEl.textContent = metrics.communityReach;
    platformCoverageEl.textContent = metrics.platforms;
    
    // Update CTA reach
    ctaReachEl.textContent = metrics.communityReach;
    
    // Animate changes
    animateValueChange(expectedImpressionsEl);
    animateValueChange(communityReachEl);
    animateValueChange(platformCoverageEl);
    animateValueChange(ctaReachEl);
  } else {
    // Reset to default values
    expectedImpressionsEl.textContent = '0';
    communityReachEl.textContent = '0';
    platformCoverageEl.textContent = '0';
    ctaReachEl.textContent = '0 developers';
  }
}

// Animate value changes
function animateValueChange(element) {
  if (element) {
    element.style.transform = 'scale(1.05)';
    element.style.color = 'var(--color-primary)';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.color = '';
    }, 200);
  }
}

// Track user interactions for analytics
function trackInteraction(action, details) {
  // This would integrate with analytics in production
  console.log('User interaction:', action, details);
}

// Enhanced package selection with tracking
function enhancedPackageSelection(packageName) {
  trackInteraction('package_selected', { package: packageName });
  
  // Add visual feedback
  const selectedCard = document.querySelector(`[data-package="${packageName}"]`);
  if (selectedCard) {
    selectedCard.classList.add('package-selected-animation');
    setTimeout(() => {
      selectedCard.classList.remove('package-selected-animation');
    }, 600);
  }
}

// Enhanced addon selection with tracking
function enhancedAddonSelection(addonId, selected) {
  trackInteraction('addon_toggled', { addon: addonId, selected });
  
  // Add visual feedback
  const addonCheckbox = document.querySelector(`#${addonId}`);
  if (addonCheckbox) {
    const addonItem = addonCheckbox.closest('.addon-item');
    if (addonItem) {
      addonItem.classList.add(selected ? 'addon-selected-animation' : 'addon-deselected-animation');
      setTimeout(() => {
        addonItem.classList.remove('addon-selected-animation', 'addon-deselected-animation');
      }, 300);
    }
  }
}

// Form validation
function validateSelection() {
  const hasPackage = selectedPackage !== null;
  const ctaButton = document.querySelector('.cta-button');
  
  if (ctaButton) {
    if (hasPackage) {
      ctaButton.classList.remove('disabled');
      ctaButton.style.opacity = '1';
      ctaButton.style.pointerEvents = 'auto';
    } else {
      ctaButton.classList.add('disabled');
      ctaButton.style.opacity = '0.7';
      ctaButton.style.pointerEvents = 'auto'; // Still allow clicks for reminder
    }
  }
  
  return hasPackage;
}

// CTA button click tracking
function setupCTATracking() {
  const ctaButton = document.querySelector('.cta-button');
  
  if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
      const isValid = validateSelection();
      
      trackInteraction('cta_clicked', {
        selectedPackage,
        selectedAddons: Array.from(selectedAddons),
        totalInvestment,
        isValid
      });
      
      if (!isValid) {
        e.preventDefault();
        // Show a gentle reminder to select a package
        showPackageReminder();
        return false;
      }
      
      // If valid, allow the link to work normally
      // The link will open in a new tab due to target="_blank"
      console.log('Redirecting to calendar booking...');
    });
  }
}

// Show package selection reminder
function showPackageReminder() {
  const packagesSection = document.querySelector('.packages-section');
  if (packagesSection) {
    packagesSection.scrollIntoView({ behavior: 'smooth' });
    
    // Add a subtle highlight to packages
    packageCards.forEach(card => {
      card.style.animation = 'pulse 1s ease-in-out';
      setTimeout(() => {
        card.style.animation = '';
      }, 1000);
    });
  }
  
  // Show a temporary message
  showTemporaryMessage('Please select a package to continue');
}

// Show temporary message
function showTemporaryMessage(message) {
  // Create temporary message element
  const messageEl = document.createElement('div');
  messageEl.textContent = message;
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-warning);
    color: var(--color-surface);
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 1000;
    box-shadow: var(--shadow-lg);
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(messageEl);
  
  // Remove after 3 seconds
  setTimeout(() => {
    messageEl.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 300);
  }, 3000);
}

// Add smooth scrolling for better UX
function addSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Add interactive feedback
function addInteractiveFeedback() {
  // Package cards hover effect
  packageCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('selected')) {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = 'var(--shadow-lg)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('selected')) {
        card.style.transform = '';
        card.style.boxShadow = '';
      }
    });
  });
  
  // Addon items hover effect
  addonItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (!item.classList.contains('selected')) {
        item.style.transform = 'translateY(-2px)';
        item.style.boxShadow = 'var(--shadow-md)';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('selected')) {
        item.style.transform = '';
        item.style.boxShadow = '';
      }
    });
  });
}

// Keyboard accessibility
function addKeyboardSupport() {
  document.addEventListener('keydown', (e) => {
    // Allow Enter and Space to activate checkboxes
    if (e.key === 'Enter' || e.key === ' ') {
      const focusedElement = document.activeElement;
      
      if (focusedElement.classList.contains('package-label') || 
          focusedElement.classList.contains('addon-label')) {
        e.preventDefault();
        const checkbox = focusedElement.previousElementSibling;
        if (checkbox) {
          checkbox.click();
        }
      }
    }
  });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .package-selected-animation {
    animation: selectedPulse 0.6s ease-out;
  }
  
  .addon-selected-animation {
    animation: addonSelected 0.3s ease-out;
  }
  
  .addon-deselected-animation {
    animation: addonDeselected 0.3s ease-out;
  }
  
  @keyframes selectedPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); box-shadow: var(--shadow-lg); }
    100% { transform: scale(1); }
  }
  
  @keyframes addonSelected {
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
  
  @keyframes addonDeselected {
    0% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  init();
  addSmoothScrolling();
  addInteractiveFeedback();
  addKeyboardSupport();
  
  // Update validation state initially
  validateSelection();
  
  console.log('Iterate.ai Proposal App initialized successfully');
});