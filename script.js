document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Intersection Observer (Scroll Reveals) ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- 2. Pre-fill Logic (Contact Page) ---
    const interestInput = document.getElementById('interest-field');
    if (interestInput) {
        const urlParams = new URLSearchParams(window.location.search);
        const tripType = urlParams.get('interest');
        if (tripType) {
            interestInput.value = `I am interested in the ${decodeURIComponent(tripType)} package. Please provide more details.`;
        }
    }

    // --- 3. Mobile Navigation ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            burger.classList.toggle('toggle');
        });
    }

    // --- 4. Safari Filtering Logic (Fixed Placement) ---
    const safariGrid = document.querySelector('.safari-grid');
    if (safariGrid) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const safariCards = document.querySelectorAll('.safari-card');
        
        const applyFilter = (filterValue) => {
            safariCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-filter') === filterValue) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        };

        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');

        if (categoryParam) {
            applyFilter(categoryParam);
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                applyFilter(filterValue);
            });
        });
    }
}); // End of DOMContentLoaded

// --- 5. Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) {
        if (window.scrollY > 100) {
            nav.style.background = "rgba(27, 63, 45, 0.95)"; 
            nav.style.padding = "15px 5%";
        } else {
            nav.style.background = "transparent";
            nav.style.padding = "30px 5%";
        }
    }
});

// --- 6. Form Submission (Fixed IDs) ---
const form = document.getElementById('safari-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Ensure these IDs match your HTML <input id="...">
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const pax = document.getElementById('user-pax').value; // Changed from user-pop
        const country = document.getElementById('country-field').value; // Changed from country
        const interest = document.getElementById('interest-field').value;

        const usdValue = document.getElementById('budget-usd').value;
        const ugxValue = document.getElementById('budget-ugx').value;
        
        let finalBudget = "Not specified";
        if (usdValue) {
            finalBudget = `${usdValue} USD`;
        } else if (ugxValue) {
            finalBudget = `${ugxValue} UGX`;
        }

        const whatsappMessage = `*New Booking Request - Tinah Trails*%0A%0A` +
            `*Client:* ${name}%0A` +
            `*Email:* ${email}%0A` +
            `*From:* ${country}%0A` +
            `*Group Size:* ${pax} People%0A` +
            `*Budget:* ${finalBudget}%0A` +
            `*Interests:* ${interest}`;

        const phoneNumber = "256762903555"; 
        const finalUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
        
        window.open(finalUrl, '_blank');
        form.reset();
    });
}