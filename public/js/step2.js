document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('dietForm');
    const formError = document.getElementById('formError');

    if (form) {
        const weightSlider = document.getElementById('weight');
        const heightSlider = document.getElementById('height');
        const weightValue = document.getElementById('weightValue');
        const heightValue = document.getElementById('heightValue');
        const activitySelect = document.getElementById('activity');

        weightSlider.addEventListener('input', function() {
            weightValue.textContent = parseFloat(this.value).toFixed(1);
            if (this.classList.contains('input-error')) {
                validateWeight();
            }
        });

        heightSlider.addEventListener('input', function() {
            heightValue.textContent = this.value;
            if (this.classList.contains('input-error')) {
                validateHeight();
            }
        });

        activitySelect.addEventListener('change', function() {
            if (this.classList.contains('input-error')) {
                validateActivity();
            }
        });

        function validateWeight() {
            const value = parseFloat(weightSlider.value);
            const errorEl = document.getElementById('weight-error');

            if (value < 30 || value > 200) {
                weightSlider.classList.add('input-error');
                errorEl.textContent = 'Peso non valido (30-200 kg)!';
                return false;
            }

            weightSlider.classList.remove('input-error');
            errorEl.textContent = '';
            return true;
        }

        function validateHeight() {
            const value = parseInt(heightSlider.value);
            const errorEl = document.getElementById('height-error');

            if (value < 100 || value > 220) {
                heightSlider.classList.add('input-error');
                errorEl.textContent = 'Altezza non valida (100-220 cm)!';
                return false;
            }

            heightSlider.classList.remove('input-error');
            errorEl.textContent = '';
            return true;
        }

        function validateActivity() {
            const value = activitySelect.value;
            const errorEl = document.getElementById('activity-error');

            if (!value) {
                activitySelect.classList.add('input-error');
                errorEl.textContent = 'Campo "Attività fisica" da compilare!';
                return false;
            }

            activitySelect.classList.remove('input-error');
            errorEl.textContent = '';
            return true;
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;

            if (!validateWeight()) isValid = false;
            if (!validateHeight()) isValid = false;
            if (!validateActivity()) isValid = false;

            if (!isValid) {
                formError.textContent = 'Compila tutti i campi correttamente!';
                formError.style.display = 'block';
                return;
            }

            form.submit();
        });
    }
});