const body = document.body;
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const mobileSidebarToggleBtn = document.getElementById('mobile-sidebar-toggle');
        const desktopSidebarToggleBtn = document.querySelector('.sidebar-toggle-desktop');
        const currentDateSpan = document.getElementById('current-date');
        const currentTimeSpan = document.getElementById('current-time');
        const currentYearSpan = document.getElementById('current-year');
        const fullscreenBtn = document.getElementById('fullscreen-btn');

        const isElementVisible = (el) => el && !el.hasAttribute('hidden') && el.offsetParent !== null;

        const manageBodyScroll = () => {
            const isSidebarOpen = body.classList.contains('sidebar-mobile-open');
            const isAnyModalVisible = document.querySelector('.confirmation-modal.visible, .announcement-overlay.visible');
            if (isSidebarOpen || isAnyModalVisible) {
                body.classList.add('overflow-hidden');
            } else {
                body.classList.remove('overflow-hidden');
            }
        };

        function toggleSidebarMobileOrDesktop() {
            if (window.innerWidth > 768) {
                body.classList.toggle('sidebar-collapsed');
            } else {
                body.classList.toggle('sidebar-mobile-open');
            }
            const isOpen = body.classList.contains('sidebar-mobile-open') || !body.classList.contains('sidebar-collapsed');
            if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.setAttribute('aria-expanded', String(isOpen));
            manageBodyScroll();
        }

        function toggleSidebarDesktop() {
            body.classList.toggle('sidebar-collapsed');
            const isCollapsed = body.classList.contains('sidebar-collapsed');
            if (desktopSidebarToggleBtn) {
                desktopSidebarToggleBtn.title = isCollapsed ? "Phóng Sidebar" : "Thu Sidebar";
                const icon = desktopSidebarToggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-arrow-left', !isCollapsed);
                    icon.classList.toggle('fa-arrow-right', isCollapsed);
                }
            }
            if (isCollapsed && window.innerWidth > 768) {
                document.querySelectorAll('.menu-items .submenu.active').forEach(submenu => {
                    submenu.classList.remove('active');
                    const parentLink = submenu.previousElementSibling;
                    if(parentLink && parentLink.classList.contains('submenu-parent')) {
                        parentLink.classList.remove('active');
                        parentLink.querySelector('.submenu-arrow')?.style.setProperty('transform', 'rotate(0deg)');
                    }
                });
            } else {
                 initializeActiveSubmenu();
            }
        }

        function toggleSubmenu(event) {
            event.preventDefault();
            if (body.classList.contains('sidebar-collapsed') && window.innerWidth > 768) {
                return;
            }
            const parentLink = event.currentTarget;
            const submenuWrapper = parentLink.nextElementSibling;
            const arrow = parentLink.querySelector('.submenu-arrow');
            if (!submenuWrapper || !submenuWrapper.classList.contains('submenu')) return;
            const isActive = submenuWrapper.classList.contains('active');

            document.querySelectorAll('.menu-items .submenu-parent.active').forEach(activeParent => {
                if (activeParent !== parentLink) {
                    activeParent.classList.remove('active');
                    const otherSubmenu = activeParent.nextElementSibling;
                     if (otherSubmenu && otherSubmenu.classList.contains('submenu')) {
                         otherSubmenu.classList.remove('active');
                     }
                     const otherArrow = activeParent.querySelector('.submenu-arrow');
                     if (otherArrow) otherArrow.style.setProperty('transform', 'rotate(0deg)');
                }
            });

            submenuWrapper.classList.toggle('active');
            parentLink.classList.toggle('active', !isActive);
             if (arrow) arrow.style.setProperty('transform', !isActive ? 'rotate(180deg)' : 'rotate(0deg)');
        }

        function initializeActiveSubmenu() {
            document.querySelectorAll('.menu-items .submenu-parent').forEach(parentLink => {
                 const submenuDiv = parentLink.nextElementSibling;
                 const arrow = parentLink.querySelector('.submenu-arrow');
                 if (submenuDiv?.classList.contains('submenu')) {
                     const hasActiveChild = submenuDiv.querySelector('a.active');
                     const shouldBeActive = hasActiveChild && (!body.classList.contains('sidebar-collapsed') || window.innerWidth <= 768);

                     submenuDiv.classList.toggle('active', shouldBeActive);
                     parentLink.classList.toggle('active', shouldBeActive);
                     if (arrow) arrow.style.setProperty('transform', shouldBeActive ? 'rotate(180deg)' : 'rotate(0deg)');
                 }
            });
        }

        function showConfirmationModal(modalId, targetInfo = {}) {
            const modal = document.getElementById(modalId);
            if (!modal) { console.error("Modal not found:", modalId); return; }
            modal.dataset.targetInfo = JSON.stringify(targetInfo);
            modal.classList.add('visible');
            manageBodyScroll();
        }

        function hideConfirmationModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                delete modal.dataset.targetInfo;
                modal.classList.remove('visible');
                manageBodyScroll();
            }
        }

        function updateDateTime() {
            const now = new Date();
            const optionsDate = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' };
            const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            try {
                if (currentDateSpan) currentDateSpan.textContent = now.toLocaleDateString('en-GB', optionsDate).replace(/,/g, '');
                if (currentTimeSpan) currentTimeSpan.textContent = now.toLocaleTimeString('en-US', optionsTime);
            } catch (e) {
                if (currentDateSpan) currentDateSpan.textContent = now.toLocaleDateString();
                if (currentTimeSpan) currentTimeSpan.textContent = now.toLocaleTimeString();
            }
            if (currentYearSpan) currentYearSpan.textContent = now.getFullYear();
        }

        function toggleFullscreen() {
             if (!document.fullscreenElement) {
                 document.documentElement.requestFullscreen().catch(err => console.error(`Fullscreen error: ${err.message} (${err.name})`));
             } else if (document.exitFullscreen) {
                 document.exitFullscreen();
             }
        }

        function handleFullscreenChange() {
             const isFullscreen = !!document.fullscreenElement;
             const icon = fullscreenBtn?.querySelector('i');
             if(icon){
                 icon.classList.toggle('fa-expand', !isFullscreen);
                 icon.classList.toggle('fa-compress', isFullscreen);
             }
              if(fullscreenBtn) {
                  fullscreenBtn.setAttribute('title', isFullscreen ? 'Exit Fullscreen' : 'Fullscreen');
              }
        }

        function handleFormSubmit(event) {
             event.preventDefault();
             const form = document.getElementById('pickup-order-form');
             const confirmCheckbox = document.getElementById('confirm_info_pickup');
             if (!form.checkValidity()) { form.reportValidity(); return; }
             if (!confirmCheckbox.checked) { alert('Vui lòng xác nhận đã đọc kỹ và kiểm tra thông tin.'); return false; }
             const formData = new FormData(form);
             const fileInput = document.getElementById('pickup_images');
             const displayedFilesList = document.getElementById('selected_files_list');
             const currentFiles = Array.from(fileInput.files);
             const displayedFileNames = Array.from(displayedFilesList.querySelectorAll('li [data-file-name]')).map(btn => btn.dataset.fileName);
             currentFiles.forEach(file => { if (displayedFileNames.includes(file.name)) { formData.append(fileInput.name, file); } });
             console.log('Submitting form data:');
             for (let [key, value] of formData.entries()) { if (value instanceof File) { console.log(`${key}: ${value.name}`); } else { console.log(`${key}: ${value}`); } }
              alert('Thông tin Pickup đã được hoàn thành (demo)!');
        }

        function handleSaveDraft() {
              console.log('Save Draft clicked');
              const form = document.getElementById('pickup-order-form');
              const formData = new FormData(form);
              console.log('Saving draft data:', Object.fromEntries(formData));
              alert('Đã lưu nháp thông tin (demo)!');
        }

        function handleFileSelection(event) {
             const fileListDisplay = document.getElementById('selected_files_list');
             const files = event.target.files;
             let existingFileNames = [];
             if (fileListDisplay.querySelector('ul')) { existingFileNames = Array.from(fileListDisplay.querySelectorAll('li [data-file-name]')).map(btn => btn.dataset.fileName); }
             const uniqueFilesMap = new Map();
             const originalFileInput = document.getElementById('pickup_images');
             Array.from(originalFileInput.files).forEach(file => { if (existingFileNames.includes(file.name)) { uniqueFilesMap.set(file.name, file); } });
             Array.from(files).forEach(file => { uniqueFilesMap.set(file.name, file); });
             fileListDisplay.innerHTML = '';
             if (uniqueFilesMap.size > 0) {
                 const list = document.createElement('ul');
                 uniqueFilesMap.forEach((file) => {
                     const listItem = document.createElement('li');
                     listItem.textContent = file.name;
                     const removeBtn = document.createElement('button');
                     removeBtn.type = 'button'; removeBtn.className = 'remove-file-btn'; removeBtn.innerHTML = '×'; removeBtn.title = 'Gỡ bỏ file này'; removeBtn.dataset.fileName = file.name; listItem.appendChild(removeBtn);
                     
                     // Create image preview element
                     const imgPreview = document.createElement('img');
                     imgPreview.style.maxWidth = '50px'; // Set max width for preview
                     imgPreview.style.maxHeight = '50px'; // Set max height for preview
                     imgPreview.style.marginRight = '10px'; // Add some space
                     imgPreview.style.verticalAlign = 'middle';
                     imgPreview.style.border = '1px solid #ddd'; // Optional border
                     imgPreview.style.borderRadius = '4px'; // Optional border radius
                     imgPreview.style.objectFit = 'cover'; // Cover the area without stretching
                     
                     // Use FileReader to read the image file
                     const reader = new FileReader();
                     reader.onload = function(e) {
                         imgPreview.src = e.target.result;
                     }
                     // Check if the file is an image before reading
                     if (file.type.startsWith('image/')) {
                         reader.readAsDataURL(file);
                         listItem.prepend(imgPreview); // Add image before text
                     } else {
                          // Optionally handle non-image files, maybe show a file icon
                          // For now, just add text content if not an image
                     }
                     
                     list.appendChild(listItem);
                 });
                 fileListDisplay.appendChild(list);
                 const dataTransfer = new DataTransfer();
                 uniqueFilesMap.forEach(file => dataTransfer.items.add(file));
                 originalFileInput.files = dataTransfer.files;
             } else {
                 fileListDisplay.innerHTML = '<i>Chưa chọn file nào.</i>';
                 originalFileInput.value = '';
             }
        }

        function handleRemoveFile(event) {
              if (event.target.classList.contains('remove-file-btn')) {
                  const fileNameToRemove = event.target.dataset.fileName;
                  const fileInput = document.getElementById('pickup_images');
                  const fileListDisplay = document.getElementById('selected_files_list');
                  const currentFiles = Array.from(fileInput.files);
                  const dataTransfer = new DataTransfer();
                  let fileRemoved = false;
                  currentFiles.forEach(file => { if (file.name !== fileNameToRemove) { dataTransfer.items.add(file); } else { fileRemoved = true; } });
                  fileInput.files = dataTransfer.files;
                  if (fileRemoved) { event.target.closest('li').remove(); }
                  if (!fileListDisplay.querySelector('li')) { fileListDisplay.innerHTML = '<i>Chưa chọn file nào.</i>'; }
                  console.log(`Removed ${fileNameToRemove}. Updated FileList:`, fileInput.files);
              }
        }

        document.addEventListener('DOMContentLoaded', () => {
            initializeActiveSubmenu();
            updateDateTime();
            setInterval(updateDateTime, 1000);

            if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.addEventListener('click', toggleSidebarMobileOrDesktop);
            if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebarMobileOrDesktop);
            if (desktopSidebarToggleBtn) desktopSidebarToggleBtn.addEventListener('click', toggleSidebarDesktop);
            document.querySelectorAll('.menu-items .submenu-parent').forEach(link => link.addEventListener('click', toggleSubmenu));

            document.querySelectorAll('.confirmation-modal').forEach(modal => {
                const modalId = modal.id;
                modal.querySelector('.confirm-yes')?.addEventListener('click', () => {
                    const info = JSON.parse(modal.dataset.targetInfo || '{}');
                    console.log(`CONFIRMED: ${modalId}`, info);
                    hideConfirmationModal(modalId);
                 });
                modal.querySelector('.confirm-cancel')?.addEventListener('click', () => hideConfirmationModal(modalId));
                modal.addEventListener('click', (event) => { if (event.target === modal) hideConfirmationModal(modalId); });
            });

             if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
             document.addEventListener('fullscreenchange', handleFullscreenChange);

            const form = document.getElementById('pickup-order-form');
            const saveDraftButton = document.querySelector('.btn-save-draft');
            const selectImagesBtn = document.getElementById('select_images_btn');
            const fileInput = document.getElementById('pickup_images');
            const fileListDisplay = document.getElementById('selected_files_list');

            if (form) form.addEventListener('submit', handleFormSubmit);
            if (saveDraftButton) saveDraftButton.addEventListener('click', handleSaveDraft);
            if (selectImagesBtn && fileInput) selectImagesBtn.addEventListener('click', () => fileInput.click() );
            if (fileInput && fileListDisplay) fileInput.addEventListener('change', handleFileSelection);
            if (fileListDisplay) fileListDisplay.addEventListener('click', handleRemoveFile);

             if (window.innerWidth > 768 && desktopSidebarToggleBtn) {
                  const isCollapsed = body.classList.contains('sidebar-collapsed');
                  const icon = desktopSidebarToggleBtn.querySelector('i');
                  if (icon) {
                    icon.classList.toggle('fa-arrow-left', !isCollapsed);
                    icon.classList.toggle('fa-arrow-right', isCollapsed);
                  }
             }
        });

        document.addEventListener('DOMContentLoaded', () => {
            const notificationBody = document.body;
            const notificationButton = document.getElementById('notification-button');
            const notificationDropdown = document.getElementById('notification-dropdown');
            const notificationList = document.getElementById('notification-list');
            const announcementOverlay = document.getElementById('announcement-overlay');
            const announcementBox = document.getElementById('announcement-box');
            const announcementCloseBtn = document.getElementById('announcement-close-btn');
            const announcementTitle = document.getElementById('announcement-title');
            const announcementBodyEl = document.getElementById('announcement-body');
            const announcementTimestamp = document.getElementById('announcement-timestamp');

            const manageNotificationBodyScroll = () => {
                const isAnnounceVisible = announcementOverlay && announcementOverlay.classList.contains('visible');
                const isAnyOtherModalVisible = false;

                if (isAnnounceVisible || isAnyOtherModalVisible) {
                    notificationBody.classList.add('overflow-hidden');
                } else {
                    if (!isAnyOtherModalVisible) {
                         notificationBody.classList.remove('overflow-hidden');
                    }
                }
            };

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

            function showAnnouncement() {
                if (announcementOverlay) {
                    announcementOverlay.classList.add('visible');
                    manageNotificationBodyScroll();
                }
            }

            function closeAnnouncement() {
                if (announcementOverlay) {
                    announcementOverlay.classList.remove('visible');
                    manageNotificationBodyScroll();
                }
            }

            if (announcementOverlay && announcementOverlay.classList.contains('visible')) {
                closeAnnouncement();
            }

            if (notificationButton) {
                notificationButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    toggleNotificationDropdown();
                });
            }

            if (notificationList) {
                notificationList.addEventListener('click', (event) => {
                    const clickedItem = event.target.closest('.notification-item');
                    if (clickedItem && announcementTitle && announcementBodyEl && announcementTimestamp) {
                        const title = clickedItem.dataset.title || 'Thông báo';
                        const bodyText = clickedItem.dataset.body || 'Không có nội dung.';
                        const timestamp = clickedItem.dataset.timestamp || '';

                        announcementTitle.textContent = title;
                        announcementBodyEl.innerHTML = '';
                        bodyText.split('||').forEach(paragraphText => {
                            if(paragraphText.trim()) {
                                const p = document.createElement('p');
                                p.textContent = paragraphText.trim();
                                announcementBodyEl.appendChild(p);
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

            if (announcementCloseBtn) {
                announcementCloseBtn.addEventListener('click', closeAnnouncement);
            }

            if (announcementOverlay) {
                announcementOverlay.addEventListener('click', (event) => {
                    if (event.target === announcementOverlay) {
                        closeAnnouncement();
                    }
                });
            }

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    if (announcementOverlay && announcementOverlay.classList.contains('visible')) {
                        closeAnnouncement();
                    } else if (notificationDropdown && notificationDropdown.classList.contains('visible')) {
                        closeNotificationDropdown();
                    }
                }
            });
        });

        // --- Dropdown user ---
        const userToggle = document.getElementById('user-dropdown-toggle');
        const userDropdown = document.getElementById('user-dropdown');
        if(userToggle && userDropdown){
            userToggle.addEventListener('click', function(e){
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
            document.addEventListener('click', function(e){
                if(!userDropdown.contains(e.target) && e.target !== userToggle){
                    userDropdown.classList.remove('show');
                }
            });
        }
        document.addEventListener('DOMContentLoaded', function() {
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
                    if (loginItem) loginItem.onclick = function(e) { e.preventDefault(); window.location.href = 'login.html'; };
                    const logoutItem = document.getElementById('logout-menu-item');
                    if (logoutItem) logoutItem.onclick = function(e) { e.preventDefault(); localStorage.removeItem('isLoggedIn'); window.location.reload(); };
                }, 100);
            }
            renderUserDropdown();
            window.addEventListener('storage', renderUserDropdown);
        });

        // --- Render thông tin đơn hàng động từ localStorage ---
        document.addEventListener('DOMContentLoaded', function() {
            const data = JSON.parse(localStorage.getItem('currentOrderDetail') || '{}');
            const infoSection = document.getElementById('order-info-dynamic');
            const creatorInfo = document.getElementById('order-creator-info');
            if (!data || Object.keys(data).length === 0) {
                infoSection.innerHTML = '<div style="color:red;padding:12px 0;">Không có dữ liệu đơn hàng!</div>';
                creatorInfo.textContent = 'Người tạo: ...';
                return;
            }
            // Tính tổng cân nặng và số kiện
            let totalWeight = '';
            let soKien = '';
            if (Array.isArray(data.dimensions) && data.dimensions.length > 0) {
                totalWeight = data.dimensions.reduce((sum, d) => sum + (parseFloat(d.weight)||0), 0).toFixed(1) + ' Kg';
                soKien = data.dimensions.length;
            }
            // Số điện thoại: chỉ lấy 1 số người gửi
            let phones = data.sender_phone || '';
            // Hàng dễ vỡ
            let fragile = (data.is_fragile == '1' || data.is_fragile === true || data.is_fragile === 'true') ? 'Yes' : 'No';
            // Render HTML
            const html = `
                <div class="info-pair"> <span class="info-label">Tên Công ty:</span> <span class="info-value">${data.sender_company || ''}</span> </div>
                <div class="info-pair"> <span class="info-label">Tên người gửi:</span> <span class="info-value">${data.sender_name || ''}</span> </div>
                <div class="info-pair"> <span class="info-label">Số điện thoại:</span> <span class="info-value">${phones}</span> </div>
                <div class="info-pair"> <span class="info-label">Cân nặng:</span> <span class="info-value">${totalWeight}</span> </div>
                <div class="info-pair"> <span class="info-label">Số lượng kiện:</span> <span class="info-value">${soKien}</span> </div>
                <div class="info-pair"> <span class="info-label">Tên hàng hóa:</span> <span class="info-value">${data.product_name || ''}</span> </div>
                <div class="info-pair-row">
                    <div class="info-sub-pair"> <span class="info-label">Chi nhánh:</span> <span class="info-value">${data.branch || ''}</span> </div>
                    <div class="info-sub-pair"> <span class="info-label">Hình thức gửi:</span> <span class="info-value">${data.pickup_method || ''}</span> </div>
                </div>
                <div class="info-pair"> <span class="info-label">Hàng dễ vỡ:</span> <span class="info-value">${fragile}</span> </div>
                <div class="info-pair"> <span class="info-label">Dịch vụ:</span> <span class="info-value">${data.service_type || ''}</span> </div>
                <div class="info-pair"> <span class="info-label">Đại lý:</span> <span class="info-value">${data.agent || ''}</span> </div>
                <div class="info-pair"> <span class="info-label">Địa chỉ:</span> <span class="info-value">${data.sender_address || ''}</span> </div>
            `;
            infoSection.innerHTML = html;
            creatorInfo.textContent = 'Người tạo: ' + (data.creator || 'Phạm Hoàng Đình - S1');
        });

        // --- Lưu toàn bộ dữ liệu form (bao gồm ảnh) vào localStorage khi submit ---
        document.getElementById('pickup-order-form').addEventListener('submit', function(e) {
            e.preventDefault();

            // Lấy dữ liệu từ các bước trước (nếu có)
            const step1Data = JSON.parse(localStorage.getItem('createPackageWizardData') || localStorage.getItem('createPackageStep1') || '{}');

            const data = {
                pickup_vehicle: document.getElementById('pickup_vehicle').value,
                pickup_time: document.getElementById('pickup_time').value,
                pickup_address: document.getElementById('pickup_address').value,
                pickup_notes: document.getElementById('pickup_notes').value,
                pickup_status: document.getElementById('pickup_status').value,
                pickup_cs: document.getElementById('pickup_cs').value,
                received_time: document.getElementById('received_time').value,
                export_time: document.getElementById('export_time').value,
                status_notes: document.getElementById('status_notes').value,
                // images will be handled separately
            };

            // Gom dữ liệu từ các bước trước và bước hiện tại
            const completeOrderData = { ...step1Data, ...data };

            // Xử lý ảnh: Đọc file ảnh và chuyển sang Base64 để lưu vào localStorage
            const fileInput = document.getElementById('pickup_images');
            const files = Array.from(fileInput.files);
            const imagePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = (e) => reject(e);
                    reader.readAsDataURL(file);
                });
            });

            // Chờ tất cả ảnh được đọc xong, sau đó lưu toàn bộ dữ liệu
            Promise.all(imagePromises).then(base64Images => {
                completeOrderData.pickup_images_base64 = base64Images; // Lưu mảng base64
                // Lưu toàn bộ object đơn hàng vào localStorage
                localStorage.setItem('pickupOrder', JSON.stringify(completeOrderData));
                console.log('Order data saved to localStorage under key "pickupOrder":', completeOrderData);

                // Chuyển hướng về trang quản lý đơn hàng sau khi lưu
                alert('Thông tin Pickup đã được hoàn thành và lưu!'); // Giữ lại alert
                window.location.href = 'package_manager.html'; // Chuyển hướng

            }).catch(error => {
                console.error('Error reading image files:', error);
                alert('Đã xảy ra lỗi khi xử lý ảnh.');
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            // Khởi tạo datetime picker cho pickup_time
            const pickupTimeInput = document.getElementById('pickup_time');
            if (pickupTimeInput) {
                const picker = new tempusDominus.TempusDominus(pickupTimeInput, {
                    display: {
                        components: {
                            decades: true,
                            year: true,
                            month: true,
                            date: true,
                            hours: true,
                            minutes: true,
                            seconds: false,
                            useTwentyfourHour: true
                        },
                        icons: {
                            type: 'icons',
                            time: 'fa fa-clock',
                            date: 'fa fa-calendar',
                            up: 'fa fa-arrow-up',
                            down: 'fa fa-arrow-down',
                            previous: 'fa fa-chevron-left',
                            next: 'fa fa-chevron-right',
                            today: 'fa fa-calendar-check',
                            clear: 'fa fa-trash',
                            close: 'fa fa-times'
                        }
                    },
                    localization: {
                        format: 'dd/MM/yyyy HH:mm'
                    }
                });
                picker.subscribe('change.datetimepicker', (e) => {
                    if (e.detail.date) {
                        const selectedDate = e.detail.date;
                        const year = selectedDate.getFullYear();
                        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                        const day = selectedDate.getDate().toString().padStart(2, '0');
                        const hours = selectedDate.getHours().toString().padStart(2, '0');
                        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

                        pickupTimeInput.value = formattedDate;
                        console.log('Pickup Time selected:', formattedDate);
                    } else {
                        pickupTimeInput.value = '';
                        console.log('Pickup Time cleared');
                    }
                });
            }

            // Khởi tạo datetime picker cho received_time
            const receivedTimeInput = document.getElementById('received_time');
            if (receivedTimeInput) {
                const picker = new tempusDominus.TempusDominus(receivedTimeInput, {
                    display: {
                        components: {
                            decades: true,
                            year: true,
                            month: true,
                            date: true,
                            hours: true,
                            minutes: true,
                            seconds: false,
                            useTwentyfourHour: true
                        },
                        icons: {
                            type: 'icons',
                            time: 'fa fa-clock',
                            date: 'fa fa-calendar',
                            up: 'fa fa-arrow-up',
                            down: 'fa fa-arrow-down',
                            previous: 'fa fa-chevron-left',
                            next: 'fa fa-chevron-right',
                            today: 'fa fa-calendar-check',
                            clear: 'fa fa-trash',
                            close: 'fa fa-times'
                        }
                    },
                    localization: {
                        format: 'dd/MM/yyyy HH:mm'
                    }
                });
                picker.subscribe('change.datetimepicker', (e) => {
                    if (e.detail.date) {
                        const selectedDate = e.detail.date;
                        const year = selectedDate.getFullYear();
                        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                        const day = selectedDate.getDate().toString().padStart(2, '0');
                        const hours = selectedDate.getHours().toString().padStart(2, '0');
                        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

                        receivedTimeInput.value = formattedDate;
                        console.log('Received Time selected:', formattedDate);
                    } else {
                        receivedTimeInput.value = '';
                        console.log('Received Time cleared');
                    }
                });
            }

            // Khởi tạo datetime picker cho export_time
            const exportTimeInput = document.getElementById('export_time');
            if (exportTimeInput) {
                const picker = new tempusDominus.TempusDominus(exportTimeInput, {
                    display: {
                        components: {
                            decades: true,
                            year: true,
                            month: true,
                            date: true,
                            hours: true,
                            minutes: true,
                            seconds: false,
                            useTwentyfourHour: true
                        },
                        icons: {
                            type: 'icons',
                            time: 'fa fa-clock',
                            date: 'fa fa-calendar',
                            up: 'fa fa-arrow-up',
                            down: 'fa fa-arrow-down',
                            previous: 'fa fa-chevron-left',
                            next: 'fa fa-chevron-right',
                            today: 'fa fa-calendar-check',
                            clear: 'fa fa-trash',
                            close: 'fa fa-times'
                        }
                    },
                    localization: {
                        format: 'dd/MM/yyyy HH:mm'
                    }
                });
                picker.subscribe('change.datetimepicker', (e) => {
                    if (e.detail.date) {
                        const selectedDate = e.detail.date;
                        const year = selectedDate.getFullYear();
                        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                        const day = selectedDate.getDate().toString().padStart(2, '0');
                        const hours = selectedDate.getHours().toString().padStart(2, '0');
                        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

                        exportTimeInput.value = formattedDate;
                        console.log('Export Time selected:', formattedDate);
                    } else {
                        exportTimeInput.value = '';
                        console.log('Export Time cleared');
                    }
                });
            }
        });