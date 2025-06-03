document.addEventListener("DOMContentLoaded", () => {
    const convertBtn = document.getElementById("convert");
    
    convertBtn.addEventListener("click", async () => {
        const amount = document.getElementById("amount").value;
        const from = document.getElementById("from-currency").value;
        const to = document.getElementById("to-currency").value;
        
        // Show loading state
        convertBtn.disabled = true;
        document.getElementById("result").textContent = "Converting...";
        
        try {
            // Try primary API
            let apiResponse = await fetch(`https://api.frankfurter.app/latest?from=${from}`);
            
            if (!apiResponse.ok) {
                // Fallback API if primary fails
                apiResponse = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from.toLowerCase()}/${to.toLowerCase()}.json`);
            }
            
            const data = await apiResponse.json();
            const rate = data.rates?.[to] || data[to.toLowerCase()];
            const result = (amount * rate).toFixed(2);
            
            document.getElementById("result").innerHTML = `
                ${amount} ${from} = <strong>${result} ${to}</strong>
                <small>(1 ${from} = ${rate.toFixed(4)} ${to})</small>
            `;
        } catch (error) {
            document.getElementById("result").innerHTML = `
                ❌ Conversion failed<br>
                <small>${error.message}</small>
            `;
        } finally {
            convertBtn.disabled = false;
        }
    });
});
