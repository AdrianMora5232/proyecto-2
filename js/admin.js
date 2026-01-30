/**
 * admin.js
 * Logic for the administrator dashboard.
 */
const Admin = {
    init() {
        console.log('Admin Dashboard Initialized');
        this.renderStats();
        this.renderScholarships();
    },

    renderStats() {
        const scholarCount = (Storage.get(Storage.SCHOLARSHIPS) || []).length;
        document.getElementById('total-scholarships').textContent = scholarCount;
    },

    renderScholarships() {
        const scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];
        const tbody = document.getElementById('scholarships-table-body');
        tbody.innerHTML = scholarships.map(s => `
            <tr>
                <td>${s.name}</td>
                <td><span class="badge badge-${s.status}">${s.status === 'open' ? 'Abierta' : 'Cerrada'}</span></td>
                <td>${s.end}</td>
                <td>
                    <button class="btn btn-secondary" onclick="alert('Editar funcionalidad en desarrollo')">Editar</button>
                </td>
            </tr>
        `).join('');
    },

    closeModal(id) {
        document.getElementById(id).classList.add('hidden');
    }
};

document.addEventListener('DOMContentLoaded', () => Admin.init());
