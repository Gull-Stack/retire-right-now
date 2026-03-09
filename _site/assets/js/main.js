/**
 * Retire Right Now - JavaScript
 * Smooth scroll, mobile nav toggle, scroll reveal animations
 */

(function() {
    'use strict';

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', function() {
        initSmoothScroll();
        initMobileNav();
        initScrollReveal();
        initFormHandling();
        initScrollHeader();
    });

    /**
     * Smooth Scroll for anchor links
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Mobile Navigation Toggle
     */
    function initMobileNav() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (!toggle || !navLinks) return;
        
        toggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            toggle.classList.toggle('active');
            
            // Update aria-expanded
            const isExpanded = navLinks.classList.contains('active');
            toggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking nav links
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /**
     * Scroll Reveal Animations
     */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        
        if (!revealElements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Form Handling
     */
    function initFormHandling() {
        const emailForm = document.querySelector('#email-form');
        
        if (!emailForm) return;
        
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('#email').value;
            const name = this.querySelector('#name').value;
            
            if (!email || !name) {
                alert('Please fill in all fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Placeholder for form submission
            // In a real implementation, you'd send this to your email service
            console.log('Form submission:', { email, name });
            
            // Show success message
            showFormSuccess();
        });
    }

    /**
     * Email validation
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Show form success message
     */
    function showFormSuccess() {
        const form = document.querySelector('#email-form');
        const originalHTML = form.innerHTML;
        
        form.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="color: var(--accent-blue); margin-bottom: 1rem;">Thank You!</h3>
                <p>Your free chapter will be sent to your email shortly.</p>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 1rem;">
                    We'll also notify you when the full book is available.
                </p>
            </div>
        `;
        
        // Reset form after 5 seconds
        setTimeout(() => {
            form.innerHTML = originalHTML;
            // Re-initialize form handling
            initFormHandling();
        }, 5000);
    }

    /**
     * Header scroll effect
     */
    function initScrollHeader() {
        const header = document.querySelector('.header');
        
        if (!header) return;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    /**
     * FAQ Accordion (if not using native details)
     */
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // Close other open items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }

    /**
     * Book 3D hover effect enhancement
     */
    function init3DBookEffect() {
        const book = document.querySelector('.book-3d');
        
        if (!book) return;
        
        book.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        book.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Initialize 3D book effect when DOM is ready
    document.addEventListener('DOMContentLoaded', init3DBookEffect);

})();