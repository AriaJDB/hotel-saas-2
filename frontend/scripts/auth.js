// Authentication Module - Session management and user authentication

/**
 * Save user session data
 * @param {Object} userData - User data from login
 */
function saveSession(userData) {
    localStorage.setItem('userSession', JSON.stringify({
        nombre: userData.nombre,
        tipo: userData.tipo || 'usuario',
        timestamp: Date.now()
    }));
}

/**
 * Get current user session
 * @returns {Object|null} User session data or null
 */
function getSession() {
    const session = localStorage.getItem('userSession');
    if (!session) return null;

    try {
        return JSON.parse(session);
    } catch (error) {
        console.error('Error parsing session:', error);
        return null;
    }
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
function isAuthenticated() {
    return getSession() !== null;
}

/**
 * Get user type from session
 * @returns {string|null} User type (admin, usuario, empleado) or null
 */
function getUserType() {
    const session = getSession();
    return session ? session.tipo : null;
}

/**
 * Logout user - clear session
 */
function logout() {
    localStorage.removeItem('userSession');
    window.location.href = '/pages/client/login.html';
}

/**
 * Redirect user based on their type
 * @param {string} userType - Type of user (admin, usuario, empleado)
 */
function redirectByUserType(userType) {
    const redirectMap = {
        'admin': '/frontend/pages/admin/dashboard.html',
        'usuario': '/frontend/pages/client/home.html',
        'empleado': '/frontend/pages/cleaning/dashboard.html'
    };

    const redirectUrl = redirectMap[userType] || '/frontend/pages/client/home.html';
    window.location.href = redirectUrl;
}

/**
 * Protect route - redirect if not authenticated
 * @param {string} requiredType - Required user type (optional)
 */
function protectRoute(requiredType = null) {
    if (!isAuthenticated()) {
        window.location.href = '/frontend/pages/client/login.html';
        return false;
    }

    if (requiredType) {
        const userType = getUserType();
        if (userType !== requiredType) {
            // Redirect to appropriate page for their type
            redirectByUserType(userType);
            return false;
        }
    }

    return true;
}

/**
 * Initialize session check on page load
 */
function initSessionCheck() {
    const session = getSession();
    if (session) {
        // Update UI with user name if element exists
        const userNameElement = document.getElementById('user-name') ||
            document.getElementById('staff-name') ||
            document.querySelector('.admin-profile span');

        if (userNameElement) {
            userNameElement.textContent = session.nombre;
        }
    }
}

// Auto-initialize on DOM load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initSessionCheck);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveSession,
        getSession,
        isAuthenticated,
        getUserType,
        logout,
        redirectByUserType,
        protectRoute,
        initSessionCheck
    };
}
