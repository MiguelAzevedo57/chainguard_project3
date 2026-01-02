document.addEventListener('DOMContentLoaded', function() {
    // Configurar seletor de idioma
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function(e) {
            translator.setLanguage(e.target.value);
        });
    }

    const ctx = document.getElementById('bitcoinChart').getContext('2d');
    // Dados fictícios de preços da Bitcoin
    const labels = [];
    for (let i = 0; i < 100; i++) {
        labels.push(i);
    }
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Bitcoin Price',
                data: generateRandomData(100, 30000, 60000),
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            },
            {
                label: 'Bitcoin Price Drop',
                data: generateRandomData(100, 20000, 50000),
                borderColor: '#FF1453',
                backgroundColor: 'rgba(255, 20, 83, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }
        ]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            animation: {
                duration: 20000,
                easing: 'linear'
            }
        }
    };
    const bitcoinChart = new Chart(ctx, config);
    function generateRandomData(count, min, max) {
        const data = [];
        let lastValue = Math.random() * (max - min) + min;
        data.push(lastValue);
        for (let i = 1; i < count; i++) {
            const change = (Math.random() - 0.5) * (max - min) * 0.1;
            lastValue += change;
            lastValue = Math.max(min, Math.min(max, lastValue));
            data.push(lastValue);
        }
        return data;
    }
    const form = document.getElementById("transactionForm")
    if(form){
        form.addEventListener("submit", async function(e) {
            e.preventDefault();

            const resultDiv = document.getElementById("result");
            resultDiv.style.display = "block";
            resultDiv.innerHTML = translator.t('result.validating');
            resultDiv.className = "result";

            try {
                const chainElement = document.getElementById("chain");
                const chain = chainElement.value;
                const txhash = document.getElementById("txHashinput").value.trim();
                const expdest = document.getElementById("expectedDestinationinput").value.trim();
                const amountInput = document.getElementById("expectedAmountinput").value;

                console.log("Iniciando validação para:", chain);

                if (!chain) throw new Error("Selecione uma Chain válida.");
                let result = await validateTx(chain, txhash, expdest, amountInput);
                if (!result) throw new Error("A função não retornou dados.");

                let { dest_bool, am_bool, dest, am } = result;
                if (dest_bool === 0 && am_bool === 0 && dest === null && am === null){
                    resultDiv.innerHTML = `<strong>${translator.t('result.notFound')}</strong><br>`;
                    resultDiv.className = "result error";
                } else if (dest_bool === 0 || am_bool === 0 ){
                    let displayDest = dest || "N/A";
                    let displayAm = am !== null ? am : "N/A";

                    resultDiv.innerHTML = `<strong>${translator.t('result.wrongData')}</strong>
                                            <table style="width:100%; margin-top:10px; border-collapse: collapse;">   
                                                <tr>
                                                  <th style="text-align:left; border-bottom:1px solid #ddd;">${translator.t('result.expected')}</th>
                                                  <th style="text-align:left; border-bottom:1px solid #ddd;">${translator.t('result.real')}</th>
                                                </tr>
                                                <tr>
                                                    <td>${translator.t('result.dest')} ${expdest.substring(0,10)}... <span style="font-weight:bold; color:${dest_bool?'green':'red'}">${dest_bool?translator.t('result.ok'):translator.t('result.wrong')}</span></td>
                                                    <td>${translator.t('result.dest')} ${displayDest.substring(0,10)}... </td>
                                                </tr>
                                                <tr>
                                                    <td>${translator.t('result.value')} ${amountInput}<span style="font-weight:bold; color:${am_bool?'green':'red'}">${am_bool?translator.t('result.ok'):translator.t('result.wrong')}</span></td>
                                                    <td>${translator.t('result.value')} ${displayAm} </td>
                                                </tr>
                                            </table>`;
                    resultDiv.className = "result wrong_data";
                } else if (dest_bool === 1 && am_bool === 1){
                    resultDiv.innerHTML = `<strong>${translator.t('result.valid')}</strong>`;
                    resultDiv.className = "result success";
                }

            } catch (error) {
                console.error("Erro Fatal:", error);
                resultDiv.innerHTML = `<strong>${translator.t('result.error')}</strong> ${error.message}`;
                resultDiv.className = "result error";
            }

        });
    }
});
