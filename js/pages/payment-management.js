document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const mobileSidebarToggleBtn = document.getElementById('mobile-sidebar-toggle');
    const currentDateSpan = document.getElementById('current-date');
    const currentTimeSpan = document.getElementById('current-time');
    const currentYearSpan = document.getElementById('current-year');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const usdInput = document.getElementById('exchange_rate');
    const vndInput = document.getElementById('exchange_rate_vnd');
    const customExchangeRateInput = document.getElementById('custom_exchange_rate');
    const currencySwitchBtn = document.querySelector('.currency-switch-btn');
    const form = document.getElementById('payment-status-form');

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

    const isElementVisible = (el) => el && !el.hasAttribute('hidden') && el.offsetParent !== null;

    const manageBaseBodyScroll = () => {
        const isSidebarOpen = body.classList.contains('sidebar-mobile-open');
        const isAnyModalVisible = document.querySelector('.confirmation-modal.visible');
        if (isSidebarOpen || isAnyModalVisible) {
            body.classList.add('overflow-hidden');
        } else {
            body.classList.remove('overflow-hidden');
        }
    };

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

    function toggleSidebarMobileOrDesktop() {
        if (window.innerWidth > 768) {
            body.classList.toggle('sidebar-collapsed');
        } else {
            body.classList.toggle('sidebar-mobile-open');
        }
        const isOpen = body.classList.contains('sidebar-mobile-open') || !body.classList.contains('sidebar-collapsed');
        if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.setAttribute('aria-expanded', String(isOpen));
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

        const parentList = parentLink.closest('ul');
        if (parentList) {
            parentList.querySelectorAll(':scope > li > .submenu-parent.active').forEach(activeParent => {
                if (activeParent !== parentLink) {
                    activeParent.classList.remove('active');
                    const activeSubmenu = activeParent.nextElementSibling;
                    if(activeSubmenu && activeSubmenu.classList.contains('submenu')) {
                         activeSubmenu.classList.remove('active');
                    }
                    const otherArrow = activeParent.querySelector('.submenu-arrow');
                    if(otherArrow) otherArrow.style.transform = 'rotate(0deg)';
                }
            });
        }

        const isActive = submenuWrapper.classList.toggle('active');
        parentLink.classList.toggle('active', isActive);
        if (arrow) {
             arrow.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
         }
    }

    function initializeActiveSubmenu() {
         const activeSubmenuLink = document.querySelector('.sidebar .submenu a.active');
         if (activeSubmenuLink) {
              const submenuDiv = activeSubmenuLink.closest('.submenu');
              const parentLink = submenuDiv?.previousElementSibling;
              if(submenuDiv && parentLink && parentLink.classList.contains('submenu-parent')) {
                   if (!(body.classList.contains('sidebar-collapsed') && window.innerWidth > 768)) {
                        submenuDiv.classList.add('active');
                        parentLink.classList.add('active');
                        const arrow = parentLink.querySelector('.submenu-arrow');
                        if(arrow) arrow.style.transform = 'rotate(180deg)';
                    } else {
                         submenuDiv.classList.remove('active');
                         parentLink.classList.remove('active');
                         const arrow = parentLink.querySelector('.submenu-arrow');
                         if(arrow) arrow.style.transform = 'rotate(0deg)';
                    }
              }
         }
    }

    function showConfirmationModal(modalId, targetData = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.dataset.targetData = JSON.stringify(targetData);
        modal.classList.add('visible');
        manageBaseBodyScroll();
    }

    function hideConfirmationModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            delete modal.dataset.targetData;
            modal.classList.remove('visible');
            manageBaseBodyScroll();
        }
    }

    function updateDateTime() {
        const now = new Date();
        const optionsDate = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        if (currentDateSpan) currentDateSpan.textContent = now.toLocaleDateString('en-GB', optionsDate).replace(/,/g, '');
        if (currentTimeSpan) currentTimeSpan.textContent = now.toLocaleTimeString('en-US', optionsTime);
        if (currentYearSpan) currentYearSpan.textContent = now.getFullYear();
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.error(`Fullscreen error: ${err.message}`));
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

    function toggleSectionOriginal(buttonElement) {
        const section = buttonElement.closest('.detail-section-original');
        const content = section?.querySelector('.section-content-original');
        const icon = buttonElement.querySelector('i');
        if (section && content && icon) {
            const isCollapsed = section.classList.toggle('collapsed');
            icon.classList.toggle('fa-chevron-down', isCollapsed);
            icon.classList.toggle('fa-chevron-up', !isCollapsed);
        }
    }

    function calculateAndUpdateVND() {
        if (!usdInput || !vndInput) return;
        const usdValue = parseFloat(usdInput.value) || 0;
        const currentExchangeRate = parseFloat(customExchangeRateInput.value) || 25500;
        const vndValue = usdValue * currentExchangeRate;
        vndInput.value = vndValue.toLocaleString('vi-VN');
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

    initializeActiveSubmenu();
    updateDateTime();
    setInterval(updateDateTime, 1000);

    if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.addEventListener('click', toggleSidebarMobileOrDesktop);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebarMobileOrDesktop);
    document.querySelectorAll('.menu-items .submenu-parent').forEach(link => link.addEventListener('click', toggleSubmenu));
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    document.querySelectorAll('.section-toggle-btn').forEach(button => {
        button.addEventListener('click', () => toggleSectionOriginal(button));
        const section = button.closest('.detail-section-original');
        const icon = button.querySelector('i');
        if (section && icon) {
            const isCollapsed = section.classList.contains('collapsed');
            icon.classList.toggle('fa-chevron-down', isCollapsed);
            icon.classList.toggle('fa-chevron-up', !isCollapsed);
        }
    });

    document.querySelectorAll('.update-button-original').forEach(button => {
        button.addEventListener('click', (e) => alert('Cập nhật thông tin thanh toán (demo)!'));
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const confirmCheckbox = document.getElementById('confirm_payment_info');
            if (confirmCheckbox && confirmCheckbox.required && !confirmCheckbox.checked) {
                alert('Vui lòng xác nhận đã kiểm tra thông tin trước khi hoàn thành.');
                return;
            }
            alert('Đã hoàn thành cập nhật thanh toán (demo)!');
            window.location.href = 'package_manager.html';
        });
        const resetButton = form.querySelector('button[type="reset"]');
        if (resetButton) resetButton.addEventListener('click', () => {});
    }

    if (currencySwitchBtn) currencySwitchBtn.addEventListener('click', () => alert('Chức năng chuyển đổi tiền tệ (demo)!'));
    if (usdInput) {
        usdInput.addEventListener('input', calculateAndUpdateVND);
        calculateAndUpdateVND();
    }

    if (customExchangeRateInput) {
         customExchangeRateInput.addEventListener('input', calculateAndUpdateVND);
    }

    document.querySelectorAll('.confirmation-modal').forEach(modal => {
        const modalId = modal.id;
        modal.querySelector('.confirm-yes')?.addEventListener('click', () => {
             const data = JSON.parse(modal.dataset.targetData || '{}');
             hideConfirmationModal(modalId);
        });
        modal.querySelector('.confirm-cancel')?.addEventListener('click', () => hideConfirmationModal(modalId));
        modal.addEventListener('click', (event) => { if (event.target === modal) hideConfirmationModal(modalId); });
    });

    if (announcementOverlay && announcementOverlay.classList.contains('visible')) {
        closeAnnouncement();
    }

    if (notificationButton) notificationButton.addEventListener('click', (event) => { event.stopPropagation(); toggleNotificationDropdown(); });

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

    if (announcementCloseBtn) announcementCloseBtn.addEventListener('click', closeAnnouncement);

    if (announcementOverlay) {
        announcementOverlay.addEventListener('click', (event) => {
            if (event.target === announcementOverlay) closeAnnouncement();
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

    // Initialize date pickers
    const datePickers = document.querySelectorAll('.date-picker');
    datePickers.forEach(input => {
        flatpickr(input, {
            locale: (window.flatpickr && flatpickr.l10ns && flatpickr.l10ns.vi) ? flatpickr.l10ns.vi : 'default',
            dateFormat: 'd/m/Y',
            allowInput: false,
            disableMobile: false,
            static: false,
            position: 'auto',
            appendTo: document.body,
            onChange: function(selectedDates, dateStr) {
                // You can add any additional logic here when date changes
            }
        });
    });
});
// --- Dropdown user & đăng nhập/đăng xuất ---
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
// Dropdown show/hide
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
});
document.addEventListener('DOMContentLoaded', function() {
// Đọc orderId từ URL parameter
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');

// Cập nhật tiêu đề trang nếu có orderId
const pageTitleElement = document.querySelector('.page-title');
if (pageTitleElement && orderId) {
    pageTitleElement.textContent = `Tình trạng thanh toán - ${orderId}`;
    // TODO: Thêm logic để load dữ liệu thanh toán của đơn hàng này từ backend/API nếu có

    // --- Thêm logic đọc trạng thái ĐL từ localStorage và set vào dropdown ---
    const savedStatusDL = localStorage.getItem('paymentStatusDL_' + orderId);
    const agentStatusSelect = document.querySelectorAll('.payment-details-original select')[0]; // Select của Đại lý
    if (savedStatusDL && agentStatusSelect) {
         // Tìm option có value tương ứng và set selected
         const options = agentStatusSelect.options;
         for (let i = 0; i < options.length; i++) {
              if (options[i].value === savedStatusDL) {
                   agentStatusSelect.selectedIndex = i;
                   break;
              }
         }
    }
    // ---------------------------------------------------------------------

} else if (pageTitleElement) {
    // Nếu không có orderId, có thể hiển thị thông báo hoặc quay về trang danh sách
    pageTitleElement.textContent = `Tình trạng thanh toán`; // Hoặc thông báo lỗi
    // alert('Không có mã đơn hàng được chọn.');
    // window.history.back(); // Tùy chọn: Quay về trang trước
}


// Nút cập nhật trạng thái thanh toán KH (cột bên trái)
const updateBtnKH = document.querySelectorAll('.payment-details-original .update-button-original')[0];
if (updateBtnKH) {
    updateBtnKH.addEventListener('click', function() {
        // Lấy mã đơn hàng TỪ BIẾN orderId đã đọc từ URL
        const currentOrderId = orderId; // Sử dụng biến orderId từ URL
        if (!currentOrderId) return alert('Không tìm thấy mã đơn hàng để lưu!');
        // Lấy trạng thái từ select của Khách hàng
        const status = document.querySelectorAll('.payment-details-original select')[0].value;
        // Lưu vào localStorage với key riêng cho KH
        localStorage.setItem('paymentStatusKH_' + currentOrderId, status);
        alert('Đã lưu trạng thái thanh toán KH cho đơn ' + currentOrderId + '!');
    });
}

// Nút cập nhật trạng thái thanh toán ĐL (cột bên phải)
const updateBtnDL = document.querySelectorAll('.payment-details-original .update-button-original')[1];
if (updateBtnDL) {
    updateBtnDL.addEventListener('click', function() {
         // Lấy mã đơn hàng TỪ BIẾN orderId đã đọc từ URL
        const currentOrderId = orderId; // Sử dụng biến orderId từ URL
        if (!currentOrderId) return alert('Không tìm thấy mã đơn hàng để lưu!');
        // Lấy trạng thái từ select của Đại lý
        const status = document.querySelectorAll('.payment-details-original select')[0].value;
        // Lưu vào localStorage với key riêng cho ĐL
        localStorage.setItem('paymentStatusDL_' + currentOrderId, status);
        alert('Đã lưu trạng thái thanh toán ĐL cho đơn ' + currentOrderId + '!');
    });
}
});