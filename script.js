document.addEventListener('DOMContentLoaded', function() {

    // ================================================== //
    //              Mobile Navigation (Hamburger)         //
    // ================================================== //
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            });
        });
    }

    // ================================================== //
    //           "WOW" Hero Section Animations            //
    // ================================================== //
    const hero = document.getElementById('hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            const { offsetWidth: width, offsetHeight: height } = hero;
            const moveX = (x / width * 40) - 20;
            const moveY = (y / height * 40) - 20;
            hero.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
        });
    }

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const elements = Array.from(heroContent.children);
        elements.forEach((element, i) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 * (i + 1));
        });
    }

    // ================================================== //
    //           Professional Theme Toggle Logic          //
    // ================================================== //
    const themeToggle = document.querySelector('#theme-toggle');
    const body = document.body;

    const setTheme = (theme) => {
        body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', theme);
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // ================================================== //
    //          Modal Logic for Certificates              //
    // ================================================== //
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');
    const certGrid = document.querySelector('.certifications-grid');

    if (certGrid) {
        certGrid.addEventListener('click', function(e) {
            const certCard = e.target.closest('.cert-card');
            if (certCard && certCard.dataset.image) {
                modal.style.display = "block";
                modalImg.src = certCard.dataset.image;
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = "none";
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    });

    // ================================================== //
    //              Scroll Reveal Animation               //
    // ================================================== //
    const revealElements = document.querySelectorAll(
        '#about p, .education-card, .timeline-item, .project-card, ' +
        '.skills-category, .tool-card, .cert-card, .contact-card'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ================================================== //
    //           Active Nav Link on Scroll                //
    // ================================================== //
    const sections = document.querySelectorAll('main section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(link => link.classList.remove('active-link'));
                const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active-link');
            }
        });
    }, {
        threshold: 0.35
    });

    sections.forEach(section => activeObserver.observe(section));

    // ================================================== //
    //     Project Image/Video Carousels (Cards + Detail)  //
    // ================================================== //
    function setupCarousel(root) {
        const track = root.querySelector('.card-carousel-track, .detail-carousel-track');
        if (!track) return;

        const slides = Array.from(track.children);
        const prevBtn = root.querySelector('.prev');
        const nextBtn = root.querySelector('.next');
        const dots = Array.from(root.querySelectorAll('.card-carousel-dot, .detail-carousel-dot'));
        const counter = root.querySelector('.detail-carousel-counter');

        // Single slide (e.g. Udemy video card): hide nav controls, nothing else to do
        if (slides.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            dots.forEach(dot => dot.style.display = 'none');
            return;
        }

        let index = 0;

        function pauseAllVideosExcept(activeIndex) {
            slides.forEach((slide, i) => {
                const video = slide.tagName === 'VIDEO' ? slide : slide.querySelector('video');
                if (video && i !== activeIndex) video.pause();
            });
        }

        function goTo(newIndex) {
            index = (newIndex + slides.length) % slides.length;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
            pauseAllVideosExcept(index);
        }

        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); goTo(index - 1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); goTo(index + 1); });
        dots.forEach((dot, i) => dot.addEventListener('click', (e) => { e.preventDefault(); goTo(i); }));

        // Touch swipe support
        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        track.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(diff) > 40) {
                diff > 0 ? goTo(index - 1) : goTo(index + 1);
            }
        }, { passive: true });

        // Keyboard support for the big detail carousel
        if (root.classList.contains('detail-carousel')) {
            root.setAttribute('tabindex', '0');
            root.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') goTo(index - 1);
                if (e.key === 'ArrowRight') goTo(index + 1);
            });
        }

        goTo(0);
    }

    document.querySelectorAll('.card-carousel, .detail-carousel').forEach(setupCarousel);

});