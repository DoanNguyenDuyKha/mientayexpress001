document.addEventListener('DOMContentLoaded', function () {
    const trackingForm = document.getElementById('tracking-form');
    const trackButton = document.getElementById('track-button');
    const buttonText = trackButton.querySelector('.button-text');
    const spinner = trackButton.querySelector('.spinner');
    const trackingIdInput = document.getElementById('tracking-id');
    const resultSection = document.getElementById('tracking-result');
    const errorMessage = document.getElementById('error-message');
    const loadingMessage = document.getElementById('loading-message');
    const progressStepsContainer = document.getElementById('progress-steps');

    function updateProgressBar(activeStepIndex, totalSteps) {
        if (!progressStepsContainer) return;
        const steps = progressStepsContainer.querySelectorAll('.step-refined');
        totalSteps = steps.length;
        if (activeStepIndex < 0 || activeStepIndex >= totalSteps) {
            activeStepIndex = 0;
        }
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            const iconElement = step.querySelector('i');
            const innerDot = step.querySelector('.inner-dot');
            if (iconElement) iconElement.remove();
            if (innerDot) innerDot.remove();
            if (index < activeStepIndex) {
                step.classList.add('completed');
                step.innerHTML = '<i class="fas fa-check"></i>';
            } else if (index === activeStepIndex) {
                step.classList.add('active');
                step.innerHTML = '<div class="inner-dot"></div>';
                if (index === totalSteps - 1) {
                    step.classList.add('completed');
                    step.innerHTML = '<i class="fas fa-check"></i>';
                }
            } else {
                step.innerHTML = '';
            }
        });
        const progressPercent = totalSteps <= 1 ? 100 : (activeStepIndex / (totalSteps - 1)) * 100;
        document.documentElement.style.setProperty('--progress-bar-width', progressPercent + '%');
    }

    if (trackingForm) {
        trackingForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const trackingId = trackingIdInput.value.trim();
            if (!trackingId) {
                errorMessage.style.display = 'flex';
                errorMessage.classList.add('show');
                errorMessage.querySelector('span').textContent = 'Vui lòng nhập mã đơn hàng.';
                return;
            }
            trackButton.disabled = true;
            trackButton.classList.add('loading');
            errorMessage.style.display = 'none';
            errorMessage.classList.remove('show');
            loadingMessage.style.display = 'flex';
            loadingMessage.classList.add('show');
            resultSection.style.display = 'none';
            setTimeout(() => {
                trackButton.disabled = false;
                trackButton.classList.remove('loading');
                loadingMessage.style.display = 'none';
                loadingMessage.classList.remove('show');
                if (trackingId.toUpperCase() === 'MTE4258326564') {
                    resultSection.style.display = 'block';
                    const currentStepFromServer = 2;
                    const totalStepsFromServer = 5;
                    updateProgressBar(currentStepFromServer, totalStepsFromServer);
                } else {
                    errorMessage.style.display = 'flex';
                    errorMessage.classList.add('show');
                    errorMessage.querySelector('span').textContent = 'Mã đơn hàng không hợp lệ hoặc không tìm thấy.';
                }
            }, 1500);
        });
    }
    updateProgressBar(2, 5);
});