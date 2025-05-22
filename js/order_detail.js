// Order Detail Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded - Initializing Order Detail Page...");

    // DOM Elements
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const mobileSidebarToggleBtn = document.getElementById('mobile-sidebar-toggle');
    const currentYearSpan = document.getElementById('current-year');
    const modalOverlay = document.getElementById('editStatusModalOverlay');
    const modalContent = document.getElementById('editStatusModalContent');
    const notificationButton = document.getElementById('notification-button');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const notificationList = document.getElementById('notification-list');
    const announcementOverlay = document.getElementById('announcement-overlay');
    const announcementBox = document.getElementById('announcement-box');
    const announcementCloseBtn = document.getElementById('announcement-close-btn');
    const announcementTitle = document.getElementById('announcement-title');
    const announcementBodyEl = document.getElementById('announcement-body');
    const announcementTimestamp = document.getElementById('announcement-timestamp');

    // Utility Functions
    const manageBodyScroll = () => {
        const isSidebarOpen = body.classList.contains('sidebar-mobile-open');
        const isAnyModalVisible = document.querySelector('.modal-overlay.active') ||
                                  (announcementOverlay && announcementOverlay.classList.contains('visible'));
        if (isSidebarOpen || isAnyModalVisible) {
            body.classList.add('overflow-hidden');
        } else {
            body.classList.remove('overflow-hidden');
        }
    };

    const toggleSidebarMobileOrDesktop = () => {
        if (window.innerWidth > 768) {
            document.body.classList.toggle('sidebar-collapsed');
            const isCollapsed = document.body.classList.contains('sidebar-collapsed');
            if (isCollapsed) {
                document.querySelectorAll('.menu-items .submenu.active').forEach(submenu => {
                    submenu.classList.remove('active');
                    const parentLink = submenu.previousElementSibling;
                    if(parentLink?.classList.contains('submenu-parent')) {
                        parentLink.classList.remove('active');
                        parentLink.querySelector('.submenu-arrow')?.style.setProperty('transform', 'rotate(0deg)');
                    }
                });
            } else {
                initializeActiveSubmenu();
            }
        } else {
            document.body.classList.toggle('sidebar-mobile-open');
        }
        const isOpen = document.body.classList.contains('sidebar-mobile-open') || !document.body.classList.contains('sidebar-collapsed');
        if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.setAttribute('aria-expanded', String(isOpen));
        manageBodyScroll();
    };

    const toggleSubmenu = (event) => {
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
    };

    const initializeActiveSubmenu = () => {
        const activeSubmenuLink = document.querySelector('.sidebar .submenu a.active');
        if (activeSubmenuLink) {
            const submenuDiv = activeSubmenuLink.closest('.submenu');
            const parentLink = submenuDiv?.previousElementSibling;
            if(submenuDiv && parentLink && parentLink.classList.contains('submenu-parent')) {
                submenuDiv.classList.add('active');
                parentLink.classList.add('active');
            }
        }
    };

    const updateDateTime = () => {
        const now = new Date();
        const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        try {
            let dayOfWeek;
            switch (now.getDay()) {
                case 0: dayOfWeek = "Sun"; break;
                case 1: dayOfWeek = "Mon"; break;
                case 2: dayOfWeek = "Tue"; break;
                case 3: dayOfWeek = "Wed"; break;
                case 4: dayOfWeek = "Thu"; break;
                case 5: dayOfWeek = "Fri"; break;
                case 6: dayOfWeek = "Sat"; break;
                default: dayOfWeek = "";
            }
            const dateString = `${dayOfWeek}, ${now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
            const currentDateSpan = document.getElementById('current-date');
            const currentTimeSpan = document.getElementById('current-time');
            if (currentDateSpan) currentDateSpan.textContent = dateString;
            if (currentTimeSpan) currentTimeSpan.textContent = now.toLocaleTimeString('en-US', optionsTime);
        } catch (e) {
            const currentDateSpan = document.getElementById('current-date');
            const currentTimeSpan = document.getElementById('current-time');
            if (currentDateSpan) currentDateSpan.textContent = now.toLocaleDateString();
            if (currentTimeSpan) currentTimeSpan.textContent = now.toLocaleTimeString();
        }
        if (currentYearSpan) currentYearSpan.textContent = now.getFullYear();
    };

    const toggleSection = (event) => {
        if (event.target.closest('button:not(.toggle-arrow), a, input, select')) {
            return;
        }

        const header = event.currentTarget;
        const section = header.closest('.detail-section');
        const sectionBody = section?.querySelector('.section-body');
        const toggleButton = header.querySelector('.toggle-arrow');
        const arrowIcon = toggleButton?.querySelector('.arrow');

        if (sectionBody && arrowIcon && toggleButton) {
            const isHidden = sectionBody.classList.toggle('hidden');
            arrowIcon.classList.toggle('fa-chevron-up', !isHidden);
            arrowIcon.classList.toggle('fa-chevron-down', isHidden);
            toggleButton.setAttribute('title', isHidden ? 'Hiện' : 'Ẩn');
        }
    };

    const initializeSectionToggles = () => {
        document.querySelectorAll('.detail-section .card-header').forEach(header => {
            const toggleButton = header.querySelector('.toggle-arrow');
            const sectionBody = header.nextElementSibling;
            const arrowIcon = toggleButton?.querySelector('.arrow');

            if (toggleButton && sectionBody && arrowIcon) {
                toggleButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sectionBody.classList.toggle('collapsed');
                    arrowIcon.classList.toggle('collapsed');
                });
            }
        });
    };

    // Modal Functions
    const closeEditModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            manageBodyScroll();
        }
        if (modalContent) modalContent.innerHTML = '';
        if (modalOverlay) modalOverlay.onclick = null;
        console.log("Generic modal closed.");
    };

    const loadAndExecuteScripts = async (container, htmlContent) => {
        // Create a temporary container
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // First, append all non-script content
        Array.from(tempDiv.childNodes).forEach(node => {
            if (node.tagName !== 'SCRIPT') {
                container.appendChild(node.cloneNode(true));
            }
        });

        // Then handle scripts
        const scripts = tempDiv.querySelectorAll('script');
        for (const script of scripts) {
            try {
                if (script.src) {
                    // Handle external scripts
                    await new Promise((resolve, reject) => {
                        const newScript = document.createElement('script');
                        newScript.src = script.src;
                        newScript.onload = resolve;
                        newScript.onerror = reject;
                        container.appendChild(newScript);
                    });
                } else {
                    // Handle inline scripts
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    container.appendChild(newScript);
                }
                console.log("Successfully loaded script:", script.src || "inline script");
            } catch (error) {
                console.error("Error loading script:", error);
            }
        }
    };

    const attachOverlayClickListener = () => {
        if (modalOverlay) {
            modalOverlay.onclick = function(event) {
                if (event.target === modalOverlay) closeEditModal();
            };
        }
    };

    const loadModalContent = async (formUrl, populationFunction = null, attachListenerFunction = null) => {
        if (!modalContent || !modalOverlay) {
            console.error("Modal container or overlay not found.");
            return;
        }
        console.log("Loading modal content from:", formUrl);
        
        modalContent.innerHTML = '<div style="padding:20px;color:var(--text-secondary);text-align:center;">Đang tải...</div>';
        modalOverlay.classList.add('active');
        manageBodyScroll();
        attachOverlayClickListener();

        try {
            const response = await fetch(formUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}, URL: ${formUrl}`);
            const htmlContent = await response.text();
            
            // Clear existing content
            modalContent.innerHTML = '';
            
            // Load content and execute scripts
            await loadAndExecuteScripts(modalContent, htmlContent);

            if (typeof populationFunction === 'function') {
                console.log("Executing population function for modal");
                populationFunction(modalContent);
            }
            if (typeof attachListenerFunction === 'function') {
                console.log("Executing listener function for modal");
                attachListenerFunction(modalContent);
            }
            else attachGenericModalListeners(modalContent);

        } catch (error) {
            console.error(`Error loading modal content from ${formUrl}:`, error);
            modalContent.innerHTML = `<div style="padding:20px;color:var(--danger-color);">Lỗi tải form: ${error.message}.</div>`;
        }
    };

    const attachGenericModalListeners = (container) => {
        const cancelButton = container.querySelector('.modal-cancel-button');
        const confirmButton = container.querySelector('.modal-confirm-button');
        if (cancelButton) {
            const newCancel = cancelButton.cloneNode(true);
            cancelButton.parentNode.replaceChild(newCancel, cancelButton);
            newCancel.addEventListener('click', closeEditModal);
        }
        if (confirmButton) {
            const newConfirm = confirmButton.cloneNode(true);
            confirmButton.parentNode.replaceChild(newConfirm, confirmButton);
            newConfirm.addEventListener('click', () => {
                console.log("Generic Confirm - Closing Modal");
                closeEditModal();
            });
        }
    };

    // Notification Functions
    const toggleNotificationDropdown = () => {
        if (notificationDropdown) notificationDropdown.classList.toggle('visible');
    };

    const closeNotificationDropdown = () => {
        if (notificationDropdown) notificationDropdown.classList.remove('visible');
    };

    const showAnnouncement = () => {
        if (announcementOverlay) {
            announcementOverlay.classList.add('visible');
            manageBodyScroll();
        }
    };

    const closeAnnouncement = () => {
        if (announcementOverlay) {
            announcementOverlay.classList.remove('visible');
            manageBodyScroll();
        }
    };

    // Initialize
    initializeActiveSubmenu();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    initializeSectionToggles();
    if (announcementOverlay && announcementOverlay.classList.contains('visible')) closeAnnouncement();

    // Event Listeners
    if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.addEventListener('click', toggleSidebarMobileOrDesktop);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebarMobileOrDesktop);
    document.querySelectorAll('.menu-items .submenu-parent').forEach(link => link.addEventListener('click', toggleSubmenu));

    // Modal Event Listeners
    const openModalTrigger = document.getElementById('editStatusTrigger');
    const openAgentItemsTrigger = document.getElementById('editAgentItemsTrigger');
    const openPackageParamsTrigger = document.getElementById('editPackageParamsTrigger');
    const openServiceInfoTrigger = document.getElementById('editServiceInfoTrigger');
    const openReceiverInfoTrigger = document.getElementById('editReceiverNameTrigger');
    const openAgentReweightTrigger = document.getElementById('editAgentReweightTrigger');
    const openOpsItemsTrigger = document.getElementById('editOpsItemsTrigger');
    const openAgentContentTrigger = document.getElementById('editAgentContentTrigger');
    const adjustChargesTriggerButton = document.getElementById('adjustChargesTrigger');
    const editProfitTriggerButton = document.getElementById('editProfitTrigger');

    // Add event listeners for all modal triggers
    if (openModalTrigger) openModalTrigger.addEventListener('click', () => loadModalContent('../form_package_detail/edit-order-status.html'));
    if (openAgentItemsTrigger) openAgentItemsTrigger.addEventListener('click', () => loadModalContent('../form_package_detail/edit_package_parameters.html'));
    if (openPackageParamsTrigger) openPackageParamsTrigger.addEventListener('click', () => loadModalContent('../form_package_detail/thongsokienhang.html'));
    if (openServiceInfoTrigger) openServiceInfoTrigger.addEventListener('click', () => loadModalContent('../form_package_detail/edit-service-information.html'));
    if (openReceiverInfoTrigger) openReceiverInfoTrigger.addEventListener('click', () => loadModalContent('../form_package_detail/edit-receiver-info.html'));
    if (openAgentReweightTrigger) openAgentReweightTrigger.addEventListener('click', () => loadModalContent('../form_package_detail/edit-package-reweight.html'));
    if (openOpsItemsTrigger) openOpsItemsTrigger.addEventListener('click', () => loadModalContent('../form_package_detail/ops-item-details.html'));
    if (openAgentContentTrigger) openAgentContentTrigger.addEventListener('click', () => loadModalContent('../form_package_detail/edit-package-reweight.html'));
    if (adjustChargesTriggerButton) adjustChargesTriggerButton.addEventListener('click', () => loadModalContent('../form_package_detail/adjust-order-value.html'));
    if (editProfitTriggerButton) editProfitTriggerButton.addEventListener('click', () => loadModalContent('../form_package_detail/adjust-order-value.html'));

    // Add event listeners for edit icons
    document.querySelectorAll('.edit-value-icon').forEach(button => {
        const title = button.getAttribute('title');
        if (title) {
            if (title.includes('Chỉnh sửa Mã đơn')) {
                button.addEventListener('click', () => loadModalContent('../form_package_detail/edit-order-code.html'));
            } else if (title.includes('Chỉnh sửa Tên công ty')) {
                button.addEventListener('click', () => loadModalContent('../form_package_detail/edit-company-name.html'));
            } else if (title.includes('Chỉnh sửa ghi chú')) {
                button.addEventListener('click', () => loadModalContent('../form_package_detail/edit-notes.html'));
            } else if (title.includes('Chỉnh sửa người gửi')) {
                button.addEventListener('click', () => loadModalContent('../form_package_detail/edit-sender-info.html'));
            }
        }
    });

    // Notification Event Listeners
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
        if (notificationDropdown?.classList.contains('visible') && 
            !notificationDropdown.contains(event.target) && 
            !notificationButton?.contains(event.target)) {
            closeNotificationDropdown();
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

    // Keyboard Event Listeners
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (announcementOverlay?.classList.contains('visible')) closeAnnouncement();
            else if (modalOverlay?.classList.contains('active')) closeEditModal();
            else if (notificationDropdown?.classList.contains('visible')) closeNotificationDropdown();
        }
    });

    // Export functions to window object for use in other scripts
    window.orderDetail = {
        loadModalContent,
        closeEditModal,
        manageBodyScroll,
        toggleNotificationDropdown,
        closeNotificationDropdown,
        showAnnouncement,
        closeAnnouncement
    };

    console.log("All initializations complete for Order Detail Page.");
}); 