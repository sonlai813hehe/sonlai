// ===== NOTE.JS - PHIÊN BẢN SÁNG/TỐI HOÀN CHỈNH =====

document.addEventListener('DOMContentLoaded', function() {
    
    // === HÀM VÀ BIẾN CHUNG ===
    const preloader = document.querySelector('.loader-container');
    const accountIcon = document.querySelector('.account-menu-container .nav-icon');
    const accountDropdown = document.querySelector('.account-dropdown');
    const accountMenuContainer = document.querySelector('.account-menu-container');

    // === TÀI KHOẢN THỬ NGHIỆM ===
    const TEST_USERNAME = 'test';
    const TEST_PASSWORD = '88888888';

    // === PARALLAX SCROLLING ===
    const bgShapes = document.querySelector('.background-shapes');
    if (bgShapes) {
        window.addEventListener('scroll', function() {
            const scrollValue = window.scrollY;
            bgShapes.style.transform = `translateY(${scrollValue * 0.3}px)`;
        });
    }

    // ========================================================
    // === LOGIC SÁNG/TỐI (YÊU CẦU MỚI) ===
    // ========================================================
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const htmlEl = document.documentElement;

    // 1. Đặt theme khi tải trang (Mặc định là SÁNG)
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        htmlEl.setAttribute('data-theme', 'dark');
    } else {
        htmlEl.setAttribute('data-theme', 'light'); // Mặc định là sáng
    }

    // 2. Thêm sự kiện click cho TẤT CẢ nút toggle
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                htmlEl.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                htmlEl.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    });

    // ========================================================
    // === LOGIC HEADER MOBILE ===
    // ========================================================
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (hamburgerBtn && mobileMenu && mobileMenuClose) {
        // Mở menu
        hamburgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.add('open');
        });

        // Đóng menu
        mobileMenuClose.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.remove('open');
        });
        
        // Đóng menu khi click vào 1 link
        mobileMenu.addEventListener('click', (e) => {
            // Chỉ đóng nếu click vào A, và không phải là nút Sáng/Tối
            if (e.target.tagName === 'A' && e.target.id !== 'mobile-menu-close') {
                if (e.target.id !== 'mobile-logout-btn') {
                     mobileMenu.classList.remove('open');
                }
            }
        });
    }

    // Hàm hiển thị thông báo pop-up
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<span>${message}</span>`;
        
        let bgColor;
        if (type === 'success') {
            bgColor = '#28a745'; // Xanh lá
        } else if (type === 'error') {
            bgColor = '#dc3545'; // Đỏ
        } else {
            bgColor = '#555555'; // Xám
        }

        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 10px; color: white;
            font-weight: 500; z-index: 10000; display: flex; align-items: center; gap: 10px; transition: all 0.3s ease;
            backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1);
            background: ${bgColor};
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Hàm updateAccountUI (Cho cả Desktop & Mobile)
    const mobileAccountLinks = document.getElementById('mobile-account-links');

    function updateAccountUI() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const user = JSON.parse(sessionStorage.getItem('user'));

        // 1. Cập nhật dropdown Desktop
        if (accountDropdown) {
            accountDropdown.innerHTML = '';
            if (isLoggedIn && user) {
                accountDropdown.innerHTML = `
                    <h4>Xin chào, ${user.username}!</h4>
                    <a href="info.html">Thông tin</a>
                    <a href="#" id="logout-btn">Đăng xuất</a>
                `;
            } else {
                accountDropdown.innerHTML = `
                    <a href="login.html">Đăng nhập</a>
                    <a href="#">Đăng ký</a>
                `;
            }
        }
        
        // 2. Cập nhật panel Mobile
        if (mobileAccountLinks) {
            mobileAccountLinks.innerHTML = '';
             if (isLoggedIn && user) {
                mobileAccountLinks.innerHTML = `
                    <a href="info.html" id="mobile-info-link">Thông tin cá nhân</a>
                    <a href="#" id="mobile-logout-btn">Đăng xuất</a>
                `;
            } else {
                mobileAccountLinks.innerHTML = `
                    <a href="login.html" id="mobile-login-link">Đăng nhập</a>
                    <a href="#" id="mobile-register-link">Đăng ký</a>
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

    // Hộp thoại xác nhận đăng xuất
    function showLogoutConfirmationModal() {
        const modalOverlay = document.createElement('div');
        const modalContent = document.createElement('div');
        const modalMessage = document.createElement('p');
        const modalButtons = document.createElement('div');
        const btnYes = document.createElement('button');
        const btnNo = document.createElement('button');

        modalOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(10px);
            display: flex; justify-content: center; align-items: center;
            z-index: 2000;
        `;
        
        const isDarkMode = htmlEl.getAttribute('data-theme') === 'dark';
        const panelBg = isDarkMode ? 'rgba(30, 30, 30, 0.8)' : '#FFFFFF';
        const textColor = isDarkMode ? '#E0E0E0' : '#181818';

        modalContent.style.cssText = `
            background: ${panelBg};
            border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
            padding: 30px;
            text-align: center; color: ${textColor};
            border: 1px solid rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(15px);
            width: 90%; max-width: 400px;
            transform: scale(0.8); opacity: 0; transition: all 0.3s ease;
        `;
        
        modalMessage.textContent = 'Bạn có muốn đăng xuất không?';
        modalMessage.style.cssText = 'font-size: 1.2em; margin-bottom: 25px;';
        modalButtons.style.cssText = 'display: flex; justify-content: center; gap: 20px;';

        btnNo.textContent = 'Không';
        btnNo.style.cssText = `
            background: rgba(150, 150, 150, 0.2); color: ${textColor}; border: 1px solid rgba(150, 150, 150, 0.3);
            padding: 10px 25px; border-radius: 50px; cursor: pointer;
            font-weight: 600;
            transition: background 0.2s ease, transform 0.2s ease;
        `;
        btnNo.addEventListener('mouseenter', () => btnNo.style.background = 'rgba(150, 150, 150, 0.4)');
        btnNo.addEventListener('mouseleave', () => btnNo.style.background = 'rgba(150, 150, 150, 0.2)');
        btnNo.addEventListener('click', () => {
            modalOverlay.remove();
        });

        btnYes.textContent = 'Có';
        btnYes.style.cssText = `
            background: #dc3545; color: white; border: none;
            padding: 10px 25px; border-radius: 50px; cursor: pointer;
            font-weight: 600;
            transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        `;
        btnYes.addEventListener('mouseenter', () => {
            btnYes.style.transform = 'translateY(-2px)';
            btnYes.style.boxShadow = '0 6px 15px rgba(220, 53, 69, 0.3)';
        });
        btnYes.addEventListener('mouseleave', () => {
             btnYes.style.transform = 'translateY(0)';
             btnYes.style.boxShadow = 'none';
        });
        btnYes.addEventListener('click', () => {
            logout();
            modalOverlay.remove();
            window.location.reload();
        });

        modalButtons.appendChild(btnNo);
        modalButtons.appendChild(btnYes);
        modalContent.appendChild(modalMessage);
        modalContent.appendChild(modalButtons);
        modalOverlay.appendChild(modalContent);
        
        document.body.appendChild(modalOverlay);
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 10);
    }
    
    // === XỬ LÝ SỰ KIỆN (DESKTOP) ===
    if (accountIcon) {
        accountIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            
            if (isLoggedIn) {
                accountDropdown.classList.toggle('show');
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    // Đóng dropdown desktop
    window.addEventListener('click', (e) => {
        if (accountMenuContainer && accountDropdown) {
             if (!accountMenuContainer.contains(e.target) && accountDropdown.classList.contains('show')) {
                accountDropdown.classList.remove('show');
            }
        }
    });

    // Xử lý click Đăng xuất (Event Delegation)
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'logout-btn' || e.target.id === 'mobile-logout-btn') {
            e.preventDefault();
            showLogoutConfirmationModal();
        }
    });


    // Xử lý form đăng nhập
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
                if (usernameValue === TEST_USERNAME && passwordValue === TEST_PASSWORD  ) {
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

    // Xử lý nút "Tìm hiểu thêm"
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

    // === Bảo vệ link (Cho cả Desktop & Mobile) ===
    const protectedLinkSelectors = '#features-link, #download-link, #support-link, #profile-link, #mobile-features-link, #mobile-download-link, #mobile-support-link, #mobile-profile-link, #mobile-info-link';
    
    document.body.addEventListener('click', (e) => {
        const clickedLink = e.target.closest(protectedLinkSelectors);
        
        if (clickedLink) {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                e.preventDefault(); 
                showNotification('Vui lòng đăng nhập để truy cập trang này!', 'info');
                
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        }
    });


    // === CÁC HIỆU ỨNG KHÁC ===
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            const isDarkMode = htmlEl.getAttribute('data-theme') === 'dark';
            
            const scrolledBgDark = 'rgba(21, 21, 21, 0.85)';
            const initialBgDark = 'rgba(200, 200, 200, 0.1)';
            
            const scrolledBgLight = 'rgba(255, 255, 255, 0.85)';
            const initialBgLight = '#FFFFFF';

            if (isDarkMode) {
                if (window.scrollY > 50) {
                    header.style.background = scrolledBgDark;
                } else {
                    header.style.background = initialBgDark;
                }
            } else {
                if (window.scrollY > 50) {
                    header.style.background = scrolledBgLight;
                } else {
                    header.style.background = initialBgLight;
                }
            }
        });
    }


    // Hiệu ứng INTERSECTION OBSERVER
    const animatedElements = document.querySelectorAll('.feature-card, .hero-content, .page-header-content, .feature-item, .login-section, .profile-container');
    if (animatedElements.length > 0) {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
                }
            });
        }, observerOptions);
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            observer.observe(element);
        });
    }

    // Preloader
    window.addEventListener('load', function() {
        if (preloader) {
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 500);
        }
    });
    
    // Cập nhật giao diện khi trang tải lần đầu
    updateAccountUI();
});
