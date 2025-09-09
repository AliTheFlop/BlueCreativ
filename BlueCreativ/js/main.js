document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Lenis Smooth Scroll ---
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 2. Sticky Header on Scroll ---
    const header = document.getElementById("header");
    if (header) {
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
    const thankYouMessage = document.getElementById("thank-you-message");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            // Stop the form's default submission and event bubbling
            e.preventDefault();
            e.stopPropagation();

            const action = contactForm.getAttribute("action");

            // Manually create a JavaScript object from the form inputs
            const formData = {
                name: contactForm.querySelector('[name="name"]').value,
                email: contactForm.querySelector('[name="email"]').value,
                message: contactForm.querySelector('[name="message"]').value,
            };

            try {
                const response = await fetch(action, {
                    method: "POST",
                    // Set headers to match your working React code
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    // Stringify the object into JSON, just like in React
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    thankYouMessage.style.display = "block";
                    contactForm.reset();
                    // Optional: hide the message after 5 seconds
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
        });
    }
});
