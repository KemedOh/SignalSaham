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

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Tutup menu saat link diklik (untuk mobile)
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

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
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (animateElements.length > 0) {
        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition =
                `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
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
            element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : element
                .textContent.includes('+') ? '+' : '');
        }, 20);
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.textContent);
                    animateCounter(counter, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Add some interactive effects
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add some random floating animation delays
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${Math.random() * 2}s`;
        el.style.animationDuration = `${3 + Math.random() * 2}s`;
    });

    // ------------------------------------------
    // Bagian 4: Pelacakan & Feedback
    // ------------------------------------------

    // Track button clicks
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            console.log('Conversion event tracked');
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Menghubungkan...';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });
});