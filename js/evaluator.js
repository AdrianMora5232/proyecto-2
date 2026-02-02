/**
 * evaluator.js
 * Logic for the evaluator dashboard.
 */
const Evaluator = {
    init() {
        console.log('Evaluator Dashboard Initialized');
        this.renderPendingApplications();
        this.renderEvaluationHistory();
        this.setupScoreCalculation();
    },

    setupScoreCalculation() {
        const inputs = document.querySelectorAll('.score-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateScoreTotal());
        });
    },

    updateScoreTotal() {
        const scoreEcon = parseInt(document.getElementById('score-econ').value) || 0;
        const scoreAcad = parseInt(document.getElementById('score-acad').value) || 0;
        const scoreSoc = parseInt(document.getElementById('score-soc').value) || 0;

        const total = scoreEcon + scoreAcad + scoreSoc;
        const totalDisplay = document.getElementById('score-total');
        totalDisplay.textContent = total;

        if (total < 70) {
            totalDisplay.style.color = 'var(--danger)';
        } else {
            totalDisplay.style.color = 'var(--success)';
        }
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
                    <td>${(a.reason || '').substring(0, 30)}${(a.reason || '').length > 30 ? '...' : ''}</td>
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
                    <td><strong>${a.totalScore || 0}/100</strong></td>
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
        document.getElementById('applicant-gpa').textContent = `${app.gpa || 'N/A'}`;
        document.getElementById('applicant-details').textContent = `Email: ${app.userId} | Tel: ${app.phone || 'N/A'}`;
        document.getElementById('applicant-amount').textContent = `$${app.amountRequested || '0'}`;
        document.getElementById('scholarship-name').textContent = s ? s.name : 'Desconocida';
        document.getElementById('applicant-dates').textContent = `${app.startDate ? new Date(app.startDate).toLocaleString() : ''} - ${app.endDate ? new Date(app.endDate).toLocaleString() : ''}`;
        document.getElementById('applicant-reason').textContent = app.reason || 'Sin justificación.';

        document.getElementById('review-modal').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('review-modal').classList.add('hidden');
        document.getElementById('evaluationForm').reset();
        document.getElementById('score-total').textContent = '0';
    },

    submitEvaluation(status) {
        const appId = document.getElementById('review-app-id').value;
        const notes = document.getElementById('review-notes').value;

        const scoreEcon = parseInt(document.getElementById('score-econ').value) || 0;
        const scoreAcad = parseInt(document.getElementById('score-acad').value) || 0;
        const scoreSoc = parseInt(document.getElementById('score-soc').value) || 0;

        if (scoreEcon < 0 || scoreEcon > 40 || scoreAcad < 0 || scoreAcad > 30 || scoreSoc < 0 || scoreSoc > 30) {
            alert('Por favor, ingrese puntajes dentro de los rangos permitidos.');
            return;
        }

        const totalScore = scoreEcon + scoreAcad + scoreSoc;

        if (totalScore < 70) {
            alert('El puntaje total debe ser al menos de 70 para enviar la evaluación.');
            return;
        }

        const apps = Storage.getApplications();
        const app = apps.find(a => a.id === appId);

        if (app) {
            app.status = status;
            app.evaluatorNotes = notes;
            app.scores = { econ: scoreEcon, acad: scoreAcad, soc: scoreSoc };
            app.totalScore = totalScore;

            Storage.updateApplication(app);
            alert(`Solicitud ${status === 'approved' ? 'Aprobada' : 'Rechazada'} con éxito. Puntaje Total: ${totalScore}/100`);
            this.closeModal();
            this.renderPendingApplications();
            this.renderEvaluationHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Evaluator.init());
