document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('datePickerModal');
    const dobDisplay = document.getElementById('dob-display');
    const dobHidden = document.getElementById('dob');
    const dobBtn = document.getElementById('dob-btn');
    const dpMonth = document.getElementById('dp-month');
    const dpYear = document.getElementById('dp-year');
    const dpDays = document.getElementById('dp-days');
    const prevMonthBtn = document.getElementById('dp-prev-month');
    const nextMonthBtn = document.getElementById('dp-next-month');

    let currentDate = new Date();
    let selectedDate = null;

    const MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    if (modal && dobDisplay) {
        function openDatePicker() {
            currentDate = selectedDate ? new Date(selectedDate) : new Date();
            renderMonthYearSelects();
            renderDays();
            modal.classList.add('active');
        }

        function closeDatePicker() {
            modal.classList.remove('active');
        }

        function renderMonthYearSelects() {
            dpMonth.innerHTML = MONTHS.map((m, i) => `<option value="${i}" ${i === currentDate.getMonth() ? 'selected' : ''}>${m}</option>`).join('');

            const year = new Date().getFullYear();
            const years = [];
            for (let y = year - 120; y <= year - 13; y++) {
                years.push(`<option value="${y}" ${y === currentDate.getFullYear() ? 'selected' : ''}>${y}</option>`);
            }
            dpYear.innerHTML = years.join('');
        }

        function renderDays() {
            const year = parseInt(dpYear.value);
            const month = parseInt(dpMonth.value);
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDay = (firstDay.getDay() + 6) % 7;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() - 13);
            const minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - 120);

            let html = '';

            for (let i = 0; i < startDay; i++) {
                const prevDate = new Date(year, month, -startDay + i + 1);
                html += `<button type="button" class="dp-day other-month" disabled>${prevDate.getDate()}</button>`;
            }

            for (let d = 1; d <= lastDay.getDate(); d++) {
                const date = new Date(year, month, d);
                const isToday = date.getTime() === today.getTime();
                const isFuture = date > maxDate;
                const isTooOld = date < minDate;
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

                let classes = 'dp-day';
                if (isToday) classes += ' today';
                if (isSelected) classes += ' selected';
                if (isFuture || isTooOld) classes += ' disabled-day';

                html += `<button type="button" class="${classes}" data-day="${d}" ${isFuture || isTooOld ? 'disabled' : ''}>${d}</button>`;
            }

            const remaining = 42 - (startDay + lastDay.getDate());
            for (let i = 1; i <= remaining; i++) {
                html += `<button type="button" class="dp-day other-month" disabled>${i}</button>`;
            }

            dpDays.innerHTML = html;

            document.querySelectorAll('.dp-day:not(.disabled-day)').forEach(btn => {
                btn.addEventListener('click', function() {
                    const day = parseInt(this.dataset.day);
                    selectedDate = new Date(parseInt(dpYear.value), parseInt(dpMonth.value), day);
                    dobDisplay.value = `${String(day).padStart(2, '0')} / ${String(parseInt(dpMonth.value) + 1).padStart(2, '0')} / ${dpYear.value}`;
                    dobHidden.value = selectedDate.toISOString().split('T')[0];

                    dobDisplay.classList.remove('input-error-custom');
                    document.getElementById('dob-error').textContent = '';

                    closeDatePicker();
                });
            });
        }

        dpMonth.addEventListener('change', renderDays);
        dpYear.addEventListener('change', renderDays);

        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderMonthYearSelects();
            renderDays();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderMonthYearSelects();
            renderDays();
        });

        document.querySelector('.date-picker-overlay').addEventListener('click', closeDatePicker);
        dobBtn.addEventListener('click', openDatePicker);
        dobDisplay.addEventListener('click', openDatePicker);

        dobDisplay.addEventListener('input', function() {
            const value = this.value.replace(/\//g, '-');
            const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
            if (match) {
                const day = parseInt(match[1]);
                const month = parseInt(match[2]) - 1;
                const year = parseInt(match[3]);
                const date = new Date(year, month, day);
                if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
                    selectedDate = date;
                    dobHidden.value = date.toISOString().split('T')[0];
                    return;
                }
            }
            dobHidden.value = '';
            selectedDate = null;
        });
    }

    const form = document.getElementById('registerForm');
    const formError = document.getElementById('formError');

    if (form) {
        const fields = {
            username: { element: document.getElementById('username'), error: document.getElementById('username-error'), label: 'Username' },
            email: { element: document.getElementById('email'), error: document.getElementById('email-error'), label: 'Email' },
            password: { element: document.getElementById('password'), error: document.getElementById('password-error'), label: 'Password' },
            password_confirm: { element: document.getElementById('password_confirm'), error: document.getElementById('password_confirm-error'), label: 'Conferma password' },
            dob: { element: document.getElementById('dob-display'), error: document.getElementById('dob-error'), label: 'Data di nascita' },
            sex: { element: document.getElementById('sex'), error: document.getElementById('sex-error'), label: 'Sesso' }
        };

        function validateField(name) {
            const field = fields[name];
            if (!field) return true;

            let value = field.element.value.trim();
            if (name === 'dob') value = document.getElementById('dob').value;

            field.element.classList.remove('input-error', 'input-error-custom');
            field.error.textContent = '';
            if (formError) formError.style.display = 'none';

            if (!value) {
                field.element.classList.add(name === 'dob' ? 'input-error-custom' : 'input-error');
                field.error.textContent = `Campo "${field.label}" da compilare!`;
                return false;
            }

            if (name === 'username' && value.length < 3) {
                field.element.classList.add('input-error');
                field.error.textContent = 'Username troppo corto (min. 3 caratteri)!';
                return false;
            }

            if (name === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    field.element.classList.add('input-error');
                    field.error.textContent = 'Email non valida!';
                    return false;
                }
            }

            if (name === 'password' && value.length < 6) {
                field.element.classList.add('input-error');
                field.error.textContent = 'Password troppo corta (min. 6 caratteri)!';
                return false;
            }

            if (name === 'password_confirm') {
                const password = fields.password.element.value;
                if (value !== password) {
                    field.element.classList.add('input-error');
                    field.error.textContent = 'Le password non corrispondono!';
                    return false;
                }
            }

            if (name === 'dob') {
                const dobDate = new Date(value);
                const today = new Date();
                let age = today.getFullYear() - dobDate.getFullYear();
                const m = today.getMonth() - dobDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
                if (age < 13 || age > 120) {
                    field.element.classList.add('input-error-custom');
                    field.error.textContent = 'Età non valida (devi avere tra i 13 e i 120 anni)!';
                    return false;
                }
            }

            return true;
        }

        Object.keys(fields).forEach(name => {
            const field = fields[name];
            if (!field.element) return;
            field.element.addEventListener('blur', () => validateField(name));
            field.element.addEventListener('input', () => {
                if (field.element.classList.contains('input-error') || field.element.classList.contains('input-error-custom')) {
                    validateField(name);
                }
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            let firstInvalid = null;

            Object.keys(fields).forEach(name => {
                if (!validateField(name)) {
                    isValid = false;
                    if (!firstInvalid) {
                        firstInvalid = fields[name].element;
                    }
                }
            });

            if (!isValid) {
                if (formError) {
                    formError.textContent = 'Compila tutti i campi correttamente!';
                    formError.style.display = 'block';
                }
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return;
            }

            const profilePicInput = document.getElementById('profile_picture');
            const profilePicBase64 = document.getElementById('profile_picture_base64');
            
            if (profilePicInput && profilePicInput.files.length > 0) {
                const file = profilePicInput.files[0];
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    profilePicBase64.value = event.target.result;
                    form.submit();
                };
                
                reader.onerror = function() {
                    form.submit();
                };
                
                reader.readAsDataURL(file);
            } else {
                form.submit();
            }
        });
    }

    const profilePicInput = document.getElementById('profile_picture');
    const profilePicPreview = document.getElementById('profilePicPreview');
    
    if (profilePicInput && profilePicPreview) {
        profilePicInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showMessage('File troppo grande. Max 2MB.', 'error');
                    this.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePicPreview.innerHTML = `<img src="${event.target.result}" alt="Profile preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});