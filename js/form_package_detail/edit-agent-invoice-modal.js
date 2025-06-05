// Hàm load dữ liệu từ localStorage vào modal
function populatePackageDetailModal() {
    const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');
    document.getElementById('packageContentInput').value = orderData.product_name || '';
    document.getElementById('agentWeightInput').value = orderData.agent_weight || '';
    // Dimensions
    const dimTbody = document.getElementById('dimensionsTable').querySelector('tbody');
    dimTbody.innerHTML = '';
    (orderData.dimensions || []).forEach((dim, idx) => {
        addDimRow(dim.length, dim.width, dim.height, dim.weight);
    });
    // Products
    const prodTbody = document.getElementById('productsTable').querySelector('tbody');
    prodTbody.innerHTML = '';
    (orderData.items || []).forEach(item => {
        addProductRow(item.name, item.unit, item.quantity, item.price, item.total);
    });
}
// Thêm dòng kích thước
function addDimRow(length='', width='', height='', weight='') {
    const tbody = document.getElementById('dimensionsTable').querySelector('tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input type='number' class='form-control' name='length[]' value='${length}'></td>
        <td><input type='number' class='form-control' name='width[]' value='${width}'></td>
        <td><input type='number' class='form-control' name='height[]' value='${height}'></td>
        <td><input type='number' class='form-control' name='weight[]' value='${weight}'></td>
        <td><button type='button' onclick='this.closest("tr").remove()' style='color:red;border:none;background:none;'><i class='fa fa-trash'></i></button></td>`;
    tbody.appendChild(tr);
}
// Thêm dòng sản phẩm
function addProductRow(name='', unit='', quantity='', price='', total='') {
    const tbody = document.getElementById('productsTable').querySelector('tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input type='text' class='form-control' name='prod_name[]' value='${name}'></td>
        <td>
            <select class='form-control' name='prod_unit[]'>
                <option value='PCE' ${unit === 'PCE' ? 'selected' : ''}>PCE</option>
                <option value='PCS' ${unit === 'PCS' ? 'selected' : ''}>PCS</option>
                <option value='PKG' ${unit === 'PKG' ? 'selected' : ''}>PKG</option>
                <option value='Rolls' ${unit === 'Rolls' ? 'selected' : ''}>Rolls</option>
            </select>
        </td>
        <td><input type='number' class='form-control' name='prod_quantity[]' value='${quantity}'></td>
        <td><input type='number' class='form-control' name='prod_price[]' value='${price}'></td>
        <td><input type='number' class='form-control' name='prod_total[]' value='${total}'></td>
        <td><button type='button' onclick='this.closest("tr").remove()' style='color:red;border:none;background:none;'><i class='fa fa-trash'></i></button></td>`;
    tbody.appendChild(tr);
}
// Calculate total for a single item row
function calculateItemTotal(row) {
    const quantityInput = row.querySelector('input[name="prod_quantity[]"]');
    const priceInput = row.querySelector('input[name="prod_price[]"]');
    const totalInput = row.querySelector('input[name="prod_total[]"]');
    const quantity = parseFloat(quantityInput?.value) || 0;
    const price = parseFloat(priceInput?.value) || 0;
    if (totalInput) totalInput.value = (quantity * price).toFixed(0); // Keep as integer if currency doesn't use decimals
}

// Add event listeners using delegation
document.getElementById('productsTable').querySelector('tbody').addEventListener('input', function(e) {
    if (e.target.matches('input[name="prod_quantity[]"], input[name="prod_price[]"]')) {
        calculateItemTotal(e.target.closest('tr'));
    }
});

document.getElementById('addDimRowBtn').onclick = () => addDimRow();
document.getElementById('addProductRowBtn').onclick = () => addProductRow();
// Khi mở modal, gọi hàm này
populatePackageDetailModal();
// Xử lý nút Hủy
document.getElementById('cancelEditPackageDetail').onclick = function() {
    window.parent && window.parent.closeEditModal ? window.parent.closeEditModal() : window.close();
};
// Xử lý xác nhận
document.getElementById('editPackageDetailForm').onsubmit = function(e) {
    e.preventDefault();
    // Lấy dữ liệu
    const product_name = document.getElementById('packageContentInput').value;
    const agent_weight = document.getElementById('agentWeightInput').value;
    // Dimensions
    const lengths = Array.from(document.getElementsByName('length[]')).map(i=>i.value);
    const widths = Array.from(document.getElementsByName('width[]')).map(i=>i.value);
    const heights = Array.from(document.getElementsByName('height[]')).map(i=>i.value);
    const weights = Array.from(document.getElementsByName('weight[]')).map(i=>i.value);
    const dimensions = lengths.map((l,i)=>({length:l,width:widths[i],height:heights[i],weight:weights[i]}));
    // Products
    const prod_names = Array.from(document.getElementsByName('prod_name[]')).map(i=>i.value);
    const prod_units = Array.from(document.getElementsByName('prod_unit[]')).map(i=>i.value);
    const prod_quantities = Array.from(document.getElementsByName('prod_quantity[]')).map(i=>i.value);
    const prod_prices = Array.from(document.getElementsByName('prod_price[]')).map(i=>i.value);
    const prod_totals = Array.from(document.getElementsByName('prod_total[]')).map(i=>i.value);
    const items = prod_names.map((n,i)=>({name:n,unit:prod_units[i],quantity:prod_quantities[i],price:prod_prices[i],total:prod_totals[i]}));
    // Lưu vào localStorage
    const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');
    orderData.product_name = product_name;
    orderData.agent_weight = agent_weight;
    orderData.dimensions = dimensions;
    orderData.items = items;
    localStorage.setItem('currentOrderDetail', JSON.stringify(orderData));
    // Reload lại trang ngoài để cập nhật giao diện
    window.parent && window.parent.location ? window.parent.location.reload() : window.location.reload();
};
window.populatePackageDetailModal = populatePackageDetailModal;