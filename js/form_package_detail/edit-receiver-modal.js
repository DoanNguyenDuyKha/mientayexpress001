// Function to populate the form with data from localStorage
function populateReceiverModal() {
    const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');
    document.getElementById('receiverCompanyNameInput').value = orderData.receiver_company || '';
    document.getElementById('receiverNameInput').value = orderData.receiver_name || '';
    document.getElementById('receiverPhone1Input').value = orderData.receiver_phone1 || '';
    document.getElementById('receiverPhone2Input').value = orderData.receiver_phone2 || '';
    document.getElementById('receiverAddressInput').value = orderData.receiver_address || '';
    document.getElementById('receiverCityInput').value = orderData.receiver_city || '';
    document.getElementById('receiverCountryInput').value = orderData.receiver_country || '';
}

// Handle Cancel button
document.getElementById('cancelEditReceiver').onclick = function() {
    // Close the modal (assuming it's loaded in an iframe)
    window.parent && window.parent.closeEditModal ? window.parent.closeEditModal() : window.close();
};

// Handle form submission (Confirm button)
document.getElementById('editReceiverForm').onsubmit = function(e) {
    e.preventDefault();

    // Get data from form
    const receiver_company = document.getElementById('receiverCompanyNameInput').value;
    const receiver_name = document.getElementById('receiverNameInput').value;
    const receiver_phone1 = document.getElementById('receiverPhone1Input').value;
    const receiver_phone2 = document.getElementById('receiverPhone2Input').value;
    const receiver_address = document.getElementById('receiverAddressInput').value;
    const receiver_city = document.getElementById('receiverCityInput').value;
    const receiver_country = document.getElementById('receiverCountryInput').value;

    // Load existing data from localStorage
    const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');

    // Update receiver data
    orderData.receiver_company = receiver_company;
    orderData.receiver_name = receiver_name;
    orderData.receiver_phone1 = receiver_phone1;
    orderData.receiver_phone2 = receiver_phone2;
    orderData.receiver_address = receiver_address;
    orderData.receiver_city = receiver_city;
    orderData.receiver_country = receiver_country;

    // Save updated data back to localStorage
    localStorage.setItem('currentOrderDetail', JSON.stringify(orderData));

    // Reload the parent page to update the main interface
    window.parent && window.parent.location ? window.parent.location.reload() : window.location.reload();
};

// Expose populate function to parent window if needed (for iframe)
window.populateReceiverModal = populateReceiverModal;

// Populate the modal when it's loaded
populateReceiverModal();