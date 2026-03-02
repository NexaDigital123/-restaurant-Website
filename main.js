// ===== RESTAURANT WEBSITE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {

    // ---------- 1. MOBILE HAMBURGER MENU ----------
    const nav = document.querySelector('nav');
    const navMenu = document.querySelector('nav ul');
    const navToggle = document.createElement('button');
    navToggle.classList.add('nav-toggle');
    navToggle.innerHTML = '☰'; // Hamburger icon
    navToggle.setAttribute('aria-label', 'Toggle navigation');
    nav.insertBefore(navToggle, navMenu);

    // Toggle menu on click
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');
        // Change icon (optional)
        if (navMenu.classList.contains('show')) {
            navToggle.innerHTML = '✕';
        } else {
            navToggle.innerHTML = '☰';
        }
    });

    // Close menu when a link is clicked (for single-page smooth scroll)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            // If it's a hash link (like #contact), we'll handle smooth scroll later
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                scrollToTarget(targetId);
            }
            // Close mobile menu after click
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('show');
                navToggle.innerHTML = '☰';
            }
        });
    });

    // ---------- 2. SMOOTH SCROLLING FOR ANCHOR LINKS ----------
    function scrollToTarget(id) {
        const target = document.querySelector(id);
        if (target) {
            const headerOffset = 80; // Adjust based on nav height
            const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Handle "Reserve a Table" button and any other hash links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== "#") { // Ignore empty hashes
                e.preventDefault();
                scrollToTarget(href);
            }
        });
    });

    // ---------- 3. STICKY NAVIGATION (add shadow on scroll) ----------
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    });

    // ---------- 4. ACTIVE LINK HIGHLIGHTING (based on current page) ----------
    // Get current page filename from URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navMenu.querySelectorAll('a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ---------- 5. RESERVATION FORM VALIDATION ----------
    const reservationForm = document.querySelector('form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual submission for demo

            let isValid = true;
            const date = document.getElementById('date');
            const time = document.getElementById('time');
            const guests = document.getElementById('guests');

            // Clear previous error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());

            // Helper to show error
            function showError(input, message) {
                isValid = false;
                const error = document.createElement('div');
                error.className = 'error-message';
                error.style.color = '#d9534f';
                error.style.fontSize = '0.9rem';
                error.style.marginTop = '0.25rem';
                error.textContent = message;
                input.parentNode.insertBefore(error, input.nextSibling);
            }

            // Validate date
            if (!date.value) {
                showError(date, 'Please select a date.');
            } else {
                const selectedDate = new Date(date.value);
                const today = new Date();
                today.setHours(0,0,0,0);
                if (selectedDate < today) {
                    showError(date, 'Date cannot be in the past.');
                }
            }

            // Validate time
            if (!time.value) {
                showError(time, 'Please select a time.');
            }

            // Validate guests
            if (!guests.value) {
                showError(guests, 'Please enter number of guests.');
            } else if (guests.value < 1 || guests.value > 8) {
                showError(guests, 'Guests must be between 1 and 8.');
            }

            if (isValid) {
                alert('Reservation submitted! (This is a demo)');
                // You could actually submit via AJAX here
            }
        });
    }

    // ---------- 6. SIMPLE IMAGE LIGHTBOX (for gallery) ----------
    // If you add images with class 'gallery-img', clicking them opens a modal
    const galleryImages = document.querySelectorAll('.gallery-img');
    if (galleryImages.length > 0) {
        // Create lightbox container
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = '<span class="lightbox-close">&times;</span><img class="lightbox-content"><div class="lightbox-caption"></div>';
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        galleryImages.forEach(img => {
            img.addEventListener('click', function() {
                lightbox.style.display = 'flex';
                lightboxImg.src = this.src;
                lightboxCaption.textContent = this.alt || '';
            });
        });

        closeBtn.addEventListener('click', function() {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // ---------- 7. PAGE LOAD FADE-IN ----------
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });

}); // end DOMContentLoaded
// ---------- 5. RESERVATION FORM HANDLING (with fetch) ----------
const reservationForm = document.getElementById('reservation-form');
if (reservationForm) {
    reservationForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Stop normal form submission

        // Clear any previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // --- Validation ---
        let isValid = true;
        const date = document.getElementById('date');
        const time = document.getElementById('time');
        const guests = document.getElementById('guests');

        function showError(input, message) {
            isValid = false;
            const error = document.createElement('div');
            error.className = 'error-message';
            error.style.color = '#d9534f';
            error.style.fontSize = '0.9rem';
            error.style.marginTop = '0.25rem';
            error.textContent = message;
            input.parentNode.insertBefore(error, input.nextSibling);
        }

        // Validate date
        if (!date.value) {
            showError(date, 'Please select a date.');
        } else {
            const selectedDate = new Date(date.value);
            const today = new Date();
            today.setHours(0,0,0,0);
            if (selectedDate < today) {
                showError(date, 'Date cannot be in the past.');
            }
        }

        // Validate time
        if (!time.value) {
            showError(time, 'Please select a time.');
        }

        // Validate guests
        if (!guests.value) {
            showError(guests, 'Please enter number of guests.');
        } else if (guests.value < 1 || guests.value > 8) {
            showError(guests, 'Guests must be between 1 and 8.');
        }

        if (!isValid) return; // Stop if validation fails

        // --- If valid, show loading state ---
        const submitBtn = reservationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // --- Collect form data ---
        const formData = new FormData(reservationForm);
        const data = Object.fromEntries(formData.entries());

        // --- Simulate sending data to server (replace with actual fetch if needed) ---
        try {
            // Option 1: Simulate success after 1 second (for demo)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Option 2: Actually send data (uncomment if you have an endpoint)
            // const response = await fetch('/submit-reservation', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            // if (!response.ok) throw new Error('Server error');

            // --- Success! Show message and optionally reset form ---
            showFormMessage('✅ Reservation request sent! We’ll confirm shortly.', 'success');
            reservationForm.reset(); // Clear the form

        } catch (error) {
            showFormMessage('❌ Something went wrong. Please try again.', 'error');
        } finally {
            // Restore button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Helper function to show a message above the form
function showFormMessage(text, type) {
    // Remove any existing message
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = `form-message ${type}`;
    msg.textContent = text;
    msg.style.padding = '1rem';
    msg.style.marginBottom = '1rem';
    msg.style.borderRadius = '8px';
    msg.style.fontWeight = '500';
    if (type === 'success') {
        msg.style.backgroundColor = '#d4edda';
        msg.style.color = '#155724';
        msg.style.border = '1px solid #c3e6cb';
    } else {
        msg.style.backgroundColor = '#f8d7da';
        msg.style.color = '#721c24';
        msg.style.border = '1px solid #f5c6cb';
    }

    // Insert at top of form
    reservationForm.parentNode.insertBefore(msg, reservationForm);
}