// ==========================================
// 1. STANDALONE HELPER & UTILITY FUNCTIONS
// ==========================================

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 5000);
}

function initCardToggles() {
    const toggleButtons = document.querySelectorAll('.details-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const details = button.nextElementSibling;
            
            // Toggle the 'show' class on the details div
            details.classList.toggle('show');
            
            // Toggle the rotation of the arrow icon
            button.classList.toggle('active');
            
            // Change text based on state
            if (details.classList.contains('show')) {
                button.innerHTML = `Close Details <i class="fas fa-chevron-down"></i>`;
            } else {
                button.innerHTML = `View Details <i class="fas fa-chevron-down"></i>`;
            }
        });
    });
}

function initWhatsAppInquiries() {
    const whatsappInquireBtns = document.querySelectorAll('.whatsapp-inquire-btn');
    
    whatsappInquireBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get safari title from data attribute
            const safariTitle = btn.getAttribute('data-title') || "a safari package";
            
            // Build message
            const message = `Hello Tinah Trails Safaris! 👋 I would like to inquire about the *${safariTitle}* package. Please share more details and availability.`;
            
            // Primary company WhatsApp number
            const phoneNumber = "256762903555"; 
            
            // Encode message for URL
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');
        });
    });
}

function initSafariFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const safariCards = document.querySelectorAll('.safari-card');
    
    if (filterButtons.length === 0) return;

    const applyFilter = (filterValue) => {
        safariCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'flex';
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

// ==========================================
// 1.2. LE SAFARI PACKAGE LOADEERRR
// ==========================================
async function loadSafariPackages() {
    const gridContainer = document.getElementById('safari-grid-container');
    if (!gridContainer) return;

    // // List of JSON files created by Decap CMS
    // const safariFiles = [
    //     'the-ultimate-gorilla-experience.json'
    //     ,'kazinga-channel-explorer.json',
    //     'honeymoon-in-the-wild.json',
    //     'the-pearl-explorer.json',
    //     'lions-of-queen-elizabeth.json','test-package.json'
    // ];

    try {
        // Fetch the dynamically generated file index
        const indexResponse = await fetch('./content/safaris-index.json');
        const safariFiles = await indexResponse.json();

        const fetchPromises = safariFiles.map(file => 
            fetch(`./content/safaris/${file}`).then(res => res.json())
        );
        const safariDataList = await Promise.all(fetchPromises);

        // Clear loading message
        gridContainer.innerHTML = '';

        safariDataList.forEach(data => {
            const cardHTML = `
                <div class="safari-card" data-category="${data.category}">
                    <div class="card-img" style="background-image: url('${data.image}');"></div>
                    <div class="card-content">
                        <h3>${data.title}</h3>
                        <p>${data.location}</p>
                        
                        <button class="details-toggle">View Details <i class="fas fa-chevron-down"></i></button>
                        
                        <div class="card-details">
                            <ul class="details-list">
                                <li><strong><i class="far fa-clock"></i> Duration:</strong> ${data.duration}</li>
                                ${data.price1 ? `<li><strong><i class="fas fa-user"></i> ${data.price1}</li>` : ''}
                                ${data.price2 ? `<li><strong><i class="fas fa-heart"></i> ${data.price2}</li>` : ''}
                                <li><strong><i class="far fa-calendar-alt"></i> Best Months:</strong> ${data.best_months}</li>
                            </ul>
                            <a href="#" class="btn full-width whatsapp-inquire-btn" data-title="${data.title}">
                                <i class="fab fa-whatsapp"></i> Inquire via WhatsApp
                            </a>
                            <a href="contact.html?interest=${encodeURIComponent(data.title)}" class="custom-form-link">
                                Or request an email quote &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Initialize listeners AFTER elements exist in the DOM
        initCardToggles();
        initWhatsAppInquiries();
        initSafariFilters();

    } catch (error) {
        console.error('Error loading safari packages:', error);
        gridContainer.innerHTML = '<p>Unable to load safaris at this time. Please try refreshing.</p>';
    }
}


// ==========================================
// 2. MAIN INITIALIZATION BLOCK
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Initialize Hero Slider ---
    initSlider();

    // --- Dynamic Safari Package Loader ---
    loadSafariPackages();

    // --- Intersection Observer (Scroll Reveals) ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- Pre-fill Logic (Contact Page) ---
    const interestInput = document.getElementById('interest-field');
    if (interestInput) {
        const urlParams = new URLSearchParams(window.location.search);
        const tripType = urlParams.get('interest');
        if (tripType) {
            interestInput.value = `I am interested in the ${decodeURIComponent(tripType)} package. Please provide more details.`;
        }
    }

    // --- Mobile Navigation ---
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
}); 


// ==========================================
// 3. GLOBAL EVENT LISTENERS
// ==========================================

// --- Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) {
        if (window.scrollY > 100) {
            nav.style.background = "rgba(27, 63, 45, 0.95)"; 
            nav.style.padding = "15px 5%";
        } else {
            nav.style.background = "transparent";
            nav.style.padding = "15px 5%";
        }
    }
});

// --- Form Submission ---
const form = document.getElementById('safari-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const pax = document.getElementById('user-pax').value; 
        const country = document.getElementById('country-field').value; 
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