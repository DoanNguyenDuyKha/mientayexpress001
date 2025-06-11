document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const button = this.querySelector('.login-btn');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    button.disabled = true;

    setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');

        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectUrl;
        } else {
            window.location.href = '../index.html';
        }
    }, 1500);
});

const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeIcon = togglePassword ? togglePassword.querySelector('i') : null;

if (togglePassword && passwordInput && eyeIcon) {
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        if (type === 'password') {
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        } else {
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        }
    });
}