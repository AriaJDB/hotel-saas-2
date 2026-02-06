// ===== NAVIGATION =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ===== FILTER FUNCTIONALITY =====
function filterRooms(status) {
    const cards = document.querySelectorAll('.room-cleaning-card');
    const tabs = document.querySelectorAll('.filter-tab');

    // Update active tab
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.closest('.filter-tab').classList.add('active');

    // Filter cards
    cards.forEach(card => {
        if (status === 'all') {
            card.style.display = 'flex';
        } else {
            if (card.dataset.status === status) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });

    updateStats();
}

// ===== ROOM ACTIONS =====
function startCleaning(roomNumber) {
    const card = findRoomCard(roomNumber);
    if (!card) return;

    // Update card status
    card.dataset.status = 'progress';

    // Update status badge
    const statusBadge = card.querySelector('.status-badge');
    statusBadge.className = 'status-badge status-progress';
    statusBadge.textContent = 'En Progreso';

    // Replace button with progress bar
    const actionsDiv = card.querySelector('.room-card-actions');
    actionsDiv.innerHTML = `
        <button class="btn-complete" onclick="completeCleaning('${roomNumber}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Marcar Completa
        </button>
        <button class="btn-details" onclick="viewDetails('${roomNumber}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        </button>
    `;

    // Add progress bar
    const notesDiv = card.querySelector('.room-card-notes');
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = `
        <div class="progress-fill" style="width: 0%"></div>
        <span class="progress-text">0% Completado</span>
    `;
    notesDiv.replaceWith(progressBar);

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        if (progress <= 100) {
            const fill = card.querySelector('.progress-fill');
            const text = card.querySelector('.progress-text');
            fill.style.width = progress + '%';
            text.textContent = progress + '% Completado';
        } else {
            clearInterval(interval);
        }
    }, 2000);

    updateStats();
    showNotification('Limpieza iniciada para Habitación ' + roomNumber, 'success');
}

function completeCleaning(roomNumber) {
    const card = findRoomCard(roomNumber);
    if (!card) return;

    // Update card status
    card.dataset.status = 'completed';

    // Update status badge
    const statusBadge = card.querySelector('.status-badge');
    statusBadge.className = 'status-badge status-completed';
    statusBadge.textContent = 'Completada';

    // Update info items
    const infoItems = card.querySelectorAll('.info-item');
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    infoItems[2].querySelector('.info-label').textContent = 'Completada:';
    infoItems[2].querySelector('.info-value').textContent = timeString;
    infoItems[3].querySelector('.info-label').textContent = 'Duración:';
    infoItems[3].querySelector('.info-value').textContent = '30 min';

    // Replace progress bar with completion badge
    const progressBar = card.querySelector('.progress-bar');
    const completionBadge = document.createElement('div');
    completionBadge.className = 'completion-badge';
    completionBadge.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Limpieza verificada y aprobada</span>
    `;
    progressBar.replaceWith(completionBadge);

    // Update actions
    const actionsDiv = card.querySelector('.room-card-actions');
    actionsDiv.innerHTML = `
        <button class="btn-secondary" onclick="viewDetails('${roomNumber}')">Ver Detalles</button>
    `;

    updateStats();
    showNotification('Habitación ' + roomNumber + ' marcada como completada', 'success');
}

function viewDetails(roomNumber) {
    const modal = document.getElementById('room-details-modal');
    const title = document.getElementById('modal-room-title');
    title.textContent = 'Detalles de Habitación ' + roomNumber;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== MODAL FUNCTIONS =====
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function saveRoomDetails() {
    showNotification('Detalles guardados correctamente', 'success');
    closeModal('room-details-modal');
}

// Close modal on overlay click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal(this.id);
        }
    });
});

// ===== HELPER FUNCTIONS =====
function findRoomCard(roomNumber) {
    const cards = document.querySelectorAll('.room-cleaning-card');
    for (let card of cards) {
        const numberSpan = card.querySelector('.room-number span');
        if (numberSpan && numberSpan.textContent.includes(roomNumber)) {
            return card;
        }
    }
    return null;
}

function updateStats() {
    const cards = document.querySelectorAll('.room-cleaning-card');
    let pending = 0;
    let progress = 0;
    let completed = 0;
    let priority = 0;

    cards.forEach(card => {
        const status = card.dataset.status;
        const priorityLevel = card.dataset.priority;

        if (status === 'pending') pending++;
        else if (status === 'progress') progress++;
        else if (status === 'completed') completed++;

        if (priorityLevel === 'high' && status === 'pending') priority++;
    });

    document.getElementById('pending-count').textContent = pending;
    document.getElementById('progress-count').textContent = progress;
    document.getElementById('completed-count').textContent = completed;
    document.getElementById('priority-count').textContent = priority;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    // Add animation
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
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        showNotification('Cerrando sesión...', 'info');
        localStorage.removeItem('userSession');
        setTimeout(() => {
            window.location.href = '/pages/client/login.html';
        }, 1500);
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function () {
    updateStats();

    // Set staff name from localStorage or default
    const staffName = localStorage.getItem('staffName') || 'Personal de Limpieza';
    document.getElementById('staff-name').textContent = staffName;

    console.log('Sistema de limpieza inicializado correctamente');
});
