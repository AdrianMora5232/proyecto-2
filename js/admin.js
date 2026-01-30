/**
 * admin.js
 * Logic for the administrator dashboard.
 */
const Admin = {
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
    },

    renderScholarships: () => {
        const list = Storage.getScholarships();
        const tbody = document.getElementById('scholarships-table-body');
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
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

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
        }
    }
};

document.addEventListener('DOMContentLoaded', Admin.init);