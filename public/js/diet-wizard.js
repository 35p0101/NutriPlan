document.addEventListener('DOMContentLoaded', function() {
    const step1Form = document.getElementById('step1Form');
    const step2Form = document.getElementById('step2Form');
    const generateForm = document.getElementById('generateForm');

    if (generateForm) {
        const spinner = generateForm.querySelector('.spinner');
        const submitBtn = generateForm.querySelector('button[type="submit"]');

        generateForm.addEventListener('submit', function(e) {
            if (submitBtn.disabled) {
                e.preventDefault();
                return;
            }

            submitBtn.disabled = true;
            if (spinner) spinner.classList.add('active');
            submitBtn.querySelector('.btn-text').textContent = 'Generazione...';
        });
    }

    const inputs = document.querySelectorAll('.diet-form input, .diet-form select');
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            this.classList.add('input-error');
        });

        input.addEventListener('input', function() {
            this.classList.remove('input-error');
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        .input-error {
            border-color: #f87171 !important;
        }
    `;
    document.head.appendChild(style);
});