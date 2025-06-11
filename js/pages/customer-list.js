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

    // --- Pagination ---
    const itemsPerPageSelect = document.getElementById('items-per-page-select');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.value = itemsPerPage;
        itemsPerPageSelect.addEventListener('change', function () {
            itemsPerPage = parseInt(this.value);
            currentPage = 1;
            renderCustomerTable();
        });
    }
});
(function () {
    var observer = new MutationObserver(updateHeaderBlur);
    document.querySelectorAll('.modal').forEach(function (modal) {
        observer.observe(modal, { attributes: true, attributeFilter: ['class', 'style'] });
    });
})();
// ================== DuyKha: Quản lý khách hàng động + Lọc + Modal + Phân trang ==================
// Load customers from localStorage or use sample data
let customers = JSON.parse(localStorage.getItem('customers')) || [
    { id: 'KH001', name: 'Nguyễn Văn A', phone: '0901234567', email: 'nguyenvana@email.com', type: 'Cá nhân', address: '123 Nguyễn Văn Linh, Q.7, TP.HCM', status: 'active' },
    { id: 'KH002', name: 'Công ty TNHH ABC', phone: '0909876543', email: 'contact@abc.com', type: 'Doanh nghiệp', address: '456 Điện Biên Phủ, Q.3, TP.HCM', status: 'active' },
    { id: 'KH003', name: 'Trần Thị B', phone: '0912345678', email: 'tranthib@email.com', type: 'Cá nhân', address: '789 Cách Mạng Tháng 8, Q.10, TP.HCM', status: 'inactive' },
    { id: 'KH004', name: 'Công ty CP XYZ', phone: '0898765432', email: 'info@xyz.com.vn', type: 'Doanh nghiệp', address: '147 Võ Văn Ngân, Q.Thủ Đức, TP.HCM', status: 'active' },
    { id: 'KH005', name: 'Lê Văn C', phone: '0977123456', email: 'levanc@email.com', type: 'Cá nhân', address: '258 Lý Thường Kiệt, Q.Tân Bình, TP.HCM', status: 'active' },
    { id: 'KH006', name: 'Phạm Thị D', phone: '0933987654', email: 'phamthid@email.com', type: 'Cá nhân', address: '369 Huỳnh Tấn Phát, Q.7, TP.HCM', status: 'inactive' },
    { id: 'KH007', name: 'Công ty TNHH DEF', phone: '0944556677', email: 'contact@def.com.vn', type: 'Doanh nghiệp', address: '741 Nguyễn Văn Cừ, Q.5, TP.HCM', status: 'active' },
    { id: 'KH008', name: 'Hoàng Văn E', phone: '0966778899', email: 'hoangvane@email.com', type: 'Cá nhân', address: '852 Kha Vạn Cân, Q.Thủ Đức, TP.HCM', status: 'active' },
    { id: 'KH009', name: 'Công ty CP GHI', phone: '0988990011', email: 'info@ghi.com', type: 'Doanh nghiệp', address: '963 Lê Văn Việt, Q.9, TP.HCM', status: 'inactive' },
    { id: 'KH010', name: 'Vũ Thị F', phone: '0911223344', email: 'vuthif@email.com', type: 'Cá nhân', address: '159 Xa lộ Hà Nội, Q.Thủ Đức, TP.HCM', status: 'active' }
];

let filterType = '';
let filterStatus = '';
let filterCustomerName = '';
let filterCustomerPhone = '';

let currentPage = 1;
let itemsPerPage = 10;

// ================== Logic cho dropdown địa chỉ (Helper Functions) ==================

// Helper functions for resetting dropdowns
// Modified to accept the select element as argument
function resetDistrictDropdown(districtSelectElement) {
    if (districtSelectElement) {
        districtSelectElement.innerHTML = '<option value="">Quận/Huyện</option>';
        districtSelectElement.disabled = true;
    }
}

// Modified to accept the select element as argument
function resetWardDropdown(wardSelectElement) {
    if (wardSelectElement) {
        wardSelectElement.innerHTML = '<option value="">Phường/Xã</option>';
        wardSelectElement.disabled = true;
    }
}

// Modified to accept the select elements as arguments
function resetAddressDropdowns(provinceSelectElement, districtSelectElement, wardSelectElement) {
    if (provinceSelectElement) {
        provinceSelectElement.innerHTML = '<option value="">Tỉnh/Thành phố</option>';
    }
    resetDistrictDropdown(districtSelectElement);
    resetWardDropdown(wardSelectElement);
}

// API Calls and Population Logic
// Modified to accept the select element and selected name/callback as arguments
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
                    // Use trim() when comparing names
                    if (val_tinh.full_name.trim() === selectedProvinceName.trim()) {
                        selectedProvinceId = val_tinh.id;
                        option.selected = true;
                    }
                    provinceSelectElement.appendChild(option);
                });
                if (callback) callback(selectedProvinceId);
            } else { console.error('API returned error for provinces:', data_tinh.error); }
        }).fail(function (jqxhr, textStatus, error) { console.error('Failed to load provinces from API:', textStatus, error); }); // Add error handling
    }
}

// Modified to accept the select elements, provinceId, selected name, and callback as arguments
function populateDistricts(districtSelectElement, wardSelectElement, provinceId, selectedDistrictName, callback) {
    if (districtSelectElement && wardSelectElement) {
        resetDistrictDropdown(districtSelectElement); // Reset district first
        resetWardDropdown(wardSelectElement); // Reset wards too
        if (provinceId) {
            $.getJSON('https://esgoo.net/api-tinhthanh/2/' + provinceId + '.htm', function (data_quan) {
                if (data_quan.error == 0) {
                    districtSelectElement.innerHTML = '<option value="">Quận/Huyện</option>';
                    let selectedDistrictId = '';
                    $.each(data_quan.data, function (key_quan, val_quan) {
                        const option = document.createElement('option');
                        option.value = val_quan.id;
                        option.textContent = val_quan.full_name;
                        // Use trim() when comparing names
                        if (val_quan.full_name.trim() === selectedDistrictName.trim()) {
                            selectedDistrictId = val_quan.id;
                            option.selected = true;
                        }
                        districtSelectElement.appendChild(option);
                    });
                    districtSelectElement.disabled = false;
                    if (callback) callback(selectedDistrictId);
                } else { console.error('API returned error for districts:', data_quan.error); }
            }).fail(function (jqxhr, textStatus, error) { console.error('Failed to load districts from API:', textStatus, error); }); // Add error handling
        } else {
            resetDistrictDropdown(districtSelectElement); // Use the correct reset function
        }
    }
}

// Modified to accept the select element, districtId, and selected name as arguments
function populateWards(wardSelectElement, districtId, selectedWardName) {
    if (wardSelectElement) {
        resetWardDropdown(wardSelectElement); // Reset ward first
        if (districtId) {
            $.getJSON('https://esgoo.net/api-tinhthanh/3/' + districtId + '.htm', function (data_phuong) {
                if (data_phuong.error == 0) {
                    wardSelectElement.innerHTML = '<option value="">Phường/Xã</option>';
                    $.each(data_phuong.data, function (key_phuong, val_phuong) {
                        const option = document.createElement('option');
                        option.value = val_phuong.id;
                        option.textContent = val_phuong.full_name;
                        // Use trim() when comparing names
                        if (val_phuong.full_name.trim() === selectedWardName.trim()) {
                            option.selected = true;
                        }
                        wardSelectElement.appendChild(option);
                    });
                    wardSelectElement.disabled = false;
                } else { console.error('API returned error for wards:', data_phuong.error); }
            }).fail(function (jqxhr, textStatus, error) { console.error('Failed to load wards from API:', textStatus, error); }); // Add error handling
        } else {
            resetWardDropdown(wardSelectElement);
        }
    }
}

// ================== END Logic cho dropdown địa chỉ (Helper Functions) ==================

// More robust helper function to remove Vietnamese diacritics and normalize string
function normalizeVietnameseString(str) {
    if (!str) return '';
    str = str.toLowerCase();
    // Remove Vietnamese diacritics
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Remove all non-alphanumeric characters except space
    str = str.replace(/[^a-z0-9\s]/g, '');
    // Replace multiple spaces with a single space
    str = str.replace(/\s+/g, ' ').trim();
    return str;
}

// ================== END Logic cho dropdown địa chỉ ==================

function renderCustomerTable() {
    const tbody = document.getElementById('customer-table-body');
    tbody.innerHTML = '';

    // Lọc dữ liệu
    let filtered = customers.filter(c => {
        let ok = true;
        if (filterType) ok = ok && (c.type === (filterType === 'personal' ? 'Cá nhân' : 'Doanh nghiệp'));
        if (filterStatus) ok = ok && (c.status === filterStatus);
        if (filterCustomerName) {
            const normalizedCustomerName = normalizeVietnameseString(c.name);
            const normalizedFilterName = normalizeVietnameseString(filterCustomerName);
            ok = ok && normalizedCustomerName.includes(normalizedFilterName);
        }
        if (filterCustomerPhone) ok = ok && c.phone.includes(filterCustomerPhone);
        return ok;
    });

    // Tính toán phân trang
    const totalCustomers = filtered.length;
    const totalPages = Math.ceil(totalCustomers / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCustomers = filtered.slice(startIndex, endIndex);

    // Hiển thị dữ liệu của trang hiện tại
    if (paginatedCustomers.length === 0 && currentPage > 1) {
        // Nếu trang hiện tại không có dữ liệu và không phải trang 1, quay về trang cuối cùng có dữ liệu
        currentPage = totalPages > 0 ? totalPages : 1;
        renderCustomerTable(); // Gọi lại để hiển thị trang cuối
        return; // Dừng hàm để tránh render lại 2 lần
    }

    paginatedCustomers.forEach((c, idx) => {
        const tr = document.createElement('tr');
        tr.classList.add('customer-row'); // Add class for main row
        tr.setAttribute('data-customer-id', c.id); // Add data attribute to link main row to detail
        tr.innerHTML = `
         <td class="col-center"><input type="checkbox" title="Chọn dòng ${startIndex + idx + 1}"></td>
         <td class="col-center mobile-hidden">${startIndex + idx + 1}</td> <!-- Hide STT on mobile -->
         <td>${c.id}</td>
         <td>${c.name}</td>
         <td class="mobile-hidden">${c.phone}</td> <!-- Hide on mobile -->
         <td class="mobile-hidden">${c.email}</td> <!-- Hide on mobile -->
         <td class="mobile-hidden">${c.type}</td> <!-- Hide on mobile -->
         <td class="mobile-hidden">${c.address}</td> <!-- Hide on mobile -->
         <td class="col-center mobile-hidden"><span class="status-badge ${c.status === 'active' ? 'active' : 'inactive'}">${c.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}</span></td> <!-- Hide on mobile -->
         <td class="col-center action-icons mobile-hidden"> <!-- Hide on mobile -->
             <button class="icon-button icon-view" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>
             <button class="icon-button icon-edit" title="Sửa"><i class="fa-solid fa-pencil"></i></button>
             <button class="icon-button icon-danger" title="Xóa"><i class="fa-solid fa-trash-can"></i></button>
         </td>
     `;

        const detailTr = document.createElement('tr');
        detailTr.classList.add('customer-detail-row'); // Add class for detail row
        detailTr.style.display = 'none'; // Initially hidden
        detailTr.innerHTML = `
         <td colspan="10"> <!-- Colspan should match total columns in thead -->
             <div class="customer-detail-content">
                 <div class="detail-item"><strong>STT:</strong> ${startIndex + idx + 1}</div>
                 <div class="detail-item"><strong>Số điện thoại:</strong> ${c.phone}</div>
                 <div class="detail-item"><strong>Email:</strong> ${c.email}</div>
                 <div class="detail-item"><strong>Loại KH:</strong> ${c.type}</div>
                 <div class="detail-item"><strong>Địa chỉ:</strong> ${c.address}</div>
                 <div class="detail-item"><strong>Trạng thái:</strong> <span class="status-badge ${c.status === 'active' ? 'active' : 'inactive'}">${c.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}</span></div>
                 <div class="detail-item action-icons"> <!-- Include action icons here for mobile -->
                     <strong>Thao tác:</strong>
                      <button class="icon-button icon-view" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>
                      <button class="icon-button icon-edit" title="Sửa"><i class="fa-solid fa-pencil"></i></button>
                      <button class="icon-button icon-danger" title="Xóa"><i class="fa-solid fa-trash-can"></i></button>
                 </div>
             </div>
         </td>
     `;

        // Gắn lại sự kiện cho các nút trên cả hàng chính và hàng chi tiết
        // Sự kiện click vào hàng chính để toggle hàng chi tiết
        tr.addEventListener('click', function () {
            // Toggle the next sibling row (which is the detail row)
            const nextRow = this.nextElementSibling;
            if (nextRow && nextRow.classList.contains('customer-detail-row')) {
                nextRow.style.display = nextRow.style.display === 'none' ? 'table-row' : 'none';
            }
        });


        // Gắn sự kiện cho các nút trong hàng chính (desktop)
        tr.querySelector('.icon-view').onclick = (e) => { e.stopPropagation(); openDetailModalById(c.id); };
        tr.querySelector('.icon-edit').onclick = (e) => { e.stopPropagation(); openEditModalById(c.id); };
        tr.querySelector('.icon-danger').onclick = (e) => { e.stopPropagation(); openDeleteModalById(c.id); };

        // Gắn sự kiện cho các nút trong hàng chi tiết (mobile)
        detailTr.querySelector('.icon-view').onclick = (e) => { e.stopPropagation(); openDetailModalById(c.id); };
        detailTr.querySelector('.icon-edit').onclick = (e) => { e.stopPropagation(); openEditModalById(c.id); };
        detailTr.querySelector('.icon-danger').onclick = (e) => { e.stopPropagation(); openDeleteModalById(c.id); };


        tbody.appendChild(tr);
        tbody.appendChild(detailTr); // Append the detail row after the main row
    });

    // Cập nhật thông tin phân trang
    updatePaginationInfo(totalCustomers, startIndex, Math.min(endIndex, totalCustomers));

    // Cập nhật nút phân trang
    renderPaginationButtons(totalCustomers, itemsPerPage, currentPage);
}

function updatePaginationInfo(total, start, end) {
    const paginationInfoSpan = document.querySelector('.pagination-info');
    if (paginationInfoSpan) {
        if (total === 0) {
            paginationInfoSpan.innerHTML = 'Không có khách hàng nào.';
        } else {
            paginationInfoSpan.innerHTML = `Hiển thị <b>${start + 1}</b> đến <b>${end}</b> của <b>${total}</b> khách hàng`;
        }
    }
}

function renderPaginationButtons(total, itemsPerPage, currentPage) {
    const paginationButtonsDiv = document.querySelector('.pagination-buttons');
    if (!paginationButtonsDiv) return;

    let navDiv = paginationButtonsDiv.querySelector('.pagination-nav-buttons');
    if (!navDiv) {
        navDiv = document.createElement('div');
        navDiv.className = 'pagination-nav-buttons';
        paginationButtonsDiv.appendChild(navDiv);
    }
    navDiv.innerHTML = '';

    const totalPages = Math.ceil(total / itemsPerPage);

    // Nút "Trước"
    const prevButton = document.createElement('button');
    prevButton.classList.add('button');
    prevButton.textContent = 'Trước';
    prevButton.disabled = currentPage === 1 || totalPages === 0;
    prevButton.onclick = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };
    navDiv.appendChild(prevButton);

    // Các nút trang
    // Logic hiển thị nút trang: Hiển thị 3 trang xung quanh trang hiện tại và trang đầu/cuối
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (totalPages <= 5) { // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả
        startPage = 1;
        endPage = totalPages;
    } else {
        // Điều chỉnh hiển thị để luôn có 5 nút trang nếu có thể, và thêm "..."
        if (currentPage <= 3) {
            endPage = 5;
            startPage = 1;
        } else if (currentPage > totalPages - 3) {
            startPage = totalPages - 4;
            endPage = totalPages;
        }
    }


    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.classList.add('button');
        firstPageButton.textContent = '1';
        firstPageButton.onclick = () => goToPage(1);
        navDiv.appendChild(firstPageButton);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = '0 5px';
            ellipsis.style.color = '#64748b';
            navDiv.appendChild(ellipsis);
        }
    }


    for (let i = startPage; i <= endPage; i++) {
        if (i >= 1 && i <= totalPages) {
            const pageButton = document.createElement('button');
            pageButton.classList.add('button');
            if (i === currentPage) {
                pageButton.classList.add('active');
                pageButton.setAttribute('aria-current', 'page');
            }
            pageButton.textContent = i;
            pageButton.onclick = () => goToPage(i);
            navDiv.appendChild(pageButton);
        }
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = '0 5px';
            ellipsis.style.color = '#64748b';
            navDiv.appendChild(ellipsis);
        }
        const lastPageButton = document.createElement('button');
        lastPageButton.classList.add('button');
        lastPageButton.textContent = totalPages;
        lastPageButton.onclick = () => goToPage(totalPages);
        navDiv.appendChild(lastPageButton);
    }


    // Nút "Sau"
    const nextButton = document.createElement('button');
    nextButton.classList.add('button');
    nextButton.textContent = 'Sau';
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };
    navDiv.appendChild(nextButton);

    if (totalPages <= 1) { // Ẩn nút "Trước" và "Sau" nếu chỉ có 1 trang
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
        if (totalPages === 0) {
            navDiv.innerHTML = ''; // Clear all buttons if no customers
        }
    } else {
        prevButton.style.display = '';
        nextButton.style.display = '';
    }

}

function goToPage(pageNumber) {
    currentPage = pageNumber;
    renderCustomerTable();
}


// Lọc
const customerTypeSelect = document.getElementById('customerType');
const customerStatusSelect = document.getElementById('customerStatus');
const filterCustomerNameInput = document.getElementById('filterCustomerName');
const filterCustomerPhoneInput = document.getElementById('filterCustomerPhone');

function applyFilters() {
    filterType = customerTypeSelect ? customerTypeSelect.value : '';
    filterStatus = customerStatusSelect ? customerStatusSelect.value : '';
    filterCustomerName = filterCustomerNameInput ? filterCustomerNameInput.value.trim() : '';
    filterCustomerPhone = filterCustomerPhoneInput ? filterCustomerPhoneInput.value.trim() : '';
    currentPage = 1; // Reset về trang 1 khi áp dụng bộ lọc
    renderCustomerTable();
}

if (customerTypeSelect) customerTypeSelect.onchange = applyFilters;
if (customerStatusSelect) customerStatusSelect.onchange = applyFilters;
if (filterCustomerNameInput) filterCustomerNameInput.addEventListener('input', applyFilters);
if (filterCustomerPhoneInput) filterCustomerPhoneInput.addEventListener('input', applyFilters);

// Thêm khách hàng
function getNextCustomerId() {
    let max = 0;
    customers.forEach(c => {
        const num = parseInt(c.id.replace('KH', ''));
        if (num > max) max = num;
    });
    console.log('Current max ID number:', max); // Debug log
    const nextIdNum = max + 1;
    const nextId = 'KH' + String(nextIdNum).padStart(3, '0');
    console.log('Next Customer ID:', nextId); // Debug log
    return nextId;
}
function openAddModal() {
    var modal = document.getElementById('addCustomerModal');
    if (modal) modal.classList.add('show');
    document.getElementById('addCustomerId').value = getNextCustomerId();
    document.getElementById('addCustomerId').readOnly = true;
    document.getElementById('addCustomerName').value = '';
    document.getElementById('addCustomerPhone').value = '';
    document.getElementById('addCustomerEmail').value = '';
    document.getElementById('addCustomerType').value = 'Cá nhân';
    document.getElementById('addCustomerDetailedAddress').value = '';
    document.getElementById('addCustomerStatus').value = 'active';
    populateProvinces(); // Populate provinces using API
    if (document.getElementById('addCustomerDetailedAddress')) document.getElementById('addCustomerDetailedAddress').value = ''; // Clear detailed address
}
document.getElementById('addCustomerBtn').onclick = openAddModal;
document.getElementById('addCustomerForm').onsubmit = function (e) {
    e.preventDefault();

    const addCustomerPhoneInput = document.getElementById('addCustomerPhone');
    const addCustomerEmailInput = document.getElementById('addCustomerEmail');
    const phone = addCustomerPhoneInput.value.trim();
    const email = addCustomerEmailInput.value.trim();
    const detailedAddress = document.getElementById('addCustomerDetailedAddress').value.trim();
    const province = document.getElementById('addCustomerProvince').options[document.getElementById('addCustomerProvince').selectedIndex].text;
    const district = document.getElementById('addCustomerDistrict').options[document.getElementById('addCustomerDistrict').selectedIndex].text;
    const ward = document.getElementById('addCustomerWard').options[document.getElementById('addCustomerWard').selectedIndex].text;

    // Simple phone number validation (only digits)
    if (!/^[0-9]+$/.test(phone)) {
        alert('Số điện thoại không hợp lệ. Vui lòng chỉ nhập số.');
        addCustomerPhoneInput.focus();
        return;
    }

    // More flexible email validation (presence of @ and a dot after @)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ. Vui lòng nhập địa chỉ email đúng định dạng (ví dụ: user@domain.com).');
        addCustomerEmailInput.focus();
        return;
    }

    if (!detailedAddress || province === 'Tỉnh/Thành phố' || district === 'Quận/Huyện' || ward === 'Phường/Xã') {
        alert('Vui lòng nhập đầy đủ thông tin địa chỉ.');
        return;
    }

    // Check for duplicate phone number or email
    const phoneExists = customers.some(c => c.phone === phone);
    const emailExists = customers.some(c => c.email === email);

    if (phoneExists) {
        alert('Số điện thoại đã tồn tại trong danh sách khách hàng.');
        addCustomerPhoneInput.focus();
        return;
    }

    if (emailExists) {
        alert('Email đã tồn tại trong danh sách khách hàng.');
        addCustomerEmailInput.focus();
        return;
    }

    const fullAddress = `${detailedAddress}, ${ward}, ${district}, ${province}`;

    const newCus = {
        id: document.getElementById('addCustomerId').value,
        name: document.getElementById('addCustomerName').value,
        phone: phone,
        email: email,
        type: document.getElementById('addCustomerType').value,
        address: fullAddress, // Sử dụng địa chỉ đầy đủ đã kết hợp
        status: document.getElementById('addCustomerStatus').value
    };
    customers.push(newCus);
    console.log('Customers array after adding new customer:', customers); // Debug log
    // Sau khi thêm, reset bộ lọc và về trang cuối cùng để xem KH mới
    filterType = '';
    filterStatus = '';
    filterCustomerName = '';
    filterCustomerPhone = '';
    if (customerTypeSelect) customerTypeSelect.value = '';
    if (customerStatusSelect) customerStatusSelect.value = '';
    if (filterCustomerNameInput) filterCustomerNameInput.value = '';
    if (filterCustomerPhoneInput) filterCustomerPhoneInput.value = '';

    const totalCustomersAfterAdd = customers.length;
    currentPage = Math.ceil(totalCustomersAfterAdd / itemsPerPage);

    renderCustomerTable();
    document.getElementById('addCustomerModal').classList.remove('show');
    alert('Thêm khách hàng thành công!');
    saveCustomersToLocalStorage(); // Save to localStorage
};
Array.from(document.querySelectorAll('#addCustomerModal .modal-close, #addCustomerModal [data-dismiss="modal"]')).forEach(btn => {
    btn.onclick = () => {
        document.getElementById('addCustomerModal').classList.remove('show');
        resetAddressDropdowns(); // Reset all address dropdowns
        if (document.getElementById('addCustomerDetailedAddress')) document.getElementById('addCustomerDetailedAddress').value = ''; // Clear detailed address
    };
});

// Sửa khách hàng
let editingId = null;
function openEditModalById(id) {
    editingId = id;
    const c = customers.find(cus => cus.id === id);
    const modal = document.getElementById('editCustomerModal'); // Get edit modal element
    if (modal && c) { // Check if modal and customer exist
        modal.classList.add('show');

        // Lấy tham chiếu các element của modal Sửa BÊN TRONG hàm này và kiểm tra null
        const editCustomerIdInput = document.getElementById('editCustomerId');
        const editCustomerNameInput = document.getElementById('editCustomerName');
        const editCustomerPhoneInput = document.getElementById('editCustomerPhone');
        const editCustomerEmailInput = document.getElementById('editCustomerEmail');
        const editCustomerTypeSelect = document.getElementById('editCustomerType');
        const editCustomerStatusSelect = document.getElementById('editCustomerStatus');
        const editCustomerProvinceSelect = document.getElementById('editCustomerProvince');
        const editCustomerDistrictSelect = document.getElementById('editCustomerDistrict');
        const editCustomerWardSelect = document.getElementById('editCustomerWard');
        const editCustomerDetailedAddressInput = document.getElementById('editCustomerDetailedAddress');

        // Gán dữ liệu cho các trường thông tin khác, kiểm tra null trước khi gán
        if (editCustomerIdInput) editCustomerIdInput.value = c.id;
        if (editCustomerNameInput) editCustomerNameInput.value = c.name;
        if (editCustomerPhoneInput) editCustomerPhoneInput.value = c.phone;
        if (editCustomerEmailInput) editCustomerEmailInput.value = c.email;
        if (editCustomerTypeSelect) editCustomerTypeSelect.value = c.type;
        if (editCustomerStatusSelect) editCustomerStatusSelect.value = c.status;

        // Parse address
        const addressParts = c.address ? c.address.split(',').map(part => part.trim()) : [];
        let detailed = '', wardName = '', districtName = '', provinceName = '';
        if (addressParts.length >= 4) {
            // Assume the last three parts are Ward, District, Province in that order
            provinceName = addressParts[addressParts.length - 1];
            districtName = addressParts[addressParts.length - 2];
            wardName = addressParts[addressParts.length - 3];
            detailed = addressParts.slice(0, addressParts.length - 3).join(', '); // Remaining parts are detailed
        } else {
            // If fewer than 4 parts, just put the whole thing in detailed address
            detailed = c.address ? c.address.trim() : '';
        }

        if (editCustomerDetailedAddressInput) editCustomerDetailedAddressInput.value = detailed;

        // Populate provinces for the Edit Modal and then select the correct ones
        // Pass the elements as arguments
        resetAddressDropdowns(editCustomerProvinceSelect, editCustomerDistrictSelect, editCustomerWardSelect);
        populateProvinces(editCustomerProvinceSelect, provinceName, function (provinceId) {
            if (provinceId) {
                // Populate districts for the matched province and then select the correct district
                populateDistricts(editCustomerDistrictSelect, editCustomerWardSelect, provinceId, districtName, function (districtId) {
                    if (districtId) {
                        // Populate wards for the matched district and then select the correct ward
                        populateWards(editCustomerWardSelect, districtId, wardName);
                    }
                });
            }
        });

        // Gắn event listeners cho các dropdown của modal Sửa
        if (editCustomerProvinceSelect && editCustomerDistrictSelect && editCustomerWardSelect) {
            // Remove existing listeners using removeEventListener if they were added previously (safer approach)
            // For simplicity here, we might rely on onchange which replaces previous handlers

            editCustomerProvinceSelect.onchange = function () {
                // Pass elements as arguments
                populateDistricts(editCustomerDistrictSelect, editCustomerWardSelect, this.value, '', null);
            };
            editCustomerDistrictSelect.onchange = function () {
                // Pass element as argument
                populateWards(editCustomerWardSelect, this.value, '');
            };
            // Ward dropdown usually doesn't need a change listener for address population
        }

    } else {
        console.error('Không tìm thấy modal chỉnh sửa hoặc khách hàng.', { modal: modal, customer: c });
    }
}
// The event listener for edit buttons is attached during renderCustomerTable function

document.getElementById('editCustomerForm').onsubmit = function (e) {
    e.preventDefault();

    const editCustomerPhoneInput = document.getElementById('editCustomerPhone');
    const editCustomerEmailInput = document.getElementById('editCustomerEmail');
    const phone = editCustomerPhoneInput ? editCustomerPhoneInput.value.trim() : '';
    const email = editCustomerEmailInput ? editCustomerEmailInput.value.trim() : '';

    // Kiểm tra trùng số điện thoại và email với khách hàng khác
    const phoneExists = customers.some(c => c.phone === phone && c.id !== editingId);
    const emailExists = customers.some(c => c.email === email && c.id !== editingId);
    if (phoneExists) {
        alert('Số điện thoại đã tồn tại trong danh sách khách hàng.');
        if (editCustomerPhoneInput) editCustomerPhoneInput.focus();
        return;
    }
    if (emailExists) {
        alert('Email đã tồn tại trong danh sách khách hàng.');
        if (editCustomerEmailInput) editCustomerEmailInput.focus();
        return;
    }

    // Get address components from Edit Modal fields inside the submit handler and add null checks
    const editCustomerDetailedAddressInput = document.getElementById('editCustomerDetailedAddress');
    const editCustomerProvinceSelect = document.getElementById('editCustomerProvince');
    const editCustomerDistrictSelect = document.getElementById('editCustomerDistrict');
    const editCustomerWardSelect = document.getElementById('editCustomerWard');

    const detailedAddress = editCustomerDetailedAddressInput ? editCustomerDetailedAddressInput.value.trim() : '';
    const provinceName = editCustomerProvinceSelect && editCustomerProvinceSelect.selectedIndex > 0 ? editCustomerProvinceSelect.options[editCustomerProvinceSelect.selectedIndex].text : '';
    const districtName = editCustomerDistrictSelect && editCustomerDistrictSelect.selectedIndex > 0 ? editCustomerDistrictSelect.options[editCustomerDistrictSelect.selectedIndex].text : '';
    const wardName = editCustomerWardSelect && editCustomerWardSelect.selectedIndex > 0 ? editCustomerWardSelect.options[editCustomerWardSelect.selectedIndex].text : '';

    // DuyKha: Validate address components in Edit Modal
    if (!detailedAddress || provinceName === 'Tỉnh/Thành phố' || districtName === 'Quận/Huyện' || wardName === 'Phường/Xã') {
        alert('Vui lòng nhập đầy đủ thông tin địa chỉ.');
        return;
    }

    // Simple phone number validation (only digits)
    if (!/^[0-9]+$/.test(phone)) {
        alert('Số điện thoại không hợp lệ. Vui lòng chỉ nhập số.');
        editCustomerPhoneInput.focus();
        return;
    }

    // More flexible email validation (presence of @ and a dot after @)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ. Vui lòng nhập địa chỉ email đúng định dạng (ví dụ: user@domain.com).');
        editCustomerEmailInput.focus();
        return;
    }

    if (editingId !== null) {
        const idx = customers.findIndex(cus => cus.id === editingId);
        if (idx !== -1) { // Check if customer exists
            // DuyKha: Combine detailed address and selected dropdown values for Edit Modal
            const fullAddress = `${detailedAddress}, ${wardName}, ${districtName}, ${provinceName}`;

            customers[idx] = {
                id: document.getElementById('editCustomerId').value,
                name: document.getElementById('editCustomerName').value,
                phone: phone,
                email: email,
                type: document.getElementById('editCustomerType').value,
                address: fullAddress, // Use the combined address
                status: document.getElementById('editCustomerStatus').value
            };
            renderCustomerTable();
            document.getElementById('editCustomerModal').classList.remove('show');
            alert('Cập nhật thông tin khách hàng thành công!');
            saveCustomersToLocalStorage(); // Save to localStorage
            editingId = null; // Reset editing ID
        }
    }
};
Array.from(document.querySelectorAll('#editCustomerModal .modal-close, #editCustomerModal [data-dismiss="modal"]')).forEach(btn => {
    btn.onclick = () => {
        document.getElementById('editCustomerModal').classList.remove('show');
    };
});

// Xóa khách hàng
let deletingId = null;
function openDeleteModalById(id) {
    deletingId = id;
    const c = customers.find(cus => cus.id === id);
    var modal = document.getElementById('deleteCustomerModal');
    if (modal && c) { // Check if modal and customer exist
        modal.classList.add('show');
        document.getElementById('deleteCustomerName').textContent = c.name;
    }
}
document.getElementById('confirmDelete').onclick = function () {
    if (deletingId !== null) {
        const initialCount = customers.length;
        customers = customers.filter(cus => cus.id !== deletingId);
        const finalCount = customers.length;
        if (finalCount < initialCount) { // Check if deletion actually happened
            renderCustomerTable();
            document.getElementById('deleteCustomerModal').classList.remove('show');
            alert('Xóa khách hàng thành công!');
            saveCustomersToLocalStorage(); // Save to localStorage
        } else {
            alert('Không tìm thấy khách hàng để xóa.');
            document.getElementById('deleteCustomerModal').classList.remove('show');
        }
        deletingId = null; // Reset deleting ID
    }
};
Array.from(document.querySelectorAll('#deleteCustomerModal .modal-close, #deleteCustomerModal [data-dismiss="modal"]')).forEach(btn => {
    btn.onclick = () => { document.getElementById('deleteCustomerModal').classList.remove('show'); };
});

// Xem chi tiết
function openDetailModalById(id) {
    const c = customers.find(cus => cus.id === id);
    if (c) { // Check if customer exists
        document.getElementById('detailCustomerId').textContent = c.id;
        document.getElementById('detailCustomerName').textContent = c.name;
        document.getElementById('detailCustomerPhone').textContent = c.phone;
        document.getElementById('detailCustomerEmail').textContent = c.email;
        document.getElementById('detailCustomerType').textContent = c.type;
        document.getElementById('detailCustomerAddress').textContent = c.address;
        document.getElementById('detailCustomerStatus').textContent = c.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động';
        document.getElementById('detailCustomerStatus').className = 'status-badge ' + (c.status === 'active' ? 'active' : 'inactive');
        document.getElementById('customerDetailModal').classList.add('show');
    }
}
Array.from(document.querySelectorAll('#customerDetailModal .modal-close, #customerDetailModal [data-dismiss="modal"]')).forEach(btn => {
    btn.onclick = () => { document.getElementById('customerDetailModal').classList.remove('show'); };
});

// Đóng modal bulk delete (nếu có)
Array.from(document.querySelectorAll('#bulkDeleteModal .modal-close, #bulkDeleteModal [data-dismiss="modal"]')).forEach(btn => {
    btn.onclick = () => { document.getElementById('bulkDeleteModal').classList.remove('show'); };
});

// Thêm hàm xuất Excel
function exportToExcel() {
    // Tạo workbook mới
    const wb = XLSX.utils.book_new();

    // Lọc dữ liệu theo các điều kiện đã chọn
    let filteredCustomers = customers.filter(c => {
        let ok = true;
        if (filterType) ok = ok && (c.type === (filterType === 'personal' ? 'Cá nhân' : 'Doanh nghiệp'));
        if (filterStatus) ok = ok && (c.status === filterStatus);
        if (filterCustomerName) {
            const normalizedCustomerName = normalizeVietnameseString(c.name);
            const normalizedFilterName = normalizeVietnameseString(filterCustomerName);
            ok = ok && normalizedCustomerName.includes(normalizedFilterName);
        }
        if (filterCustomerPhone) ok = ok && c.phone.includes(filterCustomerPhone);
        return ok;
    });

    // Chuẩn bị dữ liệu cho Excel và tính toán độ rộng cột
    const excelData = filteredCustomers.map(customer => ({
        'Mã KH': customer.id,
        'Họ và tên': customer.name,
        'Số điện thoại': customer.phone,
        'Email': customer.email,
        'Loại KH': customer.type,
        'Địa chỉ': customer.address,
        'Trạng thái': customer.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'
    }));

    // Tạo worksheet từ dữ liệu
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Tính toán độ rộng cột tự động
    const columnWidths = [];
    // Headers
    const headers = ['Mã KH', 'Họ và tên', 'Số điện thoại', 'Email', 'Loại KH', 'Địa chỉ', 'Trạng thái'];
    headers.forEach((header, colIndex) => {
        let maxWidth = header.length; // Start with header length
        excelData.forEach(row => {
            const cellValue = row[header];
            if (cellValue !== null && cellValue !== undefined) {
                maxWidth = Math.max(maxWidth, String(cellValue).length);
            }
        });
        // Add a little extra padding for better readability (e.g., 2 characters)
        columnWidths.push({ wch: maxWidth + 2 });
    });

    // Áp dụng độ rộng cột vào worksheet
    ws['!cols'] = columnWidths;

    // DuyKha: Thêm viền đen cho tất cả các ô dữ liệu
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[cellRef]) ws[cellRef] = {}; // Tạo ô nếu chưa tồn tại

            // Kiểm tra nếu đây là hàng tiêu đề (hàng đầu tiên)
            const isHeaderRow = (R === range.s.r);
            const isLastRow = (R === range.e.r);
            const isFirstCol = (C === range.s.c);
            const isLastCol = (C === range.e.c);

            ws[cellRef].s = {
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            };
        }
    }

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách khách hàng");

    // Xuất file Excel
    XLSX.writeFile(wb, "Danh_sach_khach_hang.xlsx");
}

// Gắn sự kiện cho nút xuất Excel
document.querySelector('.btn-export').addEventListener('click', exportToExcel);

// Render lần đầu
renderCustomerTable();
// ================== END DuyKha ==================

// Function to save customers to localStorage
function saveCustomersToLocalStorage() {
    localStorage.setItem('customers', JSON.stringify(customers));
}

// ================== Tích hợp API địa chỉ từ create-package.html ==================
const addCustomerProvinceSelect = document.getElementById('addCustomerProvince');
const addCustomerDistrictSelect = document.getElementById('addCustomerDistrict');
const addCustomerWardSelect = document.getElementById('addCustomerWard');
const addCustomerDetailedAddressInput = document.getElementById('addCustomerDetailedAddress');

// Populate provinces for the Add Modal on initial load
document.addEventListener('DOMContentLoaded', function () {
    const addCustomerProvinceSelect = document.getElementById('addCustomerProvince');
    const addCustomerDistrictSelect = document.getElementById('addCustomerDistrict');
    const addCustomerWardSelect = document.getElementById('addCustomerWard');
    const addCustomerDetailedAddressInput = document.getElementById('addCustomerDetailedAddress');

    // Initial populate for Add Modal provinces
    populateProvinces(addCustomerProvinceSelect, '', null); // Populate provinces on load, no pre-selected name, no callback needed initially

    // Add event listeners for Add Modal dropdowns
    if (addCustomerProvinceSelect && addCustomerDistrictSelect && addCustomerWardSelect) {
        addCustomerProvinceSelect.addEventListener('change', function () {
            // Pass elements as arguments
            populateDistricts(addCustomerDistrictSelect, addCustomerWardSelect, this.value, '', null);
        });
        addCustomerDistrictSelect.addEventListener('change', function () {
            // Pass element as argument
            populateWards(addCustomerWardSelect, this.value, '');
        });
    }

    // When Add modal is opened, reset and repopulate provinces
    const addCustomerModalElement = document.getElementById('addCustomerModal');
    if (addCustomerModalElement) {
        const addCustomerBtn = document.getElementById('addCustomerBtn');
        if (addCustomerBtn) {
            addCustomerBtn.addEventListener('click', function () {
                // Get elements inside the click handler to ensure they exist
                const currentAddCustomerProvinceSelect = document.getElementById('addCustomerProvince');
                const currentAddCustomerDistrictSelect = document.getElementById('addCustomerDistrict');
                const currentAddCustomerWardSelect = document.getElementById('addCustomerWard');
                const currentAddCustomerDetailedAddressInput = document.getElementById('addCustomerDetailedAddress');

                // Reset and repopulate provinces for Add Modal, passing elements
                resetAddressDropdowns(currentAddCustomerProvinceSelect, currentAddCustomerDistrictSelect, currentAddCustomerWardSelect);
                populateProvinces(currentAddCustomerProvinceSelect, '', null); // Repopulate provinces using API
                if (currentAddCustomerDetailedAddressInput) currentAddCustomerDetailedAddressInput.value = ''; // Clear detailed address
            });
        }

        // Handle reset when Add modal is closed
        Array.from(addCustomerModalElement.querySelectorAll('.modal-close, [data-dismiss="modal"]')).forEach(btn => {
            btn.onclick = () => {
                addCustomerModalElement.classList.remove('show');
                // Get elements inside the click handler to ensure they exist
                const currentAddCustomerProvinceSelect = document.getElementById('addCustomerProvince');
                const currentAddCustomerDistrictSelect = document.getElementById('addCustomerDistrict');
                const currentAddCustomerWardSelect = document.getElementById('addCustomerWard');
                const currentAddCustomerDetailedAddressInput = document.getElementById('addCustomerDetailedAddress');

                // Reset all address dropdowns for Add modal, passing elements
                resetAddressDropdowns(currentAddCustomerProvinceSelect, currentAddCustomerDistrictSelect, currentAddCustomerWardSelect);
                if (currentAddCustomerDetailedAddressInput) currentAddCustomerDetailedAddressInput.value = ''; // Clear detailed address
            };
        });
    }

    // Add event listeners for the dropdowns in the Edit Modal (using event delegation or attached when modal opens)
    // A safer way is to attach listeners when the modal is opened, or use event delegation on the modal element.
    // Attaching when open is simpler given the current structure.

    const editCustomerModalElement = document.getElementById('editCustomerModal');
    if (editCustomerModalElement) {
        // Handle reset when Edit modal is closed
        Array.from(editCustomerModalElement.querySelectorAll('.modal-close, [data-dismiss="modal"]')).forEach(btn => {
            btn.onclick = () => {
                editCustomerModalElement.classList.remove('show');
                // Get elements inside the click handler
                const currentEditCustomerProvinceSelect = document.getElementById('editCustomerProvince');
                const currentEditCustomerDistrictSelect = document.getElementById('editCustomerDistrict');
                const currentEditCustomerWardSelect = document.getElementById('editCustomerWard');
                const currentEditCustomerDetailedAddressInput = document.getElementById('editCustomerDetailedAddress');

                // Reset dropdown when modal is closed, passing elements
                resetAddressDropdowns(currentEditCustomerProvinceSelect, currentEditCustomerDistrictSelect, currentEditCustomerWardSelect);
                if (currentEditCustomerDetailedAddressInput) currentEditCustomerDetailedAddressInput.value = ''; // Clear detailed address
            };
        });
    }

    // Attaching change listeners when openEditModalById runs is also a valid approach.
    // We will add them inside openEditModalById to ensure elements exist.
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.modal').forEach(function (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                modal.classList.remove('visible');
            }
        });
    });
});