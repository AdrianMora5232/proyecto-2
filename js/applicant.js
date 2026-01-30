/**
 * applicant.js
 * Logic for the applicant dashboard.
 */

const Applicant = {
    init() {
        console.log('Applicant Dashboard Initialized');
        this.renderScholarships();
        this.renderHistory();
        this.setupForm();
    },

    renderScholarships() {
        const scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];
        const grid = document.getElementById('scholarships-grid');
        grid.innerHTML = scholarships.map(s => `
            <div class="card">
                <h3>${s.name}</h3>
                <p>${s.description}</p>
                <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <span class="badge badge-open">Monto: $${s.amount}</span>
                    <button class="btn btn-primary" onclick="Applicant.openModal('${s.id}', '${s.name}')">Postular</button>
                </div>
            </div>
        `).join('');
    },

    renderHistory() {
        const apps = Storage.getApplications();
        const user = Storage.getCurrentUser();
        const scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];

        const myApps = apps.filter(a => a.userId === user.email);
        const tbody = document.getElementById('history-table-body');

        tbody.innerHTML = myApps.map(a => {
            const s = scholarships.find(scholar => scholar.id === a.scholarshipId);
            return `
                <tr>
                    <td>${s ? s.name : 'Desconocida'}</td>
                    <td>${a.date}</td>
                    <td><span class="badge badge-${a.status}">${a.status}</span></td>
                    <td>${a.evaluatorNotes || 'Pendiente de revisión'}</td>
                </tr>
            `;
        }).join('');
    },

    openModal(id, name) {
        document.getElementById('app-s-id').value = id;
        document.getElementById('modal-title').textContent = `Postular a: ${name}`;
        document.getElementById('app-modal').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('app-modal').classList.add('hidden');
        document.getElementById('applicationForm').reset();
    },

    setupForm() {
        const form = document.getElementById('applicationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const sId = document.getElementById('app-s-id').value;
                const notes = document.getElementById('app-notes').value;
                const user = Storage.getCurrentUser();

                const newApp = {
                    id: Date.now().toString(),
                    scholarshipId: sId,
                    userId: user.email,
                    userName: user.name,
                    notes: notes,
                    date: new Date().toLocaleDateString(),
                    status: 'pending'
                };

                Storage.saveApplication(newApp);
                alert('Postulación enviada con éxito');
                this.closeModal();
                this.renderHistory();
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Applicant.init());
