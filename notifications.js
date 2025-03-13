/**
 * Notification System for Healthcare Analytics Dashboard
 * Provides toast notifications and alerts for user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize notification container
    initNotificationSystem();
});

/**
 * Initialize the notification system
 */
function initNotificationSystem() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
}

/**
 * Show a notification toast
 * @param {string} message - The message to display
 * @param {string} type - Type of notification (success, error, warning, info)
 * @param {number} duration - How long to show the notification in ms
 */
function showNotification(message, type = 'info', duration = 4000) {
    const container = document.querySelector('.notification-container');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    // Set content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Setup close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after duration
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }
    
    return notification;
}

/**
 * Close a notification
 * @param {HTMLElement} notification - The notification element to close
 */
function closeNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');
    
    // Remove from DOM after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Show a confirmation dialog
 * @param {string} message - The message to display
 * @param {Function} onConfirm - Callback when user confirms
 * @param {Function} onCancel - Callback when user cancels
 */
function showConfirmation(message, onConfirm, onCancel) {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal confirmation-modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3>Confirmation</h3>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <p>${message}</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" id="cancel-action">Cancel</button>
            <button class="btn btn-primary" id="confirm-action">Confirm</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
    
    // Handle confirm
    modal.querySelector('#confirm-action').addEventListener('click', () => {
        backdrop.remove();
        modal.remove();
        if (typeof onConfirm === 'function') onConfirm();
    });
    
    // Handle cancel
    const cancelAction = () => {
        backdrop.remove();
        modal.remove();
        if (typeof onCancel === 'function') onCancel();
    };
    
    modal.querySelector('#cancel-action').addEventListener('click', cancelAction);
    modal.querySelector('.close-modal').addEventListener('click', cancelAction);
}

/**
 * Show an alert message that requires user acknowledgment
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {Function} onClose - Callback when alert is closed
 */
function showAlert(title, message, onClose) {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal alert-modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <p>${message}</p>
        </div>
        <div class="modal-footer">
            <button class="btn" id="acknowledge-alert">OK</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
    
    // Handle close
    const closeAlert = () => {
        backdrop.remove();
        modal.remove();
        if (typeof onClose === 'function') onClose();
    };
    
    modal.querySelector('#acknowledge-alert').addEventListener('click', closeAlert);
    modal.querySelector('.close-modal').addEventListener('click', closeAlert);
}

/**
 * Show a data update notification with details
 * @param {string} title - Update title
 * @param {Object} details - Update details
 */
function showDataUpdateNotification(title, details) {
    const container = document.querySelector('.notification-container');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-update';
    
    // Create details HTML
    let detailsHtml = '';
    if (details && typeof details === 'object') {
        detailsHtml = '<ul class="update-details">';
        for (const key in details) {
            if (details.hasOwnProperty(key)) {
                detailsHtml += `<li><strong>${key}:</strong> ${details[key]}</li>`;
            }
        }
        detailsHtml += '</ul>';
    }
    
    // Set content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-sync-alt"></i>
        </div>
        <div class="notification-content">
            <h4>${title}</h4>
            ${detailsHtml}
            <div class="notification-actions">
                <button class="btn btn-sm" id="view-details">View Details</button>
                <button class="btn btn-sm btn-outline" id="dismiss">Dismiss</button>
            </div>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Setup close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Setup dismiss button
    notification.querySelector('#dismiss').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Setup view details
    notification.querySelector('#view-details').addEventListener('click', () => {
        // Close notification
        closeNotification(notification);
        
        // Show detailed modal
        showDataUpdateDetails(title, details);
    });
    
    return notification;
}

/**
 * Show detailed data update information
 * @param {string} title - Update title
 * @param {Object} details - Update details
 */
function showDataUpdateDetails(title, details) {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    // Create details content
    let detailsContent = '<div class="update-details-content">';
    if (details && typeof details === 'object') {
        for (const key in details) {
            if (details.hasOwnProperty(key)) {
                detailsContent += `
                    <div class="detail-item">
                        <div class="detail-label">${key}</div>
                        <div class="detail-value">${details[key]}</div>
                    </div>
                `;
            }
        }
    }
    detailsContent += '</div>';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal data-update-modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            ${detailsContent}
        </div>
        <div class="modal-footer">
            <button class="btn" id="close-details">Close</button>
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
    
    modal.querySelector('#close-details').addEventListener('click', closeModal);
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
}
