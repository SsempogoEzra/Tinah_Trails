document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Target all elements with the 'reveal' class
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// Change navbar background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        nav.style.background = "rgba(27, 63, 45, 0.95)"; // Deep Green
        nav.style.padding = "15px 5%";
    } else {
        nav.style.background = "transparent";
        nav.style.padding = "30px 5%";
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Submission Handling
const form = document.getElementById('safari-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! Our safari experts will contact you shortly.');
    form.reset();
});