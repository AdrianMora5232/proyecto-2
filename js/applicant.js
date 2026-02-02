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
        const apps = Storage.getApplications();
        const user = Storage.getCurrentUser();
        const grid = document.getElementById('scholarships-grid');

        grid.innerHTML = scholarships.map(s => {
            const alreadyApplied = apps.find(a => a.userId === user.email && a.scholarshipId === s.id);
            return `
                <div class="card">
                    <h3>${s.name}</h3>
                    <p>${s.description}</p>
                    <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <span class="badge badge-open">Monto: $${s.amount}</span>
                        ${alreadyApplied
                    ? `<button class="btn btn-secondary" disabled style="cursor: not-allowed; opacity: 0.7;">Ya postulado</button>`
                    : `<button class="btn btn-primary" onclick="Applicant.openModal('${s.id}', '${s.name}')">Postular</button>`
                }
                    </div>
                </div>
            `;
        }).join('');
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
        const scholarships = Storage.get(Storage.SCHOLARSHIPS) || [];
        const s = scholarships.find(item => item.id === id);
        const user = Storage.getCurrentUser();
        const apps = Storage.getApplications();

        // Safety check
        if (apps.find(a => a.userId === user.email && a.scholarshipId === id)) {
            alert('Ya has postulado a esta beca.');
            return;
        }

        document.getElementById('app-s-id').value = id;
        document.getElementById('modal-title').textContent = `Postular a: ${name}`;
        if (s) {
            document.getElementById('app-s-type').value = s.type === 'academic' ? 'Académica' : (s.type === 'economic' ? 'Económica' : 'Social');
        }

        // Pre-fill user data
        if (user) {
            document.getElementById('app-name').value = user.name || '';
            document.getElementById('app-phone').value = user.phone || '';
        }

        document.getElementById('app-modal').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('app-modal').classList.add('hidden');
        document.getElementById('applicationForm').reset();
        document.getElementById('guardian-fields').classList.add('hidden');
    },

    setupForm() {
        const form = document.getElementById('applicationForm');
        const isMinorCheckbox = document.getElementById('app-is-minor');
        const guardianFields = document.getElementById('guardian-fields');

        if (isMinorCheckbox) {
            isMinorCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    guardianFields.classList.remove('hidden');
                    document.getElementById('app-guardian-name').required = true;
                    document.getElementById('app-guardian-dni').required = true;
                } else {
                    guardianFields.classList.add('hidden');
                    document.getElementById('app-guardian-name').required = false;
                    document.getElementById('app-guardian-dni').required = false;
                }
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const gpa = parseFloat(document.getElementById('app-gpa').value);
                if (gpa < 80) {
                    alert('Error: El promedio mínimo debe ser mayor a 80.');
                    return;
                }

                const sId = document.getElementById('app-s-id').value;
                const user = Storage.getCurrentUser();

                const newApp = {
                    id: Date.now().toString(),
                    scholarshipId: sId,
                    userId: user.email,
                    userName: document.getElementById('app-name').value,
                    dni: user.dni,
                    phone: document.getElementById('app-phone').value,
                    gpa: gpa,
                    amountRequested: document.getElementById('app-amount').value,
                    isMinor: document.getElementById('app-is-minor').checked,
                    guardianName: document.getElementById('app-guardian-name').value,
                    guardianDni: document.getElementById('app-guardian-dni').value,
                    reason: document.getElementById('app-reason').value,
                    date: new Date().toLocaleDateString(),
                    status: 'pending'
                };

                Storage.saveApplication(newApp);
                alert('Postulación enviada con éxito');
                this.closeModal();
                this.renderHistory();
                this.renderScholarships();
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Applicant.init());
