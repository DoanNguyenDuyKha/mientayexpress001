const body = document.body;
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const mobileSidebarToggleBtn = document.getElementById('mobile-sidebar-toggle');
const desktopSidebarToggleBtn = document.querySelector('.sidebar-toggle-desktop');
const currentDateSpan = document.getElementById('current-date');
const currentTimeSpan = document.getElementById('current-time');
const currentYearSpan = document.getElementById('current-year');
const fullscreenBtn = document.getElementById('fullscreen-btn');

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
        const isOpen = body.classList.contains('sidebar-mobile-open');
        if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.setAttribute('aria-expanded', String(isOpen));
    }
    manageBodyScroll();
}

function toggleSidebarDesktop() {
    body.classList.toggle('sidebar-collapsed');
    const isCollapsed = body.classList.contains('sidebar-collapsed');
    if (desktopSidebarToggleBtn) {
        desktopSidebarToggleBtn.title = isCollapsed ? "Phóng Sidebar" : "Thu Sidebar";
    }
    if (isCollapsed) {
        document.querySelectorAll('.menu-items .submenu.active').forEach(submenu => {
            submenu.classList.remove('active');
            const parentLink = submenu.previousElementSibling;
            if (parentLink?.classList.contains('submenu-parent')) {
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
    if (body.classList.contains('sidebar-collapsed') && window.innerWidth > 768) return;
    const parentLink = event.currentTarget;
    const submenuWrapper = parentLink.nextElementSibling;
    const arrow = parentLink.querySelector('.submenu-arrow');
    if (!submenuWrapper?.classList.contains('submenu')) return;
    const parentList = parentLink.closest('ul');
    if (parentList) {
        parentList.querySelectorAll(':scope > li > .submenu-parent.active').forEach(activeParent => {
            if (activeParent !== parentLink) {
                activeParent.classList.remove('active');
                activeParent.nextElementSibling?.classList.remove('active');
                activeParent.querySelector('.submenu-arrow')?.style.setProperty('transform', 'rotate(0deg)');
            }
        });
    }
    const isActive = submenuWrapper.classList.toggle('active');
    parentLink.classList.toggle('active', isActive);
    if (arrow) arrow.style.setProperty('transform', isActive ? 'rotate(180deg)' : 'rotate(0deg)');
}

function initializeActiveSubmenu() {
    const activeSubmenuLink = document.querySelector('.sidebar .submenu a.active');
    if (activeSubmenuLink) {
        const submenuDiv = activeSubmenuLink.closest('.submenu');
        const parentLink = submenuDiv?.previousElementSibling;
        if (submenuDiv && parentLink?.classList.contains('submenu-parent')) {
            if (!(body.classList.contains('sidebar-collapsed') && window.innerWidth > 768)) {
                submenuDiv.classList.add('active');
                parentLink.classList.add('active');
                parentLink.querySelector('.submenu-arrow')?.style.setProperty('transform', 'rotate(180deg)');
            } else {
                submenuDiv.classList.remove('active');
                parentLink.classList.remove('active');
                parentLink.querySelector('.submenu-arrow')?.style.setProperty('transform', 'rotate(0deg)');
            }
        }
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
    if (icon) {
        icon.classList.toggle('fa-expand', !isFullscreen);
        icon.classList.toggle('fa-compress', isFullscreen);
    }
    if (fullscreenBtn) {
        fullscreenBtn.setAttribute('title', isFullscreen ? 'Exit Fullscreen' : 'Fullscreen');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeActiveSubmenu();
    updateDateTime();
    setInterval(updateDateTime, 1000);

    if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.addEventListener('click', toggleSidebarMobileOrDesktop);
    else console.error("Mobile toggle button not found");
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebarMobileOrDesktop);
    else console.error("Sidebar overlay not found");
    if (desktopSidebarToggleBtn) desktopSidebarToggleBtn.addEventListener('click', toggleSidebarDesktop);
    document.querySelectorAll('.menu-items .submenu-parent').forEach(link => { link.addEventListener('click', toggleSubmenu); });
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    function toggleCardSection(buttonElement) {
        const card = buttonElement.closest('.card');
        const icon = buttonElement.querySelector('i');
        if (card && icon) {
            const isCollapsed = card.classList.toggle('collapsed');
            icon.classList.toggle('fa-chevron-down', isCollapsed);
            icon.classList.toggle('fa-chevron-up', !isCollapsed);
        }
    }

    document.querySelectorAll('.card-header .section-toggle-btn').forEach(button => {
        button.addEventListener('click', () => toggleCardSection(button));
        const card = button.closest('.card');
        const icon = button.querySelector('i');
        if (card && icon) {
            const isCollapsed = card.classList.contains('collapsed');
            icon.classList.toggle('fa-chevron-down', isCollapsed);
            icon.classList.toggle('fa-chevron-up', !isCollapsed);
        }
    });

    function updateScreenshotProgressBar(activeIndex) {
        const steps = document.querySelectorAll('.progress-step-ss');
        const totalSteps = steps.length;
        if (!steps || totalSteps === 0) return;
        activeIndex = Math.max(0, Math.min(activeIndex, totalSteps - 1));
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index < activeIndex) { step.classList.add('completed'); }
            else if (index === activeIndex) { step.classList.add('active'); }
        });
        const progressPercent = totalSteps <= 1 ? 100 : (activeIndex / (totalSteps - 1)) * 100;
        document.documentElement.style.setProperty('--straking-progress-width-ss', progressPercent + '%');
    }

    const statusUpdateForm = document.getElementById('tracking-status-form');
    const mainUpdateButton = statusUpdateForm?.querySelector('.btn-update-ss');
    const mainCancelButton = statusUpdateForm?.querySelector('.btn-cancel-ss');
    const mainStatusSelect = document.getElementById('tracking_status_select');

    if (mainUpdateButton && mainStatusSelect) {
        mainUpdateButton.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedValue = mainStatusSelect.value;
            const selectedText = mainStatusSelect.options[mainStatusSelect.selectedIndex].text;
            alert(`Cập nhật trạng thái thành: ${selectedText} (Demo)`);
            let newIndex = 0;
            switch (selectedValue) {
                case 'received': newIndex = 0; break;
                case 'warehouse': newIndex = 1; break;
                case 'shipping': newIndex = 2; break;
                case 'delivered': newIndex = 3; break;
                default: newIndex = 0;
            }
            updateScreenshotProgressBar(newIndex);
        });
    }
    if (mainCancelButton) { mainCancelButton.addEventListener('click', () => window.history.back()); }

    const addHistoryToggle = document.querySelector('.add-history-toggle-ss');
    const addHistoryForm = document.querySelector('.add-history-form-ss');
    if (addHistoryForm) addHistoryForm.style.display = 'none';
    if (addHistoryToggle && addHistoryForm) {
        addHistoryToggle.addEventListener('click', () => {
            const isHidden = addHistoryForm.style.display === 'none' || addHistoryForm.style.display === '';
            addHistoryForm.style.display = isHidden ? 'block' : 'none';
        });
    }

    const handleDeleteHistory = (e) => {
        e.stopPropagation();
        if (confirm('Bạn có chắc muốn xóa mục lịch sử này?')) {
            e.target.closest(".timeline-item-ss")?.remove();
            alert('Đã xóa mục lịch sử (Demo)!');
        }
    };
    document.querySelectorAll('.timeline-delete-btn-ss').forEach(button => { button.addEventListener('click', handleDeleteHistory); });

    updateScreenshotProgressBar(2);

    const timelineSection = document.querySelector('.timeline-section-ss');
    const timelineList = timelineSection?.querySelector('.timeline-ss');
    const timelineToggleBtn = timelineSection?.querySelector('.timeline-toggle-btn-ss');
    if (timelineToggleBtn && timelineList) {
        timelineList.classList.add('collapsed');
        timelineList.style.display = 'none';
        const icon = timelineToggleBtn.querySelector('i');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
        timelineToggleBtn.addEventListener('click', () => {
            const isCollapsed = timelineList.classList.toggle('collapsed');
            const icon = timelineToggleBtn.querySelector('i');
            if (isCollapsed) {
                timelineList.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                timelineList.style.display = '';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    }

    // Add event listener to history time input to show picker on click
    const historyTimeInput = document.getElementById('history_time_ss');
    if (historyTimeInput) {
        historyTimeInput.addEventListener('click', function () {
            // Attempt to show the picker directly
            if (typeof this.showPicker === 'function') {
                this.showPicker();
            } else {
                // Fallback: focus the element, which often triggers the picker
                this.focus();
            }
        });
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
                    if (paragraphText.trim()) {
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

document.addEventListener('DOMContentLoaded', function () {
    function renderUserDropdown() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userToggle = document.getElementById('user-dropdown-toggle');
        const userDropdown = document.getElementById('user-dropdown');
        if (!userToggle || !userDropdown) return;
        if (!isLoggedIn) {
            // Chưa đăng nhập: chỉ hiện icon user và 1 mục Đăng nhập
            userToggle.innerHTML = '<i class="fa-regular fa-circle-user user-icon" id="user-icon" style="color: #64748b; font-size: 1.6em;"></i>';
            userDropdown.innerHTML = '<a href="#" class="user-dropdown-item" id="login-menu-item"><i class="fa-solid fa-right-to-bracket"></i> Đăng nhập</a>';
            document.getElementById('username-display')?.classList.add('d-none');
        } else {
            // Đã đăng nhập: hiện đủ menu
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
            document.getElementById('username-display')?.classList.remove('d-none');
        }
        // Gắn sự kiện cho menu
        setTimeout(() => {
            const loginItem = document.getElementById('login-menu-item');
            if (loginItem) loginItem.onclick = function (e) { e.preventDefault(); window.location.href = 'login.html'; };
            const logoutItem = document.getElementById('logout-menu-item');
            if (logoutItem) logoutItem.onclick = function (e) { e.preventDefault(); localStorage.removeItem('isLoggedIn'); window.location.reload(); };
        }, 100);
    }
    renderUserDropdown();
    window.addEventListener('storage', renderUserDropdown);
});