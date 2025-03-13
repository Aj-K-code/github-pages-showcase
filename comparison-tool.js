/**
 * Healthcare Metrics Comparison Tool
 * Allows side-by-side comparison of providers, procedures, and regions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize comparison panel
    initComparisonPanel();
    
    // Add comparison button to relevant cards
    setTimeout(() => {
        addComparisonButtons();
    }, 500); // Delay to ensure all cards are rendered
});

/**
 * Add comparison buttons to dashboard cards
 */
function addComparisonButtons() {
    // Add to all dashboard cards
    document.querySelectorAll('.dashboard-card').forEach(card => {
        // Skip if button already exists
        if (card.querySelector('.compare-btn')) {
            return;
        }
        
        const cardActions = card.querySelector('.card-actions');
        if (cardActions) {
            const compareBtn = document.createElement('button');
            compareBtn.className = 'btn-icon compare-btn';
            compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i>';
            compareBtn.title = 'Add to comparison';
            
            compareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const cardTitle = card.querySelector('.card-header h3').textContent;
                const cardType = card.dataset.type || 'metric';
                addToComparison(cardTitle, cardType, card);
            });
            
            // Insert before the last button
            cardActions.insertBefore(compareBtn, cardActions.lastChild);
        }
    });
    
    // Set up a mutation observer to add comparison buttons to new cards
    setupCardObserver();
}

/**
 * Set up a mutation observer to watch for new cards being added to the DOM
 */
function setupCardObserver() {
    // Create a new observer
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check each added node
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check if it's a dashboard card
                        if (node.classList && node.classList.contains('dashboard-card')) {
                            // Add comparison button if it doesn't have one
                            if (!node.querySelector('.compare-btn')) {
                                const cardActions = node.querySelector('.card-actions');
                                if (cardActions) {
                                    const compareBtn = document.createElement('button');
                                    compareBtn.className = 'btn-icon compare-btn';
                                    compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i>';
                                    compareBtn.title = 'Add to comparison';
                                    
                                    compareBtn.addEventListener('click', function(e) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        
                                        const cardTitle = node.querySelector('.card-header h3').textContent;
                                        const cardType = node.dataset.type || 'metric';
                                        addToComparison(cardTitle, cardType, node);
                                    });
                                    
                                    // Insert before the last button
                                    cardActions.insertBefore(compareBtn, cardActions.lastChild);
                                }
                            }
                        }
                        
                        // Check children recursively
                        if (node.querySelectorAll) {
                            node.querySelectorAll('.dashboard-card').forEach(card => {
                                if (!card.querySelector('.compare-btn')) {
                                    const cardActions = card.querySelector('.card-actions');
                                    if (cardActions) {
                                        const compareBtn = document.createElement('button');
                                        compareBtn.className = 'btn-icon compare-btn';
                                        compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i>';
                                        compareBtn.title = 'Add to comparison';
                                        
                                        compareBtn.addEventListener('click', function(e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            
                                            const cardTitle = card.querySelector('.card-header h3').textContent;
                                            const cardType = card.dataset.type || 'metric';
                                            addToComparison(cardTitle, cardType, card);
                                        });
                                        
                                        // Insert before the last button
                                        cardActions.insertBefore(compareBtn, cardActions.lastChild);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
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
        
        // Show comparison toggle initially
        showComparisonToggle();
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
            this.style.display = 'none';
            
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
    
    // Hide toggle button
    const toggle = document.querySelector('.comparison-toggle');
    if (toggle) {
        toggle.style.display = 'none';
    }
    
    // Hide empty state
    emptyState.style.display = 'none';
    
    // Check if already added
    const existingItems = itemsContainer.querySelectorAll('.comparison-item');
    for (let i = 0; i < existingItems.length; i++) {
        if (existingItems[i].dataset.title === title) {
            // Already exists, show notification
            if (typeof showNotification === 'function') {
                showNotification(`"${title}" is already in your comparison`, 'info');
            } else {
                alert(`"${title}" is already in your comparison`);
            }
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
    if (type === 'visualization') icon = 'chart-line';
    
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
    if (typeof showNotification === 'function') {
        showNotification(`Added "${title}" to comparison`, 'success');
    }
    
    // Mark source element as in comparison
    if (sourceElement) {
        sourceElement.classList.add('in-comparison');
    }
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
    
    // Check if there are any items
    const hasItems = itemsContainer.children.length > 0;
    
    // Show/hide empty state
    emptyState.style.display = hasItems ? 'none' : 'flex';
    
    // Enable/disable buttons
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
    while (itemsContainer.firstChild) {
        itemsContainer.removeChild(itemsContainer.firstChild);
    }
    
    // Update state
    updateComparisonState();
    
    // Remove in-comparison class from all cards
    document.querySelectorAll('.in-comparison').forEach(el => {
        el.classList.remove('in-comparison');
    });
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification('Comparison cleared', 'info');
    }
}

/**
 * Show the comparison view
 */
function showComparisonView() {
    const panel = document.querySelector('.comparison-panel');
    const itemsContainer = panel.querySelector('.comparison-items');
    const items = Array.from(itemsContainer.querySelectorAll('.comparison-item'));
    
    if (items.length === 0) {
        return;
    }
    
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Create modal header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
        <h3>Comparison Results</h3>
        <button class="close-modal">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Create modal body
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    // Create comparison grid
    const grid = document.createElement('div');
    grid.className = 'comparison-grid';
    
    // Create header row
    const headerRow = document.createElement('div');
    headerRow.className = 'comparison-header-row';
    
    // Add empty cell for labels
    const emptyCell = document.createElement('div');
    emptyCell.className = 'comparison-header-cell';
    headerRow.appendChild(emptyCell);
    
    // Add header cells for each item
    items.forEach(item => {
        const cell = document.createElement('div');
        cell.className = 'comparison-header-cell';
        cell.innerHTML = `
            ${item.dataset.title}
            <div class="comparison-type">${item.dataset.type}</div>
        `;
        headerRow.appendChild(cell);
    });
    
    grid.appendChild(headerRow);
    
    // Add data rows
    const metrics = [
        { label: 'Quality Score', icon: 'star', type: 'rating' },
        { label: 'Cost Efficiency', icon: 'dollar-sign', type: 'percentage' },
        { label: 'Patient Volume', icon: 'users', type: 'number' },
        { label: 'Readmission Rate', icon: 'redo', type: 'percentage' },
        { label: 'Complication Rate', icon: 'exclamation-triangle', type: 'percentage' },
        { label: 'Patient Satisfaction', icon: 'smile', type: 'rating' }
    ];
    
    metrics.forEach(metric => {
        const row = document.createElement('div');
        row.className = 'comparison-row';
        
        // Add label cell
        const labelCell = document.createElement('div');
        labelCell.className = 'comparison-label-cell';
        labelCell.innerHTML = `
            <i class="fas fa-${metric.icon}"></i>
            ${metric.label}
        `;
        row.appendChild(labelCell);
        
        // Add data cells for each item
        items.forEach(item => {
            const cell = document.createElement('div');
            cell.className = 'comparison-data-cell';
            
            // Generate random data for demonstration
            if (metric.type === 'rating') {
                const rating = Math.random() * 5;
                cell.innerHTML = generateStarRating(rating);
            } else if (metric.type === 'percentage') {
                const value = Math.random() * 100;
                const isGood = metric.label === 'Cost Efficiency' ? value > 50 : value < 50;
                const color = isGood ? 'var(--success)' : 'var(--danger)';
                
                cell.innerHTML = `
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${value}%; background: ${color}"></div>
                    </div>
                    ${value.toFixed(1)}%
                `;
            } else {
                const value = Math.floor(Math.random() * 10000);
                cell.textContent = value.toLocaleString();
            }
            
            row.appendChild(cell);
        });
        
        grid.appendChild(row);
    });
    
    body.appendChild(grid);
    
    // Create modal footer
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.innerHTML = `
        <button class="btn btn-sm btn-outline" id="export-comparison">
            <i class="fas fa-download"></i> Export as PDF
        </button>
        <button class="btn btn-sm" id="close-comparison-modal">Close</button>
    `;
    
    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    backdrop.appendChild(modal);
    
    // Add to document
    document.body.appendChild(backdrop);
    
    // Setup event listeners
    backdrop.querySelector('.close-modal').addEventListener('click', function() {
        backdrop.remove();
    });
    
    backdrop.querySelector('#close-comparison-modal').addEventListener('click', function() {
        backdrop.remove();
    });
    
    backdrop.querySelector('#export-comparison').addEventListener('click', function() {
        // Show notification
        if (typeof showNotification === 'function') {
            showNotification('Comparison exported as PDF', 'success');
        }
        
        // Remove modal after a delay
        setTimeout(() => {
            backdrop.remove();
        }, 1000);
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
    
    let html = '<div class="star-rating">';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    html += '</div>';
    html += `<div class="rating-value">${rating.toFixed(1)}</div>`;
    
    return html;
}
