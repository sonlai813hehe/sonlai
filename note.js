// ===== NOTE.JS - CÁC TÍNH NĂNG TƯƠNG TÁC CHO SƠN LAI CUỘC ĐỜI =====

// Đợi DOM tải xong hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    
    // === HÀM VÀ BIẾN CHUNG ===
    const preloader = document.querySelector('.loader-container');
    const accountIcon = document.querySelector('.account-menu-container .nav-icon');
    const accountDropdown = document.querySelector('.account-dropdown');
    const accountMenuContainer = document.querySelector('.account-menu-container'); // Thêm biến này

    // === TÀI KHOẢN THỬ NGHIỆM ===
    // Để kiểm tra đăng nhập, sử dụng: Tên đăng nhập: test, Mật khẩu: 123456
    const TEST_USERNAME = 'test';
    const TEST_PASSWORD = '123456';

    // Hàm hiển thị thông báo pop-up
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<span>${message}</span>`;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 8px; color: white;
            font-weight: 500; z-index: 1000; display: flex; align-items: center; gap: 10px; transition: all 0.3s ease;
            ${type === 'success' ? 'background: linear-gradient(45deg, #00c6ff, #0072ff);' : ''}
            ${type === 'error' ? 'background: linear-gradient(45deg, #ff416c, #ff4b2b);' : ''}
            ${type === 'info' ? 'background: linear-gradient(45deg, #667eea, #764ba2);' : ''}
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Hàm cập nhật giao diện dựa trên trạng thái đăng nhập
    function updateAccountUI() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const user = JSON.parse(sessionStorage.getItem('user'));

        if (accountDropdown) {
            accountDropdown.innerHTML = ''; // Xóa nội dung cũ
            if (isLoggedIn && user) {
                // Nếu đã đăng nhập, hiện menu thông tin và đăng xuất
                accountDropdown.innerHTML = `
                    <h4>Xin chào, ${user.username}!</h4>
                    <a href="info.html">Thông tin</a>
                    <a href="#" id="logout-btn">Đăng xuất</a>
                `;
            } else {
                // Nếu chưa, hiện menu đăng nhập và đăng ký
                accountDropdown.innerHTML = `
                    <a href="login.html">Đăng nhập</a>
                    <a href="#">Đăng ký</a>
                `;
            }
        }
    }

    // Hàm xử lý đăng xuất
    function logout() {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('user');
        showNotification('Đã đăng xuất!', 'success');
        updateAccountUI();
    }

    // === CHỨC NĂNG MỚI: TẠO VÀ HIỂN THỊ HỘP THOẠI XÁC NHẬN ĐĂNG XUẤT ===
    function showLogoutConfirmationModal() {
        const modalOverlay = document.createElement('div');
        const modalContent = document.createElement('div');
        const modalMessage = document.createElement('p');
        const modalButtons = document.createElement('div');
        const btnYes = document.createElement('button');
        const btnNo = document.createElement('button');

        modalOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px);
            display: flex; justify-content: center; align-items: center;
            z-index: 2000;
        `;
        
        modalContent.style.cssText = `
            background: rgba(255, 255, 255, 0.05); border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); padding: 30px;
            text-align: center; color: white; border: 1px solid rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(12px); width: 90%; max-width: 400px;
            transform: scale(0.8); opacity: 0; transition: all 0.3s ease;
        `;
        
        modalMessage.textContent = 'Bạn có muốn đăng xuất không?';
        modalMessage.style.cssText = 'font-size: 1.2em; margin-bottom: 20px;';

        modalButtons.style.cssText = 'display: flex; justify-content: center; gap: 20px;';

        btnNo.textContent = 'Không';
        btnNo.style.cssText = `
            background: rgba(255, 255, 255, 0.2); color: white; border: none;
            padding: 10px 20px; border-radius: 5px; cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
        `;
        btnNo.addEventListener('mouseenter', () => btnNo.style.background = 'rgba(255, 255, 255, 0.3)');
        btnNo.addEventListener('mouseleave', () => btnNo.style.background = 'rgba(255, 255, 255, 0.2)');
        btnNo.addEventListener('click', () => {
            modalOverlay.remove();
        });

        btnYes.textContent = 'Có';
        btnYes.style.cssText = `
            background: #ff4b2b; color: white; border: none;
            padding: 10px 20px; border-radius: 5px; cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
        `;
        btnYes.addEventListener('mouseenter', () => btnYes.style.background = '#ff416c');
        btnYes.addEventListener('mouseleave', () => btnYes.style.background = '#ff4b2b');
        btnYes.addEventListener('click', () => {
            logout();
            modalOverlay.remove();
            window.location.reload();
        });

        // Xây dựng cấu trúc modal
        modalButtons.appendChild(btnNo);
        modalButtons.appendChild(btnYes);
        modalContent.appendChild(modalMessage);
        modalContent.appendChild(modalButtons);
        modalOverlay.appendChild(modalContent);
        
        // Hiển thị modal và thêm hiệu ứng chuyển động
        document.body.appendChild(modalOverlay);
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 10);
    }
    
    // === XỬ LÝ SỰ KIỆN ===

    // Sửa lỗi: xử lý logic đăng nhập trên biểu tượng tài khoản
    if (accountIcon) {
        accountIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            
            if (isLoggedIn) {
                // Nếu đã đăng nhập, hiện/ẩn menu dropdown
                accountDropdown.classList.toggle('show');
            } else {
                // Nếu chưa, chuyển hướng đến trang login
                window.location.href = 'login.html';
            }
        });
    }

    // Đóng menu dropdown khi nhấp vào bất kỳ đâu ngoài nó
    window.addEventListener('click', (e) => {
        if (accountMenuContainer && accountDropdown) {
             if (!accountMenuContainer.contains(e.target) && accountDropdown.classList.contains('show')) {
                accountDropdown.classList.remove('show');
            }
        }
    });

    // Xử lý sự kiện click bên trong menu thả xuống
    // Sử dụng event delegation để bắt sự kiện click trên nút "Đăng xuất"
    if (accountDropdown) {
        accountDropdown.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn') {
                e.preventDefault();
                showLogoutConfirmationModal();
            }
        });
    }

    // Xử lý form đăng nhập trên trang login.html
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const submitBtn = this.querySelector('button[type="submit"]');

            const usernameValue = usernameInput.value.trim();
            const passwordValue = passwordInput.value.trim();
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Đang đăng nhập...';
            submitBtn.disabled = true;

            setTimeout(() => {
                if (usernameValue === TEST_USERNAME && passwordValue === TEST_PASSWORD) {
                    sessionStorage.setItem('isLoggedIn', 'true'); 
                    sessionStorage.setItem('user', JSON.stringify({ username: usernameValue }));
                    showNotification('Đăng nhập thành công! Chuyển hướng về trang chính...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    showNotification('Tên đăng nhập hoặc mật khẩu không chính xác!', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }, 1500);
        });
    }

    // Xử lý nút "Tìm hiểu thêm" trên trang index.html
    const ctaButton = document.getElementById('cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            if (isLoggedIn) {
                window.location.href = 'features.html';
            } else {
                e.preventDefault();
                showNotification('Vui lòng đăng nhập để xem các tính năng!', 'info');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    }

    // === MỞ KHÓA các liên kết trên thanh điều hướng ===
    const protectedLinks = document.querySelectorAll('#features-link, #download-link, #support-link, #profile-link');
    protectedLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                e.preventDefault();
                showNotification('Vui lòng đăng nhập để truy cập trang này!', 'info');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    });

    // === CÁC HIỆU ỨNG KHÁC (GIỮ NGUYÊN) ===
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(15, 12, 41, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.05)';
                header.style.backdropFilter = 'blur(12px)';
            }
        });
    }

    const animatedElements = document.querySelectorAll('.feature-card, .hero-content, .page-header-content, .feature-item, .login-section');
    if (animatedElements.length > 0) {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'all 0.8s ease';
                }
            });
        }, observerOptions);
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            observer.observe(element);
        });
    }

    const glassPanels = document.querySelectorAll('.glass-panel:not(header):not(footer)');
    glassPanels.forEach(panel => {
        panel.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 198, 255, 0.25)';
            this.style.transition = 'all 0.3s ease';
        });
        panel.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.1)';
        });
    });

    window.addEventListener('load', function() {
        if (preloader) {
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 500);
        }
    });

    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) translateY(-3px)';
            this.style.transition = 'all 0.2s ease';
        });
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
    
    // Cập nhật giao diện khi trang tải lần đầu
    updateAccountUI();
});