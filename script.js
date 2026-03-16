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
            // Decodes URL characters like %20 into spaces
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
    // // --- Auto-fill Country Logic ---
    // const countryInput = document.getElementById('country-field');

    // if (countryInput) {
    //     // We fetch data from a free IP lookup service
    //     fetch('https://ipapi.co/json/')
    //         .then(response => response.json())
    //         .then(data => {
    //             // data.country_name gives us the full name (e.g., "United States")
    //             if (data.country_name) {
    //                 countryInput.value = data.country_name;
    //             }
    //         })
    //         .catch(error => {
    //             console.log("Error fetching country:", error);
    //             // We leave it empty if the service fails so the user can type it
    //         });
    // }
});

// --- 4. Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) {
        if (window.scrollY > 100) {
            nav.style.background = "rgba(27, 63, 45, 0.95)"; 
            nav.style.padding = "15px 5%";
        } else {
            nav.style.background = "transparent"; // Note: Ensure your CSS doesn't conflict here
            nav.style.padding = "30px 5%";
        }
    }
});

// --- 5. Form Submission ---
const form = document.getElementById('safari-form');
// if (form) {
//     form.addEventListener('submit', (e) => {
//         e.preventDefault();
//         alert('Thank you! Our safari experts at Tinah Trails will contact you shortly.');
//         form.reset();
//     });
// }
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Collect Basic Data
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const pax = document.getElementById('user-pop').value;
        const country = document.getElementById('country').value;
        const interest = document.getElementById('interest-field').value;

        // 2. Handle Dual Currency Logic
        const usdValue = document.getElementById('budget-usd').value;
        const ugxValue = document.getElementById('budget-ugx').value;
        
        // Decide which budget string to use in the message
        let finalBudget = "Not specified";
        if (usdValue) {
            finalBudget = `${usdValue} USD`;
        } else if (ugxValue) {
            finalBudget = `${ugxValue} UGX`;
        }

        // 3. Construct the WhatsApp message
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