document.addEventListener('DOMContentLoaded', function() {
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
            resultDiv.innerHTML = "A validar transação...";
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
                    resultDiv.innerHTML = "<strong>Transação não encontrada!</strong><br>";
                    resultDiv.className = "result error";
                } else if (dest_bool === 0 || am_bool === 0 ){
                    let displayDest = dest || "N/A";
                    let displayAm = am !== null ? am : "N/A";
                    
                    resultDiv.innerHTML = `<strong> Transação encontrada com dados diferentes!</strong>
                                            <table style="width:100%; margin-top:10px; border-collapse: collapse;">
                                                <tr>
                                                  <th style="text-align:left; border-bottom:1px solid #ddd;">Esperado</th>
                                                  <th style="text-align:left; border-bottom:1px solid #ddd;">Real (Blockchain)</th>
                                                </tr>
                                                <tr>
                                                    <td>Dest: ${expdest.substring(0,10)}... <span style="font-weight:bold; color:${dest_bool?'green':'red'}">${dest_bool?'OK':'<-errado'}</span></td>
                                                    <td>Dest: ${displayDest.substring(0,10)}... </td>
                                                </tr>
                                                <tr>
                                                    <td>Valor: ${amountInput}<span style="font-weight:bold; color:${am_bool?'green':'red'}">${am_bool?'OK':'<-errado'}</span></td>
                                                    <td>Valor: ${displayAm} </td>
                                                </tr>
                                            </table>`;
                    resultDiv.className = "result wrong_data";
                } else if (dest_bool === 1 && am_bool === 1){
                    resultDiv.innerHTML = "<strong> Transação Válida e Confirmada!</strong>";
                    resultDiv.className = "result success";
                }

            } catch (error) {
                console.error("Erro Fatal:", error);
                resultDiv.innerHTML = `<strong>Erro Técnico:</strong> ${error.message}`;
                resultDiv.className = "result error";
            }
            
        });
    }
});