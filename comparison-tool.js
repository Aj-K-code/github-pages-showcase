/**
 * Healthcare Metrics Comparison Tool
 * Allows side-by-side comparison of providers, procedures, and regions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add comparison button to relevant cards
    addComparisonButtons();
    
    // Initialize comparison panel
    initComparisonPanel();
});

/**
 * Add comparison buttons to dashboard cards
 */
function addComparisonButtons() {
    // Add to provider cards
    document.querySelectorAll('.dashboard-card').forEach(card => {
        const cardActions = card.querySelector('.card-actions');
        if (cardActions) {
            const compareBtn = document.createElement('button');
            compareBtn.className = 'btn-icon compare-btn';
            compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i>';
            compareBtn.title = 'Add to comparison';
            
            compareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const cardTitle = card.querySelector('.card-header h3').textContent;
                const cardType = card.dataset.type || 'metric';
                addToComparison(cardTitle, cardType, card);
            });
            
            cardActions.appendChild(compareBtn);
        }
    });
}

/**
 * Initialize the comparison panel
 */
function initComparisonPanel() {
    // Create comparison panel if it doesn't exist
    if (!document.querySelector('.comparison-panel')) {
        const panel = document.createElement('div');
        panel.className = 'comparison-panel';
        panel.innerHTML = `
            <div class="comparison-header">
                <h3>Comparison Tool</h3>
                <div class="comparison-actions">
                    <button class="btn-icon minimize-comparison">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <button class="btn-icon close-comparison">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="comparison-body">
                <div class="comparison-empty">
                    <i class="fas fa-balance-scale"></i>
                    <p>Add items to compare by clicking the comparison icon on any card</p>
                </div>
                <div class="comparison-items"></div>
            </div>
            <div class="comparison-footer">
                <button class="btn btn-sm" id="view-comparison" disabled>View Comparison</button>
                <button class="btn btn-sm btn-outline" id="clear-comparison" disabled>Clear All</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Setup event listeners
        setupComparisonEvents();
    }
}

/**
 * Setup event listeners for comparison panel
 */
function setupComparisonEvents() {
    const panel = document.querySelector('.comparison-panel');
    
    // Minimize panel
    panel.querySelector('.minimize-comparison').addEventListener('click', function() {
        panel.classList.toggle('minimized');
        this.querySelector('i').classList.toggle('fa-chevron-down');
        this.querySelector('i').classList.toggle('fa-chevron-up');
    });
    
    // Close panel
    panel.querySelector('.close-comparison').addEventListener('click', function() {
        panel.classList.add('hidden');
        
        // Show the comparison toggle button
        showComparisonToggle();
    });
    
    // Clear all items
    panel.querySelector('#clear-comparison').addEventListener('click', function() {
        clearComparison();
    });
    
    // View comparison
    panel.querySelector('#view-comparison').addEventListener('click', function() {
        if (!this.disabled) {
            showComparisonView();
        }
    });
}

/**
 * Show the comparison toggle button
 */
function showComparisonToggle() {
    // Create toggle button if it doesn't exist
    if (!document.querySelector('.comparison-toggle')) {
        const toggle = document.createElement('button');
        toggle.className = 'comparison-toggle';
        toggle.innerHTML = '<i class="fas fa-balance-scale"></i>';
        toggle.title = 'Open comparison tool';
        
        toggle.addEventListener('click', function() {
            // Hide the toggle
            this.remove();
            
            // Show the panel
            const panel = document.querySelector('.comparison-panel');
            panel.classList.remove('hidden');
        });
        
        document.body.appendChild(toggle);
    } else {
        // Show existing toggle
        document.querySelector('.comparison-toggle').style.display = 'flex';
    }
}

/**
 * Add an item to the comparison panel
 * @param {string} title - Item title
 * @param {string} type - Item type (provider, procedure, region)
 * @param {HTMLElement} sourceElement - Source element
 */
function addToComparison(title, type, sourceElement) {
    const panel = document.querySelector('.comparison-panel');
    const itemsContainer = panel.querySelector('.comparison-items');
    const emptyState = panel.querySelector('.comparison-empty');
    
    // Show panel if hidden
    panel.classList.remove('hidden');
    
    // Hide empty state
    emptyState.style.display = 'none';
    
    // Check if already added
    const existingItems = itemsContainer.querySelectorAll('.comparison-item');
    for (let i = 0; i < existingItems.length; i++) {
        if (existingItems[i].dataset.title === title) {
            // Already exists, show notification
            showNotification(`"${title}" is already in your comparison`, 'info');
            return;
        }
    }
    
    // Create new comparison item
    const item = document.createElement('div');
    item.className = 'comparison-item';
    item.dataset.title = title;
    item.dataset.type = type;
    
    // Get appropriate icon
    let icon = 'chart-bar';
    if (type === 'provider') icon = 'hospital';
    if (type === 'procedure') icon = 'procedures';
    if (type === 'region') icon = 'map-marker-alt';
    
    item.innerHTML = `
        <div class="comparison-item-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="comparison-item-title">${title}</div>
        <button class="remove-comparison-item">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    itemsContainer.appendChild(item);
    
    // Setup remove button
    item.querySelector('.remove-comparison-item').addEventListener('click', function() {
        item.remove();
        updateComparisonState();
    });
    
    // Update buttons state
    updateComparisonState();
    
    // Show notification
    showNotification(`Added "${title}" to comparison`, 'success');
    
    // Highlight source element
    sourceElement.classList.add('in-comparison');
}

/**
 * Update comparison panel state
 */
function updateComparisonState() {
    const panel = document.querySelector('.comparison-panel');
    const itemsContainer = panel.querySelector('.comparison-items');
    const emptyState = panel.querySelector('.comparison-empty');
    const viewBtn = panel.querySelector('#view-comparison');
    const clearBtn = panel.querySelector('#clear-comparison');
    
    // Check if there are items
    const hasItems = itemsContainer.children.length > 0;
    
    // Update empty state
    emptyState.style.display = hasItems ? 'none' : 'flex';
    
    // Update buttons
    viewBtn.disabled = !hasItems;
    clearBtn.disabled = !hasItems;
}

/**
 * Clear all comparison items
 */
function clearComparison() {
    const panel = document.querySelector('.comparison-panel');
    const itemsContainer = panel.querySelector('.comparison-items');
    
    // Remove all items
    itemsContainer.innerHTML = '';
    
    // Update state
    updateComparisonState();
    
    // Remove highlights from source elements
    document.querySelectorAll('.in-comparison').forEach(el => {
        el.classList.remove('in-comparison');
    });
    
    // Show notification
    showNotification('Comparison cleared', 'info');
}

/**
 * Show the comparison view
 */
function showComparisonView() {
    const panel = document.querySelector('.comparison-panel');
    const itemsContainer = panel.querySelector('.comparison-items');
    const items = itemsContainer.querySelectorAll('.comparison-item');
    
    // Collect items data
    const comparisonData = [];
    items.forEach(item => {
        comparisonData.push({
            title: item.dataset.title,
            type: item.dataset.type
        });
    });
    
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    // Create comparison content
    let comparisonContent = `
        <div class="comparison-grid">
            <div class="comparison-header-row">
                <div class="comparison-header-cell"></div>
    `;
    
    // Add header cells
    comparisonData.forEach(item => {
        comparisonContent += `
            <div class="comparison-header-cell">
                <h4>${item.title}</h4>
                <div class="comparison-type">${item.type}</div>
            </div>
        `;
    });
    
    comparisonContent += `</div>`;
    
    // Add metric rows
    const metrics = [
        { name: 'Cost', icon: 'dollar-sign' },
        { name: 'Quality Score', icon: 'star' },
        { name: 'Patient Satisfaction', icon: 'smile' },
        { name: 'Readmission Rate', icon: 'redo' },
        { name: 'Procedure Volume', icon: 'chart-line' }
    ];
    
    metrics.forEach(metric => {
        comparisonContent += `
            <div class="comparison-row">
                <div class="comparison-label-cell">
                    <i class="fas fa-${metric.icon}"></i>
                    <span>${metric.name}</span>
                </div>
        `;
        
        // Add data cells with random values for demo
        comparisonData.forEach(item => {
            let value;
            
            // Generate appropriate random values based on metric
            if (metric.name === 'Cost') {
                value = `$${(Math.random() * 10000).toFixed(2)}`;
            } else if (metric.name === 'Quality Score') {
                const score = (Math.random() * 5).toFixed(1);
                value = `<div class="star-rating" data-rating="${score}">
                    ${generateStarRating(score)}
                </div>`;
            } else if (metric.name === 'Patient Satisfaction') {
                const percent = Math.floor(Math.random() * 100);
                value = `<div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%"></div>
                    <span>${percent}%</span>
                </div>`;
            } else if (metric.name === 'Readmission Rate') {
                const rate = (Math.random() * 20).toFixed(1);
                value = `${rate}%`;
            } else {
                value = Math.floor(Math.random() * 1000);
            }
            
            comparisonContent += `
                <div class="comparison-data-cell">${value}</div>
            `;
        });
        
        comparisonContent += `</div>`;
    });
    
    comparisonContent += `</div>`;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal comparison-modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3>Healthcare Metrics Comparison</h3>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            ${comparisonContent}
        </div>
        <div class="modal-footer">
            <button class="btn" id="export-comparison">Export as PDF</button>
            <button class="btn btn-outline" id="close-comparison">Close</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
    
    // Handle close
    const closeModal = () => {
        backdrop.remove();
        modal.remove();
    };
    
    modal.querySelector('#close-comparison').addEventListener('click', closeModal);
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Handle export
    modal.querySelector('#export-comparison').addEventListener('click', () => {
        showNotification('Exporting comparison as PDF...', 'info');
        setTimeout(() => {
            showNotification('Comparison exported successfully!', 'success');
        }, 1500);
    });
}

/**
 * Generate star rating HTML
 * @param {number} rating - Rating value (0-5)
 * @return {string} HTML for star rating
 */
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let html = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    return html;
}
