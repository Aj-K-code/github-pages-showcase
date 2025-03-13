/**
 * Advanced Data Filters for Healthcare Analytics Dashboard
 * Provides interactive filtering capabilities for all dashboard components
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the filter system
    initializeFilters();
    
    // Setup event listeners for filter changes
    setupFilterEvents();
});

/**
 * Initialize the filter UI components
 */
function initializeFilters() {
    // Create filter container if it doesn't exist
    if (!document.querySelector('.filter-container')) {
        createFilterUI();
    }
    
    // Populate filter options from data
    populateFilterOptions();
}

/**
 * Create the filter UI elements
 */
function createFilterUI() {
    const dashboardSection = document.querySelector('.dashboard-section');
    
    // Create filter container
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    
    // Create filter header
    const filterHeader = document.createElement('div');
    filterHeader.className = 'filter-header';
    filterHeader.innerHTML = `
        <h3>Data Filters</h3>
        <div class="filter-actions">
            <button class="btn btn-sm" id="apply-filters">Apply</button>
            <button class="btn btn-sm btn-outline" id="reset-filters">Reset</button>
        </div>
    `;
    
    // Create filter body
    const filterBody = document.createElement('div');
    filterBody.className = 'filter-body';
    filterBody.innerHTML = `
        <div class="filter-row">
            <div class="filter-group">
                <label>Date Range</label>
                <div class="date-range-picker">
                    <input type="date" id="date-from" name="date-from">
                    <span>to</span>
                    <input type="date" id="date-to" name="date-to">
                </div>
            </div>
            
            <div class="filter-group">
                <label>Region</label>
                <select id="region-filter" multiple>
                    <option value="northeast">Northeast</option>
                    <option value="midwest">Midwest</option>
                    <option value="south">South</option>
                    <option value="west">West</option>
                </select>
            </div>
        </div>
        
        <div class="filter-row">
            <div class="filter-group">
                <label>Provider Type</label>
                <select id="provider-filter" multiple>
                    <option value="hospital">Hospital</option>
                    <option value="clinic">Clinic</option>
                    <option value="specialist">Specialist</option>
                    <option value="primary">Primary Care</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label>Cost Range</label>
                <div class="range-slider">
                    <div id="cost-slider"></div>
                    <div class="range-values">
                        <span id="cost-min">$0</span>
                        <span id="cost-max">$10,000</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="filter-row">
            <div class="filter-group">
                <label>Quality Score</label>
                <div class="quality-options">
                    <label class="quality-option">
                        <input type="checkbox" value="5-star"> 5★
                    </label>
                    <label class="quality-option">
                        <input type="checkbox" value="4-star"> 4★
                    </label>
                    <label class="quality-option">
                        <input type="checkbox" value="3-star"> 3★
                    </label>
                    <label class="quality-option">
                        <input type="checkbox" value="2-star"> 2★
                    </label>
                    <label class="quality-option">
                        <input type="checkbox" value="1-star"> 1★
                    </label>
                </div>
            </div>
            
            <div class="filter-group">
                <label>Advanced Filters</label>
                <div class="tag-filters">
                    <span class="filter-tag" data-value="high-value">High Value <i class="fas fa-times"></i></span>
                    <span class="filter-tag" data-value="trending">Trending <i class="fas fa-times"></i></span>
                    <span class="filter-tag add-tag"><i class="fas fa-plus"></i> Add</span>
                </div>
            </div>
        </div>
    `;
    
    // Assemble filter components
    filterContainer.appendChild(filterHeader);
    filterContainer.appendChild(filterBody);
    
    // Add to dashboard
    dashboardSection.insertBefore(filterContainer, dashboardSection.firstChild);
}

/**
 * Populate filter options from data
 */
function populateFilterOptions() {
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    document.getElementById('date-to').valueAsDate = today;
    document.getElementById('date-from').valueAsDate = thirtyDaysAgo;
}

/**
 * Setup event listeners for filter interactions
 */
function setupFilterEvents() {
    // Apply filters button
    document.getElementById('apply-filters').addEventListener('click', function() {
        applyFilters();
        showFilterAppliedNotification();
    });
    
    // Reset filters button
    document.getElementById('reset-filters').addEventListener('click', function() {
        resetFilters();
    });
    
    // Remove tag when clicking the X
    document.querySelectorAll('.filter-tag .fa-times').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const tag = this.parentElement;
            tag.remove();
        });
    });
    
    // Add new tag
    document.querySelector('.filter-tag.add-tag').addEventListener('click', function() {
        showAddTagDialog();
    });
}

/**
 * Apply the selected filters to the dashboard data
 */
function applyFilters() {
    // Get filter values
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    const regions = Array.from(document.getElementById('region-filter').selectedOptions).map(opt => opt.value);
    const providers = Array.from(document.getElementById('provider-filter').selectedOptions).map(opt => opt.value);
    
    // Get quality filters
    const qualityScores = Array.from(document.querySelectorAll('.quality-option input:checked')).map(cb => cb.value);
    
    // Get tag filters
    const tags = Array.from(document.querySelectorAll('.filter-tag:not(.add-tag)')).map(tag => tag.dataset.value);
    
    console.log('Applying filters:', {
        dateRange: { from: dateFrom, to: dateTo },
        regions,
        providers,
        qualityScores,
        tags
    });
    
    // Update dashboard with filtered data
    updateDashboardWithFilters();
}

/**
 * Reset all filters to default values
 */
function resetFilters() {
    // Reset date range
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    document.getElementById('date-to').valueAsDate = today;
    document.getElementById('date-from').valueAsDate = thirtyDaysAgo;
    
    // Reset dropdowns
    document.getElementById('region-filter').selectedIndex = -1;
    document.getElementById('provider-filter').selectedIndex = -1;
    
    // Reset quality checkboxes
    document.querySelectorAll('.quality-option input').forEach(cb => cb.checked = false);
    
    // Reset tags
    document.querySelectorAll('.filter-tag:not(.add-tag)').forEach(tag => tag.remove());
    
    // Update dashboard with unfiltered data
    updateDashboardWithFilters();
    
    // Show reset notification
    showNotification('Filters have been reset to defaults', 'info');
}

/**
 * Show dialog to add a new filter tag
 */
function showAddTagDialog() {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3>Add Filter Tag</h3>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Select a tag or create custom</label>
                <select id="tag-select">
                    <option value="">-- Select a tag --</option>
                    <option value="high-volume">High Volume</option>
                    <option value="low-cost">Low Cost</option>
                    <option value="high-quality">High Quality</option>
                    <option value="needs-review">Needs Review</option>
                    <option value="custom">Custom Tag...</option>
                </select>
            </div>
            <div class="form-group custom-tag-input" style="display: none;">
                <label>Custom Tag Name</label>
                <input type="text" id="custom-tag-input" placeholder="Enter custom tag">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" id="cancel-tag">Cancel</button>
            <button class="btn" id="add-tag">Add Tag</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
    
    // Show custom input when "Custom Tag" is selected
    document.getElementById('tag-select').addEventListener('change', function() {
        const customInput = document.querySelector('.custom-tag-input');
        if (this.value === 'custom') {
            customInput.style.display = 'block';
        } else {
            customInput.style.display = 'none';
        }
    });
    
    // Close modal on cancel
    document.getElementById('cancel-tag').addEventListener('click', function() {
        backdrop.remove();
        modal.remove();
    });
    
    // Close modal on X
    document.querySelector('.close-modal').addEventListener('click', function() {
        backdrop.remove();
        modal.remove();
    });
    
    // Add tag and close modal
    document.getElementById('add-tag').addEventListener('click', function() {
        const select = document.getElementById('tag-select');
        let tagValue, tagText;
        
        if (select.value === 'custom') {
            tagText = document.getElementById('custom-tag-input').value.trim();
            tagValue = tagText.toLowerCase().replace(/\s+/g, '-');
        } else if (select.value) {
            tagValue = select.value;
            tagText = select.options[select.selectedIndex].text;
        }
        
        if (tagValue && tagText) {
            addFilterTag(tagValue, tagText);
        }
        
        backdrop.remove();
        modal.remove();
    });
}

/**
 * Add a new filter tag to the UI
 */
function addFilterTag(value, text) {
    const tagContainer = document.querySelector('.tag-filters');
    const addTagButton = document.querySelector('.filter-tag.add-tag');
    
    const newTag = document.createElement('span');
    newTag.className = 'filter-tag';
    newTag.dataset.value = value;
    newTag.innerHTML = `${text} <i class="fas fa-times"></i>`;
    
    // Add remove event
    newTag.querySelector('.fa-times').addEventListener('click', function(e) {
        e.stopPropagation();
        newTag.remove();
    });
    
    // Insert before the add button
    tagContainer.insertBefore(newTag, addTagButton);
}

/**
 * Update dashboard visualizations based on applied filters
 */
function updateDashboardWithFilters() {
    // Add loading state to charts
    document.querySelectorAll('.chart-container, .map-container').forEach(container => {
        container.classList.add('loading');
    });
    
    // Simulate data loading delay
    setTimeout(() => {
        // Update charts with new data
        updateCharts();
        
        // Remove loading state
        document.querySelectorAll('.chart-container, .map-container').forEach(container => {
            container.classList.remove('loading');
        });
    }, 800);
}

/**
 * Show notification when filters are applied
 */
function showFilterAppliedNotification() {
    showNotification('Filters applied successfully', 'success');
}

/**
 * Show a notification message
 */
function showNotification(message, type = 'info') {
    // Create notification element if notification system exists
    if (typeof showNotification === 'function') {
        showNotification(message, type);
    } else {
        console.log(`Notification (${type}): ${message}`);
    }
}

/**
 * Update all charts with filtered data
 */
function updateCharts() {
    // This would be replaced with actual chart update logic
    console.log('Updating charts with filtered data');
    
    // For demo purposes, we'll just add some animation to show changes
    document.querySelectorAll('.chart-container canvas').forEach(canvas => {
        canvas.style.animation = 'none';
        void canvas.offsetWidth; // Trigger reflow
        canvas.style.animation = 'pulse 0.5s ease-in-out';
    });
}
