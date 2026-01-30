/**
 * evaluator.js
 * Logic for the evaluator dashboard.
 */
const Evaluator = {
    init() {
        console.log('Evaluator Dashboard Initialized');
    },

    closeModal() {
        document.getElementById('review-modal').classList.add('hidden');
    },

    submitEvaluation(status) {
        alert(`Evaluación guardada como: ${status}`);
        this.closeModal();
    }
};

document.addEventListener('DOMContentLoaded', () => Evaluator.init());
