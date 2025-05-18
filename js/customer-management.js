// Filter functionality
const customerTypeFilter = document.getElementById('customerType');
const customerStatusFilter = document.getElementById('customerStatus');
const filterButton = document.querySelector('.btn-filter');
const customerTableBody = document.getElementById('customer-table-body');

function applyFilters() {
    const selectedType = customerTypeFilter.value;
    const selectedStatus = customerStatusFilter.value;
    const rows = customerTableBody.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const typeCell = row.cells[6]; // Cột loại khách hàng
        const statusCell = row.cells[8]; // Cột trạng thái
        
        const type = typeCell.textContent.trim();
        const status = statusCell.querySelector('.status-badge').classList.contains('active') ? 'active' : 'inactive';
        
        const typeMatch = !selectedType || type.toLowerCase() === (selectedType === 'personal' ? 'cá nhân' : selectedType === 'business' ? 'doanh nghiệp' : '');
        const statusMatch = !selectedStatus || status === selectedStatus;
        
        row.style.display = typeMatch && statusMatch ? '' : 'none';
    });

    // Cập nhật số thứ tự cho các dòng đang hiển thị
    let visibleIndex = 1;
    Array.from(rows).forEach(row => {
        if (row.style.display !== 'none') {
            row.cells[1].textContent = visibleIndex++;
        }
    });
}

// Thêm event listeners cho bộ lọc
if (customerTypeFilter) customerTypeFilter.addEventListener('change', applyFilters);
if (customerStatusFilter) customerStatusFilter.addEventListener('change', applyFilters);
if (filterButton) filterButton.addEventListener('click', applyFilters);

// Modal functionality
const modals = document.querySelectorAll('.modal');
const modalCloseButtons = document.querySelectorAll('.modal-close, [data-dismiss="modal"]');
const addCustomerBtn = document.getElementById('addCustomerBtn');
const addCustomerModal = document.getElementById('addCustomerModal');
const editCustomerModal = document.getElementById('editCustomerModal');
const deleteCustomerModal = document.getElementById('deleteCustomerModal');
const customerDetailModal = document.getElementById('customerDetailModal');

// Hàm mở modal
function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }, 10);
}

// Hàm đóng modal
function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// Đóng tất cả các modal
function closeAllModals() {
    modals.forEach(closeModal);
}

// Event listener cho nút thêm khách hàng
if (addCustomerBtn) {
    addCustomerBtn.addEventListener('click', () => {
        openModal(addCustomerModal);
    });
}

// Event listeners cho các nút đóng modal
modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) closeModal(modal);
    });
});

// Event listener cho click bên ngoài modal
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Event listener cho phím Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// Xử lý nút xem chi tiết khách hàng
const viewButtons = document.querySelectorAll('.icon-view');
viewButtons.forEach(button => {
    button.addEventListener('click', () => {
        const row = button.closest('tr');
        if (row) {
            const cells = row.cells;
            // Cập nhật thông tin trong modal
            document.getElementById('detailCustomerId').textContent = cells[2].textContent;
            document.getElementById('detailCustomerName').textContent = cells[3].textContent;
            document.getElementById('detailCustomerPhone').textContent = cells[4].textContent;
            document.getElementById('detailCustomerEmail').textContent = cells[5].textContent;
            document.getElementById('detailCustomerType').textContent = cells[6].textContent;
            document.getElementById('detailCustomerAddress').textContent = cells[7].textContent;
            
            // Hiển thị modal
            openModal(customerDetailModal);
        }
    });
});

// Xử lý nút sửa khách hàng
const editButtons = document.querySelectorAll('.icon-edit');
editButtons.forEach(button => {
    button.addEventListener('click', () => {
        const row = button.closest('tr');
        if (row) {
            const cells = row.cells;
            // Cập nhật form sửa
            document.getElementById('editCustomerId').value = cells[2].textContent;
            document.getElementById('editCustomerName').value = cells[3].textContent;
            document.getElementById('editCustomerPhone').value = cells[4].textContent;
            document.getElementById('editCustomerEmail').value = cells[5].textContent;
            document.getElementById('editCustomerType').value = cells[6].textContent;
            document.getElementById('editCustomerAddress').value = cells[7].textContent;
            
            // Hiển thị modal
            openModal(editCustomerModal);
        }
    });
});

// Xử lý nút xóa khách hàng
const deleteButtons = document.querySelectorAll('.icon-danger');
deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
        const row = button.closest('tr');
        if (row) {
            const customerName = row.cells[3].textContent;
            document.getElementById('deleteCustomerName').textContent = customerName;
            openModal(deleteCustomerModal);
        }
    });
});

// Xử lý form thêm khách hàng
const addCustomerForm = document.getElementById('addCustomerForm');
if (addCustomerForm) {
    addCustomerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Xử lý thêm khách hàng ở đây
        closeModal(addCustomerModal);
        addCustomerForm.reset();
    });
}

// Xử lý form sửa khách hàng
const editCustomerForm = document.getElementById('editCustomerForm');
if (editCustomerForm) {
    editCustomerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Xử lý sửa khách hàng ở đây
        closeModal(editCustomerModal);
    });
} 