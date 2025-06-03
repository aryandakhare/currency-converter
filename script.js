// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Get references to the HTML elements
    const convertBtn = document.getElementById("convert");
    const amountInput = document.getElementById("amount");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");
    const resultDisplay = document.getElementById("result");

    // Add an event listener to the convert button for click events
    convertBtn.addEventListener("click", async () => {
        // Get the current values from the input fields and dropdowns
        const amount = parseFloat(amountInput.value); // Convert amount to a number
        const from = fromCurrencySelect.value;
        const to = toCurrencySelect.value;

        // Basic validation for amount
        if (isNaN(amount) || amount <= 0) {
            resultDisplay.innerHTML = `<span class="text-red-600">Please enter a valid positive amount.</span>`;
            return; // Stop execution if amount is invalid
        }

        // Show loading state and disable the button to prevent multiple clicks
        convertBtn.disabled = true;
        resultDisplay.textContent = "Converting...";
        resultDisplay.classList.remove('text-red-600'); // Clear any previous error styling
        resultDisplay.classList.add('text-gray-900'); // Reset text color

        try {
            // Try the primary API (Frankfurter API) for exchange rates
            let apiResponse = await fetch(`https://api.frankfurter.app/latest?from=${from}`);

            // If the primary API call fails (e.g., non-200 status code)
            if (!apiResponse.ok) {
                console.warn("Primary API failed, trying fallback API.");
                // Fallback API (Currency-API by Fawazahmed0)
                apiResponse = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from.toLowerCase()}/${to.toLowerCase()}.json`);

                // If fallback also fails, throw an error
                if (!apiResponse.ok) {
                    throw new Error(`Failed to fetch data from both APIs. Status: ${apiResponse.status}`);
                }
            }

            // Parse the JSON response from the API
            const data = await apiResponse.json();

            // Extract the exchange rate.
            // Frankfurter API uses `data.rates[to]`.
            // Currency-API uses `data[to.toLowerCase()]`.
            const rate = data.rates?.[to] || data[to.toLowerCase()];

            // Check if a valid rate was obtained
            if (typeof rate === 'undefined' || rate === null) {
                throw new Error(`Exchange rate for ${from} to ${to} not found.`);
            }

            // Calculate the converted amount and format to 2 decimal places
            const result = (amount * rate).toFixed(2);

            // Display the conversion result and the current rate
            resultDisplay.innerHTML = `
                ${amount} ${from} = <strong class="text-blue-600">${result} ${to}</strong>
                <br>
                <small class="text-gray-600">(1 ${from} = ${rate.toFixed(4)} ${to})</small>
            `;
        } catch (error) {
            // Handle any errors during the fetch or calculation
            console.error("Conversion error:", error);
            resultDisplay.innerHTML = `
                <span class="text-red-600">❌ Conversion failed</span><br>
                <small class="text-red-500">${error.message}</small>
            `;
        } finally {
            // Re-enable the convert button regardless of success or failure
            convertBtn.disabled = false;
        }
    });
});
