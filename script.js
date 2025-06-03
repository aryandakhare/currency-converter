document.addEventListener("DOMContentLoaded", () => {
    const convertBtn = document.getElementById("convert");
    const amountInput = document.getElementById("amount");
    const fromCurrency = document.getElementById("from-currency");
    const toCurrency = document.getElementById("to-currency");
    const resultDiv = document.getElementById("result");

    // Free API with fallback
    const API_ENDPOINTS = [
        "https://api.frankfurter.app/latest",
        "https://api.exchangerate-api.com/v4/latest"
    ];

    convertBtn.addEventListener("click", async () => {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount) {
            resultDiv.textContent = "Please enter a valid number!";
            return;
        }

        convertBtn.disabled = true;
        resultDiv.textContent = "Converting...";

        try {
            let rates;
            // Try multiple APIs
            for (const api of API_ENDPOINTS) {
                try {
                    const response = await fetch(`${api}?from=${from}`);
                    if (!response.ok) continue;
                    const data = await response.json();
                    rates = data.rates;
                    break;
                } catch (e) {
                    console.log(`API ${api} failed, trying next...`);
                }
            }

            if (!rates) throw new Error("All APIs failed");

            const rate = rates[to];
            const convertedAmount = (amount * rate).toFixed(2);

            resultDiv.innerHTML = `
                ${amount} ${from} = 
                <span style="color: #6c5ce7">${convertedAmount} ${to}</span>
                <div style="font-size: 14px; color: #666; margin-top: 5px">
                    1 ${from} = ${rate.toFixed(4)} ${to}
                </div>
            `;
        } catch (error) {
            resultDiv.innerHTML = `
                ❌ Failed to convert. 
                <div style="font-size: 14px; color: #666">${error.message}</div>
            `;
            console.error(error);
        } finally {
            convertBtn.disabled = false;
        }
    });
});