document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const mobileSidebarToggleBtn = document.getElementById('mobile-sidebar-toggle');
    const desktopSidebarToggleBtn = document.querySelector('.sidebar-toggle-desktop');
    const filterModalStats = document.getElementById('filter-modal-stats');
    const mobileFilterToggleBtnStats = document.getElementById('mobile-filter-toggle-stats');
    const currentDateSpan = document.getElementById('current-date');
    const currentTimeSpan = document.getElementById('current-time');
    const currentYearSpan = document.getElementById('current-year');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const layoutToggleButton = document.getElementById('layout-toggle-btn');
    const statisticsContentArea = document.getElementById('statistics-content-area');

    const notificationButton = document.getElementById('notification-button');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const notificationList = document.getElementById('notification-list');
    const announcementOverlay = document.getElementById('announcement-overlay');
    const announcementBox = document.getElementById('announcement-box');
    const announcementCloseBtn = document.getElementById('announcement-close-btn');
    const announcementTitle = document.getElementById('announcement-title');
    const announcementBodyEl = document.getElementById('announcement-body');
    const announcementTimestamp = document.getElementById('announcement-timestamp');

    let serviceVolumeChartInstance = null;
    let revenueProfitChartInstance = null;
    let personnelOverviewChartInstance = null;
    let personnelPaymentChartInstance = null;
    let miniChartRevenueInstance, miniChartOrdersInstance, miniChartWeightInstance, miniChartTrackingInstance;

    const personnelPaymentData = { revenue: { 'pham_hoang_dinh': { paid: 85, unpaid: 15 }, 'alice': { paid: 70, unpaid: 30 }, 'hoang_yen': { paid: 50, unpaid: 10 }, 'van_anh': { paid: 40, unpaid: 5 }, 'phuong_anh': { paid: 35, unpaid: 8 }, 'thuy_anh': { paid: 30, unpaid: 12 }, 'hoang_anh': { paid: 25, unpaid: 15 }, 'ngan_ha': { paid: 20, unpaid: 20 }, 'sin': { paid: 15, unpaid: 5 } }, weight: { 'pham_hoang_dinh': { paid: 1200, unpaid: 300 }, 'alice': { paid: 1000, unpaid: 200 }, 'hoang_yen': { paid: 700, unpaid: 100 }, 'van_anh': { paid: 450, unpaid: 50 }, 'phuong_anh': { paid: 350, unpaid: 50 }, 'thuy_anh': { paid: 280, unpaid: 20 }, 'hoang_anh': { paid: 150, unpaid: 50 }, 'ngan_ha': { paid: 100, unpaid: 50 }, 'sin': { paid: 90, unpaid: 27 } } };
    const personnelOverviewData = { revenue: { 'pham_hoang_dinh': 100, 'alice': 100, 'hoang_yen': 60, 'van_anh': 45, 'phuong_anh': 43, 'thuy_anh': 42, 'hoang_anh': 40, 'ngan_ha': 40, 'sin': 20 }, weight: { 'pham_hoang_dinh': 1500, 'alice': 1200, 'hoang_yen': 800, 'van_anh': 500, 'phuong_anh': 400, 'thuy_anh': 300, 'hoang_anh': 200, 'ngan_ha': 150, 'sin': 117 } };
    const personnelDetails = { 'pham_hoang_dinh': { name: 'Phạm Hoàng Định', color: '#0284c7' }, 'alice': { name: 'Alice', color: '#f43f5e' }, 'hoang_yen': { name: 'Hoàng Yến', color: '#14b8a6' }, 'van_anh': { name: 'Văn Anh', color: '#f97316' }, 'phuong_anh': { name: 'Phượng Anh', color: '#ea580c' }, 'thuy_anh': { name: 'Thùy Anh', color: '#60a5fa' }, 'hoang_anh': { name: 'Hoàng Anh', color: '#a855f7' }, 'ngan_ha': { name: 'Ngân Hà', color: '#dbeafe' }, 'sin': { name: 'Sin', color: '#22c55e' } };
    const countryDetailsData = { us: [ { service: 'MTE-US SIN', orders: 5, gross: '365.5 Kg', charged: '366 Kg', revenue: '125,372,000 đ' }, { service: 'FEDEX THỰC PHẨM', orders: 8, gross: '99.5 Kg', charged: '100 Kg', revenue: '76,899,000 đ' } ], au: [ { service: 'AUS Express', orders: 15, gross: '150 Kg', charged: '155 Kg', revenue: '90,000,000 đ' }, { service: 'DHL AUS', orders: 10, gross: '80 Kg', charged: '82 Kg', revenue: '65,000,000 đ' } ] };

    const manageBodyScroll = () => {
        const isSidebarOpen = body.classList.contains('sidebar-mobile-open');
        const isAnyModalVisible = document.querySelector('.filter-modal.visible, .confirmation-modal.visible, .announcement-overlay.visible');
        body.classList.toggle('overflow-hidden', isSidebarOpen || !!isAnyModalVisible);
    };

    function toggleSidebarMobileOrDesktop() {
        if (window.innerWidth > 768) {
            document.body.classList.toggle('sidebar-collapsed');
        } else {
            document.body.classList.toggle('sidebar-mobile-open');
            const mobileSidebarToggleBtn = document.getElementById('mobile-sidebar-toggle');
            const isOpen = document.body.classList.contains('sidebar-mobile-open');
        if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.setAttribute('aria-expanded', String(isOpen));
        }
        manageBodyScroll();
    }

    function toggleSubmenu(event) {
        event.preventDefault();
        if (document.body.classList.contains('sidebar-collapsed') && window.innerWidth > 768) return;
        const parentLink = event.currentTarget;
        const submenuWrapper = parentLink.nextElementSibling;
        if (!submenuWrapper || !submenuWrapper.classList.contains('submenu')) return;
        const isActive = parentLink.classList.toggle('active');
        submenuWrapper.classList.toggle('active', isActive);
        if (isActive) {
            document.querySelectorAll('.menu-items .submenu-parent.active').forEach(activeParent => {
                if (activeParent !== parentLink) {
                    activeParent.classList.remove('active');
                    activeParent.nextElementSibling?.classList.remove('active');
                }
            });
        }
    }

    function initializeActiveSubmenu() {
        const activeSubmenuLink = document.querySelector('.sidebar .submenu a.active');
        if (activeSubmenuLink) {
            const submenuDiv = activeSubmenuLink.closest('.submenu');
            const parentLink = submenuDiv?.previousElementSibling;
            if(submenuDiv && parentLink?.classList.contains('submenu-parent')) {
                if (!(document.body.classList.contains('sidebar-collapsed') && window.innerWidth > 768)) {
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

    function toggleFilterModalStats() {
        if (filterModalStats) {
            filterModalStats.classList.toggle('visible');
            manageBodyScroll();
        }
    }
    function applyFiltersStats(source) {
        if (source === 'modal') { toggleFilterModalStats(); }
    }
    function resetFiltersStats(source) {
        const formContainer = source === 'modal' ? filterModalStats?.querySelector('.filter-modal-body') : document.querySelector('.stats-filters');
        if (formContainer) {
            formContainer.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select').forEach(el => {
                if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = '';
            });
            formContainer.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(el => el.checked = false);
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
            document.documentElement.requestFullscreen().catch(err => {});
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    function handleFullscreenChange() {
        const isFullscreen = !!document.fullscreenElement;
        const icon = fullscreenBtn?.querySelector('i');
        if(icon){ icon.classList.toggle('fa-expand', !isFullscreen); icon.classList.toggle('fa-compress', isFullscreen); }
        if(fullscreenBtn) { fullscreenBtn.setAttribute('title', isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'); }
    }

    function initCharts() {
        Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        const serviceVolumeCtx = document.getElementById('serviceVolumeChart')?.getContext('2d');
        if (serviceVolumeCtx) { const labels = ['Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5', 'Th.6', 'Th.7', 'Th.8', 'Th.9', 'Th.10', 'Th.11', 'Th.12']; const grossWeightData = [1200, 1900, 1500, 2500, 2200, 3000, 2800, 3500, 3200, 4000, 3800, 4500]; const chargedWeightData = [1000, 1700, 1300, 2300, 2000, 2800, 2600, 3300, 3000, 3800, 3600, 4300]; serviceVolumeChartInstance = new Chart(serviceVolumeCtx, { type: 'line', data: { labels: labels, datasets: [ { label: 'Gross weight', data: grossWeightData, borderColor: '#36a2eb', backgroundColor: 'rgba(54, 162, 235, 0.1)', tension: 0.4, fill: true, pointRadius: 3, pointHoverRadius: 5 }, { label: 'Charged weight', data: chargedWeightData, borderColor: '#ff6384', backgroundColor: 'rgba(255, 99, 132, 0.1)', tension: 0.4, fill: true, pointRadius: 3, pointHoverRadius: 5 } ] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#e5e7eb' } }, x: { grid: { display: false } } }, interaction: { intersect: false, mode: 'index' }, tooltips: { enabled: true } } }); }
        const revenueProfitCtx = document.getElementById('revenueProfitChart')?.getContext('2d');
         if (revenueProfitCtx) { const labels = ['Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5', 'Th.6', 'Th.7', 'Th.8', 'Th.9', 'Th.10', 'Th.11', 'Th.12']; revenueProfitChartInstance = new Chart(revenueProfitCtx, { type: 'bar', data: { labels: labels, datasets: [ { label: 'Doanh thu', data: [500, 600, 450, 700, 650, 800, 750, 900, 850, 1000, 950, 1100], backgroundColor: '#4bc0c0' }, { label: 'Chi phí khác', data: [100, 120, 90, 140, 130, 160, 150, 180, 170, 200, 190, 220], backgroundColor: '#ffcd56' }, { label: 'Giá net', data: [80, 100, 70, 120, 110, 140, 130, 160, 150, 180, 170, 200], backgroundColor: '#ff9f40' } ] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#e5e7eb' }, stacked: false }, x: { grid: { display: false }, stacked: false } }, barPercentage: 0.7, categoryPercentage: 0.6 } }); }
        initPersonnelOverviewChart(); initPersonnelPaymentChart();
        const miniChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { y: { display: false }, x: { display: false } } }; const miniData = { labels: ['1', '2', '3', '4', '5'], datasets: [{ data: [10, 15, 8, 12, 18], backgroundColor: '#cbd5e1', barPercentage: 0.6 }] }; const miniRevenueCtx = document.getElementById('mini-chart-revenue')?.getContext('2d'); if(miniRevenueCtx) miniChartRevenueInstance = new Chart(miniRevenueCtx, { type: 'bar', data: miniData, options: miniChartOptions }); const miniOrdersCtx = document.getElementById('mini-chart-orders')?.getContext('2d'); if(miniOrdersCtx) miniChartOrdersInstance = new Chart(miniOrdersCtx, { type: 'bar', data: miniData, options: miniChartOptions }); const miniWeightCtx = document.getElementById('mini-chart-weight')?.getContext('2d'); if(miniWeightCtx) miniChartWeightInstance = new Chart(miniWeightCtx, { type: 'bar', data: miniData, options: miniChartOptions }); const miniTrackingCtx = document.getElementById('mini-chart-tracking')?.getContext('2d'); if(miniTrackingCtx) miniChartTrackingInstance = new Chart(miniTrackingCtx, { type: 'bar', data: miniData, options: miniChartOptions });
    }

    function initPersonnelOverviewChart() {
        const overviewCtx = document.getElementById('personnelOverviewChart')?.getContext('2d');
        if (overviewCtx) {
            personnelOverviewChartInstance = new Chart(overviewCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Tổng quan Nhân sự',
                        data: [],
                        backgroundColor: [],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) { label += ': '; }
                                    if (context.parsed !== null) {
                                        const unitEl = document.getElementById('personnel-center-unit');
                                        const unit = unitEl ? unitEl.textContent : '';
                                        if (unit.toLowerCase().includes('triệu đồng')) {
                                            label += new Intl.NumberFormat('vi-VN').format(context.raw) + ' Triệu đồng';
                                        } else if (unit.toLowerCase().includes('kg')) {
                                            label += new Intl.NumberFormat('de-DE').format(context.raw) + ' Kg';
                                        } else {
                                            label += new Intl.NumberFormat('vi-VN').format(context.raw);
                                        }
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    function updatePersonnelOverviewChart() {
        if (!personnelOverviewChartInstance) return;
        const reportType = document.getElementById('personnel-report-type')?.value ?? 'revenue';
        const dataForMetric = personnelOverviewData[reportType];
        const centerValueEl = document.getElementById('personnel-center-value');
        const centerUnitEl = document.getElementById('personnel-center-unit');
        if (!dataForMetric || !centerValueEl || !centerUnitEl) {
            if (personnelOverviewChartInstance) {
                personnelOverviewChartInstance.data.labels=[];
                personnelOverviewChartInstance.data.datasets[0].data=[];
                personnelOverviewChartInstance.data.datasets[0].backgroundColor=[];
                personnelOverviewChartInstance.update();
            }
            if(centerValueEl) centerValueEl.textContent = 'N/A';
            if(centerUnitEl) centerUnitEl.textContent = '-';
            return;
        }
        const labels = [];
        const data = [];
        const backgroundColors = [];
        let totalValue = 0;
        Object.keys(personnelDetails).forEach(personId => {
            if (dataForMetric[personId] !== undefined) {
                labels.push(personnelDetails[personId].name);
                const value = dataForMetric[personId];
                data.push(value);
                backgroundColors.push(personnelDetails[personId].color);
                totalValue += value;
            }
        });
        personnelOverviewChartInstance.data.labels = labels;
        personnelOverviewChartInstance.data.datasets[0].data = data;
        personnelOverviewChartInstance.data.datasets[0].backgroundColor = backgroundColors;
        personnelOverviewChartInstance.update();
        let formattedTotal, unitText;
        if (reportType === 'revenue') {
            formattedTotal = new Intl.NumberFormat('vi-VN').format(totalValue);
            unitText = 'Triệu đồng';
        } else if (reportType === 'weight') {
            formattedTotal = new Intl.NumberFormat('de-DE').format(totalValue);
            unitText = 'Kg';
        } else {
            formattedTotal = new Intl.NumberFormat('vi-VN').format(totalValue);
            unitText = 'Đơn vị';
        }
        centerValueEl.textContent = formattedTotal;
        centerUnitEl.textContent = unitText;
    }

    function initPersonnelPaymentChart() {
        const paymentCtx = document.getElementById('personnelPaymentChart')?.getContext('2d');
        if (paymentCtx) {
            personnelPaymentChartInstance = new Chart(paymentCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Đã thanh toán', 'Chưa thanh toán'],
                    datasets: [{
                        label: 'Trạng thái thanh toán',
                        data: [0, 0],
                        backgroundColor: ['#0284c7', '#f97316'],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) { label += ': '; }
                                    if (context.parsed !== null) {
                                        const unitEl = document.getElementById('personnel-total-unit');
                                        const unit = unitEl ? unitEl.textContent : '';
                                        if (unit.toLowerCase().includes('triệu đồng')) {
                                            label += new Intl.NumberFormat('vi-VN').format(context.raw) + ' Triệu đồng';
                                        } else if (unit.toLowerCase().includes('kg')) {
                                            label += new Intl.NumberFormat('de-DE').format(context.raw) + ' Kg';
                                        } else {
                                            label += new Intl.NumberFormat('vi-VN').format(context.raw);
                                        }
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    function updatePersonnelPaymentChart() {
        if (!personnelPaymentChartInstance) return;
        const reportType = document.getElementById('personnel-report-type')?.value ?? 'revenue';
        const selectedPersonnelIds = Array.from(document.querySelectorAll('.personnel-checkbox-item input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        const dataForMetric = personnelPaymentData[reportType];
        const paidValueEl = document.getElementById('personnel-paid-value');
        const unpaidValueEl = document.getElementById('personnel-unpaid-value');
        const unitEl = document.getElementById('personnel-total-unit');
        if (!dataForMetric || !paidValueEl || !unpaidValueEl || !unitEl) {
            if (personnelPaymentChartInstance) {
                personnelPaymentChartInstance.data.datasets[0].data = [0, 0];
                personnelPaymentChartInstance.update();
            }
            if (paidValueEl) paidValueEl.textContent = 'N/A';
            if (unpaidValueEl) unpaidValueEl.textContent = 'N/A';
            if (unitEl) unitEl.textContent = '-';
            return;
        }
        let totalPaid = 0;
        let totalUnpaid = 0;
        selectedPersonnelIds.forEach(personId => {
            const personData = dataForMetric[personId];
            if (personData) {
                totalPaid += personData.paid || 0;
                totalUnpaid += personData.unpaid || 0;
            }
        });
        personnelPaymentChartInstance.data.datasets[0].data = [totalPaid, totalUnpaid];
        personnelPaymentChartInstance.update();
        let formattedPaid, formattedUnpaid, unitText;
        if (reportType === 'revenue') {
            formattedPaid = new Intl.NumberFormat('vi-VN').format(totalPaid);
            formattedUnpaid = new Intl.NumberFormat('vi-VN').format(totalUnpaid);
            unitText = 'Triệu đồng';
        } else if (reportType === 'weight') {
            formattedPaid = new Intl.NumberFormat('de-DE').format(totalPaid);
            formattedUnpaid = new Intl.NumberFormat('de-DE').format(totalUnpaid);
            unitText = 'Kg';
        } else {
            formattedPaid = new Intl.NumberFormat('vi-VN').format(totalPaid);
            formattedUnpaid = new Intl.NumberFormat('vi-VN').format(totalUnpaid);
            unitText = 'Đơn vị';
        }
        paidValueEl.textContent = formattedPaid;
        unpaidValueEl.textContent = formattedUnpaid;
        unitEl.textContent = unitText;
    }

    function togglePersonnelReportView() {
        const checkboxes = document.querySelectorAll('.personnel-checkbox-item input[type="checkbox"]');
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        const overviewView = document.getElementById('personnel-overview-view');
        const paymentView = document.getElementById('personnel-payment-view');
        if (!overviewView || !paymentView) return;
        if (anyChecked) {
            overviewView.style.display = 'none';
            paymentView.style.display = 'flex';
            updatePersonnelPaymentChart();
        } else {
            overviewView.style.display = 'flex';
            paymentView.style.display = 'none';
            updatePersonnelOverviewChart();
        }
    }

    function setupNationalReportInteraction() {
        const reportContainer = document.getElementById('national-usage-report'); if (!reportContainer) return;
        const listView = reportContainer.querySelector('.national-list-view');
        const tableView = reportContainer.querySelector('.national-table-view');
        const detailsTableBody = document.getElementById('national-details-tbody');
        const backButton = reportContainer.querySelector('.back-to-list-btn');
        const reportTitle = document.getElementById('national-report-title');
        const originalTitle = reportTitle ? reportTitle.textContent : 'Báo cáo quốc gia';
        if (listView && tableView && detailsTableBody && backButton && reportTitle) {
            listView.addEventListener('click', (event) => {
                const button = event.target.closest('.view-details-btn'); if (!button) return;
                const listItem = button.closest('.national-list-item');
                const countryCode = listItem.dataset.country; const countryName = listItem.dataset.countryName || 'Chi tiết';
                const detailsData = countryDetailsData[countryCode] || [];
                detailsTableBody.innerHTML = '';
                detailsData.forEach(item => {
                    const row = detailsTableBody.insertRow();
                    row.innerHTML = `<td>${item.service}</td><td>${item.orders}</td><td>${item.gross}</td><td>${item.charged}</td><td class="currency">${item.revenue}</td>`;
                });
                const firstHeader = tableView.querySelector('thead th:first-child'); if (firstHeader) firstHeader.textContent = countryName;
                listView.style.display = 'none'; tableView.style.display = 'block'; backButton.style.display = 'inline-flex'; reportTitle.textContent = `Chi tiết: ${countryName}`;
            });
            backButton.addEventListener('click', () => {
                tableView.style.display = 'none'; backButton.style.display = 'none'; listView.style.display = 'block'; reportTitle.textContent = originalTitle;
            });
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

    function toggleLayout() {
        if (!statisticsContentArea || !layoutToggleButton) return;
        const isGrid = statisticsContentArea.classList.contains('layout-grid');
        const icon = layoutToggleButton.querySelector('i');

        if (isGrid) {
            statisticsContentArea.classList.remove('layout-grid');
            statisticsContentArea.classList.add('layout-stack');
            layoutToggleButton.title = "Chuyển sang bố cục lưới";
            if (icon) { icon.classList.remove('fa-table-list'); icon.classList.add('fa-grip'); }
            localStorage.setItem('statisticsLayout', 'stack');
        } else {
            statisticsContentArea.classList.remove('layout-stack');
            statisticsContentArea.classList.add('layout-grid');
            layoutToggleButton.title = "Chuyển sang bố cục dọc";
            if (icon) { icon.classList.remove('fa-grip'); icon.classList.add('fa-table-list'); }
            localStorage.setItem('statisticsLayout', 'grid');
        }

         setTimeout(() => {
            [serviceVolumeChartInstance, revenueProfitChartInstance, personnelOverviewChartInstance, personnelPaymentChartInstance, miniChartRevenueInstance, miniChartOrdersInstance, miniChartWeightInstance, miniChartTrackingInstance].forEach(chart => {
                if (chart && typeof chart.resize === 'function') chart.resize();
            });
        }, 50);
    }

    function applySavedLayout() {
         if (!statisticsContentArea || !layoutToggleButton) return;
         const savedLayout = localStorage.getItem('statisticsLayout');
         const icon = layoutToggleButton.querySelector('i');

         if (savedLayout === 'stack') {
             statisticsContentArea.classList.remove('layout-grid');
             statisticsContentArea.classList.add('layout-stack');
             layoutToggleButton.title = "Chuyển sang bố cục lưới";
             if (icon) { icon.classList.remove('fa-table-list'); icon.classList.add('fa-grip'); }
         } else {
             statisticsContentArea.classList.remove('layout-stack');
             statisticsContentArea.classList.add('layout-grid');
             layoutToggleButton.title = "Chuyển sang bố cục dọc";
             if (icon) { icon.classList.remove('fa-grip'); icon.classList.add('fa-table-list'); }
         }
    }


    initializeActiveSubmenu();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    applySavedLayout();
    initCharts();
    setupNationalReportInteraction();
    togglePersonnelReportView();


    if (mobileSidebarToggleBtn) mobileSidebarToggleBtn.addEventListener('click', toggleSidebarMobileOrDesktop);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebarMobileOrDesktop);
    if (desktopSidebarToggleBtn) desktopSidebarToggleBtn.addEventListener('click', toggleSidebarMobileOrDesktop);
    document.querySelectorAll('.menu-items .submenu-parent').forEach(link => link.addEventListener('click', toggleSubmenu));
    if (mobileFilterToggleBtnStats) mobileFilterToggleBtnStats.addEventListener('click', toggleFilterModalStats);
    if (filterModalStats) {
        filterModalStats.querySelector('.filter-modal-close-btn')?.addEventListener('click', toggleFilterModalStats);
        filterModalStats.addEventListener('click', (event) => { if (event.target === filterModalStats) toggleFilterModalStats(); });
        document.getElementById('modal-apply-filter-stats-btn')?.addEventListener('click', () => applyFiltersStats('modal'));
        document.getElementById('modal-reset-filter-stats-btn')?.addEventListener('click', () => resetFiltersStats('modal'));
    }
    document.querySelector('.stats-filters .filter-apply-btn')?.addEventListener('click', () => applyFiltersStats('desktop'));
    const reportTypeSelect = document.getElementById('personnel-report-type');
    if (reportTypeSelect) reportTypeSelect.addEventListener('change', togglePersonnelReportView);
    const personnelCheckboxes = document.querySelectorAll('.personnel-checkbox-item input[type="checkbox"]');
    personnelCheckboxes.forEach(checkbox => checkbox.addEventListener('change', togglePersonnelReportView));
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    if (layoutToggleButton) layoutToggleButton.addEventListener('click', toggleLayout);


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
                announcementTimestamp.textContent = timestamp ? new Date(timestamp).toLocaleString('vi-VN') : '';
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
         if (announcementOverlay && announcementOverlay.classList.contains('visible')) {
             if (!announcementBox.contains(event.target) && event.target !== announcementOverlay) {
             }
         }
    });
    if (announcementCloseBtn) announcementCloseBtn.addEventListener('click', closeAnnouncement);
    if (announcementOverlay) {
        announcementOverlay.addEventListener('click', (event) => { if (event.target === announcementOverlay) closeAnnouncement(); });
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (announcementOverlay && announcementOverlay.classList.contains('visible')) {
                closeAnnouncement();
            } else if (notificationDropdown && notificationDropdown.classList.contains('visible')) {
                closeNotificationDropdown();
            } else if (filterModalStats && filterModalStats.classList.contains('visible')) {
                 toggleFilterModalStats();
            }
        }
    });

    // Add event listeners to show date picker when date inputs are clicked
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('click', function() {
            // Try to show the native date picker
            if (typeof this.showPicker === 'function') {
                this.showPicker();
            } else {
                // Fallback for browsers that don't support showPicker
                this.focus();
                // You might need a library for full cross-browser compatibility
            }
        });
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