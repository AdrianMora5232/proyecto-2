/**
 * admin.js
 * Logic for the administrator dashboard.
 */

const Admin = {
<<<<<<< HEAD
    init: () => {
        Admin.renderDashboard();
        Admin.renderScholarships();
        Admin.renderEvaluators();

        // Event Listeners
        document.getElementById('logoutBtn').addEventListener('click', Auth.logout);

        // Modal Handlers
        document.getElementById('openScholarshipModal').addEventListener('click', () => {
            Admin.openModal('scholarshipModal');
        });

        document.getElementById('scholarshipForm').addEventListener('submit', Admin.handleScholarshipSubmit);
    },

    renderDashboard: () => {
        const users = Storage.getUsers();
        const scholarships = Storage.getScholarships();
        const applications = Storage.getApplications();

        document.getElementById('total-scholarships').textContent = scholarships.length;
        document.getElementById('total-applications').textContent = applications.length;
        document.getElementById('total-users').textContent = users.length;
=======
    init() {
        console.log('Admin Dashboard Initialized');
        this.setupEventListeners();
        this.renderStats();
        this.renderScholarships();
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
>>>>>>> 3f670e62f0bc87bdc4b91c3c90940bd311726ee0
    },

    renderScholarships: () => {
        const list = Storage.getScholarships();
        const tbody = document.getElementById('scholarships-table-body');
<<<<<<< HEAD
        tbody.innerHTML = '';

        list.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td><span class="badge ${item.status === 'open' ? 'badge-open' : 'badge-closed'}">${item.status}</span></td>
                <td>${item.startDate} - ${item.endDate}</td>
                <td>
                    <button class="btn btn-secondary" onclick="Admin.editScholarship('${item.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="Admin.deleteScholarship('${item.id}')">Eliminar</button>
=======

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
>>>>>>> 3f670e62f0bc87bdc4b91c3c90940bd311726ee0
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

<<<<<<< HEAD
    handleScholarshipSubmit: (e) => {
        e.preventDefault();
        const id = document.getElementById('s-id').value || Date.now().toString();
        const name = document.getElementById('s-name').value;
        const description = document.getElementById('s-description').value;
        const type = document.getElementById('s-type').value;
        const amount = document.getElementById('s-amount').value;
        const startDate = document.getElementById('s-start').value;
        const endDate = document.getElementById('s-end').value;
        const status = document.getElementById('s-status').value;

        // Requirements split by newline
        const requirements = document.getElementById('s-reqs').value.split('\n').filter(r => r.trim() !== '');

        const newScholarship = {
            id, name, description, type, amount, startDate, endDate, status, requirements
        };

        let scholarships = Storage.getScholarships();
        const existingIndex = scholarships.findIndex(s => s.id === id);

        if (existingIndex >= 0) {
            scholarships[existingIndex] = newScholarship;
        } else {
            scholarships.push(newScholarship);
        }

        Storage.setScholarships(scholarships);
        Admin.closeModal('scholarshipModal');
        Admin.renderScholarships();
        Admin.renderDashboard();
    },

    editScholarship: (id) => {
        const scholarships = Storage.getScholarships();
        const item = scholarships.find(s => s.id === id);
        if (!item) return;

        document.getElementById('s-id').value = item.id;
        document.getElementById('s-name').value = item.name;
        document.getElementById('s-description').value = item.description;
        document.getElementById('s-type').value = item.type;
        document.getElementById('s-amount').value = item.amount;
        document.getElementById('s-start').value = item.startDate;
        document.getElementById('s-end').value = item.endDate;
        document.getElementById('s-status').value = item.status;
        document.getElementById('s-reqs').value = item.requirements.join('\n');

        Admin.openModal('scholarshipModal', 'Editar Convocatoria');
    },

    deleteScholarship: (id) => {
        if (!confirm('¿Estás seguro de eliminar esta convocatoria?')) return;

        let scholarships = Storage.getScholarships();
        scholarships = scholarships.filter(s => s.id !== id);
        Storage.setScholarships(scholarships);
        Admin.renderScholarships();
        Admin.renderDashboard();
    },

    renderEvaluators: () => {
        const users = Storage.getUsers();
        const evaluators = users.filter(u => u.role === 'evaluator');
        const listDiv = document.getElementById('evaluators-list');
        listDiv.innerHTML = '';

        evaluators.forEach(u => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <h4>${u.name}</h4>
                <p class="text-muted">${u.email}</p>
            `;
            listDiv.appendChild(div);
        });
    },

    /* UI Helpers */
    openModal: (modalId, title = null) => {
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
        if (title) modal.querySelector('h2').textContent = title;
    },

    closeModal: (modalId) => {
        document.getElementById(modalId).classList.add('hidden');
        // Reset form if it exists
        const form = document.querySelector(`#${modalId} form`);
        if (form) {
            form.reset();
            document.getElementById('s-id').value = ''; // Clear hidden ID
            modalId === 'scholarshipModal' && (document.querySelector('#scholarshipModal h2').textContent = 'Nueva Convocatoria');
=======
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
>>>>>>> 3f670e62f0bc87bdc4b91c3c90940bd311726ee0
        }
    }
};

document.addEventListener('DOMContentLoaded', Admin.init);