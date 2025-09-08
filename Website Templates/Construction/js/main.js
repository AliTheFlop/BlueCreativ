document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Lenis Smooth Scroll ---
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);


    // --- 2. Sticky Header on Scroll ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 3. Smooth Scrolling for Nav Links ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if(targetElement){
                e.preventDefault();
                lenis.scrollTo(targetElement);
            }
        });
    });


    // --- 4. Staggered Animation on Scroll ---
    const animatedElements = document.querySelectorAll(".animate-in");

    const observer = new IntersectionObserver((entries) => {
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
    }, {
        threshold: 0.1,
    });

    animatedElements.forEach((el) => {
        observer.observe(el);
    });

});