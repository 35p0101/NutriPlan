document.getElementById('calc-bmi-btn')?.addEventListener('click', function() {
        const weight = parseFloat(document.getElementById('bmi-weight').value);
        const height = parseFloat(document.getElementById('bmi-height').value);

        if (!weight || !height || weight <= 0 || height <= 0) {
            return;
        }

        const bmi = weight / Math.pow(height / 100, 2);
        const bmiFixed = bmi.toFixed(1);

        let category = '';
        if (bmi < 18.5) category = 'Sottopeso';
        else if (bmi < 25) category = 'Normopeso';
        else if (bmi < 30) category = 'Sovrappeso';
        else category = 'Obeso';

        document.getElementById('bmi-value-num').textContent = bmiFixed;
        document.getElementById('bmi-category').textContent = category;
        document.getElementById('bmi-result').style.display = 'block';
    });