document.addEventListener('DOMContentLoaded', function() {
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
    const profileForm = document.querySelector('.profile-pic-form-inline');
    const cancelBtn = document.getElementById('cancel-pic-btn');
    let originalAvatarHtml = '';
    let originalAvatarClass = '';
    
    if (profileAvatarLarge) {
        originalAvatarHtml = profileAvatarLarge.innerHTML;
        originalAvatarClass = profileAvatarLarge.className;
    }
    
    if (profilePicInput && profilePicBase64) {
        profilePicInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 500 * 1024) {
                    alert('File troppo grande. Max 500KB.');
                    this.value = '';
                    return;
                }
                
                if (cancelBtn) cancelBtn.style.display = 'inline-block';
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePicBase64.value = event.target.result;
                    
                    if (profileAvatarLarge) {
                        profileAvatarLarge.innerHTML = `<img src="${event.target.result}" alt="Profile">`;
                        profileAvatarLarge.classList.add('profile-avatar-img');
                    }
                };
                reader.onerror = function() {
                    alert('Errore nella lettura del file');
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
            });
        }
        
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                if (!profilePicBase64.value) {
                    e.preventDefault();
                    alert('Seleziona una foto prima di salvare');
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