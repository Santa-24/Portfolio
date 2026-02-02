// =====================================
// MODERN PROFESSIONAL PORTFOLIO JS
// Component-based, Clean Architecture
// =====================================

// ===== CONFIGURATION =====
const CONFIG = {
    typingSpeed: 100,
    deletingSpeed: 50,
    typingDelay: 2000,
    stats: {
        animationDuration: 2000,
        updateInterval: 50
    }
};

// ===== UTILITY FUNCTIONS =====
const utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Animate number
    animateNumber(element, target, duration) {
        const start = 0;
        const increment = target / (duration / CONFIG.stats.updateInterval);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, CONFIG.stats.updateInterval);
    }
};

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.setupToggle();
    }

    setupToggle() {
        const toggle = document.getElementById('themeSwitch');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }
}

// ===== NAVIGATION MANAGER =====
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.setupToggle();
        this.setupLinks();
        this.setupScrollEffect();
        this.setupActiveLink();
    }

    setupToggle() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.navToggle.classList.toggle('active');
            });
        }
    }

    setupLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }

                // Close mobile menu
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });
    }

    setupScrollEffect() {
        const handleScroll = utils.throttle(() => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    setupActiveLink() {
        const sections = document.querySelectorAll('.section');
        
        const handleScroll = utils.throttle(() => {
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor(element) {
        this.element = element;
        this.texts = [
            'Cloud Engineer',
            'Full-Stack Developer',
            'DevOps Enthusiast',
            'Problem Solver'
        ];
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? CONFIG.deletingSpeed : CONFIG.typingSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = CONFIG.typingDelay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== STATS COUNTER =====
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-value');
        this.hasAnimated = false;
        this.init();
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animate();
                    this.hasAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        this.stats.forEach(stat => observer.observe(stat));
    }

    animate() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            utils.animateNumber(stat, target, CONFIG.stats.animationDuration);
        });
    }
}

// ===== SKILLS TABS =====
class SkillsTabs {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.init();
    }

    init() {
        if (this.tabButtons.length === 0) return;
        this.setupTabs();
        this.setupProgressAnimation();
    }

    setupTabs() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Update buttons
                this.tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update contents
                this.tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetTab) {
                        content.classList.add('active');
                        this.animateSkillBars(content);
                    }
                });
            });
        });
    }

    setupProgressAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeTab = document.querySelector('.tab-content.active');
                    if (activeTab) {
                        this.animateSkillBars(activeTab);
                    }
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }

    animateSkillBars(container) {
        const progressBars = container.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            const width = bar.style.getPropertyValue('--progress');
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }
}

// ===== PROJECTS FILTER =====
class ProjectsFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projects = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        if (this.filterButtons.length === 0) return;
        this.setupFilter();
    }

    setupFilter() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update buttons
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                this.projects.forEach(project => {
                    const categories = project.getAttribute('data-category');
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// ===== CONTACT FORM =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;
        this.setupValidation();
    }

    setupValidation() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            this.clearErrors();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Validate
            let hasError = false;
            
            if (formData.name.length < 2) {
                this.showError('nameError', 'Name must be at least 2 characters');
                hasError = true;
            }
            
            if (!this.validateEmail(formData.email)) {
                this.showError('emailError', 'Please enter a valid email address');
                hasError = true;
            }
            
            if (formData.subject.length < 5) {
                this.showError('subjectError', 'Subject must be at least 5 characters');
                hasError = true;
            }
            
            if (formData.message.length < 10) {
                this.showError('messageError', 'Message must be at least 10 characters');
                hasError = true;
            }
            
            if (hasError) return;
            
            // Submit form
            await this.submitForm(formData);
        });
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearErrors() {
        const errors = this.form.querySelectorAll('.form-error');
        errors.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }

    async submitForm(data) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const successMessage = document.getElementById('formSuccess');
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        try {
            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success
            successMessage.classList.add('show');
            this.form.reset();
            
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
            
        } catch (error) {
            this.showError('messageError', 'Failed to send message. Please try again.');
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.timeline-item, .skill-card, .project-card, .cert-card, .feature-card');
        this.init();
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        this.animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }
}

// ===== BACK TO TOP BUTTON =====
class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }

    init() {
        if (!this.button) return;
        this.setupButton();
        this.setupScroll();
    }

    setupButton() {
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupScroll() {
        const handleScroll = utils.throttle(() => {
            if (window.scrollY > 500) {
                this.button.classList.add('show');
            } else {
                this.button.classList.remove('show');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===== IMAGE FALLBACK =====
class ImageFallback {
    constructor() {
        this.init();
    }

    init() {
        const avatarImg = document.getElementById('avatarImg');
        if (avatarImg) {
            avatarImg.addEventListener('error', function() {
                const fallback = this.nextElementSibling;
                if (fallback && fallback.classList.contains('avatar-fallback')) {
                    this.style.display = 'none';
                    fallback.style.display = 'flex';
                }
            });
        }
    }
}

// ===== INITIALIZE APP =====
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Initialize all components
        new ThemeManager();
        new NavigationManager();
        new StatsCounter();
        new SkillsTabs();
        new ProjectsFilter();
        new ContactForm();
        new ScrollAnimations();
        new BackToTop();
        new ImageFallback();

        // Initialize typing animation
        const typedText = document.getElementById('typedText');
        if (typedText) {
            new TypingAnimation(typedText);
        }

        // Console message
        this.showConsoleMessage();
    }

    showConsoleMessage() {
        console.log(
            '%c👋 Welcome to My Portfolio!',
            'color: #0EA5E9; font-size: 24px; font-weight: bold;'
        );
        console.log(
            '%c✨ Built with modern web technologies',
            'color: #8B5CF6; font-size: 14px;'
        );
        console.log(
            '%c🚀 Check out my GitHub: https://github.com/Santa-24',
            'color: #10B981; font-size: 14px;'
        );
    }
}

// ===== START APP =====
new App();