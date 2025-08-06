document.addEventListener('DOMContentLoaded', function () {
    // ------------------------------------------
    // Bagian 1: Deklarasi Variabel & Elemen
    // ------------------------------------------
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger-menu');
    const checkbox = document.getElementById('checkbox');
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const statsSection = document.querySelector('.stats');
    const interactiveCards = document.querySelectorAll('.feature-card, .testimonial-card, .screenshot-card');
    const floatingElements = document.querySelectorAll('.floating');
    const ctaButtons = document.querySelectorAll('a[href*="wa.me"], .whatsapp-btn, a[href*="trial.php"]');
    const navAnchors = document.querySelectorAll('a[href^="#"]');

    // ------------------------------------------
    // Bagian 2: Fungsionalitas Navbar & Dark Mode
    // ------------------------------------------

    // Dark Mode Toggle
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (savedTheme === 'dark-mode') {
            checkbox.checked = true;
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-mode');
        checkbox.checked = true;
    }

    if (checkbox) {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }

    // Hamburger menu toggle - PERBAIKAN
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Tutup menu saat link diklik (untuk mobile) - PERBAIKAN
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
    }

    // Tutup menu ketika klik di luar navbar - BARU
    document.addEventListener('click', function (event) {
        if (navbar && !navbar.contains(event.target)) {
            if (navLinks && hamburger) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });

    // Tutup menu ketika window di-resize ke desktop - BARU
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            if (navLinks && hamburger) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });

    // Smooth scrolling for navigation links
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ------------------------------------------
    // Bagian 3: Efek Visual & Animasi
    // ------------------------------------------

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (animateElements.length > 0) {
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Counter animation for stats
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Preserve original formatting (%, +, etc.)
            let suffix = '';
            const originalText = element.getAttribute('data-original') || element.textContent;
            if (originalText.includes('%')) suffix = '%';
            if (originalText.includes('+')) suffix = '+';
            if (originalText.includes('K')) suffix = 'K';
            if (originalText.includes('M')) suffix = 'M';

            element.textContent = Math.floor(current) + suffix;
        }, 20);
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    // Store original text for suffix preservation
                    counter.setAttribute('data-original', counter.textContent);
                    const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                    if (!isNaN(target)) {
                        animateCounter(counter, target);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Add interactive effects for cards
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add random floating animation delays
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${Math.random() * 2}s`;
        el.style.animationDuration = `${3 + Math.random() * 2}s`;
    });

    // ------------------------------------------
    // Bagian 4: Pelacakan & Feedback
    // ------------------------------------------

    // Track button clicks dengan feedback visual yang lebih baik
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            // Prevent double clicks
            if (this.classList.contains('processing')) {
                e.preventDefault();
                return;
            }

            console.log('Conversion event tracked:', this.href || this.textContent);

            const originalText = this.innerHTML;
            this.classList.add('processing');

            // Animasi loading yang lebih smooth
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menghubungkan...';

            // Simulasi proses loading
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Tersambung!';

                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('processing');
                }, 1500);
            }, 1000);
        });
    });

    // ------------------------------------------
    // Bagian 5: Optimisasi Performance & UX
    // ------------------------------------------

    // Lazy loading untuk gambar (jika ada)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Preload critical resources
    function preloadResource(href, as) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
    }

    // Smooth page transitions
    window.addEventListener('beforeunload', function () {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
    });

    // Initialize tooltips atau popover jika diperlukan
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', function () {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--dark);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    z-index: 9999;
                    pointer-events: none;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                `;
                document.body.appendChild(tooltip);

                // Position tooltip
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';

                // Show tooltip
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                    tooltip.style.transform = 'translateY(0)';
                }, 10);

                this._tooltip = tooltip;
            });

            el.addEventListener('mouseleave', function () {
                if (this._tooltip) {
                    this._tooltip.remove();
                    this._tooltip = null;
                }
            });
        });
    }

    // Initialize semua fungsi tambahan
    initTooltips();

    // Debug mode untuk development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🚀 SignalSaham - Debug Mode Aktif');
        console.log('📱 Mobile Menu:', navLinks ? 'Ready' : 'Not Found');
        console.log('🎨 Theme Switch:', checkbox ? 'Ready' : 'Not Found');
        console.log('📊 Stats Section:', statsSection ? 'Ready' : 'Not Found');
        console.log('🎯 CTA Buttons:', ctaButtons.length + ' found');
    }

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function () {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log(`⚡ Page Load Time: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
                }
            }, 0);
        });
    }

    // Service Worker registration (jika diperlukan untuk PWA)
    if ('serviceWorker' in navigator && 'production' === 'production') {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    }

    // Keyboard navigation support
    document.addEventListener('keydown', function (e) {
        // ESC untuk tutup mobile menu
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }

        // Tab navigation untuk accessibility
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    // Remove keyboard nav class on mouse use
    document.addEventListener('mousedown', function () {
        document.body.classList.remove('keyboard-nav');
    });

    console.log('✅ SignalSaham Website - Semua fungsi berhasil dimuat!');
});