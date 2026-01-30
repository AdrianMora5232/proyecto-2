/**
 * applicant.js
 * Logic for the applicant dashboard.
 */

const Applicant = {
    init() {
        console.log('Applicant Dashboard Initialized');
        this.renderScholarships();
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
                    <button class="btn btn-primary" onclick="alert('Postulación enviada correctamente')">Postular</button>
                </div>
            </div>
        `).join('');
    },

    closeModal() {
        document.getElementById('app-modal').classList.add('hidden');
    }
};

document.addEventListener('DOMContentLoaded', () => Applicant.init());
