document.addEventListener('DOMContentLoaded', function() {
            const changePasswordBtn = document.getElementById('changePasswordBtn');
            const passwordChangeForm = document.getElementById('passwordChangeForm');
            const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');

            if (changePasswordBtn) {
                changePasswordBtn.addEventListener('click', function() {
                    passwordChangeForm.style.display = 'block';
                    changePasswordBtn.style.display = 'none';
                });
            }

            if (cancelPasswordBtn) {
                cancelPasswordBtn.addEventListener('click', function() {
                    passwordChangeForm.style.display = 'none';
                    changePasswordBtn.style.display = 'inline-flex';
                    document.getElementById('currentPassword').value = '';
                    document.getElementById('newPassword').value = '';
                    document.getElementById('confirmPassword').value = '';
                });
            }

            const cancelPremiumForm = document.querySelector('form[action="/profile/cancel-premium"]');
            if (cancelPremiumForm) {
                cancelPremiumForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    showConfirm('Sei sicuro di voler annullare il tuo abbonamento Premium?', function() {
                        cancelPremiumForm.submit();
                    });
                });
            }

            const removePicForm = document.getElementById('removePicForm');
            if (removePicForm) {
                removePicForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    showConfirm('Sei sicuro di voler rimuovere la foto profilo?', function() {
                        removePicForm.submit();
                    });
                });
            }
        });