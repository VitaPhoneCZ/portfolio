document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        hamburger.classList.toggle('active');

        // Basic styling for mobile menu when active
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(15, 23, 42, 0.98)';
            navLinks.style.padding = '2rem';
            navLinks.style.textAlign = 'center';
            navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.skill-card, .hw-item, .about-text, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Contact Form Handling (AJAX)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // UI Feedback (Loading)
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Odesílám...';
            submitBtn.disabled = true;
            formStatus.style.display = 'none';

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            fetch('send_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(data => {
                    formStatus.innerText = data.message;
                    formStatus.style.display = 'block';

                    if (data.status === 'success') {
                        formStatus.style.color = '#00f2fe'; // Success color
                        contactForm.reset();
                    } else {
                        formStatus.style.color = '#ff0055'; // Error color
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    formStatus.innerText = 'Došlo k chybě při komunikaci se serverem.';
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#ff0055';
                })
                .finally(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Jelly Cursor Glow Effect
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let scaleX = 1, scaleY = 1;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Smooth trailing (LERP)
            // 0.1 = slower/smoother lag, 0.2 = faster/closer
            const speed = 0.12;
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;

            // Calculate velocity for subtle deformation
            const deltaX = mouseX - cursorX;
            const deltaY = mouseY - cursorY;
            const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // "Jelly" deformation - SUBTLE version
            const maxStretch = 0.15; // Limit stretch to 15% (was 50%)
            const stretchFactor = Math.min(velocity * 0.002, maxStretch);

            // Calculate angle for rotation
            const angle = Math.atan2(deltaY, deltaX);

            // Apply transform with subtle stretch
            cursorGlow.style.transform = `translate(${cursorX}px, ${cursorY}px) rotate(${angle}rad) scale(${1 + stretchFactor}, ${1 - stretchFactor})`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }
});
