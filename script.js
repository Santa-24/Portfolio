// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dark/Light Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add rotation animation
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

// Typing animation
const typingEl = document.getElementById('typingText');
const names = ['Santanu', 'Cloud Architect'];
let nameIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentText = names[nameIndex];

    if (!isDeleting && charIndex <= currentText.length) {
        typingEl.textContent = currentText.substring(0, charIndex);
        charIndex++;
        setTimeout(type, 120);
    } 
    else if (isDeleting && charIndex >= 0) {
        typingEl.textContent = currentText.substring(0, charIndex);
        charIndex--;
        setTimeout(type, 80);
    } 
    else if (!isDeleting && charIndex > currentText.length) {
        setTimeout(() => isDeleting = true, 1500);
        setTimeout(type, 1500);
    } 
    else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        nameIndex = (nameIndex + 1) % names.length;
        setTimeout(type, 400);
    }
}

setTimeout(type, 500);

// Download CV functionality
document.getElementById('downloadCV').addEventListener('click', function (e) {
    e.preventDefault();
    
    // Create and show download modal
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>📄 Download CV</h3>
            <p>Choose your preferred format:</p>
            <div class="download-options">
                <button class="download-btn pdf-btn" data-format="pdf">
                    <span class="format-icon">📄</span>
                    <span class="format-text">PDF Format</span>
                    <span class="format-size">(Recommended - Best Quality)</span>
                </button>
                <button class="download-btn doc-btn" data-format="doc">
                    <span class="format-icon">📝</span>
                    <span class="format-text">DOCX Format</span>
                    <span class="format-size">(Editable - MS Word)</span>
                </button>
            </div>
            <button class="modal-close">Cancel</button>
        </div>
    `;
    
    // Add styles for modal
    const style = document.createElement('style');
    style.textContent = `
        .download-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background: var(--bg-card);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid var(--accent-primary);
            max-width: 500px;
            width: 90%;
            text-align: center;
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .modal-content h3 {
            font-size: 2rem;
            margin-bottom: 15px;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .modal-content p {
            color: var(--text-secondary);
            margin-bottom: 30px;
        }
        
        .download-options {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .download-btn {
            padding: 20px;
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 15px;
            text-align: left;
        }
        
        .download-btn:hover {
            border-color: var(--accent-primary);
            transform: translateX(5px);
        }
        
        .format-icon {
            font-size: 2.5rem;
        }
        
        .format-text {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-primary);
            display: block;
        }
        
        .format-size {
            font-size: 0.9rem;
            color: var(--text-secondary);
            display: block;
        }
        
        .modal-close {
            padding: 12px 30px;
            background: transparent;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
        }
        
        .modal-close:hover {
            border-color: var(--accent-primary);
            color: var(--accent-primary);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
    
    // Handle download buttons
    modal.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const format = btn.dataset.format;
            
            // Show downloading message
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>⏳ Preparing download...</span>';
            btn.disabled = true;
            
            setTimeout(() => {
                // Create a sample CV download (you should replace this with actual CV file)
                const message = document.createElement('div');
                message.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--accent-primary);
                    color: white;
                    padding: 20px 40px;
                    border-radius: 10px;
                    font-weight: 600;
                    z-index: 10001;
                    animation: fadeIn 0.3s ease;
                `;
                message.textContent = `CV download started (${format.toUpperCase()})! Please add your actual CV file to enable downloads.`;
                document.body.appendChild(message);
                
                setTimeout(() => {
                    message.remove();
                    modal.remove();
                    style.remove();
                }, 3000);
                
                // Note: Replace this with actual download logic
                // Example: window.location.href = 'path/to/your-cv.' + format;
            }, 1500);
        });
    });
});

// Contact Form Validation and Submission
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let hasError = false;
    
    // Validate name
    if (name.length < 2) {
        showError('nameError', 'Please enter a valid name (at least 2 characters)');
        hasError = true;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address');
        hasError = true;
    }
    
    // Validate subject
    if (subject.length < 5) {
        showError('subjectError', 'Subject must be at least 5 characters');
        hasError = true;
    }
    
    // Validate message
    if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual EmailJS or backend API)
    try {
        // Example EmailJS integration (you need to set up EmailJS account):
        /*
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        }).then(() => {
            showSuccess('Message sent successfully! I\'ll get back to you soon.');
            contactForm.reset();
        });
        */
        
        // Simulated delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showSuccess('Message sent successfully! I\'ll get back to you soon. 🎉');
        contactForm.reset();
        
    } catch (error) {
        showError('messageError', 'Failed to send message. Please try again.');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function showSuccess(message) {
    formSuccess.textContent = message;
    formSuccess.style.display = 'block';
    
    setTimeout(() => {
        formSuccess.style.display = 'none';
    }, 5000);
}

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(`
        .hero-content > *,
        .about-content,
        .timeline-item,
        .skill-category,
        .cert-card,
        .project-card,
        .blog-card,
        .testimonial-card
    `);
    
    elementsToAnimate.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
});

// Skill bars animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-category').forEach(category => {
    skillObserver.observe(category);
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = 'none';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Dynamic stats counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Profile image placeholder handler
const profileImages = document.querySelectorAll('.profile-img, .about-profile-img');
profileImages.forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
        `;
        placeholder.textContent = '👨‍💻';
        this.parentElement.appendChild(placeholder);
    });
});

// Add active state to navigation on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavOnScroll() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavOnScroll);

// Add CSS for active nav link
const navLinkStyle = document.createElement('style');
navLinkStyle.textContent = `
    .nav-links a.active {
        color: var(--accent-primary);
        position: relative;
    }
    
    .nav-links a.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--accent-primary);
    }
`;
document.head.appendChild(navLinkStyle);

// Certification verify links (placeholder)
document.querySelectorAll('.cert-verify').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Certification verification will be available once you add your actual credential links.');
    });
});

// Blog read more links (placeholder)
document.querySelectorAll('.blog-read-more').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Blog posts will be available when you add your actual blog content.');
    });
});

// Initialize tooltips for social links
document.querySelectorAll('.hero-social-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        const title = this.getAttribute('title');
        if (title) {
            const tooltip = document.createElement('div');
            tooltip.className = 'social-tooltip';
            tooltip.textContent = title;
            tooltip.style.cssText = `
                position: absolute;
                bottom: -35px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--accent-primary);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 0.85rem;
                white-space: nowrap;
                pointer-events: none;
                z-index: 100;
            `;
            this.style.position = 'relative';
            this.appendChild(tooltip);
        }
    });
    
    link.addEventListener('mouseleave', function() {
        const tooltip = this.querySelector('.social-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Console message for developers
console.log(`
%c👋 Hello Developer!
%cWelcome to Santanu's Portfolio

%cThis portfolio showcases:
✅ Modern responsive design
✅ Dark/Light theme toggle
✅ Smooth animations & transitions
✅ Professional UI components
✅ Clean, maintainable code

%cFeel free to explore the code and reach out!

%c🔗 GitHub: https://github.com/Santa-09
`, 
'color: #00bfff; font-size: 24px; font-weight: bold;',
'color: #1e90ff; font-size: 16px;',
'color: #44ff44; font-size: 14px; line-height: 1.8;',
'color: #00bfff; font-size: 14px;',
'color: #1e90ff; font-size: 14px; font-weight: bold;'
);

// Export functions for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showError,
        showSuccess,
        animateCounter
    };
}