// Lấy dữ liệu từ localStorage
function getOrderDetailsFromLocalStorage() {
    const orderDetails = localStorage.getItem('currentOrderDetail');
    if (orderDetails) {
        return JSON.parse(orderDetails);
    }
    return null;
}

// Hiển thị chi tiết đơn hàng
function displayOrderDetails() {
    const orderDetails = getOrderDetailsFromLocalStorage();
    if (!orderDetails) {
        console.log('Không có dữ liệu đơn hàng trong localStorage');
        return;
    }

    // Tìm các phần tử cần cập nhật
    const orderTableBody = document.getElementById('order-table-body');
    if (!orderTableBody) {
        console.log('Không tìm thấy bảng đơn hàng');
        return;
    }

    // Tạo HTML cho chi tiết đơn hàng
    const detailsHTML = `
        <tr class="details-row" id="details-row-current" style="display: none;">
            <td colspan="16">
                <div class="details-inner-wrapper">
                    <div class="order-details-content">
                        <div class="detail-item"><span class="detail-label">REF Code:</span><span class="detail-value">${orderDetails.refCode || 'N/A'}</span></div>
                        <div class="detail-item"><span class="detail-label">Tên sản phẩm:</span><span class="detail-value">${orderDetails.productName || 'N/A'}</span></div>
                        <div class="detail-item"><span class="detail-label">SL kiện/gói:</span><span class="detail-value">${orderDetails.quantity || 'N/A'}</span></div>
                        <div class="detail-item"><span class="detail-label">Ảnh kiện:</span><span class="detail-value"><div class="image-modal-trigger"><img src="${orderDetails.imageUrl || '../images/kien1.jpg'}" alt="Ảnh kiện"></div></span></div>
                        <div class="detail-item"><span class="detail-label">Cân nặng:</span><span class="detail-value">${orderDetails.weight || 'N/A'} KG</span></div>
                        <div class="detail-item"><span class="detail-label">Reweight:</span><span class="detail-value">${orderDetails.reweight || 'N/A'} KG</span></div>
                        <div class="detail-item"><span class="detail-label">Cân nặng đại lý:</span><span class="detail-value">${orderDetails.agentWeight || 'N/A'} KG</span></div>
                        <div class="detail-item full-width"><span class="detail-label">Ghi chú CPK:</span><span class="detail-value">${orderDetails.notes || 'N/A'}</span></div>
                    </div>
                    <div class="details-action-icons">
                        <button class="icon-button icon-print" title="In chi tiết"><i class="fa-solid fa-print"></i></button>
                        <button class="icon-button icon-excel" title="Xuất Excel"><i class="fa-solid fa-file-excel"></i></button>
                    </div>
                </div>
            </td>
        </tr>
    `;

    // Thêm chi tiết đơn hàng vào bảng
    orderTableBody.insertAdjacentHTML('beforeend', detailsHTML);

    // Hiển thị chi tiết đơn hàng
    const detailsRow = document.getElementById('details-row-current');
    if (detailsRow) {
        detailsRow.style.display = 'table-row';
    }
}

// Gọi hàm khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    displayOrderDetails();
}); 