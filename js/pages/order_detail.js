// Helper function to get service data from localStorage
function getServiceData() {
    const data = localStorage.getItem('serviceData');
    return data ? JSON.parse(data) : [];
}

// Function to populate the service select dropdown in the modal
function populateServiceSelect(container) {
    const serviceSelect = container.querySelector('#serviceNameInput');
    if (!serviceSelect) {
        console.error('Element serviceNameInput not found in modal container');
        return;
    }

    // Clear all options except the default one
    while (serviceSelect.options.length > 1) {
        serviceSelect.remove(1);
    }

    // Get service data
    const services = getServiceData();

    // Add options for displayed services
    services.forEach(service => {
        if (service.hienThi) { // Only add services marked as displayable
            const option = document.createElement('option');
            option.value = service.maDV; // Use service code as value
            option.textContent = `${service.maDV} - ${service.tenDV}`;
            serviceSelect.appendChild(option);
        }
    });
    console.log('Service select in modal populated with data from localStorage.');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded - Initializing Order Detail Page...");

    // Khởi tạo các biến modal
    window.modalOverlay = document.getElementById('editStatusModalOverlay');
    window.modalContent = document.getElementById('editStatusModalContent');

    // Hàm đóng modal
    function closeEditModal() {
        console.log("Closing modal..."); // Add log
        if (window.modalOverlay) {
            window.modalOverlay.classList.remove('active');
        }
        // IMPORTANT: Do NOT clear the innerHTML of the modal content container here,
        // as it destroys the iframe environment.
        // The iframe content will be managed by the browser when the overlay is hidden.
        // if (window.modalContent) window.modalContent.innerHTML = ''; // REMOVE OR COMMENT OUT THIS LINE

        // Optionally, remove the iframe explicitly after hiding, but NOT by clearing innerHTML
        const iframe = window.modalContent ? window.modalContent.querySelector('iframe') : null;
        if (iframe) {
            // Give a small delay to allow iframe script to finish before removing
            setTimeout(() => {
                iframe.remove();
                console.log("Iframe removed after delay."); // Add log
            }, 50); // 50ms delay
        }

        if (window.modalOverlay) {
            window.modalOverlay.onclick = null;
            console.log("Overlay click listener removed."); // Add log
        }
        console.log("Modal closed."); // Add log
    }

    // Gắn hàm closeEditModal vào window để các iframe có thể truy cập
    window.closeEditModal = closeEditModal;

    // Hàm gắn sự kiện click cho overlay
    function attachOverlayClickListener() {
        if (window.modalOverlay) {
            window.modalOverlay.onclick = function (event) {
                if (event.target === window.modalOverlay) closeEditModal();
            };
        }
    }

    // Hàm mở modal bằng iframe cho Thông số kiện hàng
    function loadModalContentIframe(url) {
        if (!window.modalContent || !window.modalOverlay) return;
        window.modalContent.innerHTML = `<iframe src="${url}" style="width:100%;height:90vh;border:none;border-radius:12px;overflow:hidden;background:transparent;"></iframe>`;
        window.modalOverlay.classList.add('active');
        if (window.modalOverlay) {
            window.modalOverlay.onclick = function (event) {
                if (event.target === window.modalOverlay) closeEditModal();
            };
        }
    }

    // Hàm load nội dung modal (HTML content) for Bill Info
    async function loadModalContentHtml(formUrl, populationFunction = null, attachListenerFunction = null) {
        if (!window.modalContent || !window.modalOverlay) {
            console.error("Modal container or overlay not found."); return;
        }
        // Set height to auto for HTML modals if needed, or rely on modal-content-wrapper max-height
        window.modalContent.innerHTML = '<div style="padding:20px;color:var(--text-secondary);text-align:center;">Đang tải...</div>';
        // Adjust modal content wrapper style for HTML modals if necessary
        // Example: window.modalContent.style.maxHeight = '90vh'; // Set max-height
        // Example: window.modalContent.style.overflowY = 'auto'; // Allow internal scroll if needed

        window.modalOverlay.classList.add('active');
        if (window.modalOverlay) {
            window.modalOverlay.onclick = function (event) {
                if (event.target === window.modalOverlay) closeEditModal();
            };
        }

        try {
            const response = await fetch(formUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}, URL: ${formUrl}`);
            const htmlContent = await response.text();
            window.modalContent.innerHTML = htmlContent;
            // Populate the service select dropdown after loading HTML content
            populateServiceSelect(window.modalContent);

            // Call population function for existing data and attach listeners
            if (typeof populationFunction === 'function') populationFunction(window.modalContent);
            if (typeof attachListenerFunction === 'function') attachListenerFunction(window.modalContent);

        } catch (error) {
            window.modalContent.innerHTML = `<div style="padding:20px;color:var(--danger-color);">Lỗi tải form: ${error.message}.</div>`;
        }
    }

    // Hàm populate dữ liệu cho modal Bill Info (lấy từ localStorage)
    function populateBillInfoSectionModalData(container) {
        console.log('populateBillInfoSectionModalData called');
        const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');
        console.log('orderData from localStorage:', orderData);

        const billCodeInput = container.querySelector('#billCodeInput');
        if (billCodeInput) billCodeInput.value = orderData.bill_code || '';
        const refCodeInput = container.querySelector('#refCodeInput');
        if (refCodeInput) refCodeInput.value = orderData.ref_code || '';

        const orderDateInput = container.querySelector('#orderDateInput');
        if (orderDateInput) {
            if (orderData.order_date) {
                const d = new Date(orderData.order_date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                orderDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
            }
        }

        const creatorInput = container.querySelector('#creatorInput');
        // Set giá trị người tạo mặc định hoặc từ dữ liệu đã lưu (nếu có)
        if (creatorInput) creatorInput.value = orderData.creator || 'PHẠM HOÀNG ĐÌNH'; // Mặc định là "PHẠM HOÀNG ĐÌNH" nếu chưa có

        const statusInput = container.querySelector('#statusInput');
        if (statusInput) statusInput.value = orderData.order_status || 'processing';

        const serviceInput = container.querySelector('#serviceNameInput');
        // Lấy dịch vụ từ orderData và tìm option khớp bằng textContent
        if (serviceInput && orderData.service_type) {
            const options = serviceInput.options;
            let serviceFound = false;
            for (let i = 0; i < options.length; i++) {
                if (options[i].textContent.trim() === orderData.service_type.trim()) {
                    serviceInput.value = options[i].value;
                    serviceFound = true;
                    break;
                }
            }
            if (!serviceFound && orderData.service_type) {
                // If textContent match failed, try matching by the stored value if it was the value from create-package
                const createPackageServices = [
                    { value: 'signature', text: 'Chữ Ký' },
                    { value: 'fumigation', text: 'FUMIGATION' },
                    { value: 'packing', text: 'Đóng kiện gỗ' },
                    { value: 'insurance', text: 'Bảo hiểm hàng hóa' }
                    // Add other service mappings if needed
                ];
                const matchedService = createPackageServices.find(service => service.text === orderData.service_type.trim());
                if (matchedService) {
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].value.trim() === matchedService.value) {
                            serviceInput.value = options[i].value;
                            break;
                        }
                    }
                }


            }
            console.log('Populating serviceNameInput with text:', orderData.service_type, '. Element value set to:', serviceInput.value);
        }

        const branchInput = container.querySelector('#branchInput');
        // Lấy chi nhánh từ orderData
        if (branchInput) branchInput.value = orderData.branch || '';

        // Xử lý Dịch vụ cộng thêm: Đảm bảo orderData.add_service là mảng và kiểm tra checkbox theo value
        // orderData.add_service lưu mảng các VALUE TỪ create-package.html: ['signature', 'insurance', ...]
        const addServicesArr = Array.isArray(orderData.add_service) ? orderData.add_service : []; // Ensure it's always an array
        console.log('Saved add_service values (from localStorage): ', addServicesArr);

        // Reset all checkboxes first
        container.querySelectorAll('input[type="checkbox"][name^="add_service_"]').forEach(cb => cb.checked = false);

        // Check checkboxes based on the values in addServicesArr, comparing with modal checkbox VALUE
        container.querySelectorAll('input[type="checkbox"][name^="add_service_"]').forEach(cb => {
            console.log('Checking checkbox:', cb.name, ', modal checkbox value:', cb.value);
            // We need to check if the saved value (e.g., 'signature') matches the modal checkbox value (e.g., 'Chữ ký')
            // Or vice versa, depending on what was truly saved.
            // Let's map the modal checkbox value back to the potential saved value
            const modalValueMap = {
                'Chữ ký': 'signature',
                'Bảo hiểm hàng hóa': 'insurance',
                'FUMIGATION': 'fumigation',
                'Đóng kiện gỗ': 'packing'
            };
            const potentialSavedValue = modalValueMap[cb.value.trim()];

            if (potentialSavedValue && addServicesArr.includes(potentialSavedValue)) {
                cb.checked = true;
                console.log('-> Checked!');
            } else {
                // Also check if the saved array includes the modal checkbox value directly (fallback)
                if (addServicesArr.includes(cb.value.trim())) {
                    cb.checked = true;
                    console.log('-> Checked by direct value match!');
                } else {
                    console.log('-> Not checked.');
                }
            }
        });
        console.log('Finished populating add_service checkboxes.');

        const noteInput = container.querySelector('#noteInput');
        // Lấy ghi chú từ orderData.shipment_notes
        if (noteInput) noteInput.value = orderData.shipment_notes || '';
        console.log('Populating noteInput with data:', orderData.shipment_notes);

    }

    // Hàm gắn sự kiện cho modal Bill Info (lưu vào localStorage và cập nhật giao diện)
    function attachBillInfoSectionModalListeners(container) {
        const cancelButton = container.querySelector('.modal-cancel-button');
        const confirmButton = container.querySelector('.modal-confirm-button');
        const form = container.querySelector('#formBillInfoSectionModal');
        if (cancelButton) cancelButton.addEventListener('click', function () {
            console.log('[Modal] Đã bấm Hủy chỉnh sửa thông tin vận đơn');
            closeEditModal();
        });
        if (confirmButton && form) {
            confirmButton.addEventListener('click', function () {
                console.log('[Modal] Đã bấm Xác nhận chỉnh sửa thông tin vận đơn');
                // Gather data from modal inputs
                const bill_code = container.querySelector('#billCodeInput')?.value || '';
                const ref_code = container.querySelector('#refCodeInput')?.value || '';
                const order_date_str = container.querySelector('#orderDateInput')?.value || '';
                const creator = container.querySelector('#creatorInput')?.value || ''; // Lấy giá trị người tạo từ input
                const order_status = container.querySelector('#statusInput')?.value || 'processing';
                const serviceSelectElement = container.querySelector('#serviceNameInput');
                const service_type = serviceSelectElement ? serviceSelectElement.options[serviceSelectElement.selectedIndex].textContent.trim() : ''; // Lưu text hiển thị

                const branch = container.querySelector('#branchInput')?.value || '';
                // Lấy value của các checkbox dịch vụ cộng thêm đã chọn
                // Lần này chúng ta lưu các value khớp với form ở create-package.html
                const add_service = Array.from(container.querySelectorAll('input[type="checkbox"][name^="add_service_"]:checked')).map(cb => {
                    // Map modal checkbox value back to the value used in create-package.html
                    const modalValueToSavedValueMap = {
                        'Chữ ký': 'signature',
                        'Bảo hiểm hàng hóa': 'insurance',
                        'FUMIGATION': 'fumigation',
                        'Đóng kiện gỗ': 'packing'
                    };
                    return modalValueToSavedValueMap[cb.value.trim()] || cb.value.trim(); // Fallback to modal value if not found
                });

                const shipment_notes = container.querySelector('#noteInput')?.value || ''; // Lấy giá trị ghi chú

                // Convert date string to ISO string if valid
                let order_date = '';
                if (order_date_str) {
                    const d = new Date(order_date_str);
                    if (!isNaN(d)) order_date = d.toISOString();
                }

                // Load existing data from localStorage
                const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');

                // Update orderData object
                orderData.bill_code = bill_code;
                orderData.ref_code = ref_code;
                orderData.order_date = order_date;
                orderData.creator = creator; // Lưu giá trị người tạo vào trường creator
                orderData.order_status = order_status;
                orderData.service_type = service_type; // Lưu text hiển thị dịch vụ
                orderData.branch = branch;
                orderData.add_service = add_service; // Lưu MẢNG các value dịch vụ cộng thêm (signature, fumigation, ...)
                orderData.shipment_notes = shipment_notes; // Lưu giá trị ghi chú

                // Save updated data back to localStorage
                localStorage.setItem('currentOrderDetail', JSON.stringify(orderData));

                // Update displayed information on the page
                const section = document.querySelectorAll('.detail-section')[0];
                if (section) {
                    const pairs = section.querySelectorAll('.data-pair');
                    pairs[0].querySelector('.value').textContent = bill_code; // Mã đơn hàng
                    pairs[1].querySelector('.value').textContent = ref_code; // REF Code
                    // Display formatted date
                    pairs[2].querySelector('.value').textContent = order_date ? new Date(order_date).toLocaleString('vi-VN') : ''; // Ngày tạo
                    pairs[3].querySelector('.value').textContent = creator; // Người tạo
                    // Update status badge
                    const statusBadge = pairs[4].querySelector('.status-badge');
                    if (statusBadge) {
                        statusBadge.textContent = order_status === 'processing' ? 'Đang vận chuyển' : (order_status === 'completed' ? 'Hoàn tất' : (order_status === 'cancelled' ? 'Đã hủy' : order_status));
                        statusBadge.className = `status-badge status-${order_status}`; // Update class for styling
                    }

                    pairs[5].querySelector('.value').textContent = service_type; // Dịch vụ
                    // Display joined additional services text - use the values saved (signature, etc) and map them back to display text
                    const addServiceDisplay = add_service.map(value => {
                        // Map saved value (signature, etc) back to display text
                        const displayMap = {
                            'signature': 'Chữ Ký',
                            'insurance': 'Bảo hiểm hàng hóa',
                            'fumigation': 'FUMIGATION',
                            'packing': 'Đóng kiện gỗ'
                        };
                        return displayMap[value] || value; // Fallback if value not in map
                    }).join(' / ');
                    pairs[6].querySelector('.value').textContent = addServiceDisplay; // Dịch vụ kèm

                    pairs[7].querySelector('.value').textContent = shipment_notes; // Ghi chú
                }

                // Close the modal
                closeEditModal();
            });
        }
    }

    // Gắn sự kiện cho nút edit Bill Info (dùng loadModalContentHtml)
    document.querySelectorAll('.detail-section .edit-section:not(#editPackageDetailBtn)').forEach(function (btn) {
        btn.addEventListener('click', function () {
            loadModalContentHtml(
                '../form_package_detail/edit-bill-info-section.html',
                populateBillInfoSectionModalData,
                attachBillInfoSectionModalListeners
            );
        });
    });

    document.getElementById('editPackageDetailBtn').addEventListener('click', function () {
        loadModalContentIframe('../form_package_detail/edit-package-detail-modal.html');
    });

    document.getElementById('editReceiverBtn').addEventListener('click', function () {
        loadModalContentIframe('../form_package_detail/edit-receiver-modal.html');
    });

    document.getElementById('editSenderBtn').addEventListener('click', function () {
        loadModalContentIframe('../form_package_detail/edit-sender-modal.html');
    });

    // Add event listener for Charges section edit icon
    document.getElementById('adjustChargesTrigger').addEventListener('click', function () {
        console.log('Edit charges icon clicked'); // Add log for debugging
        loadModalContentIframe('../form_package_detail/edit-charges-modal.html');
    });

    // Add event listener for Profit section edit icon
    document.getElementById('editProfitTrigger').addEventListener('click', function () {
        console.log('Edit profit icon clicked'); // Add log for debugging
        loadModalContentIframe('../form_package_detail/edit-profit-modal.html');
    });

    // Add event listener for Agent Invoice section edit icon
    document.getElementById('editAgentInvoiceTrigger').addEventListener('click', function () {
        console.log('Edit agent invoice icon clicked'); // Add log for debugging
        loadModalContentIframe('../form_package_detail/edit-agent-invoice-modal.html');
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Lấy dữ liệu từ localStorage
    const orderData = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');

    // Hiển thị thông tin vận đơn
    document.querySelector('.page-title').textContent = `Chi tiết đơn hàng - ${orderData.bill_code || 'MTE' + Math.floor(Math.random() * 1000000)}`;

    // Hiển thị thông tin vận đơn
    const billInfoSection = document.querySelector('.detail-section');
    if (billInfoSection) {
        const billCodeValue = billInfoSection.querySelector('.data-pair:nth-child(1) .value');
        const refCodeValue = billInfoSection.querySelector('.data-pair:nth-child(2) .value');
        const orderDateValue = billInfoSection.querySelector('.data-pair:nth-child(3) .value');
        const creatorValue = billInfoSection.querySelector('.data-pair:nth-child(4) .value');
        const statusValue = billInfoSection.querySelector('.data-pair:nth-child(5) .value');
        const serviceValue = billInfoSection.querySelector('.data-pair:nth-child(6) .value');
        const addServiceValue = billInfoSection.querySelector('.data-pair:nth-child(7) .value');
        const noteValue = billInfoSection.querySelector('.data-pair:nth-child(8) .value');

        if (billCodeValue) billCodeValue.textContent = orderData.bill_code || '';
        if (refCodeValue) refCodeValue.textContent = orderData.ref_code || '';
        if (orderDateValue) {
            const date = new Date(orderData.order_date);
            orderDateValue.textContent = date.toLocaleString('vi-VN');
        }
        if (creatorValue) creatorValue.textContent = 'PHẠM HOÀNG BÌNH'; // Giá trị mặc định
        if (statusValue) {
            const statusBadge = statusValue.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = orderData.order_status === 'processing' ? 'Đang vận chuyển' : orderData.order_status;
                statusBadge.className = `status-badge status-${orderData.order_status}`;
            }
        }
        if (serviceValue) serviceValue.textContent = orderData.service_type || '';
        if (addServiceValue) {
            const addServices = Array.isArray(orderData.add_service) ? orderData.add_service.join(' / ') : orderData.add_service || '';
            addServiceValue.textContent = addServices;
        }
        if (noteValue) noteValue.textContent = orderData.shipment_notes || '';
    }

    // Hiển thị thông tin người gửi
    const senderSection = document.querySelector('.detail-column-right .detail-section:nth-child(1)');
    if (senderSection) {
        const senderNameValue = senderSection.querySelector('#senderNameValue');
        const senderPhoneValue = senderSection.querySelector('#senderPhoneValue');
        const senderAddressValue = senderSection.querySelector('#senderAddressValue');

        if (senderNameValue) senderNameValue.textContent = orderData.sender_name || '';
        if (senderPhoneValue) senderPhoneValue.textContent = orderData.sender_phone || '';
        if (senderAddressValue) {
            const address = [
                orderData.sender_address,
                orderData.sender_city,
                orderData.sender_country
            ].filter(Boolean).join(', ');
            senderAddressValue.textContent = address;
        }
    }

    // Hiển thị thông tin người nhận
    const receiverSection = document.querySelector('.detail-column-right .detail-section:nth-child(2)');
    if (receiverSection) {
        const receiverCompanyNameValue = receiverSection.querySelector('#receiverCompanyNameValue');
        const receiverNameValue = receiverSection.querySelector('#receiverNameValue');
        const receiverPhoneValue = receiverSection.querySelector('#receiverPhonesValue');
        const receiverAddressValue = receiverSection.querySelector('#receiverAddressValue');

        if (receiverCompanyNameValue) receiverCompanyNameValue.textContent = orderData.receiver_company || '';
        if (receiverNameValue) receiverNameValue.textContent = orderData.receiver_name || '';
        if (receiverPhoneValue) {
            const phones = [orderData.receiver_phone1, orderData.receiver_phone2].filter(Boolean).join(' / ');
            receiverPhoneValue.textContent = phones;
        }
        if (receiverAddressValue) {
            const address = [
                orderData.receiver_address,
                orderData.receiver_city,
                orderData.receiver_country
            ].filter(Boolean).join(', ');
            receiverAddressValue.textContent = address;
        }
    }

    // Hiển thị thông tin kích thước và cân nặng
    const dimensionsSection = document.querySelector('.agent-invoice-dim-grid');
    if (dimensionsSection && orderData.dimensions) {
        const dimRows = dimensionsSection.querySelectorAll('.dimension-row');
        orderData.dimensions.forEach((dim, index) => {
            if (dimRows[index]) {
                const calcValue = dimRows[index].querySelector('.dim-calc-value');
                const qdValue = dimRows[index].querySelector('.dim-qd-value');
                if (calcValue) {
                    const volume = (dim.length * dim.width * dim.height) / 5000;
                    calcValue.innerHTML = `<b>${dim.length}</b>x<b>${dim.width}</b>x<b>${dim.height}</b>/5000= ${volume.toFixed(2)} KG`;
                }
                if (qdValue) qdValue.textContent = `${dim.weight} KG`;
            }
        });
    }

    // Hiển thị thông tin sản phẩm
    const productSection = document.querySelector('.agent-invoice-body');
    if (productSection) {
        const productNameValue = productSection.querySelector('#agentContentValue');
        if (productNameValue) productNameValue.textContent = orderData.product_name || '';
    }

    // Hiển thị danh sách hàng hóa cho cả 2 section (nếu có nhiều bảng hàng hóa)
    const allItemsTbody = document.querySelectorAll('section.card.detail-section .table-wrapper table.data-table tbody');
    if (allItemsTbody && orderData.items && Array.isArray(orderData.items)) {
        allItemsTbody.forEach(tbody => {
            tbody.innerHTML = orderData.items.map(item => `
               <tr>
                   <td>${item.name}</td>
                   <td class="text-center value">${item.unit}</td>
                   <td class="text-center value">${item.quantity}</td>
                   <td class="text-right value">${item.price}</td>
                   <td class="text-right value">${item.total}</td>
               </tr>
           `).join('');
        });
    }

    // Render kích thước kiện hàng (Kích thước ban đầu)
    const dimGrid = document.querySelector('.agent-invoice-dim-grid');
    if (dimGrid && orderData.dimensions && Array.isArray(orderData.dimensions)) {
        let html = `
           <div class="grid-header header-calc">Kích thước ban đầu (Cm)</div>
           <div class="grid-header header-qd">Converted Weight</div>
           <div class="grid-header header-dl">Re-Weight</div>
       `;
        orderData.dimensions.forEach((dim, idx) => {
            const converted = ((dim.length * dim.width * dim.height) / 5000).toFixed(2);
            html += `
               <div class="dim-prefix">(${idx + 1}/${orderData.dimensions.length})</div>
               <div class="dim-calc-value"><b>${dim.length}</b>x<b>${dim.width}</b>x<b>${dim.height}</b>/5000= ${converted} KG</div>
               <div class="dim-qd-value">${converted} KG</div>
           `;
        });
        dimGrid.innerHTML = html;
    }

    // Render kích thước thực tế (Cm)
    const dimGridThucTe = document.querySelectorAll('.agent-invoice-dim-grid')[1];
    function customRoundKg(value) {
        const num = parseFloat(value);
        if (isNaN(num)) return '';
        return (Math.ceil(num * 2) / 2).toFixed(1);
    }
    if (dimGridThucTe && orderData.dimensions && Array.isArray(orderData.dimensions)) {
        let html = `
           <div class="grid-header header-calc">Kích thước thực tế (Cm)</div>
           <div class="grid-header header-qd">Converted Weight</div>
           <div class="grid-header header-dl">Re-Weight</div>
       `;
        orderData.dimensions.forEach((dim, idx) => {
            const converted = ((dim.length * dim.width * dim.height) / 5000).toFixed(2);
            const reweight = customRoundKg(converted);
            html += `
               <div class="dim-prefix">(${idx + 1}/${orderData.dimensions.length})</div>
               <div class="dim-calc-value"><b>${dim.length}</b>x<b>${dim.width}</b>x<b>${dim.height}</b>/5000= ${converted} KG</div>
               <div class="dim-qd-value">${converted} KG</div>
               <div class="dim-dl-value">${reweight} KG</div>
           `;
        });
        dimGridThucTe.innerHTML = html;
    }

    // Render động bảng kích thước cho cả 2 section: 'Thông số kiện hàng' và 'Khai Invoice đại lý'
    const allDimGrids = document.querySelectorAll('.agent-invoice-dim-grid');
    if (allDimGrids.length >= 4 && orderData.dimensions && Array.isArray(orderData.dimensions)) {
        // Hàm làm tròn
        function customRoundKg(value) {
            const num = parseFloat(value);
            if (isNaN(num)) return '';
            return (Math.ceil(num * 2) / 2).toFixed(1);
        }
        // Render cho từng cặp bảng (ban đầu & thực tế)
        for (let i = 0; i < 2; i++) {
            // Bảng Kích thước ban đầu (Cm)
            let html1 = `
               <div class="grid-header header-calc">Kích thước ban đầu (Cm)</div>
               <div class="grid-header header-qd">Converted Weight</div>
               <div class="grid-header header-dl">Re-Weight</div>
           `;
            orderData.dimensions.forEach((dim, idx) => {
                const converted = ((dim.length * dim.width * dim.height) / 5000).toFixed(2);
                html1 += `
                   <div class="dim-prefix">(${idx + 1}/${orderData.dimensions.length})</div>
                   <div class="dim-calc-value"><b>${dim.length}</b>x<b>${dim.width}</b>x<b>${dim.height}</b>/5000= ${converted} KG</div>
                   <div class="dim-qd-value">${converted} KG</div>
               `;
            });
            allDimGrids[i * 2].innerHTML = html1;

            // Bảng Kích thước thực tế (Cm)
            let html2 = `
               <div class="grid-header header-calc">Kích thước thực tế (Cm)</div>
               <div class="grid-header header-qd">Converted Weight</div>
               <div class="grid-header header-dl">Re-Weight</div>
           `;
            orderData.dimensions.forEach((dim, idx) => {
                const converted = ((dim.length * dim.width * dim.height) / 5000).toFixed(2);
                const reweight = customRoundKg(converted);
                html2 += `
                   <div class="dim-prefix">(${idx + 1}/${orderData.dimensions.length})</div>
                   <div class="dim-calc-value"><b>${dim.length}</b>x<b>${dim.width}</b>x<b>${dim.height}</b>/5000= ${converted} KG</div>
                   <div class="dim-qd-value">${converted} KG</div>
                   <div class="dim-dl-value">${reweight} KG</div>
               `;
            });
            allDimGrids[i * 2 + 1].innerHTML = html2;
        }
    }

});
const body = document.body;
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const mobileSidebarToggleBtn = document.getElementById('mobile-sidebar-toggle');
const desktopSidebarToggleBtn = document.querySelector('.sidebar-toggle-desktop');
const serviceTableBody = document.getElementById('service-table-body');
const selectAllCheckbox = document.getElementById('select-all-checkbox');
const currentDateSpan = document.getElementById('current-date');
const currentTimeSpan = document.getElementById('current-time');
const currentYearSpan = document.getElementById('current-year');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const notificationButton = document.getElementById('notification-button');
const notificationDropdown = document.getElementById('notification-dropdown');
const notificationList = document.getElementById('notification-list');
const announcementOverlay = document.getElementById('announcement-overlay');
const announcementBox = document.getElementById('announcement-box');
const announcementCloseBtn = document.getElementById('announcement-close-btn');
const announcementTitle = document.getElementById('announcement-title');
const announcementBody = document.getElementById('announcement-body');
const announcementTimestamp = document.getElementById('announcement-timestamp');

const manageBodyScroll = () => {
    const isSidebarOpen = body.classList.contains('sidebar-mobile-open');
    const isAnnounceVisible = announcementOverlay && announcementOverlay.classList.contains('visible');
    const isAnyOtherModalVisible = document.querySelector('.filter-modal.visible, .confirmation-modal.visible');
    if (isSidebarOpen || isAnnounceVisible || isAnyOtherModalVisible) {
        body.classList.add('overflow-hidden');
    } else {
        body.classList.remove('overflow-hidden');
    }
};

function toggleSidebarMobile() { body.classList.toggle('sidebar-mobile-open'); const isOpen = body.classList.contains('sidebar-mobile-open'); if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.setAttribute('aria-expanded', String(isOpen)); manageBodyScroll(); }
function toggleSidebarDesktop() { body.classList.toggle('sidebar-collapsed'); const isCollapsed = body.classList.contains('sidebar-collapsed'); if (desktopSidebarToggleBtn) { desktopSidebarToggleBtn.title = isCollapsed ? "Phóng Sidebar" : "Thu Sidebar"; desktopSidebarToggleBtn.querySelector('i').style.transform = isCollapsed ? 'rotate(180deg)' : ''; } if (isCollapsed) { document.querySelectorAll('.menu-items .submenu.active').forEach(submenu => { submenu.classList.remove('active'); submenu.previousElementSibling?.classList.remove('active'); }); } }
function toggleSubmenu(event) { event.preventDefault(); const parentLink = event.currentTarget; const submenuWrapper = parentLink.nextElementSibling; if (!submenuWrapper || !submenuWrapper.classList.contains('submenu')) return; if (!parentLink.classList.contains('active')) { document.querySelectorAll('.menu-items .submenu-parent.active').forEach(activeParent => { if (activeParent !== parentLink) { activeParent.classList.remove('active'); activeParent.nextElementSibling?.classList.remove('active'); } }); } submenuWrapper.classList.toggle('active'); parentLink.classList.toggle('active'); }
function initializeActiveSubmenu() { const activeLink = document.querySelector('.sidebar .menu-items > li > a.active'); const activeSubmenuLink = document.querySelector('.sidebar .submenu a.active'); if (activeSubmenuLink) { const submenuDiv = activeSubmenuLink.closest('.submenu'); const parentLink = submenuDiv?.previousElementSibling; if (submenuDiv && parentLink && parentLink.classList.contains('submenu-parent')) { if (!activeLink || activeLink !== parentLink) { submenuDiv.classList.add('active'); parentLink.classList.add('active'); } } } }
function updateDateTime() { const now = new Date(); const optionsDate = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }; const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }; try { let dayOfWeek; switch (now.getDay()) { case 0: dayOfWeek = "Sun"; break; case 1: dayOfWeek = "Mon"; break; case 2: dayOfWeek = "Tue"; break; case 3: dayOfWeek = "Wed"; break; case 4: dayOfWeek = "Thu"; break; case 5: dayOfWeek = "Fri"; break; case 6: dayOfWeek = "Sat"; break; default: dayOfWeek = ""; } const dateString = `${dayOfWeek} ${now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`; if (currentDateSpan) currentDateSpan.textContent = dateString; if (currentTimeSpan) currentTimeSpan.textContent = now.toLocaleTimeString('en-US', optionsTime); } catch (e) { if (currentDateSpan) currentDateSpan.textContent = now.toLocaleDateString(); if (currentTimeSpan) currentTimeSpan.textContent = now.toLocaleTimeString(); } if (currentYearSpan) currentYearSpan.textContent = now.getFullYear(); }
function toggleFullscreen() { if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(err => console.error(`Fullscreen error: ${err.message}`)); } else if (document.exitFullscreen) { document.exitFullscreen(); } }
function handleFullscreenChange() { const isFullscreen = !!document.fullscreenElement; const icon = fullscreenBtn?.querySelector('i'); if (icon) { icon.classList.toggle('fa-expand', !isFullscreen); icon.classList.toggle('fa-compress', isFullscreen); } if (fullscreenBtn) { fullscreenBtn.setAttribute('title', isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'); } }

function showAnnouncement() {
    if (announcementOverlay) {
        announcementOverlay.classList.add('visible');
        manageBodyScroll();
    }
}
function closeAnnouncement() {
    if (announcementOverlay) {
        announcementOverlay.classList.remove('visible');
        manageBodyScroll();
    }
}

function toggleNotificationDropdown() {
    if (notificationDropdown) {
        notificationDropdown.classList.toggle('visible');
    }
}

function closeNotificationDropdown() {
    if (notificationDropdown) {
        notificationDropdown.classList.remove('visible');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeActiveSubmenu();
    updateDateTime();
    setInterval(updateDateTime, 1000);

    if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.addEventListener('click', function () {
        if (window.innerWidth > 768) {
            body.classList.toggle('sidebar-collapsed');
        } else {
            body.classList.toggle('sidebar-mobile-open');
        }
        const isOpen = body.classList.contains('sidebar-mobile-open') || !body.classList.contains('sidebar-collapsed');
        mobileSidebarToggleBtn.setAttribute('aria-expanded', String(isOpen));
    });
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebarMobile);
    if (desktopSidebarToggleBtn) desktopSidebarToggleBtn.addEventListener('click', toggleSidebarDesktop);
    document.querySelectorAll('.menu-items .submenu-parent').forEach(link => link.addEventListener('click', toggleSubmenu));
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    if (notificationButton) {
        notificationButton.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleNotificationDropdown();
        });
    }

    if (notificationList) {
        notificationList.addEventListener('click', (event) => {
            const clickedItem = event.target.closest('.notification-item');
            if (clickedItem && announcementTitle && announcementBody && announcementTimestamp) {
                const title = clickedItem.dataset.title || 'Thông báo';
                const bodyText = clickedItem.dataset.body || 'Không có nội dung.';
                const timestamp = clickedItem.dataset.timestamp || '';

                announcementTitle.textContent = title;

                announcementBody.innerHTML = '';
                bodyText.split('||').forEach(paragraphText => {
                    if (paragraphText.trim()) {
                        const p = document.createElement('p');
                        p.textContent = paragraphText.trim();
                        announcementBody.appendChild(p);
                    }
                });

                announcementTimestamp.textContent = timestamp;

                showAnnouncement();

                closeNotificationDropdown();
            }
        });
    }

    document.addEventListener('click', (event) => {
        if (notificationDropdown && notificationDropdown.classList.contains('visible')) {
            if (!notificationDropdown.contains(event.target) && event.target !== notificationButton && !notificationButton.contains(event.target)) {
                closeNotificationDropdown();
            }
        }
    });

    if (announcementCloseBtn) announcementCloseBtn.addEventListener('click', closeAnnouncement);
    if (announcementOverlay) announcementOverlay.addEventListener('click', (event) => { if (event.target === announcementOverlay) closeAnnouncement(); });

    document.querySelector('.footer-actions .button.danger')?.addEventListener('click', () => { alert("Xóa đã chọn clicked!"); });
    document.querySelector('.footer-actions .button.primary')?.addEventListener('click', () => { alert("Thêm dịch vụ mới clicked!"); });
});

// --- Dropdown user & đăng nhập/đăng xuất ---
document.addEventListener('DOMContentLoaded', function () {
    function renderUserDropdown() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userToggle = document.getElementById('user-dropdown-toggle');
        const userDropdown = document.getElementById('user-dropdown');
        if (!userToggle || !userDropdown) return;
        if (!isLoggedIn) {
            userToggle.innerHTML = '<i class="fa-regular fa-circle-user user-icon" id="user-icon" style="color: #64748b; font-size: 1.6em;"></i>';
            userDropdown.innerHTML = '<a href="#" class="user-dropdown-item" id="login-menu-item"><i class="fa-solid fa-right-to-bracket"></i> Đăng nhập</a>';
        } else {
            userToggle.innerHTML = '<i class="fa-regular fa-circle-user user-icon" id="user-icon" style="color: #64748b; font-size: 1.6em;"></i>';
            userDropdown.innerHTML = `
               <div class="user-info">
                   <div class="user-avatar"><i class="fa-regular fa-circle-user"></i></div>
                   <div class="user-details"><h4>Phạm Hoàng Đình</h4><span class="user-role">Quản trị viên</span></div>
               </div>
               <div class="dropdown-divider"></div>
               <a href="#" class="user-dropdown-item"><i class="fa-regular fa-user"></i> Thông tin cá nhân</a>
               <a href="#" class="user-dropdown-item"><i class="fa-solid fa-gear"></i> Cài đặt tài khoản</a>
               <a href="#" class="user-dropdown-item"><i class="fa-solid fa-bell"></i> Thông báo</a>
               <a href="#" class="user-dropdown-item"><i class="fa-solid fa-shield-halved"></i> Bảo mật</a>
               <div class="dropdown-divider"></div>
               <a href="#" class="user-dropdown-item" id="logout-menu-item"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</a>
           `;
        }
        setTimeout(() => {
            const loginItem = document.getElementById('login-menu-item');
            if (loginItem) loginItem.onclick = function (e) { e.preventDefault(); window.location.href = 'login.html'; };
            const logoutItem = document.getElementById('logout-menu-item');
            if (logoutItem) logoutItem.onclick = function (e) { e.preventDefault(); localStorage.removeItem('isLoggedIn'); window.location.reload(); };
        }, 100);
    }
    renderUserDropdown();
    window.addEventListener('storage', renderUserDropdown);
    // Dropdown show/hide
    const userToggle = document.getElementById('user-dropdown-toggle');
    const userDropdown = document.getElementById('user-dropdown');
    if (userToggle && userDropdown) {
        userToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        document.addEventListener('click', function (e) {
            if (!userDropdown.contains(e.target) && e.target !== userToggle) {
                userDropdown.classList.remove('show');
            }
        });
    }
});

// Check sessionStorage flag to control process bar visibility
const processSteps = document.querySelector('.progress-steps');
const fromCreatePackageStep2 = sessionStorage.getItem('fromCreatePackageStep2');

if (processSteps) {
    if (fromCreatePackageStep2 === 'true') {
        // Show the process bar (it's visible by default unless hidden by CSS)
        processSteps.style.display = ''; // Or remove a 'hidden' class if applied by CSS
    } else {
        // Hide the process bar
        processSteps.style.display = 'none';
    }
}

// Clean up the flag after checking
sessionStorage.removeItem('fromCreatePackageStep2');

// Add event listener for the "Tạo Pickup" button
const createPickupBtn = document.getElementById('create-pickup-btn');
if (createPickupBtn) {
    createPickupBtn.addEventListener('click', function () {
        sessionStorage.setItem('fromOrderDetailToPickup', 'true');
        window.location.href = 'pickup-package.html';
    });
}

// Add event listener for the "Hoàn thành" button in the footer
const completeOrderFooterBtn = document.getElementById('complete-order-footer-btn');
if (completeOrderFooterBtn) {
    completeOrderFooterBtn.addEventListener('click', function () {
        window.location.href = 'package_manager.html';
    });
}

// --- Logic for footer button visibility based on source page ---
const sourcePage = sessionStorage.getItem('sourcePageOrderDetail');
const footerActionsDiv = document.querySelector('.footer-actions');
const completeButton = document.getElementById('complete-order-footer-btn');
const otherButtons = document.querySelectorAll('.footer-actions .button:not(#complete-order-footer-btn)');

// Tạo nút 'Quay lại'
const backButton = document.createElement('button');
backButton.className = 'button secondary'; // Hoặc class phù hợp
backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Quay lại';
backButton.style.display = 'none'; // Mặc định ẩn
backButton.addEventListener('click', function () {
    window.location.href = 'create-package-step2.html'; // Điều hướng về create-package-step2
});
// Tìm vị trí để chèn nút 'Quay lại'. Có thể chèn vào footerActionsDiv.
if (footerActionsDiv) {
    // Chèn nút Quay lại vào đầu footer-actions
    footerActionsDiv.insertBefore(backButton, footerActionsDiv.firstChild);
}

// Default: Show all buttons (as if coming from package_manager or direct access)
if (footerActionsDiv) {
    footerActionsDiv.style.display = 'flex';
}
if (completeButton) {
    completeButton.style.display = ''; // Show by default
}
otherButtons.forEach(btn => btn.style.display = ''); // Show by default

if (sourcePage === 'create-package-step2') {
    // If coming from create-package-step2, hide all buttons except "Hoàn thành" and show "Quay lại"
    if (footerActionsDiv) {
        footerActionsDiv.style.display = 'flex'; // Keep the container visible
    }
    if (completeButton) {
        completeButton.style.display = ''; // Show "Hoàn thành"
    }
    otherButtons.forEach(btn => btn.style.display = 'none'); // Hide others
    if (backButton) {
        backButton.style.display = ''; // Show "Quay lại"
    }

} else if (sourcePage === 'package-manager') {
    // If coming from package-manager, hide "Hoàn thành" and show others, hide "Quay lại"
    if (footerActionsDiv) {
        footerActionsDiv.style.display = 'flex'; // Keep the container visible
    }
    if (completeButton) {
        completeButton.style.display = 'none'; // Hide "Hoàn thành"
    }
    otherButtons.forEach(btn => btn.style.display = ''); // Show others
    if (backButton) {
        backButton.style.display = 'none'; // Hide "Quay lại"
    }
} else { // Trường hợp truy cập trực tiếp hoặc từ nguồn khác không xác định
    // Mặc định hiển thị tất cả trừ nút Quay lại
    if (backButton) {
        backButton.style.display = 'none'; // Hide "Quay lại"
    }
    if (footerActionsDiv) {
        footerActionsDiv.style.display = 'flex';
    }
    if (completeButton) {
        completeButton.style.display = ''; // Show by default
    }
    otherButtons.forEach(btn => btn.style.display = ''); // Show by default
}

// Clean up the flag after checking
sessionStorage.removeItem('sourcePageOrderDetail');
// --- End logic for footer button visibility ---

sessionStorage.setItem('sourcePageOrderDetail', 'create-package-step2');
document.addEventListener('DOMContentLoaded', function () {
    // Lắng nghe click vào nút mũi tên trên header của từng card
    document.querySelectorAll('.detail-section .toggle-arrow').forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Tìm tới card-section chứa nút này
            const card = btn.closest('.detail-section');
            if (!card) return;
            // Tìm tới phần body cần ẩn/hiện
            const body = card.querySelector('.section-body');
            if (!body) return;
            // Toggle class collapsed
            body.classList.toggle('collapsed');
            // Xoay mũi tên
            const arrow = btn.querySelector('.arrow');
            if (arrow) arrow.classList.toggle('collapsed');
        });
    });
});