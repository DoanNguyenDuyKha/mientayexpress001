document.addEventListener('DOMContentLoaded', function() {
    // Lấy dữ liệu từ localStorage
    const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');
    const items = Array.isArray(orderData.items) ? orderData.items : [];

    const modalTableBody = document.querySelector('.modal-item-table tbody');
    const modalGrandTotalEl = document.getElementById('modalGrandTotal');
    const addRowButton = document.querySelector('.btn-add-row');

    // Xóa hết các dòng cũ
    if (modalTableBody) {
        modalTableBody.innerHTML = '';
    }

    // Render lại các dòng từ localStorage
    function renderRows() {
        if (!modalTableBody) return;
        modalTableBody.innerHTML = '';
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><button type="button" class="btn-delete-row" title="Xóa dòng này"><i class="fa-solid fa-trash"></i></button></td>
                <td><input type="text" value="${item.name || ''}" class="form-control item-name"></td>
                <td><input type="number" value="${item.quantity || ''}" class="form-control item-qty"></td>
                <td>
                    <select class="form-select item-unit">
                        <option value="PCE" ${item.unit === 'PCE' ? 'selected' : ''}>PCE</option>
                        <option value="PCS" ${item.unit === 'PCS' ? 'selected' : ''}>PCS</option>
                        <option value="PKG" ${item.unit === 'PKG' ? 'selected' : ''}>PKG</option>
                        <option value="Rolls" ${item.unit === 'Rolls' ? 'selected' : ''}>Rolls</option>
                    </select>
                </td>
                <td><input type="number" value="${item.price || ''}" step="0.01" class="form-control item-price"></td>
                <td><input type="text" value="${item.total || ''}" class="form-control item-total" readonly></td>
            `;
            modalTableBody.appendChild(row);
        });
        if (items.length === 0) {
            // Nếu không có dữ liệu, thêm 1 dòng trống
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><button type="button" class="btn-delete-row" title="Xóa dòng này"><i class="fa-solid fa-trash"></i></button></td>
                <td><input type="text" value="" class="form-control item-name"></td>
                <td><input type="number" value="" class="form-control item-qty"></td>
                <td>
                    <select class="form-select item-unit">
                        <option value="PCE">PCE</option>
                        <option value="PCS">PCS</option>
                        <option value="PKG">PKG</option>
                        <option value="Rolls">Rolls</option>
                    </select>
                </td>
                <td><input type="number" value="" step="0.01" class="form-control item-price"></td>
                <td><input type="text" value="" class="form-control item-total" readonly></td>
            `;
            modalTableBody.appendChild(row);
        }
    }

    // Hàm tính tổng giá trị
    function calculateGrandTotal() {
        if (!modalTableBody || !modalGrandTotalEl) return;
        let grandTotal = 0;
        modalTableBody.querySelectorAll('tr').forEach(row => {
            const totalInput = row.querySelector('.item-total');
            grandTotal += parseFloat(totalInput.value) || 0;
        });
        modalGrandTotalEl.textContent = Math.round(grandTotal);
    }

    // Hàm tính tổng giá từng dòng
    function calculateRowTotal(row) {
        const qtyInput = row.querySelector('.item-qty');
        const priceInput = row.querySelector('.item-price');
        const totalInput = row.querySelector('.item-total');
        
        // Lấy giá trị số lượng và đơn giá
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        
        // Tính tổng giá = số lượng * đơn giá
        const total = qty * price;
        
        // Hiển thị tổng giá là số nguyên
        totalInput.value = Math.round(total);
        
        // Cập nhật tổng giá trị
        calculateGrandTotal();
    }

    // Gắn sự kiện cho từng dòng
    function addRowListeners(row) {
        const qtyInput = row.querySelector('.item-qty');
        const priceInput = row.querySelector('.item-price');
        const deleteButton = row.querySelector('.btn-delete-row');
        if(qtyInput) qtyInput.addEventListener('input', () => calculateRowTotal(row));
        if(priceInput) priceInput.addEventListener('input', () => calculateRowTotal(row));
        if(deleteButton) {
            deleteButton.addEventListener('click', () => {
                if (modalTableBody && modalTableBody.querySelectorAll('tr').length > 1) {
                    row.remove();
                    calculateGrandTotal();
                } else {
                    alert("Không thể xóa dòng cuối cùng.");
                }
            });
        }
    }

    // Render ban đầu
    if (modalTableBody) {
        renderRows();
        modalTableBody.querySelectorAll('tr').forEach(addRowListeners);
        calculateGrandTotal();
    }

    // Thêm dòng mới
    if (addRowButton && modalTableBody) {
        addRowButton.addEventListener('click', () => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><button type="button" class="btn-delete-row" title="Xóa dòng này"><i class="fa-solid fa-trash"></i></button></td>
                <td><input type="text" value="" class="form-control item-name"></td>
                <td><input type="number" value="" class="form-control item-qty"></td>
                <td>
                    <select class="form-select item-unit">
                        <option value="PCE">PCE</option>
                        <option value="PCS">PCS</option>
                        <option value="PKG">PKG</option>
                        <option value="Rolls">Rolls</option>
                    </select>
                </td>
                <td><input type="number" value="" step="0.01" class="form-control item-price"></td>
                <td><input type="text" value="" class="form-control item-total" readonly></td>
            `;
            modalTableBody.appendChild(row);
            addRowListeners(row);
        });
    }

    // Xử lý nút xác nhận
    document.querySelector('.modal-confirm-button').addEventListener('click', () => {
        // Lấy dữ liệu từ bảng
        const newItems = [];
        modalTableBody.querySelectorAll('tr').forEach(row => {
            const name = row.querySelector('.item-name')?.value?.trim() || '';
            const quantity = parseInt(row.querySelector('.item-qty')?.value) || 0;
            const unit = row.querySelector('.item-unit')?.value || '';
            const price = parseFloat(row.querySelector('.item-price')?.value) || 0;
            const total = parseFloat(row.querySelector('.item-total')?.value) || 0;
            if (name && unit && quantity > 0) {
                newItems.push({ name, unit, quantity, price, total });
            }
        });
        // Lưu vào localStorage
        orderData.items = newItems;
        localStorage.setItem('currentOrderDetail', JSON.stringify(orderData));
        alert('Đã cập nhật chi tiết hàng hóa!');
        window.close();
    });
});