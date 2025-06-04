document.addEventListener('DOMContentLoaded', function() {

    // --- Utility Functions ---

    // Smooth scroll to an element
    function scrollToElement(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    }

    // --- Header and Footer ---

    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
         currentYearElement.textContent = new Date().getFullYear();
    }


    // Typing animation for header
    const typingTextElement = document.querySelector('.typing-text');
    const textToType = "Julian Godenschweig";
    let typeIndex = 0;
    const typingSpeed = 80; // Milliseconds per character

    function startTypingAnimation() {
        if (typingTextElement) {
            typingTextElement.classList.add('cursor-blink'); // Add cursor before typing
             function typeWriter() {
                if (typeIndex < textToType.length) {
                    typingTextElement.textContent += textToType.charAt(typeIndex);
                    typeIndex++;
                    setTimeout(typeWriter, typingSpeed);
                } else {
                    typingTextElement.classList.remove('cursor-blink'); // Remove after typing
                }
            }
            typeWriter();
        }
    }

    startTypingAnimation();


    // --- Custom Cursor ---
    const customCursor = document.querySelector('.cursor');
    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px'; // Use clientX/Y for more precise cursor tracking
            customCursor.style.top = e.clientY + 'px';
        });

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .nav-links li, .social-icon, .back-to-top, .btn, .detail-item, .skill-category, .timeline-content, .experience-item'); // Added more hover elements
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('cursor-hover');
            });
        });
    }


    // --- Navbar Functionality ---
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const headerSection = document.querySelector('.header'); // Assuming the header is the first section


    // Navbar scroll effect and fade
    let lastScrollTop = 0;
    const navbarHeight = navbar ? navbar.offsetHeight : 0; // Get navbar height for fade logic

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add 'scrolled' class for background/styling change
        if (scrollTop > 50) { // Threshold for adding 'scrolled' class
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Navbar fade out when scrolling down, fade in when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
            // Scrolling down and past the navbar height
            navbar.classList.add('faded');
        } else {
            // Scrolling up or near the top
            navbar.classList.remove('faded');
        }

        // Ensure navbar is always visible at the very top
        if (scrollTop === 0) {
            navbar.classList.remove('faded');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });

    // Mobile menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Optional: Disable body scroll when menu is open
            // document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                // Optional: Re-enable body scroll
                // document.body.classList.remove('no-scroll');
            });
        });
    }


    // --- Scroll Reveal Animation (using IntersectionObserver for better performance) ---
    const sections = document.querySelectorAll('.section, .fade-in'); // Include both classes

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start observing slightly before it enters the viewport
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            // Adjust offset for fixed navbar
            const navbarOffset = navbar ? navbar.offsetHeight : 0;
            scrollToElement(targetId, navbarOffset + 20); // Add extra padding

            // Close mobile menu after clicking a link
             if (hamburger && navLinks && hamburger.classList.contains('active')) {
                 hamburger.classList.remove('active');
                 navLinks.classList.remove('active');
                 // document.body.classList.remove('no-scroll'); // Optional: Re-enable body scroll
             }
        });
    });


    // --- Animate Skill Bars ---
    const skillBars = document.querySelectorAll('.progress');

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percentage = bar.style.width;
                bar.style.width = '0'; // Reset width to trigger animation
                // Use setTimeout to ensure the width reset happens before the animation
                setTimeout(() => {
                    bar.style.width = percentage;
                }, 100); // Small delay

                observer.unobserve(bar); // Stop observing once animated
            }
        });
    }, {
         threshold: 0.5, // Trigger when 50% of the skill bar container is visible
         rootMargin: '0px 0px -50px 0px' // Start observing slightly before it enters the viewport
    });

    skillBars.forEach(bar => {
        // The observer needs to observe the parent element of the bar, not the bar itself
        // Assuming the structure is .skill-bar > .progress-bar > .progress
         const progressBarContainer = bar.parentElement;
         if (progressBarContainer && progressBarContainer.parentElement) {
             skillObserver.observe(progressBarContainer.parentElement);
         }
    });


    // --- Contact Form Submission ---
    const contactForm = document.querySelector('.contact-form');
    const formStatusElement = document.getElementById('form-status');

    if (contactForm && formStatusElement) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatusElement.textContent = 'Thanks! Your message was sent.';
                    formStatusElement.className = 'form-status success'; // Reset and add class
                    contactForm.reset();
                } else {
                     const errorData = await response.json(); // Try to get more detailed error
                     let errorMessage = 'Oops! Something went wrong.';
                     if (errorData && errorData.errors) {
                         errorMessage += ' ' + errorData.errors.map(error => error.message).join(', ');
                     }
                    formStatusElement.textContent = errorMessage;
                    formStatusElement.className = 'form-status error'; // Reset and add class
                }
            } catch (error) {
                 formStatusElement.textContent = 'An error occurred. Please try again later.';
                 formStatusElement.className = 'form-status error'; // Reset and add class
                 console.error('Form submission error:', error);
            }
        });
    }

});