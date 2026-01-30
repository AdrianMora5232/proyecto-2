/**
 * evaluator.js
 * Logic for the evaluator dashboard.
 */
const Evaluator = {
    init() {
        console.log('Evaluator Dashboard Initialized');
        this.renderPendingApplications();
        this.renderEvaluationHistory();
    },

    renderPendingApplications() {
        const apps = Storage.getApplications();
        const scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];
        const pendingApps = apps.filter(a => a.status === 'pending');
        const tbody = document.getElementById('reviews-table-body');

        if (pendingApps.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay solicitudes pendientes</td></tr>';
            return;
        }

        tbody.innerHTML = pendingApps.map(a => {
            const s = scholarships.find(scholar => scholar.id === a.scholarshipId);
            return `
                <tr>
                    <td>${a.userName}</td>
                    <td>${s ? s.name : 'Desconocida'}</td>
                    <td>${a.date}</td>
                    <td>${a.notes.substring(0, 30)}${a.notes.length > 30 ? '...' : ''}</td>
                    <td>
                        <button class="btn btn-primary" onclick="Evaluator.openReviewModal('${a.id}')">Revisar</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderEvaluationHistory() {
        const apps = Storage.getApplications();
        const scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];
        const historyApps = apps.filter(a => a.status === 'approved' || a.status === 'rejected');
        const tbody = document.getElementById('history-table-body');

        if (!tbody) return;

        if (historyApps.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay historial de evaluaciones</td></tr>';
            return;
        }

        tbody.innerHTML = historyApps.map(a => {
            const s = scholarships.find(scholar => scholar.id === a.scholarshipId);
            return `
                <tr>
                    <td>${a.userName}</td>
                    <td>${s ? s.name : 'Desconocida'}</td>
                    <td>${a.date}</td>
                    <td>${a.evaluatorNotes || 'Sin comentarios'}</td>
                    <td><span class="badge badge-${a.status}">${a.status === 'approved' ? 'Aprobada' : 'Rechazada'}</span></td>
                </tr>
            `;
        }).join('');
    },

    openReviewModal(appId) {
        const apps = Storage.getApplications();
        const app = apps.find(a => a.id === appId);
        const scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];
        const s = scholarships.find(scholar => scholar.id === app.scholarshipId);
        const users = Storage.getUsers();
        const user = users.find(u => u.email === app.userId);

        document.getElementById('review-app-id').value = app.id;
        document.getElementById('applicant-name').textContent = app.userName;
        document.getElementById('applicant-details').textContent = `Email: ${app.userId} | DNI: ${user ? user.dni : 'N/A'}`;
        document.getElementById('scholarship-name').textContent = s ? s.name : 'Desconocida';
        document.getElementById('applicant-notes').textContent = app.notes || 'Sin notas adicionales.';

        document.getElementById('review-modal').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('review-modal').classList.add('hidden');
        document.getElementById('evaluationForm').reset();
    },

    submitEvaluation(status) {
        const appId = document.getElementById('review-app-id').value;
        const notes = document.getElementById('review-notes').value;
        const apps = Storage.getApplications();
        const app = apps.find(a => a.id === appId);

        if (app) {
            app.status = status;
            app.evaluatorNotes = notes;
            Storage.updateApplication(app);
            alert(`Solicitud ${status === 'approved' ? 'Aprobada' : 'Rechazada'} con éxito.`);
            this.closeModal();
            this.renderPendingApplications();
            this.renderEvaluationHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Evaluator.init());
