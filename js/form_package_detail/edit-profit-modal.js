document.addEventListener('DOMContentLoaded', function() {
    console.log("Charges modal script loaded.");

    // Function to format number with dots
    function formatNumber(num) {
        return num.toFixed(0).replace(/\B(?=(\d{3})+(?!d))/g, ".");
    }

    // Function to parse number from formatted string
    function parseNumber(str) {
        return parseFloat(str.replace(/[^0-9.-]+/g,"")) || 0;
    }

    // Function to populate the form with data from localStorage
    function populateChargesModal() {
        const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');
        const chargesData = orderData.charges || {};

        document.getElementById('currencyUnitInput').value = chargesData.currency_unit || '5';
        document.getElementById('exchangeRateInput').value = chargesData.exchange_rate || '';
        document.getElementById('baseFareInput').value = chargesData.base_fare || '';
        document.getElementById('otherChargesInput').value = chargesData.other_charges || '';
        document.getElementById('netAgentInput').value = chargesData.net_agent || '';
        document.getElementById('vatPercentInput').value = chargesData.vat_percent || '';
        document.getElementById('vatAmountInput').value = chargesData.vat_amount || '';
        document.getElementById('saleCommissionInput').value = chargesData.sale_commission || '';
        document.getElementById('totalChargesInput').value = chargesData.total_charges || '';
        document.getElementById('totalAgentChargesInput').value = chargesData.total_agent_charges || '';
        document.getElementById('otherChargesNoteInput').value = chargesData.other_charges_note || '';

        calculateCharges();
    }

    // Basic calculation function
    function calculateCharges() {
        const baseFare = parseNumber(document.getElementById('baseFareInput').value);
        const otherCharges = parseNumber(document.getElementById('otherChargesInput').value);
        const vatPercent = parseNumber(document.getElementById('vatPercentInput').value);
        const netAgent = parseNumber(document.getElementById('netAgentInput').value);

        // Calculate VAT Amount
        const vatAmount = baseFare * (vatPercent / 100);
        document.getElementById('vatAmountInput').value = formatNumber(vatAmount);

        // Calculate Total Charges
        const totalCharges = baseFare + otherCharges + vatAmount;
        document.getElementById('totalChargesInput').value = formatNumber(totalCharges);

        // Calculate Total Agent Charges
        const totalAgentCharges = netAgent + otherCharges;
        document.getElementById('totalAgentChargesInput').value = formatNumber(totalAgentCharges);
    }

    // Add event listeners for input changes to recalculate
    document.getElementById('baseFareInput').addEventListener('input', calculateCharges);
    document.getElementById('otherChargesInput').addEventListener('input', calculateCharges);
    document.getElementById('vatPercentInput').addEventListener('input', calculateCharges);
    document.getElementById('netAgentInput').addEventListener('input', calculateCharges);

    // Handle Cancel button
    document.getElementById('cancelEditCharges').onclick = function() {
        console.log('[Modal] Đã bấm Hủy chỉnh sửa cước phí');
        window.parent && window.parent.closeEditModal ? window.parent.closeEditModal() : window.close();
    };

    // Handle form submission (Confirm button)
    document.getElementById('editChargesForm').onsubmit = function(e) {
        e.preventDefault();
        console.log('[Modal] Đã bấm Xác nhận chỉnh sửa cước phí');

        calculateCharges();

        const chargesData = {
            currency_unit: document.getElementById('currencyUnitInput').value,
            exchange_rate: document.getElementById('exchangeRateInput').value,
            base_fare: document.getElementById('baseFareInput').value,
            other_charges: document.getElementById('otherChargesInput').value,
            net_agent: document.getElementById('netAgentInput').value,
            vat_percent: document.getElementById('vatPercentInput').value,
            vat_amount: document.getElementById('vatAmountInput').value,
            sale_commission: document.getElementById('saleCommissionInput').value,
            total_charges: document.getElementById('totalChargesInput').value,
            total_agent_charges: document.getElementById('totalAgentChargesInput').value,
            other_charges_note: document.getElementById('otherChargesNoteInput').value
        };

        const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');
        orderData.charges = chargesData;
        localStorage.setItem('currentOrderDetail', JSON.stringify(orderData));

        window.parent && window.parent.location ? window.parent.location.reload() : window.location.reload();
    };

    // Populate the modal when it's loaded
    populateChargesModal();
});