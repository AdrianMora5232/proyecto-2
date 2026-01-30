/**
 * data.js
 * Initial data setup for the application.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize default scholarships if empty
    if (!Storage.get(Storage.SCHOLARSHIPS)) {
        const initialScholarships = [
            {
                id: '1',
                name: 'Beca de Excelencia Académica',
                description: 'Para alumnos con promedio superior a 9.5',
                type: 'academic',
                amount: 5000,
                status: 'open',
                start: '2026-02-01',
                end: '2026-06-30'
            },
            {
                id: '2',
                name: 'Apoyo Económico Transporte',
                description: 'Subsidio mensual para traslado escolar',
                type: 'economic',
                amount: 1200,
                status: 'open',
                start: '2026-01-15',
                end: '2026-12-31'
            }
        ];
        Storage.save(Storage.SCHOLARSHIPS, initialScholarships);
    }

    // Default Admin User for testing
    const users = Storage.getUsers();
    if (users.length === 0) {
        const admin = {
            name: 'Administrador Global',
            email: 'admin@horizon.com',
            password: 'admin',
            role: 'admin',
            workerId: 'ADMIN-001',
            dni: '00000000'
        };
        Storage.saveUser(admin);
    }
});
