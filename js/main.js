document.addEventListener('DOMContentLoaded', () => {

    // Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                // Optional: remove from DOM after fade
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 1000);
            }, 1800); // 1.8s for premium "curtain" feel
        });
    }

    // Sticky Navbar Transition
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Testimonials Slider
    const slides = document.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    if (slides.length > 0) {
        // Show first slide initially
        showSlide(0);
        // Start auto-play
        setInterval(nextSlide, slideInterval);
    }

    // Smooth Scrolling for Anchors with Header Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // Intersection Observer for Fade-in Animations (Simple Scroll Reveal)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add 'fade-in' class to sections we want to animate
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    // Dropdown Click Handling (Mobile/Tablet/Desktop interaction)
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown-menu');

        if (dropdown && link) {
            link.addEventListener('click', (e) => {
                // ALWAYS prevent default for elements with dropdowns
                e.preventDefault();

                // For mobile, stop propagation to prevent menu from closing
                if (window.innerWidth < 992) {
                    e.stopPropagation();
                }

                // Close others
                navItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle visibility
                item.classList.toggle('active');
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item')) {
            navItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // --- Mobile Hamburger Menu Logic ---
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');

    if (navContainer && navMenu) {
        // Create Toggle Button
        const menuToggle = document.createElement('div');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';

        // Append to container (it will flex to the right)
        navContainer.appendChild(menuToggle);

        // Toggle Event
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Toggle Icon
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu ONLY when clicking a terminal link (no dropdown)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const parentItem = link.closest('.nav-item');
                const hasDropdown = parentItem && parentItem.querySelector('.dropdown-menu');

                // If it's a sub-link or a terminal link, close the menu
                if (!hasDropdown || link.classList.contains('dropdown-link')) {
                    navMenu.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }

    // --- Premium Animations Script ---

    // 1. Hero Text Reveal
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Handle spaces
            span.style.animationDelay = `${index * 0.05}s`; // Stagger each letter
            heroTitle.appendChild(span);
        });
    }

    // 2. Staggered Scroll for Grids
    // Select containers of cards
    const gridContainers = document.querySelectorAll('.features-grid, .services-grid, .about-images');

    gridContainers.forEach(container => {
        const children = Array.from(container.children);
        children.forEach((child, index) => {
            child.classList.add('fade-in-up');
            // Loop delays (max 600ms to avoid waiting too long)
            const delay = (index % 6) * 100 + 100;
            child.classList.add(`delay-${delay}`);
            observer.observe(child);
        });
    });

    // 3. Add Shimmer to specific elements
    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach(btn => btn.classList.add('shimmer-effect'));

    // Note: 'observer' is already defined above in the file, reusing it.
    // Ensure the observer callback handles '.fade-in-up'

    // Just in case, let's update the observer to be robust
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animationObserver.unobserve(entry.target); // Play once
            }
        });
    }, { threshold: 0.1 });

    // Observing grid items we just setup
    document.querySelectorAll('.fade-in-up').forEach(el => animationObserver.observe(el));

    // 4. Floating Particles in About Section
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        // Create container
        const container = document.createElement('div');
        container.classList.add('floating-container');
        aboutSection.style.position = 'relative'; // Ensure positioning context
        aboutSection.insertBefore(container, aboutSection.firstChild);

        // Create particles
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Randomize size, position, duration, and type
            const size = Math.random() * 10 + 5; // 5px to 15px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            particle.style.left = `${Math.random() * 100}%`;

            const duration = Math.random() * 20 + 10; // 10s to 30s
            particle.style.animationDuration = `${duration}s`;

            const delay = Math.random() * 5;
            particle.style.animationDelay = `${delay}s`;

            // Mix of gold and green
            if (Math.random() > 0.5) {
                particle.classList.add('gold');
            }

            container.appendChild(particle);
        }
    }

    // Modal Handling
    const modalBtn = document.querySelector('a[href="#vision"].btn-primary'); // Adjust selector as needed based on exact button
    // Actually, looking at index.html, the button is: <a href="#vision" class="btn btn-primary" style="margin-top: 1rem;">Read Our Story</a>
    // We can target it specifically if we add an ID or just be careful.
    // Let's create the modal HTML dynamically or expect it in the HTML.
    // Recommended: Insert Modal HTML dynamically to avoid messing up index.html manually if not needed.

    const modalHTML = `
    <div id="story-modal" class="modal-overlay">
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-header">
                <h2>ABOUT AADI ANANTA</h2>
            </div>
            <div class="modal-body">
                
                <h3>THE PHILOSOPHY OF AADI ANANTA</h3>
                <p><strong>Giving Spontaneously:</strong> The more one gives, the more one gets. Aadi Ananta is sharing abundance in life in every manner. So you can have peace of mind and happiness within.</p>
                <p><strong>Making an Impact:</strong> The project itself is a unique location and rare in its theme and philosophy behind it. While you are making a home there, you are making an impact of uniqueness too.</p>
                <p><strong>Nurturing a Vision:</strong> We at 'Aadi Ananta' present you, with your own space without changing ceaseless flow of cosmic energy and natural transformation for your convenience.</p>
                <p><strong>Learning for Life:</strong> Change is the only constant thing. Nature is a perfect example of this change which is eternal. Aadi Ananta presents your own space to learn constantly where your teacher is Nature.</p>

                <h3>THE 'THREE DIMENSIONS' OF AADI ANANTA</h3>
                <p><strong>Gathering Impact:</strong> Outdoor activities that promote spiritual well-being are frequently available in the surroundings of a spiritual Aadi Ananta weekend house. Nature walks, hiking trails, or adjacent natural beauty spots can be visited, allowing folks to immerse themselves in the natural world's awe-inspiring beauties and experience a profound sense of connection with the cosmos.</p>
                <p><strong>Drawing Holism:</strong> Aadi Ananta provides a respite from the demands and distractions of everyday life, allowing individuals to step away and focus on their spiritual journey. It serves as a sanctuary where one can nurture their soul, find inner balance, and cultivate a deeper understanding of themselves and the world around them.</p>
                <p><strong>Acquiring Energy:</strong> It's a cozy cabin in the mountains or a retreat center in the countryside. Aadi Ananta offers a sacred space for introspection, self-care, and spiritual exploration. It is a place where individuals can recharge their spirits, find solace, and embark on a profound journey of self-discovery and personal growth.</p>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('story-modal');
    const closeBtn = modal.querySelector('.modal-close');

    // Find the specific 'Read Our Story' button
    // It is in the About section with text "Read Our Story"
    const readStoryBtns = Array.from(document.querySelectorAll('.btn-primary'));
    const storyBtn = readStoryBtns.find(btn => btn.textContent.trim() === 'Read Our Story');

    if (storyBtn) {
        storyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close on click outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Dynamic Interactions ---

    // Hover effect for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .feature-card, input, textarea');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // 2. 3D Tilt Effect for Service Cards
    const cards = document.querySelectorAll('.service-card, .feature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            card.style.transition = 'transform 0.1s ease'; // Fast response
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.transition = 'transform 0.5s ease'; // Smooth reset
        });
    });

    // 3. Parallax Hero Background
    const heroBg = document.querySelector('.hero-background');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroBg.style.transform = `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0005})`;
        });
    }

    // 4. Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline, .btn-link, .social-icon');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move the button towards the cursor (strength = 0.3)
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            btn.style.transition = 'transform 0.1s ease-out';
        });

        btn.addEventListener('mouseleave', () => {
            // Smoothly return to original position
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        });
    });

    // 5. Service Options Modal Logic
    const serviceData = {
        'living': {
            title: 'Wellness Living',
            desc: 'Luxury Residences Tailored for Harmony',
            options: [
                { name: 'Luxury Villas', link: 'wellness/villas.html' },
                { name: 'Wellness Sanctuary Suites', link: 'wellness/suites.html' },
                { name: 'Heritage Cottages', link: 'wellness/cottages.html' },
                { name: 'Zen Tree Houses', link: 'wellness/treehouse.html' }
            ]
        },
        'retreat': {
            title: 'Wellness Retreat',
            desc: 'Transformative Healing Programs',
            options: [
                { name: 'Body Pain Treatment', link: 'retreat/body-pain.html' },
                { name: 'Disease Treatment', link: 'retreat/disease-treatment.html' },
                { name: 'Stress Management', link: 'retreat/stress-management.html' },
                { name: 'Panchakarma Detox', link: 'retreat/panchakarma.html' },
                { name: 'Ayurvedic Healing', link: 'retreat/ayurveda.html' },
                { name: 'Homeopathy Care', link: 'retreat/homeopathy.html' },
                { name: 'Naturopathy', link: 'retreat/naturopathy.html' },
                { name: 'Yoga & Meditation', link: 'retreat/yoga.html' }
            ]
        },
        'venues': {
            title: 'Venues & Hospitality',
            desc: 'Exquisite Spaces for Every Occasion',
            options: [
                { name: 'Meeting Spaces', link: 'venues/meeting.html' },
                { name: 'Corporate Parties', link: 'venues/party.html' },
                { name: 'Conferences', link: 'venues/conference.html' },
                { name: 'Destination Weddings', link: 'venues/wedding.html' },
                { name: 'Music Concerts', link: 'venues/concert.html' },
                { name: 'Private Celebrations', link: 'venues/private-party.html' }
            ]
        },
        'reality': {
            title: 'Rich Returns Reality',
            desc: 'Invest in a Sustainable Future',
            options: [
                { name: 'Residential Projects', link: 'reality/residential.html' },
                { name: 'Commercial Projects', link: 'reality/commercial.html' }
            ]
        },
        'sports': {
            title: 'Sports Activity',
            desc: 'Olympic Standard Excellence',
            options: [
                { name: 'Olympic Arena', link: 'sports/arena.html' },
                { name: 'Sports Training', link: 'sports/training.html' }
            ]
        },
        'education': {
            title: 'Education',
            desc: 'Nurturing Minds with Vedic Wisdom',
            options: [
                { name: 'Residential Gurukul', link: 'education/gurukul.html' },
                { name: 'Future-Ready Values', link: 'education/future-ready.html' },
                { name: 'Art & Culture Classes', link: 'education/art.html' }
            ]
        }
    };

    // Create Modal HTML
    const serviceModalHTML = `
    <div id="service-options-modal" class="service-options-modal">
        <div class="options-container">
            <button class="modal-close-btn">&times;</button>
            <div class="options-header">
                <h2 id="modal-service-title">Service Name</h2>
                <p id="modal-service-desc">Description goes here</p>
            </div>
            <div id="options-grid" class="options-grid">
                <!-- Options injected here -->
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', serviceModalHTML);

    const sModal = document.getElementById('service-options-modal');
    const sTitle = document.getElementById('modal-service-title');
    const sDesc = document.getElementById('modal-service-desc');
    const sGrid = document.getElementById('options-grid');
    const sClose = sModal.querySelector('.modal-close-btn');

    document.querySelectorAll('.explore-service').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceKey = btn.getAttribute('data-service');
            const data = serviceData[serviceKey];

            if (data) {
                sTitle.innerText = data.title;
                sDesc.innerText = data.desc;
                sGrid.innerHTML = data.options.map(opt => `
                    <a href="${opt.link}" class="option-btn">${opt.name}</a>
                `).join('');

                sModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeServiceModal = () => {
        sModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    sClose.addEventListener('click', closeServiceModal);
    sModal.addEventListener('click', (e) => {
        if (e.target === sModal) closeServiceModal();
    });

    // 6. Scroll Reveal Observer
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15 // Trigger when 15% of element is visible
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-container, .page-content h2').forEach(el => {
        revealObserver.observe(el);
    });

});


