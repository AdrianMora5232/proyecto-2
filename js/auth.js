/**
 * auth.js
 * Logic for registration, login and session management.
 */
const Auth = {
    register(name, email, password, dni, phone, role, workerId) {
        const users = Storage.getUsers();

        // Check if user exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'El correo ya está registrado.' };
        }

        const newUser = { name, email, password, dni, phone, role, workerId };
        Storage.saveUser(newUser);

        // Auto login after register
        Storage.setCurrentUser(newUser);

        return { success: true };
    },

    login({ email, password, role, workerId, dni }) {
        const users = Storage.getUsers();
        const user = users.find(u => u.email === email && u.password === password && u.role === role);

        if (!user) {
            return { success: false, message: 'Credenciales inválidas o rol incorrecto.' };
        }

        // Additional checks for staff
        if ((role === 'admin' || role === 'evaluator') && (user.workerId !== workerId || user.dni !== dni)) {
            return { success: false, message: 'ID de trabajador o identificación incorrectos.' };
        }

        Storage.setCurrentUser(user);
        return { success: true, user };
    },

    redirectUser(user) {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        switch (user.role) {
            case 'admin':
                window.location.href = 'admin.html';
                break;
            case 'evaluator':
                window.location.href = 'evaluator.html';
                break;
            case 'applicant':
            default:
                window.location.href = 'applicant.html';
                break;
        }
    },

    logout() {
        Storage.clearSession();
        window.location.href = 'index.html';
    }
};

// Global Logout Handler
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => Auth.logout());
    }

    // Protection for dashboard pages (if not on index or register)
    const isAuthPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('register.html') || window.location.pathname.endsWith('/');

    if (typeof NO_AUTH_CHECK === 'undefined' && !isAuthPage) {
        const user = Storage.getCurrentUser();
        if (!user) window.location.href = 'index.html';
    }
});
