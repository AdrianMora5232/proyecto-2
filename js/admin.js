/**
 * admin.js
 * Logic for the administrator dashboard.
 */

const Admin = {
    init() {
        console.log('Admin Dashboard Initialized');
        this.setupEventListeners();
        this.renderStats();
        this.renderScholarships();
        this.renderEvaluators();
    },

    renderEvaluators() {
        const users = Storage.getUsers();
        const evaluators = users.filter(u => u.role === 'evaluator');
        const list = document.getElementById('evaluators-list');

        if (!list) return;

        if (evaluators.length === 0) {
            list.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No hay evaluadores registrados.</p>';
            return;
        }

        list.innerHTML = evaluators.map(e => `
            <div class="card" style="padding: 1.5rem; border-left: 4px solid var(--primary);">
                <h4 style="margin-bottom: 0.25rem;">${e.name}</h4>
                <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem;">${e.email}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
                    <span>ID: ${e.workerId || 'N/A'}</span>
                    <span class="badge badge-primary" style="background: var(--primary-light); color: white;">Evaluador</span>
                </div>
            </div>
        `).join('');
    },

    setupEventListeners() {
        const openModalBtn = document.getElementById('openScholarshipModal');
        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => {
                this.openModal('scholarshipModal');
            });
        }

        const form = document.getElementById('scholarshipForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveScholarship();
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Auth.logout();
            });
        }
    },

    renderStats() {
        const scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];
        const users = Storage.getUsers();
        const applications = Storage.get(Storage.APPLICATIONS) || [];

        document.getElementById('total-scholarships').textContent = scholarships.length;
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('total-applications').textContent = applications.length;
    },

    renderScholarships() {
        const scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];
        const tbody = document.getElementById('scholarships-table-body');

        if (!tbody) return;

        if (scholarships.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hay convocatorias registradas</td></tr>';
            return;
        }

        tbody.innerHTML = scholarships.map(s => `
            <tr>
                <td>${s.name}</td>
                <td><span class="badge badge-${s.status}">${s.status === 'open' ? 'Abierta' : 'Cerrada'}</span></td>
                <td>${s.end}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="Admin.editScholarship('${s.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="Admin.deleteScholarship('${s.id}')">Eliminar</button>
                </td>
            </tr>
        `).join('');
    },

    saveScholarship() {
        const id = document.getElementById('s-id').value || Date.now().toString();
        const scholarship = {
            id,
            name: document.getElementById('s-name').value,
            description: document.getElementById('s-description').value,
            type: document.getElementById('s-type').value,
            amount: document.getElementById('s-amount').value,
            start: document.getElementById('s-start').value,
            end: document.getElementById('s-end').value,
            status: document.getElementById('s-status').value,
            reqs1: document.getElementById('s-reqs1').value,
            reqs2: document.getElementById('s-reqs2').value,
            reqs3: document.getElementById('s-reqs3').value,
            reqs4: document.getElementById('s-reqs4').value,
            crit1: document.getElementById('s-crit1').value,
            crit2: document.getElementById('s-crit2').value,
            crit3: document.getElementById('s-crit3').value,
            crit4: document.getElementById('s-crit4').value,
        };

        let scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];

        const index = scholarships.findIndex(s => s.id === id);
        if (index > -1) {
            scholarships[index] = scholarship;
        } else {
            scholarships.push(scholarship);
        }

        Storage.save(Storage.SCHOLARSHIPS, scholarships);
        this.closeModal('scholarshipModal');
        this.renderScholarships();
        this.renderStats();

        document.getElementById('scholarshipForm').reset();
        document.getElementById('s-id').value = '';
    },

    editScholarship(id) {
        const scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];
        const s = scholarships.find(s => s.id === id);

        if (s) {
            document.getElementById('s-id').value = s.id;
            document.getElementById('s-name').value = s.name;
            document.getElementById('s-description').value = s.description;
            document.getElementById('s-type').value = s.type;
            document.getElementById('s-amount').value = s.amount;
            document.getElementById('s-start').value = s.start;
            document.getElementById('s-end').value = s.end;
            document.getElementById('s-status').value = s.status;
            document.getElementById('s-reqs1').value = s.reqs1 || '';
            document.getElementById('s-reqs2').value = s.reqs2 || '';
            document.getElementById('s-reqs3').value = s.reqs3 || '';
            document.getElementById('s-reqs4').value = s.reqs4 || '';
            document.getElementById('s-crit1').value = s.crit1 || '';
            document.getElementById('s-crit2').value = s.crit2 || '';
            document.getElementById('s-crit3').value = s.crit3 || '';
            document.getElementById('s-crit4').value = s.crit4 || '';
            this.openModal('scholarshipModal');
        }
    },

    deleteScholarship(id) {
        if (confirm('¿Estás seguro de eliminar esta convocatoria?')) {
            let scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];
            scholarships = scholarships.filter(s => s.id !== id);
            Storage.save(Storage.SCHOLARSHIPS, scholarships);
            this.renderScholarships();
            this.renderStats();
        }
    },

    openModal(id) {
        document.getElementById(id).classList.remove('hidden');
    },

    closeModal(id) {
        document.getElementById(id).classList.add('hidden');
        if (id === 'scholarshipModal') {
            document.getElementById('scholarshipForm').reset();
            document.getElementById('s-id').value = '';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Admin.init());
