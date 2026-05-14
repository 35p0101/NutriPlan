document.addEventListener('DOMContentLoaded', function() {
    const regenerateBtn = document.getElementById('regenerateBtn');
    const mealPlanGrid = document.getElementById('mealPlanGrid');

    if (regenerateBtn && mealPlanGrid) {
        regenerateBtn.addEventListener('click', async function() {
            regenerateBtn.disabled = true;
            regenerateBtn.innerHTML = `
                <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 4v6h-6M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                Rigenerazione...
            `;

            try {
                const response = await fetch('/dashboard/regenerate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Errore nella rigenerazione');
                }

                const data = await response.json();

                if (data.plan) {
                    updateMealPlanGrid(data.plan);

                    const regenerateIcon = regenerateBtn.querySelector('svg');
                    if (regenerateIcon) {
                        regenerateIcon.style.color = 'var(--green-soft)';
                    }
                }
            } catch (error) {
                console.error('Rigenerazione fallita:', error);
                showToast('Errore durante la rigenerazione del piano. Riprova.', 'error');
            } finally {
                regenerateBtn.disabled = false;
                regenerateBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 4v6h-6M1 20v-6h6"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                    Rigenera
                `;
            }
        });
    }

    function updateMealPlanGrid(plan) {
        const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        const todayIndex = new Date().getDay();
        const dayMap = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
        const targetCalories = parseInt(mealPlanGrid.dataset.targetCalories) || 2000;
        const today = dayMap[todayIndex];

        mealPlanGrid.innerHTML = giorni.map((giorno, i) => {
            const isToday = today === i;
            const dayData = plan[giorno] || {};
            const isSgarro = dayData.isSgarro;

            const colazione = dayData.colazione;
            const spuntino1 = dayData.spuntino1;
            const pranzo = dayData.pranzo;
            const spuntino2 = dayData.spuntino2;
            const spuntino3 = dayData.spuntino3;
            const cena = dayData.cena;

            const totalCal = (colazione?.calorie || 0) + (spuntino1?.calorie || 0) + (pranzo?.calorie || 0) + (spuntino2?.calorie || 0) + (spuntino3?.calorie || 0) + (cena?.calorie || 0);
            const calDiff = targetCalories - totalCal;
            const calClass = isSgarro ? 'calories-sgarro' : (Math.abs(calDiff) < 200 ? 'calories-ok' : (calDiff > 0 ? 'calories-low' : 'calories-high'));

            const getMealLink = (meal) => {
                if (meal && meal.nome) {
                    let html = `<a href="/meal/${encodeURIComponent(meal.nome)}" class="meal-link">${meal.nome}</a>`;
                    if (meal.totalGrammi) {
                        html += `<span class="meal-grammi">${meal.totalGrammi}g</span>`;
                    }
                    return html;
                }
                return '<span class="meal-name">-</span>';
            };

            return `
                <div class="day-column ${isToday ? 'today' : ''} ${isSgarro ? 'day-sgarro' : ''}">
                    <div class="day-header">
                        ${giorno}
                        ${isToday ? '<span class="today-badge">Oggi</span>' : ''}
                        ${isSgarro ? '<span class="sgarro-badge">Sgarro</span>' : ''}
                    </div>
                    <div class="day-meals">
                        <div class="meal-slot">
                            <span class="meal-type">Colazione</span>
                            ${getMealLink(colazione)}
                        </div>
                        ${!isSgarro && spuntino1 && spuntino1.nome ? `
                        <div class="meal-slot snack">
                            <span class="meal-type">Spuntino</span>
                            ${getMealLink(spuntino1)}
                        </div>
                        ` : ''}
                        <div class="meal-slot">
                            <span class="meal-type">${isSgarro ? 'Pranzo (Sgarro)' : 'Pranzo'}</span>
                            ${getMealLink(pranzo)}
                        </div>
                        ${!isSgarro && spuntino2 && spuntino2.nome ? `
                        <div class="meal-slot snack">
                            <span class="meal-type">Spuntino</span>
                            ${getMealLink(spuntino2)}
                        </div>
                        ` : ''}
                        ${!isSgarro && spuntino3 && spuntino3.nome ? `
                        <div class="meal-slot snack">
                            <span class="meal-type">Spuntino</span>
                            ${getMealLink(spuntino3)}
                        </div>
                        ` : ''}
                        <div class="meal-slot">
                            <span class="meal-type">${isSgarro ? 'Cena (Sgarro)' : 'Cena'}</span>
                            ${getMealLink(cena)}
                        </div>
                        ${!isSgarro ? `
                        <div class="day-calories ${calClass}">
                            <span class="calories-total">${totalCal} kcal</span>
                            <span class="calories-target">Target: ${targetCalories}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        mealPlanGrid.style.animation = 'fadeIn 0.3s ease';
    }
});

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--bg-elevated);
        border: 1px solid ${type === 'error' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(123, 219, 142, 0.5)'};
        border-radius: 8px;
        color: var(--text-primary);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(20px); }
    }
    .spinner {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);