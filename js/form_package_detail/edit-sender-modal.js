// Function to populate the form with data from localStorage
function populateSenderModal() {
    const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');
    document.getElementById('senderNameInput').value = orderData.sender_name || '';
    document.getElementById('senderPhoneInput').value = orderData.sender_phone || '';
    document.getElementById('senderAddressInput').value = orderData.sender_address || '';
    document.getElementById('senderCityInput').value = orderData.sender_city || '';
    document.getElementById('senderCountryInput').value = orderData.sender_country || '';
}

// Handle Cancel button
document.getElementById('cancelEditSender').onclick = function() {
    // Close the modal (assuming it's loaded in an iframe)
    window.parent && window.parent.closeEditModal ? window.parent.closeEditModal() : window.close();
};

// Handle form submission (Confirm button)
document.getElementById('editSenderForm').onsubmit = function(e) {
    e.preventDefault();

    // Get data from form
    const sender_name = document.getElementById('senderNameInput').value;
    const sender_phone = document.getElementById('senderPhoneInput').value;
    const sender_address = document.getElementById('senderAddressInput').value;
    const sender_city = document.getElementById('senderCityInput').value;
    const sender_country = document.getElementById('senderCountryInput').value;

    // Load existing data from localStorage
    const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');

    // Update sender data
    orderData.sender_name = sender_name;
    orderData.sender_phone = sender_phone;
    orderData.sender_address = sender_address;
    orderData.sender_city = sender_city;
    orderData.sender_country = sender_country;

    // Save updated data back to localStorage
    localStorage.setItem('currentOrderDetail', JSON.stringify(orderData));

    // Reload the parent page to update the main interface
    window.parent && window.parent.location ? window.parent.location.reload() : window.location.reload();
};

// Expose populate function to parent window if needed (for iframe)
window.populateSenderModal = populateSenderModal;

// Populate the modal when it's loaded
populateSenderModal();