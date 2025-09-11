document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Lenis Smooth Scroll ---
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 2. Sticky Header on Scroll (Modified) ---
    const header = document.getElementById("header");
    const heroSection = document.querySelector(".hero"); // Check for hero section

    // Only run the scroll effect if the hero section exists (i.e., on the main page)
    if (header && heroSection) {
        // Set initial state based on scroll position
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Add scroll listener
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    // --- 3. Staggered Animation on Scroll ---
    const animatedElements = document.querySelectorAll(".animate-in");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = parseInt(element.dataset.animDelay) || 0;

                    setTimeout(() => {
                        element.classList.add("is-visible");
                    }, delay);

                    observer.unobserve(element);
                }
            });
        },
        {
            threshold: 0.1,
        }
    );

    animatedElements.forEach((el) => {
        observer.observe(el);
    });

    // --- 4. Mobile Menu Logic ---
    const navMenu = document.getElementById("nav-menu");
    const navToggle = document.getElementById("nav-toggle");
    const navClose = document.getElementById("nav-close");
    const navLinks = document.querySelectorAll(".nav__link");

    // Function to close the menu
    const closeMenu = () => {
        navMenu.classList.remove("show-menu");
    };

    // Show menu
    if (navToggle) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.add("show-menu");
        });
    }

    // Hide menu with close button
    if (navClose) {
        navClose.addEventListener("click", closeMenu);
    }

    // Hide menu when a link is clicked & smooth scroll
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            // If the link is to another page, don't prevent default
            if (targetId.includes(".html")) {
                return;
            }
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                lenis.scrollTo(targetElement);
                closeMenu();
            }
        });
    });

    // --- 5. Formspark Submission ---
    const contactForm = document.getElementById("contact-form");
    const newsletterForm = document.getElementById("newsletter-form");
    const thankYouMessage = document.getElementById("thank-you-message");

    const handleFormSubmit = async (form, event) => {
        event.preventDefault();
        event.stopPropagation();

        const action = form.getAttribute("action");
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                thankYouMessage.style.display = "block";
                form.reset();
                setTimeout(() => {
                    thankYouMessage.style.display = "none";
                }, 5000);
            } else {
                alert("Submission failed with status: " + response.status);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please check the console.");
        }
    };

    if (contactForm) {
        contactForm.addEventListener("submit", (e) =>
            handleFormSubmit(contactForm, e)
        );
    }

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) =>
            handleFormSubmit(newsletterForm, e)
        );
    }

    // --- 6. FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll(".faq__item");

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq__question");

        question.addEventListener("click", () => {
            // Check if the item is already active
            const isActive = item.classList.contains("active");

            // Optional: Close all other items
            faqItems.forEach((i) => i.classList.remove("active"));

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.toggle("active");
            }
        });
    });
});
