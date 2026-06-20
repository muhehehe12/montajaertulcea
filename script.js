document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. NAVIGAȚIE SCROLLED & ACTIVE LINK AT SCROLL
       ========================================================================== */
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Schimbare stil header la scroll
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Evidențiere legătură activă în meniu în funcție de secțiunea vizibilă
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset pentru inaltimea header-ului
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       2. MENIU HAMBURGER MOBIL
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            navMenu.classList.toggle('open');
            // Blocăm scroll-ul pe corp când meniul e deschis
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Închidem meniul când se dă click pe o legătură
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================================================
       3. ACORDEON INTREBARI FRECVENTE (FAQ)
       ========================================================================== */
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(faqHeader => {
        faqHeader.addEventListener('click', () => {
            const faqItem = faqHeader.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Închide toate celelalte întrebări deschise (acordeon exclusiv)
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle elementul curent
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       4. GALERIE FOTO - LIGHTBOX
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

    if (lightbox && lightboxImg && lightboxCaption && lightboxCloseBtn) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const caption = item.getAttribute('data-caption');
                
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxCaption.textContent = caption || img.alt;
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        lightboxCloseBtn.addEventListener('click', closeLightbox);
        
        // Închidere la click pe exteriorul imaginii
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Închidere la tasta ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    /* ==========================================================================
       5. ANIMAȚII LA SCROLL (FADE IN REVEAL)
       ========================================================================== */
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85; // declanșăm când elementul e la 85% din înălțime

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;

            if (revealTop < triggerBottom) {
                reveal.classList.add('active');
            }
        });
    };

    // Rulăm funcția o dată la încărcare
    revealOnScroll();
    // Și ascultăm scroll-ul
    window.addEventListener('scroll', revealOnScroll);

    /* ==========================================================================
       6. FORMULAR DE CONTACT (VALIDARE & TRIMITERE)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name').value.trim();
            const phoneInput = document.getElementById('phone').value.trim();
            const serviceSelect = document.getElementById('service-type').value;
            const messageInput = document.getElementById('message').value.trim();

            // Validări simple
            if (!nameInput || !phoneInput || !serviceSelect || !messageInput) {
                showStatus('Vă rugăm să completați toate câmpurile obligatorii.', 'error');
                return;
            }

            if (phoneInput.length < 10) {
                showStatus('Numărul de telefon introdus nu este valid.', 'error');
                return;
            }

            // Simulăm un apel API cu animație de loading
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Se trimite...';

            setTimeout(() => {
                // Succes
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                showStatus(`Vă mulțumim, ${nameInput}! Mesajul dumneavoastră pentru serviciul de "${getServiceName(serviceSelect)}" a fost trimis cu succes. Vă contactăm în cel mai scurt timp.`, 'success');
                
                // Resetăm formularul
                contactForm.reset();
            }, 1500);
        });
    }

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = 'form-status'; // reset
        formStatus.classList.add(type);
        
        // Scroll fin către mesajul de status pe ecranele mici
        if (window.innerWidth < 768) {
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function getServiceName(val) {
        const names = {
            'montaj': 'Montaj Aer Condiționat',
            'demontare': 'Demontare / Remontare',
            'igienizare': 'Igienizare Completă',
            'curatare': 'Curățare Profesională',
            'freon': 'Încărcare Freon',
            'reparatii': 'Reparație / Diagnostic',
            'mentenanta': 'Mentenanță Periodică',
            'altele': 'Alt serviciu / Întrebare'
        };
        return names[val] || val;
    }
});
