document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const formError = document.getElementById('formError');

    if (form) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');

        function validateEmail() {
            const value = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            emailInput.classList.remove('input-error');
            emailError.textContent = '';

            if (!value) {
                emailInput.classList.add('input-error');
                emailError.textContent = 'Campo "Email" da compilare!';
                return false;
            }

            if (!emailRegex.test(value)) {
                emailInput.classList.add('input-error');
                emailError.textContent = 'Email non valida!';
                return false;
            }

            return true;
        }

        function validatePassword() {
            const value = passwordInput.value;

            passwordInput.classList.remove('input-error');
            passwordError.textContent = '';

            if (!value) {
                passwordInput.classList.add('input-error');
                passwordError.textContent = 'Campo "Password" da compilare!';
                return false;
            }

            return true;
        }

        emailInput.addEventListener('blur', validateEmail);
        passwordInput.addEventListener('input', function() {
            if (passwordInput.classList.contains('input-error')) {
                validatePassword();
            }
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailValid = validateEmail();
            const passwordValid = validatePassword();

            if (!emailValid || !passwordValid) {
                formError.textContent = 'Compila tutti i campi correttamente!';
                formError.style.display = 'block';
                return;
            }

            form.submit();
        });
    }
});