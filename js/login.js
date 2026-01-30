document.addEventListener('DOMContentLoaded', () => {
    // Inicializar IDs de prueba si no existen
    if (!localStorage.getItem('authorized_ids')) {
        const testIDs = ['ADMIN123', 'EVAL2026', 'COORD_XYZ'];
        localStorage.setItem('authorized_ids', JSON.stringify(testIDs));
        console.log('IDs de prueba cargados en LocalStorage:', testIDs);
    }

    const applicantForm = document.getElementById('applicant-form');
    const adminForm = document.getElementById('admin-form');
    const messageEl = document.getElementById('message');

    const showMessage = (text, type) => {
        messageEl.textContent = text;
        messageEl.className = `show ${type}`;
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 3000);
    };


    // Manejo de login para Postulantes (Simulado)
    applicantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('applicant-email').value;
        showMessage(`¡Bienvenido, ${email.split('@')[0]}! Accediendo...`, 'success');
        // Aquí iría la redirección
    });

    // Manejo de login para Administradores y Evaluadores (Con validación LocalStorage)
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const adminID = document.getElementById('admin-id').value;
        const authorizedIDs = JSON.parse(localStorage.getItem('authorized_ids') || '[]');

        if (authorizedIDs.includes(adminID)) {
            showMessage('ID Verificado. Entrando al panel de control...', 'success');
            // Aquí iría la redirección al dashboard
        } else {
            showMessage('Error: ID no autorizado. Contacte a soporte.', 'error');
        }
    });
});
