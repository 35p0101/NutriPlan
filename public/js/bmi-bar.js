document.addEventListener('DOMContentLoaded', function() {
    const bmiBar = document.querySelector('.bmi-bar');
    if (bmiBar) {
        bmiBar.style.opacity = '0';
        setTimeout(() => {
            bmiBar.style.transition = 'opacity 0.5s ease';
            bmiBar.style.opacity = '1';
        }, 100);
    }

    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        if (match) {
            const target = parseInt(match[0]);
            el.textContent = '0';
            el.style.animation = `countUp 0.5s ease forwards`;
            el.style.setProperty('--target', target);
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes countUp {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});