// API Module - Centralized backend communication
const API_BASE_URL = 'http://localhost:3000';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<boolean>} Success status
 */
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/nuevo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Error en el registro');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error registrando usuario:', error);
        throw error;
    }
}

/**
 * Login user
 * @param {Object} credentials - Login credentials {correo, password}
 * @returns {Promise<boolean>} Success status
 */
async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error('Credenciales incorrectas');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
}

// ===== HABITACIONES (ROOMS) =====

/**
 * Get all rooms
 * @returns {Promise<Array>} List of rooms
 */
async function getRooms() {
    try {
        const response = await fetch(`${API_BASE_URL}/habitaciones`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error obteniendo habitaciones');
        }

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo habitaciones:', error);
        return [];
    }
}

/**
 * Get available rooms for specific dates
 * @param {string} checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date (YYYY-MM-DD)
 * @returns {Promise<Array>} List of available rooms
 */
async function getAvailableRooms(checkIn, checkOut) {
    try {
        const params = new URLSearchParams();
        if (checkIn) params.append('fechaEntrada', checkIn);
        if (checkOut) params.append('fechaSalida', checkOut);

        const response = await fetch(`${API_BASE_URL}/habitaciones/disponibles/buscar?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error obteniendo habitaciones disponibles');
        }

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo habitaciones disponibles:', error);
        return [];
    }
}

/**
 * Create new room (admin only)
 * @param {Object} roomData - Room data
 * @returns {Promise<Object>} Result object
 */
async function createRoom(roomData) {
    try {
        const response = await fetch(`${API_BASE_URL}/habitaciones/nueva`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData)
        });

        if (!response.ok) {
            throw new Error('Error creando habitación');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creando habitación:', error);
        throw error;
    }
}

/**
 * Update room
 * @param {string} num - Room number
 * @param {Object} roomData - Updated room data
 * @returns {Promise<Object>} Result object
 */
async function updateRoom(num, roomData) {
    try {
        const response = await fetch(`${API_BASE_URL}/habitaciones/${num}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData)
        });

        if (!response.ok) {
            throw new Error('Error actualizando habitación');
        }

        return await response.json();
    } catch (error) {
        console.error('Error actualizando habitación:', error);
        throw error;
    }
}

/**
 * Update room status (for cleaning staff)
 * @param {string} num - Room number
 * @param {string} status - New status (Disponible, Ocupada, Limpiando, Mantenimiento)
 * @returns {Promise<Object>} Result object
 */
async function updateRoomStatus(num, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/habitaciones/${num}/estado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: status })
        });

        if (!response.ok) {
            throw new Error('Error actualizando estado de habitación');
        }

        return await response.json();
    } catch (error) {
        console.error('Error actualizando estado:', error);
        throw error;
    }
}

// ===== RESERVACIONES (RESERVATIONS) =====

/**
 * Get all reservations (admin only)
 * @returns {Promise<Array>} List of reservations
 */
async function getReservations() {
    try {
        const response = await fetch(`${API_BASE_URL}/reservaciones`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error obteniendo reservaciones');
        }

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo reservaciones:', error);
        return [];
    }
}

/**
 * Get user's reservations
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of user's reservations
 */
async function getUserReservations(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservaciones/usuario/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error obteniendo reservaciones del usuario');
        }

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo reservaciones del usuario:', error);
        return [];
    }
}

/**
 * Create new reservation
 * @param {Object} reservationData - Reservation data
 * @returns {Promise<Object>} Result object with reservation ID
 */
async function createReservation(reservationData) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservaciones/nueva`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData)
        });

        if (!response.ok) {
            throw new Error('Error creando reservación');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creando reservación:', error);
        throw error;
    }
}

/**
 * Update reservation
 * @param {string} id - Reservation ID
 * @param {Object} data - Updated reservation data
 * @returns {Promise<Object>} Result object
 */
async function updateReservation(id, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Error actualizando reservación');
        }

        return await response.json();
    } catch (error) {
        console.error('Error actualizando reservación:', error);
        throw error;
    }
}

/**
 * Update reservation status
 * @param {string} id - Reservation ID
 * @param {string} status - New status (Confirmada, Check-in, Check-out, Cancelada)
 * @returns {Promise<Object>} Result object
 */
async function updateReservationStatus(id, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservaciones/${id}/estado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: status })
        });

        if (!response.ok) {
            throw new Error('Error actualizando estado de reservación');
        }

        return await response.json();
    } catch (error) {
        console.error('Error actualizando estado:', error);
        throw error;
    }
}

/**
 * Cancel reservation
 * @param {string} id - Reservation ID
 * @returns {Promise<Object>} Result object
 */
async function cancelReservation(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservaciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error cancelando reservación');
        }

        return await response.json();
    } catch (error) {
        console.error('Error cancelando reservación:', error);
        throw error;
    }
}

// ===== LIMPIEZA (CLEANING) =====

/**
 * Get cleaning tasks (rooms that need cleaning)
 * @returns {Promise<Array>} List of rooms with cleaning status
 */
async function getCleaningTasks() {
    try {
        const rooms = await getRooms();
        // Filter rooms that need cleaning or are being cleaned
        return rooms.filter(room =>
            room.estado === 'Limpiando' ||
            room.estado === 'Ocupada' ||
            room.estado === 'Mantenimiento'
        ).map(room => ({
            roomNumber: room.num,
            tipo: room.tipo,
            estado: room.estado === 'Limpiando' ? 'En Progreso' :
                room.estado === 'Ocupada' ? 'Pendiente' : 'Mantenimiento',
            prioridad: room.estado === 'Ocupada' ? 'Alta' : 'Media',
            piso: room.piso
        }));
    } catch (error) {
        console.error('Error obteniendo tareas de limpieza:', error);
        return [];
    }
}

/**
 * Update room cleaning status
 * @param {string} roomNumber - Room number
 * @param {string} status - New status
 * @returns {Promise<Object>} Result object
 */
async function updateCleaningStatus(roomNumber, status) {
    return await updateRoomStatus(roomNumber, status);
}

// ===== ARTÍCULOS (ARTICLES/ITEMS) =====

/**
 * Get all articles
 * @returns {Promise<Array>} List of articles
 */
async function getArticles() {
    try {
        const response = await fetch(`${API_BASE_URL}/articulos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error obteniendo artículos');
        }

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo artículos:', error);
        return [];
    }
}

/**
 * Get articles by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} List of articles in category
 */
async function getArticlesByCategory(category) {
    try {
        const response = await fetch(`${API_BASE_URL}/articulos/categoria/${category}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error obteniendo artículos por categoría');
        }

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo artículos por categoría:', error);
        return [];
    }
}

// ===== PEDIDOS (ORDERS) =====

/**
 * Create new order
 * @param {Object} orderData - Order data {id_res, id_art, cantidad, estado}
 * @returns {Promise<Object>} Result object
 */
async function createOrder(orderData) {
    try {
        const response = await fetch(`${API_BASE_URL}/pedidos/nuevo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Error creando pedido');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creando pedido:', error);
        throw error;
    }
}

/**
 * Get orders by reservation
 * @param {string} resId - Reservation ID
 * @returns {Promise<Array>} List of orders
 */
async function getOrdersByReservation(resId) {
    try {
        const response = await fetch(`${API_BASE_URL}/pedidos/reservacion/${resId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error obteniendo pedidos');
        }

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo pedidos:', error);
        return [];
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        registerUser,
        loginUser,
        getRooms,
        getAvailableRooms,
        createRoom,
        updateRoom,
        updateRoomStatus,
        getReservations,
        getUserReservations,
        createReservation,
        updateReservation,
        updateReservationStatus,
        cancelReservation,
        getCleaningTasks,
        updateCleaningStatus,
        getArticles,
        getArticlesByCategory,
        createOrder,
        getOrdersByReservation
    };
}
