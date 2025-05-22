(function() {
    // Code xử lý thêm/xóa dòng kích thước
    const form = document.getElementById('formPackageParamsModal');
    if (!form) {
        console.error("Lỗi script con: Không tìm thấy thẻ form#formPackageParamsModal");
        return;
    }

    const formBody = form.querySelector('.form-body');
    const addButton = form.querySelector('.btn-add-dim-row');
    const removeButton = form.querySelector('.btn-remove-dim-row');
    const actionsContainer = form.querySelector('.dimension-row-actions');
    const headerRow = form.querySelector('.dimension-headers');

    if (!formBody || !addButton || !removeButton || !actionsContainer || !headerRow) {
        console.error("Không tìm thấy các thành phần cần thiết cho script thêm/xóa dòng v3.");
        return;
    }

    const referenceNodeForInsert = actionsContainer;

    function createDimensionRowElements() {
        const label = document.createElement('label');
        label.className = 'dim-label';
        label.textContent = 'Kích thước (Cm):';

        const inputLength = document.createElement('input');
        inputLength.type = 'number'; inputLength.step = 'any'; inputLength.name = 'length[]';
        inputLength.className = 'control-item dim-input col2';

        const inputWidth = document.createElement('input');
        inputWidth.type = 'number'; inputWidth.step = 'any'; inputWidth.name = 'width[]';
        inputWidth.className = 'control-item dim-input col3';

        const inputHeight = document.createElement('input');
        inputHeight.type = 'number'; inputHeight.step = 'any'; inputHeight.name = 'height[]';
        inputHeight.className = 'control-item dim-input col4';

        const inputWeight = document.createElement('input');
        inputWeight.type = 'number'; inputWeight.step = 'any'; inputWeight.name = 'weight[]';
        inputWeight.className = 'control-item dim-input col5';

        return [label, inputLength, inputWidth, inputHeight, inputWeight];
    }

    function removeLastRow() {
         const dimLabels = formBody.querySelectorAll('.dim-label');
         const dimInputs = formBody.querySelectorAll('.dim-input');

         if (dimLabels.length > 1) {
             const elementsToRemove = [
                 dimLabels[dimLabels.length - 1],
                 ...Array.from(dimInputs).slice(-4)
             ];
             elementsToRemove.forEach(el => {
                 if (el && el.parentNode === formBody) {
                     formBody.removeChild(el);
                 }
             });
             updateActionsRowSpan();
         } else {
             alert("Phải có ít nhất một dòng kích thước.");
         }
    }

    function addRow() {
        const newRowElements = createDimensionRowElements();
        newRowElements.forEach(el => {
            formBody.insertBefore(el, referenceNodeForInsert);
        });
        updateActionsRowSpan();
        const firstInputNewRow = newRowElements[1];
        if(firstInputNewRow) firstInputNewRow.focus();
    }

     function updateActionsRowSpan() {
        const dimensionRowCount = formBody.querySelectorAll('.dim-label').length;
        const startRow = 4;
        actionsContainer.style.gridRow = `${startRow} / span ${dimensionRowCount}`;
    }

    removeButton.addEventListener('click', removeLastRow);
    addButton.addEventListener('click', addRow);
    updateActionsRowSpan();

    console.log("Đã gắn listener thêm/xóa dòng kích thước - ID form OK.");

    // Code xử lý load và lưu dữ liệu từ localStorage
    function initializeFormHandlers() {
        const productNameInput = document.getElementById('productNameModalCorrectId');
        const dimDivisorInput = document.getElementById('dimDivisorModalCorrectId');
        const cancelButton = document.querySelector('.modal-cancel-button');
        const confirmButton = document.querySelector('.modal-confirm-button');

        // Load dữ liệu từ localStorage
        function loadDataFromLocalStorage() {
            console.log('Loading data from localStorage...');
            try {
                const currentOrderDetail = JSON.parse(localStorage.getItem('currentOrderDetail'));
                console.log('Loaded data:', currentOrderDetail);
                
                if (currentOrderDetail) {
                    // Load thông tin cơ bản
                    if (productNameInput) productNameInput.value = currentOrderDetail.product_name || '';
                    if (dimDivisorInput) dimDivisorInput.value = currentOrderDetail.dim_divisor || 5000;

                    // Load thông tin kích thước
                    const dimensions = currentOrderDetail.dimensions || [];
                    const formBody = form.querySelector('.form-body');
                    const actionsContainer = form.querySelector('.dimension-row-actions');

                    // Xóa các dòng kích thước hiện tại (trừ dòng đầu tiên)
                    const existingLabels = formBody.querySelectorAll('.dim-label');
                    const existingInputs = formBody.querySelectorAll('.dim-input');
                    for (let i = 1; i < existingLabels.length; i++) {
                        existingLabels[i].remove();
                    }
                    for (let i = 4; i < existingInputs.length; i++) {
                        existingInputs[i].remove();
                    }

                    // Điền dữ liệu cho dòng đầu tiên
                    if (dimensions.length > 0) {
                        const firstDim = dimensions[0];
                        const inputs = formBody.querySelectorAll('.dim-input');
                        inputs[0].value = firstDim.length || '';
                        inputs[1].value = firstDim.width || '';
                        inputs[2].value = firstDim.height || '';
                        inputs[3].value = firstDim.weight || '';
                    }

                    // Thêm các dòng kích thước còn lại
                    for (let i = 1; i < dimensions.length; i++) {
                        const dim = dimensions[i];
                        const label = document.createElement('label');
                        label.className = 'dim-label';
                        label.textContent = 'Kích thước (Cm):';

                        const inputs = [
                            document.createElement('input'),
                            document.createElement('input'),
                            document.createElement('input'),
                            document.createElement('input')
                        ];

                        inputs.forEach((input, index) => {
                            input.type = 'number';
                            input.step = 'any';
                            input.className = `control-item dim-input col${index + 2}`;
                            input.name = ['length[]', 'width[]', 'height[]', 'weight[]'][index];
                            input.value = [dim.length, dim.width, dim.height, dim.weight][index] || '';
                        });

                        formBody.insertBefore(label, actionsContainer);
                        inputs.forEach(input => formBody.insertBefore(input, actionsContainer));
                    }

                    // Cập nhật vị trí của nút thêm/xóa
                    const dimensionRowCount = formBody.querySelectorAll('.dim-label').length;
                    actionsContainer.style.gridRow = `4 / span ${dimensionRowCount}`;
                }
            } catch (error) {
                console.error('Lỗi khi load dữ liệu từ localStorage:', error);
            }
        }

        // Lưu dữ liệu vào localStorage khi xác nhận
        function saveDataToLocalStorage() {
            try {
                const currentOrderDetail = JSON.parse(localStorage.getItem('currentOrderDetail')) || {};
                
                // Lưu thông tin cơ bản
                currentOrderDetail.product_name = productNameInput.value;
                currentOrderDetail.dim_divisor = parseFloat(dimDivisorInput.value) || 5000;

                // Lưu thông tin kích thước
                const dimensions = [];
                const lengthInputs = form.querySelectorAll('input[name="length[]"]');
                const widthInputs = form.querySelectorAll('input[name="width[]"]');
                const heightInputs = form.querySelectorAll('input[name="height[]"]');
                const weightInputs = form.querySelectorAll('input[name="weight[]"]');

                for (let i = 0; i < lengthInputs.length; i++) {
                    dimensions.push({
                        length: parseFloat(lengthInputs[i].value) || 0,
                        width: parseFloat(widthInputs[i].value) || 0,
                        height: parseFloat(heightInputs[i].value) || 0,
                        weight: parseFloat(weightInputs[i].value) || 0
                    });
                }

                currentOrderDetail.dimensions = dimensions;
                localStorage.setItem('currentOrderDetail', JSON.stringify(currentOrderDetail));

                // Thông báo thành công
                alert('Đã cập nhật thông tin kiện hàng thành công!');
                
                // Dispatch event để thông báo cho trang chính biết dữ liệu đã được cập nhật
                document.dispatchEvent(new CustomEvent('packageParamsUpdated', {
                    detail: currentOrderDetail
                }));
                
                // Đóng modal
                const modal = document.querySelector('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            } catch (error) {
                console.error('Lỗi khi lưu dữ liệu vào localStorage:', error);
                alert('Có lỗi xảy ra khi lưu thông tin!');
            }
        }

        // Gắn sự kiện cho các nút
        if (cancelButton) {
            cancelButton.addEventListener('click', function() {
                const modal = document.querySelector('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        }

        if (confirmButton) {
            confirmButton.addEventListener('click', saveDataToLocalStorage);
        }

        // Load dữ liệu ban đầu
        loadDataFromLocalStorage();
    }

    // Khởi tạo handlers khi DOM đã sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFormHandlers);
    } else {
        initializeFormHandlers();
    }

    // Thêm event listener cho việc mở modal
    document.addEventListener('showModal', function(event) {
        if (event.detail && event.detail.modalId === 'packageParamsModal') {
            console.log('Modal opened, loading data...');
            initializeFormHandlers();
        }
    });

    // Thêm event listener cho việc đóng modal
    document.addEventListener('hideModal', function(event) {
        if (event.detail && event.detail.modalId === 'packageParamsModal') {
            console.log('Modal closed');
        }
    });

    // Thêm event listener cho việc cập nhật dữ liệu từ trang chính
    document.addEventListener('updatePackageParams', function(event) {
        if (event.detail) {
            console.log('Received update from parent page:', event.detail);
            localStorage.setItem('currentOrderDetail', JSON.stringify(event.detail));
            initializeFormHandlers();
        }
    });

})();