document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.alert').forEach(function(alert) {
        setTimeout(function() {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(20px)';
            setTimeout(function() {
                alert.remove();
            }, 300);
        }, 3000);
    });

    const modal = document.getElementById('confirmModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    let modalCallback = null;

    window.showConfirm = function(message, onConfirm) {
        if (!modal) return onConfirm ? onConfirm() : null;
        modalMessage.textContent = message;
        modal.style.display = 'flex';
        modalCallback = onConfirm;
    };

    window.hideModal = function() {
        if (modal) modal.style.display = 'none';
        modalCallback = null;
    };

    if (modalCancel) {
        modalCancel.addEventListener('click', hideModal);
    }

    if (modalConfirm) {
        modalConfirm.addEventListener('click', function() {
            if (modalCallback) modalCallback();
            hideModal();
        });
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) hideModal();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') hideModal();
    });

    const currentPage = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });

    const navMenuToggle = document.querySelector('.nav-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navMenuToggle && navMenu) {
        navMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', openSidebar);
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSidebar();
    });

    const logoutForms = document.querySelectorAll('form[action*="logout"]');
    logoutForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            fetch(this.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then(() => {
                window.location.href = '/';
            });
        });
    });

    const profilePicInput = document.getElementById('profile_picture');
    const profilePicBase64 = document.getElementById('profile_picture_base64');
    const profileAvatarLarge = document.querySelector('.profile-avatar-large');
    const updateForm = document.querySelector('.update-pic-form');
    const cancelBtn = document.getElementById('cancel-pic-btn');
    const changePhotoLabel = document.querySelector('label[for="profile_picture"]');
    const removePicForm = document.querySelector('.remove-pic-form');
    let originalAvatarHtml = '';
    let originalAvatarClass = '';
    
    if (profileAvatarLarge) {
        originalAvatarHtml = profileAvatarLarge.innerHTML;
        originalAvatarClass = profileAvatarLarge.className;
    }
    
    if (profilePicInput && profilePicBase64) {
        const saveBtn = document.getElementById('save-pic-btn');

        profilePicInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showMessage('File troppo grande. Max 2MB.', 'error');
                    this.value = '';
                    return;
                }

                if (cancelBtn) cancelBtn.style.display = 'inline-block';
                if (saveBtn) saveBtn.style.display = 'inline-block';
                if (changePhotoLabel) changePhotoLabel.style.display = 'none';
                if (removePicForm) removePicForm.style.display = 'none';

                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePicBase64.value = event.target.result;

                    if (profileAvatarLarge) {
                        profileAvatarLarge.innerHTML = `<img src="${event.target.result}" alt="Profile">`;
                        profileAvatarLarge.classList.add('profile-avatar-img');
                    }
                };
                reader.onerror = function() {
                    showMessage('Errore nella lettura del file', 'error');
                };
                reader.readAsDataURL(file);
            }
        });

        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                profilePicInput.value = '';
                profilePicBase64.value = '';
                if (profileAvatarLarge) {
                    profileAvatarLarge.innerHTML = originalAvatarHtml;
                    profileAvatarLarge.className = originalAvatarClass;
                }
                cancelBtn.style.display = 'none';
                if (saveBtn) saveBtn.style.display = 'none';
                if (changePhotoLabel) changePhotoLabel.style.display = '';
                if (removePicForm) removePicForm.style.display = '';
            });
        }

        if (updateForm) {
            updateForm.addEventListener('submit', function(e) {
                if (!profilePicBase64.value) {
                    e.preventDefault();
                    showMessage('Seleziona una foto prima di salvare', 'error');
                } else {
                    if (saveBtn) saveBtn.style.display = 'none';
                    if (cancelBtn) cancelBtn.style.display = 'none';
                    if (changePhotoLabel) changePhotoLabel.style.display = 'none';
                    if (removePicForm) removePicForm.style.display = 'none';
                }
            });
        }
    }
});

function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 1000; max-width: 400px;';

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = start + (range * easeProgress);

        element.textContent = current.toFixed(1);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}