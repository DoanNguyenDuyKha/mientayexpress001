document.addEventListener('DOMContentLoaded', function () {
    // --- Sidebar & Submenu ---
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const mobileSidebarToggleBtn = document.getElementById('mobile-sidebar-toggle');
    const desktopSidebarToggleBtn = document.querySelector('.sidebar-toggle-desktop');
    function manageBodyScroll() {
        const isSidebarOpen = body.classList.contains('sidebar-mobile-open');
        const isAnyModalVisible = document.querySelector('.confirmation-modal.visible, .filter-modal.visible, .announcement-overlay.visible');
        if (isSidebarOpen || isAnyModalVisible) {
            body.classList.add('overflow-hidden');
        } else {
            body.classList.remove('overflow-hidden');
        }
    }
    function toggleSidebarMobile() {
        body.classList.toggle('sidebar-mobile-open');
        manageBodyScroll();
    }
    function toggleSidebarDesktop() {
        body.classList.toggle('sidebar-collapsed');
        manageBodyScroll();
    }
    function toggleSidebarMobileOrDesktop() {
        if (window.innerWidth > 768) {
            toggleSidebarDesktop();
        } else {
            toggleSidebarMobile();
        }
        const isOpen = body.classList.contains('sidebar-mobile-open') || !body.classList.contains('sidebar-collapsed');
        if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.setAttribute('aria-expanded', String(isOpen));
    }
    function toggleSubmenu(event) {
        event.preventDefault();
        if (body.classList.contains('sidebar-collapsed') && window.innerWidth > 768) return;
        const parentLink = event.currentTarget;
        const submenuWrapper = parentLink.nextElementSibling;
        if (!submenuWrapper || !submenuWrapper.classList.contains('submenu')) return;
        if (!parentLink.classList.contains('active')) {
            document.querySelectorAll('.menu-items .submenu-parent.active').forEach(activeParent => {
                if (activeParent !== parentLink) {
                    activeParent.classList.remove('active');
                    activeParent.nextElementSibling?.classList.remove('active');
                }
            });
        }
        submenuWrapper.classList.toggle('active');
        parentLink.classList.toggle('active');
    }
    function initializeActiveSubmenu() {
        const activeSubmenuLink = document.querySelector('.sidebar .submenu a.active');
        if (activeSubmenuLink) {
            const submenuDiv = activeSubmenuLink.closest('.submenu');
            const parentLink = submenuDiv?.previousElementSibling;
            if (submenuDiv && parentLink && parentLink.classList.contains('submenu-parent')) {
                submenuDiv.classList.add('active');
                parentLink.classList.add('active');
            }
        }
    }
    initializeActiveSubmenu();
    if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.addEventListener('click', toggleSidebarMobileOrDesktop);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebarMobile);
    if (desktopSidebarToggleBtn) desktopSidebarToggleBtn.addEventListener('click', toggleSidebarDesktop);
    document.querySelectorAll('.menu-items .submenu-parent').forEach(link => link.addEventListener('click', toggleSubmenu));

    // --- Notification & Announcement Modal ---
    const notificationButton = document.getElementById('notification-button');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const notificationList = document.getElementById('notification-list');
    const announcementOverlay = document.getElementById('announcement-overlay');
    const announcementBox = document.getElementById('announcement-box');
    const announcementCloseBtn = document.getElementById('announcement-close-btn');
    const announcementTitle = document.getElementById('announcement-title');
    const announcementBody = document.getElementById('announcement-body');
    const announcementTimestamp = document.getElementById('announcement-timestamp');
    function showAnnouncement() {
        if (announcementOverlay) {
            announcementOverlay.classList.add('visible');
            announcementOverlay.style.display = 'flex';
            updateHeaderBlur();
            if (typeof manageBodyScroll === 'function') manageBodyScroll();
        }
    }
    function closeAnnouncement() {
        if (announcementOverlay) {
            announcementOverlay.classList.remove('visible');
            setTimeout(() => { announcementOverlay.style.display = 'none'; updateHeaderBlur(); }, 200);
            updateHeaderBlur();
            if (typeof manageBodyScroll === 'function') manageBodyScroll();
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

    // --- Dropdown user & đăng nhập/đăng xuất ---
    function renderUserDropdown() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userToggle = document.getElementById('user-dropdown-toggle');
        const userDropdown = document.getElementById('user-dropdown');
        if (!userToggle || !userDropdown) return;
        if (!isLoggedIn) {
            userToggle.innerHTML = `
                <div style="background: linear-gradient(135deg, #ffe066 0%, #a78bfa 100%); border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                    <i class="fa-regular fa-circle-user user-icon" style="color: #4F46E5; font-size: 1.5em;"></i>
                </div>
            `;
            userDropdown.innerHTML = `
                <a href="#" class="user-dropdown-item" id="login-menu-item">
                    <i class="fa-solid fa-right-to-bracket"></i> Đăng nhập
                </a>
            `;
        } else {
            userToggle.innerHTML = `
                <div style="background: linear-gradient(135deg, #ffe066 0%, #a78bfa 100%); border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                    <i class="fa-regular fa-circle-user user-icon" style="color: #4F46E5; font-size: 1.5em;"></i>
                </div>
            `;
            userDropdown.innerHTML = `
                <div class="user-info">
                    <div class="user-avatar"><i class="fa-regular fa-circle-user"></i></div>
                    <div class="user-details">
                        <div>Phạm Hoàng Đình</div>
                        <div>Quản trị viên</div>
                    </div>
                </div>
                <hr>
                <a href="#" class="user-dropdown-item"><i class="fa-regular fa-user"></i> Thông tin cá nhân</a>
                <a href="#" class="user-dropdown-item"><i class="fa-solid fa-gear"></i> Cài đặt tài khoản</a>
                <a href="#" class="user-dropdown-item"><i class="fa-solid fa-bell"></i> Thông báo</a>
                <a href="#" class="user-dropdown-item"><i class="fa-solid fa-shield-halved"></i> Bảo mật</a>
                <hr>
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
function updateHeaderBlur() {
    var header = document.querySelector('.header');
    var anyModalOpen = false;
    document.querySelectorAll('.modal').forEach(function (modal) {
        var isVisible = modal.classList.contains('show') && (window.getComputedStyle(modal).visibility !== 'hidden');
        if (isVisible) anyModalOpen = true;
    });
    if (document.querySelector('.announcement-overlay.visible')) anyModalOpen = true;
    if (header) {
        if (anyModalOpen) {
            header.classList.add('blurred');
            if (!header.querySelector('.header-dark-overlay')) {
                var overlay = document.createElement('div');
                overlay.className = 'header-dark-overlay';
                header.appendChild(overlay);
            }
        } else {
            header.classList.remove('blurred');
            var overlay = header.querySelector('.header-dark-overlay');
            if (overlay) overlay.remove();
        }
    }
}
(function () {
    var observer = new MutationObserver(updateHeaderBlur);
    document.querySelectorAll('.modal').forEach(function (modal) {
        modal.addEventListener('transitionend', function (event) {
            if (event.propertyName === 'opacity' && window.getComputedStyle(modal).opacity === '0') {
                updateHeaderBlur();
            }
            if (event.propertyName === 'opacity' && window.getComputedStyle(modal).opacity === '1') {
                updateHeaderBlur();
            }
        });
    });
    updateHeaderBlur();
})();
// ================== DuyKha: Quản lý nhân viên động + Lọc + Modal + Địa chỉ API ==================
// Khởi tạo mảng employees
let employees = [];

// Hàm lưu dữ liệu vào localStorage
function saveEmployeesToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Hàm lấy dữ liệu từ localStorage
function loadEmployeesFromLocalStorage() {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
        employees = JSON.parse(savedEmployees);
    } else {
        // Nếu không có dữ liệu trong localStorage, khởi tạo với một số nhân viên mẫu
        employees = [
            { id: 'NV001', name: 'Nguyễn Văn Nhân', phone: '0901234567', email: 'nhan.nguyen@email.com', role: 'Nhân viên', address: '123 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh', status: 'active' },
            { id: 'NV002', name: 'Trần Thị Quản', phone: '0912345678', email: 'quan.tran@email.com', role: 'Quản lý', address: '456 Điện Biên Phủ, Phường 17, Quận Bình Thạnh, TP. Hồ Chí Minh', status: 'active' },
            { id: 'NV003', name: 'Lê Văn Admin', phone: '0923456789', email: 'admin.le@email.com', role: 'Admin', address: '789 Cách Mạng Tháng 8, Phường 11, Quận 3, TP. Hồ Chí Minh', status: 'inactive' }
        ];
        saveEmployeesToLocalStorage(); // Lưu dữ liệu mẫu vào localStorage
    }
}

// Load dữ liệu khi trang được tải
loadEmployeesFromLocalStorage();

let filterRole = '';
let filterStatus = '';
let filterName = '';

let itemsPerPage = 10;
let currentPage = 1;

// ================== Logic cho dropdown địa chỉ (Helper Functions) ==================

// Helper functions for resetting dropdowns
function resetDistrictDropdown(districtSelectElement) {
    if (districtSelectElement) {
        districtSelectElement.innerHTML = '<option value="">Quận/Huyện</option>';
        districtSelectElement.disabled = true;
    }
}

function resetWardDropdown(wardSelectElement) {
    if (wardSelectElement) {
        wardSelectElement.innerHTML = '<option value="">Phường/Xã</option>';
        wardSelectElement.disabled = true;
    }
}

function resetAddressDropdowns(provinceSelectElement, districtSelectElement, wardSelectElement) {
    if (provinceSelectElement) {
        provinceSelectElement.innerHTML = '<option value="">Tỉnh/Thành phố</option>';
    }
    resetDistrictDropdown(districtSelectElement);
    resetWardDropdown(wardSelectElement);
}

// API Calls and Population Logic
function populateProvinces(provinceSelectElement, selectedProvinceName, callback) {
    if (provinceSelectElement) {
        provinceSelectElement.innerHTML = '<option value="">Tỉnh/Thành phố</option>'; // Clear existing options first
        $.getJSON('https://esgoo.net/api-tinhthanh/1/0.htm', function (data_tinh) {
            if (data_tinh.error == 0) {
                let selectedProvinceId = '';
                $.each(data_tinh.data, function (key_tinh, val_tinh) {
                    const option = document.createElement('option');
                    option.value = val_tinh.id;
                    option.textContent = val_tinh.full_name;
                    if (selectedProvinceName && val_tinh.full_name.trim() === selectedProvinceName.trim()) {
                        selectedProvinceId = val_tinh.id;
                        option.selected = true;
                    }
                    provinceSelectElement.appendChild(option);
                });
                if (callback) callback(selectedProvinceId);
            } else { console.error('API returned error for provinces:', data_tinh.error); }
        }).fail(function (jqxhr, textStatus, error) { console.error('Failed to load provinces from API:', textStatus, error); });
    }
}

function populateDistricts(districtSelectElement, wardSelectElement, provinceId, selectedDistrictName, callback) {
    if (districtSelectElement && wardSelectElement) {
        resetDistrictDropdown(districtSelectElement);
        resetWardDropdown(wardSelectElement);
        if (provinceId) {
            $.getJSON('https://esgoo.net/api-tinhthanh/2/' + provinceId + '.htm', function (data_quan) {
                if (data_quan.error == 0) {
                    districtSelectElement.innerHTML = '<option value="">Quận/Huyện</option>';
                    let selectedDistrictId = '';
                    $.each(data_quan.data, function (key_quan, val_quan) {
                        const option = document.createElement('option');
                        option.value = val_quan.id;
                        option.textContent = val_quan.full_name;
                        if (selectedDistrictName && val_quan.full_name.trim() === selectedDistrictName.trim()) {
                            selectedDistrictId = val_quan.id;
                            option.selected = true;
                        }
                        districtSelectElement.appendChild(option);
                    });
                    districtSelectElement.disabled = false;
                    if (callback) callback(selectedDistrictId);
                } else { console.error('API returned error for districts:', data_quan.error); }
            }).fail(function (jqxhr, textStatus, error) { console.error('Failed to load districts from API:', textStatus, error); });
        } else {
            resetDistrictDropdown(districtSelectElement);
        }
    }
}

function populateWards(wardSelectElement, districtId, selectedWardName) {
    if (wardSelectElement) {
        resetWardDropdown(wardSelectElement);
        if (districtId) {
            $.getJSON('https://esgoo.net/api-tinhthanh/3/' + districtId + '.htm', function (data_phuong) {
                if (data_phuong.error == 0) {
                    wardSelectElement.innerHTML = '<option value="">Phường/Xã</option>';
                    $.each(data_phuong.data, function (key_phuong, val_phuong) {
                        const option = document.createElement('option');
                        option.value = val_phuong.id;
                        option.textContent = val_phuong.full_name;
                        if (selectedWardName && val_phuong.full_name.trim() === selectedWardName.trim()) {
                            option.selected = true;
                        }
                        wardSelectElement.appendChild(option);
                    });
                    wardSelectElement.disabled = false;
                } else { console.error('API returned error for wards:', data_phuong.error); }
            }).fail(function (jqxhr, textStatus, error) { console.error('Failed to load wards from API:', textStatus, error); });
        } else {
            resetWardDropdown(wardSelectElement);
        }
    }
}

// Function to parse address string and return components (for Edit modal)
function parseAddress(fullAddress) {
    const parts = fullAddress ? fullAddress.split(',').map(part => part.trim()) : [];
    let detailed = '', ward = '', district = '', province = '';

    if (parts.length >= 4) {
        province = parts[parts.length - 1];
        district = parts[parts.length - 2];
        ward = parts[parts.length - 3];
        detailed = parts.slice(0, parts.length - 3).join(', ');
    } else {
        detailed = fullAddress ? fullAddress.trim() : '';
    }
    return { detailed, ward, district, province };
}

// More robust helper function to remove Vietnamese diacritics and normalize string
function normalizeVietnameseString(str) {
    if (!str) return '';
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/[^a-z0-9\s]/g, '');
    str = str.replace(/\s+/g, ' ').trim();
    return str;
}

function renderEmployeeTable() {
    const tbody = document.getElementById('employee-table-body');
    const paginationInfoSpan = document.getElementById('pagination-info');
    const paginationButtonsDiv = document.querySelector('.pagination-buttons');
    const navDiv = paginationButtonsDiv.querySelector('.pagination-nav-buttons');
    tbody.innerHTML = '';

    let filtered = employees.filter(e => {
        let ok = true;
        if (filterRole) ok = ok && (e.role === filterRole);
        if (filterStatus) ok = ok && (e.status === filterStatus);
        if (filterName) ok = ok && normalizeVietnameseString(e.name).includes(normalizeVietnameseString(filterName));
        return ok;
    });

    // Calculate pagination variables
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToShow = filtered.slice(start, end);

    // Adjust current page if it's beyond the last page after filtering
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
        renderEmployeeTable(); // Re-render with the last page
        return;
    }
    if (totalPages === 0) {
        currentPage = 1; // Reset to page 1 if no items
    }

    itemsToShow.forEach((e, idx) => {
        const tr = document.createElement('tr');
        tr.classList.add('employee-row'); // Add class for main row
        tr.setAttribute('data-employee-id', e.id); // Add data attribute to link main row to detail
        const stt = start + idx + 1; // Calculate actual STT based on start index
        tr.innerHTML = `
            <td class="col-center"><input type="checkbox" class="rowCheckbox" data-employee-id="${e.id}"></td>
            <td class="col-center mobile-hidden">${stt}</td>
            <td>${e.id}</td>
            <td>${e.name}</td>
            <td class="mobile-hidden">${e.phone}</td>
            <td class="mobile-hidden">${e.email}</td>
            <td class="mobile-hidden">${e.role}</td>
            <td class="mobile-hidden">${e.address}</td>
            <td class="col-center mobile-hidden"><span class="status-badge ${e.status === 'active' ? 'active' : 'inactive'}">${e.status === 'active' ? 'Đang làm' : 'Nghỉ việc'}</span></td>
            <td class="col-center action-icons mobile-hidden">
                <button class="icon-button icon-view" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>
                <button class="icon-button icon-edit" title="Sửa"><i class="fa-solid fa-pencil"></i></button>
                <button class="icon-button icon-danger" title="Xóa"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        `;

        // Gắn sự kiện cho các nút trong hàng chính (desktop)
        tr.querySelector('.icon-view').onclick = (e2) => { e2.stopPropagation(); openDetailModalById(e.id); };
        tr.querySelector('.icon-edit').onclick = (e2) => { e2.stopPropagation(); openEditModalById(e.id); };
        tr.querySelector('.icon-danger').onclick = (e2) => { e2.stopPropagation(); openDeleteModalById(e.id); };

        // Tạo hàng chi tiết cho mobile
        const detailTr = document.createElement('tr');
        detailTr.classList.add('employee-detail-row');
        detailTr.style.display = 'none';
        detailTr.innerHTML = `
            <td colspan="10">
                <div class="employee-detail-content">
                    <div class="detail-item"><strong>Số điện thoại:</strong> ${e.phone}</div>
                    <div class="detail-item"><strong>Email:</strong> ${e.email}</div>
                    <div class="detail-item"><strong>Chức vụ:</strong> ${e.role}</div>
                    <div class="detail-item"><strong>Địa chỉ:</strong> ${e.address}</div>
                    <div class="detail-item"><strong>Trạng thái:</strong> <span class="status-badge ${e.status === 'active' ? 'active' : 'inactive'}">${e.status === 'active' ? 'Đang làm' : 'Nghỉ việc'}</span></div>
                    <div class="detail-item action-icons">
                        <strong>Thao tác:</strong>
                        <button class="icon-button icon-view" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>
                        <button class="icon-button icon-edit" title="Sửa"><i class="fa-solid fa-pencil"></i></button>
                        <button class="icon-button icon-danger" title="Xóa"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </td>
        `;
        // Gắn sự kiện cho các nút trong hàng chi tiết (mobile)
        detailTr.querySelector('.icon-view').onclick = (e2) => { e2.stopPropagation(); openDetailModalById(e.id); };
        detailTr.querySelector('.icon-edit').onclick = (e2) => { e2.stopPropagation(); openEditModalById(e.id); };
        detailTr.querySelector('.icon-danger').onclick = (e2) => { e2.stopPropagation(); openDeleteModalById(e.id); };

        // Sự kiện click vào hàng chính để xổ/ẩn hàng chi tiết (chỉ mobile)
        tr.addEventListener('click', function (e2) {
            // Chỉ xổ ở mobile (dựa vào window width)
            if (window.innerWidth <= 768) {
                const nextRow = this.nextElementSibling;
                if (nextRow && nextRow.classList.contains('employee-detail-row')) {
                    nextRow.style.display = nextRow.style.display === 'none' ? 'table-row' : 'none';
                }
            }
        });

        tbody.appendChild(tr);
        tbody.appendChild(detailTr);
    });

    // Update pagination info count
    if (paginationInfoSpan) {
        if (totalItems === 0) {
            paginationInfoSpan.innerHTML = 'Không tìm thấy nhân viên nào';
        } else {
            const displayedStart = totalItems > 0 ? start + 1 : 0;
            const displayedEnd = Math.min(start + itemsPerPage, totalItems);
            paginationInfoSpan.innerHTML = `Hiển thị <b>${displayedStart}</b> đến <b>${displayedEnd}</b> của <b>${totalItems}</b> mục`;
        }
    }

    // Render pagination buttons
    if (navDiv) {
        navDiv.innerHTML = '';
        // "Trước" button
        const prevButton = document.createElement('button');
        prevButton.classList.add('button');
        if (currentPage === 1 || totalPages === 0) {
            prevButton.disabled = true;
        }
        prevButton.textContent = 'Trước';
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderEmployeeTable();
            }
        });
        navDiv.appendChild(prevButton);
        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.classList.add('button');
            if (i === currentPage) {
                pageButton.classList.add('active');
                pageButton.setAttribute('aria-current', 'page');
                pageButton.disabled = true;
            }
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderEmployeeTable();
            });
            navDiv.appendChild(pageButton);
        }
        // "Sau" button
        const nextButton = document.createElement('button');
        nextButton.classList.add('button');
        if (currentPage === totalPages || totalPages === 0) {
            nextButton.disabled = true;
        }
        nextButton.textContent = 'Sau';
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderEmployeeTable();
            }
        });
        navDiv.appendChild(nextButton);
    }

    // Uncheck the select all checkbox after re-rendering
    const selectAllCheckboxes = document.getElementById('selectAllCheckboxes');
    if (selectAllCheckboxes) {
        selectAllCheckboxes.checked = false;
    }
}

// Logic cho checkbox "Chọn tất cả"
const selectAllCheckboxes = document.getElementById('selectAllCheckboxes');
if (selectAllCheckboxes) {
    selectAllCheckboxes.addEventListener('change', function () {
        const rowCheckboxes = document.querySelectorAll('#employeeTable tbody .rowCheckbox');
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
}

// Gắn lại sự kiện lắng nghe cho checkbox hàng khi bảng được render lại
document.getElementById('employee-table-body').addEventListener('change', function (e) {
    if (e.target.classList.contains('rowCheckbox')) {
        // Có thể thêm logic kiểm tra nếu tất cả các rowCheckbox đã được chọn để tự động tích selectAllCheckboxes
    }
});

// Lọc tự động khi thay đổi select box
const employeeRoleSelect = document.getElementById('filterEmployeeRole');
const employeeStatusSelect = document.getElementById('filterEmployeeStatus');
const employeeNameFilterInput = document.getElementById('filterEmployeeName');

function updateFiltersAndRender() {
    filterRole = employeeRoleSelect.value;
    filterStatus = employeeStatusSelect.value;
    filterName = employeeNameFilterInput.value.trim();
    renderEmployeeTable();
}

if (employeeRoleSelect) employeeRoleSelect.onchange = updateFiltersAndRender;
if (employeeStatusSelect) employeeStatusSelect.onchange = updateFiltersAndRender;
if (employeeNameFilterInput) employeeNameFilterInput.oninput = updateFiltersAndRender;

// Thêm nhân viên
function getNextEmployeeId() {
    let max = 0;
    employees.forEach(e => {
        const num = parseInt(e.id.replace('NV', ''));
        if (num > max) max = num;
    });
    return 'NV' + String(max + 1).padStart(3, '0');
}

// Hàm kiểm tra email hợp lệ (chỉ chấp nhận @gmail.com)
function isValidEmail(email) {
    // Kiểm tra email chỉ có đuôi @gmail.com
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
}

// Hàm kiểm tra số điện thoại hợp lệ (Kiểm tra số điện thoại Việt Nam: bắt đầu bằng 0 và có 10 số)
function isValidPhone(phone) {
    // Kiểm tra số điện thoại Việt Nam: bắt đầu bằng 0 và có 10 số
    const phoneRegex = /^0[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone);
}

// Hàm kiểm tra email đã tồn tại
function isEmailExists(email, currentId = null) {
    return employees.some(emp => emp.email === email && emp.id !== currentId);
}

// Hàm kiểm tra số điện thoại đã tồn tại
function isPhoneExists(phone, currentId = null) {
    return employees.some(emp => emp.phone === phone && emp.id !== currentId);
}

// Hàm hiển thị thông báo lỗi (sử dụng alert)
function showError(inputElement, message) {
    alert(message);
}

// Hàm xóa thông báo lỗi (không cần thiết với alert)
function clearError(inputElement) {
    // inputElement.classList.remove('error'); // Remove removing error class
}

// Hàm hiển thị thông báo thành công (sử dụng alert)
function showSuccessMessage(title, message) {
    alert(`${title}\n\n${message}`);
}

function openAddModal() {
    console.log('Attempting to open add employee modal');
    var modal = document.getElementById('addEmployeeModal');
    console.log('Result of getElementById(\'addEmployeeModal\'):', modal);
    if (!modal) {
        console.error('Modal addEmployeeModal not found');
        return;
    }
    modal.classList.add('show');

    const addEmployeeIdInput = document.getElementById('addEmployeeId');
    console.log('Result of getElementById(\'addEmployeeId\'):', addEmployeeIdInput);
    if (!addEmployeeIdInput) {
        console.error('Input addEmployeeId not found');
        return;
    }
    addEmployeeIdInput.value = getNextEmployeeId();
    addEmployeeIdInput.readOnly = true;

    const addEmployeeNameInput = document.getElementById('addEmployeeName');
    if (!addEmployeeNameInput) {
        console.error('Input addEmployeeName not found');
        return;
    }
    addEmployeeNameInput.value = '';

    const addEmployeePhoneInput = document.getElementById('addEmployeePhone');
    if (!addEmployeePhoneInput) {
        console.error('Input addEmployeePhone not found');
        return;
    }
    addEmployeePhoneInput.value = '';

    const addEmployeeEmailInput = document.getElementById('addEmployeeEmail');
    if (!addEmployeeEmailInput) {
        console.error('Input addEmployeeEmail not found');
        return;
    }
    addEmployeeEmailInput.value = '';

    const addEmployeeRoleSelect = document.getElementById('addEmployeeRole');
    if (!addEmployeeRoleSelect) {
        console.error('Select addEmployeeRole not found');
        return;
    }
    addEmployeeRoleSelect.value = 'Nhân viên';

    const addEmployeeStatusSelect = document.getElementById('addEmployeeStatus');
    if (!addEmployeeStatusSelect) {
        console.error('Select addEmployeeStatus not found');
        return;
    }
    addEmployeeStatusSelect.value = 'active';

    // Reset và populate các combobox địa chỉ
    const addEmployeeProvinceSelect = document.getElementById('addEmployeeProvince');
    const addEmployeeDistrictSelect = document.getElementById('addEmployeeDistrict');
    const addEmployeeWardSelect = document.getElementById('addEmployeeWard');
    const addEmployeeDetailedAddressInput = document.getElementById('addEmployeeDetailedAddress');

    // Add null checks for address selects and detailed address input
    if (!addEmployeeProvinceSelect) {
        console.error('Select addEmployeeProvince not found');
        return;
    }
    if (!addEmployeeDistrictSelect) {
        console.error('Select addEmployeeDistrict not found');
        return;
    }
    if (!addEmployeeWardSelect) {
        console.error('Select addEmployeeWard not found');
        return;
    }
    if (!addEmployeeDetailedAddressInput) {
        console.error('Input addEmployeeDetailedAddress not found');
        return;
    }

    // Call the actual functions to reset and populate dropdowns
    resetAddressDropdowns(addEmployeeProvinceSelect, addEmployeeDistrictSelect, addEmployeeWardSelect);
    populateProvinces(addEmployeeProvinceSelect, '', null); // Populate provinces when modal opens
    if (addEmployeeDetailedAddressInput) addEmployeeDetailedAddressInput.value = ''; // Clear detailed address

    // Attach event listeners for dropdown changes in Add modal
    // Remove existing listeners first to avoid duplicates if openAddModal is called multiple times
    addEmployeeProvinceSelect.onchange = null;
    addEmployeeDistrictSelect.onchange = null;

    addEmployeeProvinceSelect.onchange = function () {
        populateDistricts(addEmployeeDistrictSelect, addEmployeeWardSelect, this.value, '', null);
    };
    addEmployeeDistrictSelect.onchange = function () {
        populateWards(addEmployeeWardSelect, this.value, '');
    };

    // Xóa tất cả thông báo lỗi
    modal.querySelectorAll('.error-message').forEach(el => el.remove());
    modal.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// Thêm lại sự kiện click cho nút thêm nhân viên để mở modal và populate tỉnh/thành phố
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
if (addEmployeeBtn) { addEmployeeBtn.onclick = openAddModal; }

// Thêm lại sự kiện đóng modal
Array.from(document.querySelectorAll('#addEmployeeModal .modal-close, #addEmployeeModal [data-dismiss="modal"]')).forEach(btn => {
    btn.onclick = () => {
        const modal = document.getElementById('addEmployeeModal');
        if (modal) modal.classList.remove('show');
        // Reset address dropdowns when modal is closed
        const addProvince = document.getElementById('addEmployeeProvince');
        const addDistrict = document.getElementById('addEmployeeDistrict');
        const addWard = document.getElementById('addEmployeeWard');
        resetAddressDropdowns(addProvince, addDistrict, addWard);
        if (document.getElementById('addEmployeeDetailedAddress')) document.getElementById('addEmployeeDetailedAddress').value = '';
    };
});

document.getElementById('addEmployeeForm').onsubmit = function (e) {
    e.preventDefault();

    // Lấy giá trị từ form
    const name = document.getElementById('addEmployeeName').value.trim();
    const phone = document.getElementById('addEmployeePhone').value.trim();
    const email = document.getElementById('addEmployeeEmail').value.trim();
    const role = document.getElementById('addEmployeeRole').value;
    // Update to get address components from the new fields
    const detailedAddress = document.getElementById('addEmployeeDetailedAddress').value.trim();
    const provinceSelect = document.getElementById('addEmployeeProvince');
    const districtSelect = document.getElementById('addEmployeeDistrict');
    const wardSelect = document.getElementById('addEmployeeWard');

    const province = provinceSelect.selectedIndex > 0 ? provinceSelect.options[provinceSelect.selectedIndex].text : '';
    const district = districtSelect.selectedIndex > 0 ? districtSelect.options[districtSelect.selectedIndex].text : '';
    const ward = wardSelect.selectedIndex > 0 ? wardSelect.options[wardSelect.selectedIndex].text : '';

    const status = document.getElementById('addEmployeeStatus').value;

    // Kiểm tra các trường bắt buộc
    let isValid = true;

    // Kiểm tra tên
    if (name === '') {
        showError(document.getElementById('addEmployeeName'), 'Vui lòng nhập họ và tên');
        isValid = false;
    }

    // Kiểm tra số điện thoại
    if (!isValidPhone(phone)) {
        showError(document.getElementById('addEmployeePhone'), 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (VD: 0912345678)');
        isValid = false;
    } else if (isPhoneExists(phone)) {
        showError(document.getElementById('addEmployeePhone'), 'Số điện thoại đã tồn tại');
        isValid = false;
    }

    // Kiểm tra email
    if (!isValidEmail(email)) {
        showError(document.getElementById('addEmployeeEmail'), 'Email không hợp lệ. Vui lòng sử dụng địa chỉ email @gmail.com');
        isValid = false;
    } else if (isEmailExists(email)) {
        showError(document.getElementById('addEmployeeEmail'), 'Email đã tồn tại');
        isValid = false;
    }

    // Kiểm tra địa chỉ - Update validation for new address fields
    if (!detailedAddress || province === '' || district === '' || ward === '') {
        showError(document.getElementById('addEmployeeDetailedAddress'), 'Vui lòng nhập đầy đủ thông tin địa chỉ (bao gồm Tỉnh/Thành phố, Quận/Huyện, Phường/Xã và Địa chỉ chi tiết).');
        isValid = false;
    }

    if (!isValid) return;

    // Combine address components into a single string
    const fullAddress = `${detailedAddress}, ${ward}, ${district}, ${province}`;

    // Nếu tất cả đều hợp lệ, thêm nhân viên mới
    const newEmp = {
        id: document.getElementById('addEmployeeId').value,
        name: name,
        phone: phone,
        email: email,
        role: role,
        address: fullAddress, // Use the combined address
        status: status
    };
    employees.push(newEmp);
    saveEmployeesToLocalStorage();
    renderEmployeeTable();
    document.getElementById('addEmployeeModal').classList.remove('show');

    // Reset address dropdowns and clear detailed address after successful add
    resetAddressDropdowns(provinceSelect, districtSelect, wardSelect);
    if (document.getElementById('addEmployeeDetailedAddress')) document.getElementById('addEmployeeDetailedAddress').value = '';

    // Hiển thị thông báo thành công
    showSuccessMessage(
        'Thêm nhân viên thành công',
        `Đã thêm nhân viên ${name} vào hệ thống.`
    );
};

// Thêm sự kiện validate realtime cho form thêm
// document.getElementById('addEmployeeName').addEventListener('input', function() {}); // Keep if needed
// document.getElementById('addEmployeeAddress').addEventListener('input', function() {}); // Remove or update if needed

// Sửa nhân viên
let editingId = null;
function openEditModalById(id) {
    editingId = id;
    const e = employees.find(emp => emp.id === id);
    var modal = document.getElementById('editEmployeeModal');
    if (modal && e) { // Check if modal and employee exist
        modal.classList.add('show');

        const editEmployeeIdInput = document.getElementById('editEmployeeId');
        const editEmployeeNameInput = document.getElementById('editEmployeeName');
        const editEmployeePhoneInput = document.getElementById('editEmployeePhone');
        const editEmployeeEmailInput = document.getElementById('editEmployeeEmail');
        const editEmployeeRoleSelect = document.getElementById('editEmployeeRole');
        const editEmployeeStatusSelect = document.getElementById('editEmployeeStatus');
        const editEmployeeProvinceSelect = document.getElementById('editEmployeeProvince');
        const editEmployeeDistrictSelect = document.getElementById('editEmployeeDistrict');
        const editEmployeeWardSelect = document.getElementById('editEmployeeWard');
        const editEmployeeDetailedAddressInput = document.getElementById('editEmployeeDetailedAddress');

        // Gán dữ liệu cho các trường thông tin khác, kiểm tra null trước khi gán
        if (editEmployeeIdInput) editEmployeeIdInput.value = e.id;
        if (editEmployeeNameInput) editEmployeeNameInput.value = e.name;
        if (editEmployeePhoneInput) editEmployeePhoneInput.value = e.phone;
        if (editEmployeeEmailInput) editEmployeeEmailInput.value = e.email;
        if (editEmployeeRoleSelect) editEmployeeRoleSelect.value = e.role;
        if (editEmployeeStatusSelect) editEmployeeStatusSelect.value = e.status;

        // Xóa tất cả thông báo lỗi
        modal.querySelectorAll('.error-message').forEach(el => el.remove());
        modal.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        // Parse address to populate dropdowns
        const addressParts = parseAddress(e.address);
        if (editEmployeeDetailedAddressInput) editEmployeeDetailedAddressInput.value = addressParts.detailed;

        resetAddressDropdowns(editEmployeeProvinceSelect, editEmployeeDistrictSelect, editEmployeeWardSelect);
        populateProvinces(editEmployeeProvinceSelect, addressParts.province, function (provinceId) {
            if (provinceId) {
                populateDistricts(editEmployeeDistrictSelect, editEmployeeWardSelect, provinceId, addressParts.district, function (districtId) {
                    if (districtId) {
                        populateWards(editEmployeeWardSelect, districtId, addressParts.ward);
                    }
                });
            }
        });

        // Attach event listeners for dropdown changes in Edit modal
        // Remove existing listeners first
        if (editEmployeeProvinceSelect) editEmployeeProvinceSelect.onchange = null;
        if (editEmployeeDistrictSelect) editEmployeeDistrictSelect.onchange = null;

        if (editEmployeeProvinceSelect && editEmployeeDistrictSelect && editEmployeeWardSelect) {
            editEmployeeProvinceSelect.onchange = function () {
                populateDistricts(editEmployeeDistrictSelect, editEmployeeWardSelect, this.value, '', null);
            };
            editEmployeeDistrictSelect.onchange = function () {
                populateWards(editEmployeeWardSelect, this.value, '');
            };
        }

    } else {
        console.error('Không tìm thấy modal chỉnh sửa hoặc nhân viên.', { modal: modal, employee: e });
    }
}

// Thêm lại sự kiện đóng modal sửa
Array.from(document.querySelectorAll('#editEmployeeModal .modal-close, #editEmployeeModal [data-dismiss="modal"]')).forEach(btn => {
    btn.onclick = () => {
        const modal = document.getElementById('editEmployeeModal');
        if (modal) modal.classList.remove('show');
        // Reset address dropdowns when modal is closed
        const editProvince = document.getElementById('editEmployeeProvince');
        const editDistrict = document.getElementById('editEmployeeDistrict');
        const editWard = document.getElementById('editEmployeeWard');
        resetAddressDropdowns(editProvince, editDistrict, editWard);
        if (document.getElementById('editEmployeeDetailedAddress')) document.getElementById('editEmployeeDetailedAddress').value = '';
    };
});

document.getElementById('editEmployeeForm').onsubmit = function (e) {
    e.preventDefault();

    // Lấy giá trị từ form
    const name = document.getElementById('editEmployeeName').value.trim();
    const phone = document.getElementById('editEmployeePhone').value.trim();
    const email = document.getElementById('editEmployeeEmail').value.trim();
    const role = document.getElementById('editEmployeeRole').value;
    // Update to get address components from the new fields
    const detailedAddress = document.getElementById('editEmployeeDetailedAddress').value.trim();
    const provinceSelect = document.getElementById('editEmployeeProvince');
    const districtSelect = document.getElementById('editEmployeeDistrict');
    const wardSelect = document.getElementById('editEmployeeWard');

    const province = provinceSelect.selectedIndex > 0 ? provinceSelect.options[provinceSelect.selectedIndex].text : '';
    const district = districtSelect.selectedIndex > 0 ? districtSelect.options[districtSelect.selectedIndex].text : '';
    const ward = wardSelect.selectedIndex > 0 ? wardSelect.options[wardSelect.selectedIndex].text : '';

    const status = document.getElementById('editEmployeeStatus').value;

    // Kiểm tra các trường bắt buộc
    let isValid = true;

    // Kiểm tra tên
    if (name === '') {
        showError(document.getElementById('editEmployeeName'), 'Vui lòng nhập họ và tên');
        isValid = false;
    }

    // Kiểm tra số điện thoại
    if (!isValidPhone(phone)) {
        showError(document.getElementById('editEmployeePhone'), 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (VD: 0912345678)');
        isValid = false;
    } else if (isPhoneExists(phone, editingId)) {
        showError(document.getElementById('editEmployeePhone'), 'Số điện thoại đã tồn tại');
        isValid = false;
    }

    // Kiểm tra email
    if (!isValidEmail(email)) {
        showError(document.getElementById('editEmployeeEmail'), 'Email không hợp lệ. Vui lòng sử dụng địa chỉ email @gmail.com');
        isValid = false;
    } else if (isEmailExists(email, editingId)) {
        showError(document.getElementById('editEmployeeEmail'), 'Email đã tồn tại');
        isValid = false;
    }

    // Kiểm tra địa chỉ - Update validation for new address fields
    if (!detailedAddress || province === '' || district === '' || ward === '') {
        showError(document.getElementById('editEmployeeDetailedAddress'), 'Vui lòng nhập đầy đủ thông tin địa chỉ (bao gồm Tỉnh/Thành phố, Quận/Huyện, Phường/Xã và Địa chỉ chi tiết).');
        isValid = false;
    }

    if (!isValid) return;

    if (editingId !== null) {
        const idx = employees.findIndex(emp => emp.id === editingId);
        if (idx !== -1) { // Check if employee exists
            // Combine address components into a single string
            const fullAddress = `${detailedAddress}, ${ward}, ${district}, ${province}`;

            employees[idx] = {
                id: document.getElementById('editEmployeeId').value,
                name: name,
                phone: phone,
                email: email,
                role: role,
                address: fullAddress, // Use the combined address
                status: status
            };
            saveEmployeesToLocalStorage();
            renderEmployeeTable();
            document.getElementById('editEmployeeModal').classList.remove('show');

            // Reset address dropdowns and clear detailed address after successful edit
            resetAddressDropdowns(provinceSelect, districtSelect, wardSelect);
            if (document.getElementById('editEmployeeDetailedAddress')) document.getElementById('editEmployeeDetailedAddress').value = '';

            // Hiển thị thông báo thành công
            showSuccessMessage(
                'Cập nhật thành công',
                `Đã cập nhật thông tin nhân viên ${name}.`
            );
            editingId = null; // Reset editing ID
        }
    }
};

// Thêm sự kiện validate realtime cho form sửa
// document.getElementById('editEmployeeName').addEventListener('input', function() {}); // Keep if needed
// document.getElementById('editEmployeeAddress').addEventListener('input', function() {}); // Remove or update if needed

// Xóa nhân viên
let deletingId = null;
function openDeleteModalById(id) {
    deletingId = id;
    const e = employees.find(emp => emp.id === id);
    var modal = document.getElementById('deleteEmployeeModal');
    if (modal && e) { // Check if modal and employee exist
        modal.classList.add('show');
        document.getElementById('deleteEmployeeName').textContent = e.name;
    }
}
document.getElementById('confirmDeleteEmployee').onclick = function () {
    if (deletingId !== null) {
        const idx = employees.findIndex(emp => emp.id === deletingId);
        if (idx !== -1) { // Check if employee exists
            employees.splice(idx, 1);
            saveEmployeesToLocalStorage(); // Lưu vào localStorage sau khi xóa
            renderEmployeeTable();
            const modal = document.getElementById('deleteEmployeeModal');
            if (modal) modal.classList.remove('show');
        } else {
            console.error('Employee with ID ', deletingId, ' not found for deletion.');
            const modal = document.getElementById('deleteEmployeeModal');
            if (modal) modal.classList.remove('show');
        }
        deletingId = null; // Reset deleting ID
    }
};
Array.from(document.querySelectorAll('#deleteEmployeeModal .modal-close, #deleteEmployeeModal [data-dismiss="modal"]')).forEach(btn => {
    btn.onclick = () => {
        const modal = document.getElementById('deleteEmployeeModal');
        if (modal) modal.classList.remove('show');
    };
});

// Xem chi tiết
function openDetailModalById(id) {
    const e = employees.find(emp => emp.id === id);
    if (e) { // Check if employee exists
        document.getElementById('detailEmployeeId').textContent = e.id;
        document.getElementById('detailEmployeeName').textContent = e.name;
        document.getElementById('detailEmployeePhone').textContent = e.phone;
        document.getElementById('detailEmployeeEmail').textContent = e.email;
        document.getElementById('detailEmployeeRole').textContent = e.role;
        document.getElementById('detailEmployeeAddress').textContent = e.address;
        document.getElementById('detailEmployeeStatus').textContent = e.status === 'active' ? 'Đang làm' : 'Nghỉ việc';
        document.getElementById('detailEmployeeStatus').className = 'status-badge ' + (e.status === 'active' ? 'active' : 'inactive');
        const modal = document.getElementById('employeeDetailModal');
        if (modal) modal.classList.add('show');
    } else {
        console.error('Employee with ID ', id, ' not found for detail view.');
    }
}
Array.from(document.querySelectorAll('#employeeDetailModal .modal-close, #employeeDetailModal [data-dismiss="modal"]')).forEach(btn => {
    btn.onclick = () => {
        const modal = document.getElementById('employeeDetailModal');
        if (modal) modal.classList.remove('show');
    };
});

// Xóa nhiều nhân viên
let selectedEmployeeIds = []; // Biến để lưu ID các nhân viên được chọn

document.getElementById('deleteSelectedBtn').onclick = function () {
    const selectedCheckboxes = document.querySelectorAll('#employeeTable tbody .rowCheckbox:checked');
    selectedEmployeeIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.employeeId);

    if (selectedEmployeeIds.length === 0) {
        alert('Vui lòng chọn ít nhất một nhân viên để xóa!');
        return;
    }

    // Lấy tên của các nhân viên được chọn
    const selectedEmployeeNames = employees
        .filter(emp => selectedEmployeeIds.includes(emp.id))
        .map(emp => emp.name);

    // Hiển thị modal xác nhận xóa nhiều
    const bulkDeleteModal = document.getElementById('bulkDeleteEmployeeModal');
    const bulkDeleteCountSpan = document.getElementById('bulkDeleteCount');
    const bulkDeleteNamesListDiv = document.getElementById('bulkDeleteNamesList');

    if (bulkDeleteCountSpan) {
        bulkDeleteCountSpan.textContent = selectedEmployeeIds.length;
    }
    if (bulkDeleteNamesListDiv) {
        // Xóa nội dung cũ và thêm danh sách tên
        bulkDeleteNamesListDiv.innerHTML = '';
        if (selectedEmployeeNames.length > 0) {
            const ul = document.createElement('ul');
            ul.style.listStyle = 'disc inside';
            ul.style.paddingLeft = '1rem';
            ul.style.color = 'var(--text-primary)';
            selectedEmployeeNames.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                ul.appendChild(li);
            });
            bulkDeleteNamesListDiv.appendChild(ul);
        }
    }

    if (bulkDeleteModal) {
        bulkDeleteModal.classList.add('show');
    }
};

// Sự kiện click cho nút Xác nhận Xóa trong modal xóa nhiều
document.getElementById('confirmBulkDeleteEmployee').onclick = function () {
    if (selectedEmployeeIds.length > 0) {
        // Lọc ra các nhân viên KHÔNG có trong danh sách ID cần xóa
        employees = employees.filter(emp => !selectedEmployeeIds.includes(emp.id));

        selectedEmployeeIds = []; // Clear selected IDs
        saveEmployeesToLocalStorage(); // Lưu vào localStorage sau khi xóa nhiều
        renderEmployeeTable();

        // Đóng modal xác nhận xóa nhiều
        const bulkDeleteModal = document.getElementById('bulkDeleteEmployeeModal');
        if (bulkDeleteModal) bulkDeleteModal.classList.remove('show');
    }
};
// Sự kiện đóng modal xóa nhiều
Array.from(document.querySelectorAll('#bulkDeleteEmployeeModal .modal-close, #bulkDeleteEmployeeModal [data-dismiss="modal"]')).forEach(btn => {
    btn.onclick = () => {
        const bulkDeleteModal = document.getElementById('bulkDeleteEmployeeModal');
        if (bulkDeleteModal) bulkDeleteModal.classList.remove('show');
    };
});

// Initial render
renderEmployeeTable();

document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPageSelect = document.getElementById('items-per-page-select');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.value = itemsPerPage;
        itemsPerPageSelect.addEventListener('change', function () {
            itemsPerPage = parseInt(this.value);
            currentPage = 1;
            renderEmployeeTable();
        });
    }
});
document.addEventListener('DOMContentLoaded', function () {
});
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.modal').forEach(function (modal) {
        modal.addEventListener('mousedown', function (e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
});
// ... existing code ...
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        document.querySelectorAll('.employee-detail-row').forEach(function (row) {
            row.style.display = 'none';
        });
    }
});