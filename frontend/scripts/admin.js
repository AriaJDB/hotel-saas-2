// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Active nav link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Modal functions
function openNewReservationModal() {
    document.getElementById('new-reservation-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openRoomModal() {
    document.getElementById('add-room-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal on overlay click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal(this.id);
        }
    });
});

// Form submission
const adminReservationForm = document.getElementById('admin-reservation-form');
if (adminReservationForm) {
    adminReservationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Reservación creada exitosamente');
        closeModal('new-reservation-modal');
        this.reset();

        // Aquí se podría agregar la lógica para actualizar la tabla
        updateReservationsTable();
    });
}

// Add room form submission
const addRoomForm = document.getElementById('add-room-form');
if (addRoomForm) {
    addRoomForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtener datos del formulario
        const roomName = this.querySelector('input[placeholder="Ej: Suite Premium"]').value;
        const category = this.querySelector('select').value;
        const price = this.querySelector('input[type="number"][placeholder="150"]').value;
        const quantity = this.querySelector('input[placeholder="10"]').value;

        alert(`Habitación "${roomName}" agregada exitosamente al sistema\n\nCategoría: ${category}\nPrecio: $${price}/noche\nCantidad: ${quantity} habitaciones`);
        closeModal('add-room-modal');
        this.reset();

        // Aquí se implementaría la lógica real para agregar la habitación
        console.log('Nueva habitación agregada:', {
            name: roomName,
            category: category,
            price: price,
            quantity: quantity
        });
    });
}

// Update reservations table (simulación)
function updateReservationsTable() {
    console.log('Tabla de reservaciones actualizada');
    // Aquí se implementaría la lógica real para actualizar la tabla
}

// Logout function
function logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        localStorage.removeItem('userSession');
        window.location.href = '/pages/client/login.html';
    }
}

// Table action buttons handlers
document.addEventListener('DOMContentLoaded', function () {
    // View details buttons
    const viewButtons = document.querySelectorAll('.btn-icon-action[title="Ver detalles"]');
    viewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const reservationId = row.cells[0].textContent;
            alert(`Ver detalles de la reservación ${reservationId}`);
            // Aquí se implementaría la lógica para mostrar los detalles
        });
    });

    // Edit buttons
    const editButtons = document.querySelectorAll('.btn-icon-action[title="Editar"]');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const reservationId = row.cells[0].textContent;
            alert(`Editar reservación ${reservationId}`);
            // Aquí se implementaría la lógica para editar
        });
    });

    // Delete/Cancel buttons
    const deleteButtons = document.querySelectorAll('.btn-icon-action.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const reservationId = row.cells[0].textContent;
            if (confirm(`¿Está seguro que desea cancelar la reservación ${reservationId}?`)) {
                alert(`Reservación ${reservationId} cancelada`);
                // Aquí se implementaría la lógica para cancelar
            }
        });
    });

    // Room management buttons
    const roomEditButtons = document.querySelectorAll('.room-admin-card .btn-secondary');
    roomEditButtons.forEach(button => {
        button.addEventListener('click', function () {
            const roomCard = this.closest('.room-admin-card');
            const roomName = roomCard.querySelector('h4').textContent;
            alert(`Editar ${roomName}`);
            // Aquí se implementaría la lógica para editar habitación
        });
    });

    const roomDetailsButtons = document.querySelectorAll('.room-admin-card .btn-outline');
    roomDetailsButtons.forEach(button => {
        button.addEventListener('click', function () {
            const roomCard = this.closest('.room-admin-card');
            const roomName = roomCard.querySelector('h4').textContent;
            alert(`Ver detalles de ${roomName}`);
            // Aquí se implementaría la lógica para ver detalles de habitación
        });
    });
});

// Statistics update simulation (could be connected to real-time data)
function updateStatistics() {
    // Esta función se podría llamar periódicamente para actualizar las estadísticas
    console.log('Actualizando estadísticas...');
}

// Initialize tooltips or other UI enhancements
function initializeUI() {
    console.log('Interfaz de administración inicializada');
}

// Call initialization
initializeUI();
