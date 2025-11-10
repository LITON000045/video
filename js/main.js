// Main JavaScript functionality for the portfolio website

class PortfolioApp {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentProjectIndex = 0;
        this.isModalOpen = false;

        this.init();
    }

    async init() {
        try {
            await this.loadProjects();
            this.setupEventListeners();
            this.initializeAnimations();
            this.hideLoading();
        } catch (error) {
            console.error('Failed to initialize portfolio:', error);
            this.showError();
        }
    }

    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) {
                throw new Error('Failed to load projects data');
            }
            const data = await response.json();
            this.projects = data.projects;
            this.filteredProjects = [...this.projects];
            this.siteSettings = data.settings || {};

            // Initialize the portfolio
            this.renderFeaturedProjects();
            this.renderPortfolio();
            this.populateTagFilter();
        } catch (error) {
            console.error('Error loading projects:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Close mobile menu if open
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Scroll effects
        this.setupScrollEffects();

        // Contact form
        this.setupContactForm();

        // Modal controls
        this.setupModalControls();
    }

    setupScrollEffects() {
        const header = document.querySelector('.header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add/remove background to header based on scroll
            if (currentScroll > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }

            // Update active navigation based on scroll position
            this.updateActiveNavigation();

            lastScroll = currentScroll;
        });
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Show loading state
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // In a real implementation, you'd send this to a server
                // For now, we'll simulate a successful submission
                await this.simulateFormSubmission(data);

                // Show success message
                this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
            } catch (error) {
                this.showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data submitted:', data);
                resolve();
            }, 1500);
        });
    }

    setupModalControls() {
        const modal = document.getElementById('projectModal');
        const closeBtn = document.getElementById('modalClose');
        const prevBtn = document.getElementById('modalPrev');
        const nextBtn = document.getElementById('modalNext');

        // Close modal
        closeBtn.addEventListener('click', () => this.closeModal());

        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closeModal();
            }
        });

        // Navigation within modal
        prevBtn.addEventListener('click', () => this.navigateModal(-1));
        nextBtn.addEventListener('click', () => this.navigateModal(1));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isModalOpen) return;

            if (e.key === 'ArrowLeft') {
                this.navigateModal(-1);
            } else if (e.key === 'ArrowRight') {
                this.navigateModal(1);
            }
        });
    }

    initializeAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');

                    // Add specific animation classes
                    if (entry.target.classList.contains('featured-project')) {
                        entry.target.classList.add('slide-in-left');
                    } else if (entry.target.classList.contains('portfolio-project')) {
                        entry.target.classList.add('slide-in-right');
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animations
        document.querySelectorAll('.featured-project, .portfolio-project, .skill-item, .stat').forEach(el => {
            observer.observe(el);
        });

        // Counter animation for stats
        this.setupCounterAnimation();
    }

    setupCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // The lower the faster

        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const increment = target / speed;

                    const updateCount = () => {
                        const count = +counter.innerText;
                        if (count < target) {
                            counter.innerText = Math.ceil(count + increment);
                            setTimeout(updateCount, 1);
                        } else {
                            counter.innerText = target;
                        }
                    };

                    updateCount();
                    countObserver.unobserve(counter);
                }
            });
        });

        counters.forEach(counter => {
            countObserver.observe(counter);
        });
    }

    renderFeaturedProjects() {
        const featuredGrid = document.getElementById('featuredGrid');
        const featuredProjects = this.projects.filter(project => project.featured);

        featuredGrid.innerHTML = featuredProjects.map(project => this.createFeaturedProjectCard(project)).join('');

        // Add click events to featured projects
        featuredGrid.querySelectorAll('.featured-project').forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.dataset.projectId;
                this.openModal(projectId);
            });
        });
    }

    createFeaturedProjectCard(project) {
        return `
            <div class="featured-project" data-project-id="${project.id}">
                <div class="featured-thumbnail">
                    <img src="images/${project.thumbnail}" alt="${project.title}" loading="lazy">
                    <div class="play-overlay">
                        <div class="play-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="featured-info">
                    <h3 class="featured-title">${project.title}</h3>
                    <p class="featured-description">${project.description}</p>
                    <div class="featured-meta">
                        <span class="featured-duration">${project.duration}</span>
                        <div class="featured-tags">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderPortfolio() {
        const portfolioGrid = document.getElementById('portfolioGrid');

        if (this.filteredProjects.length === 0) {
            portfolioGrid.innerHTML = '<div class="no-results"><p>No projects found matching your criteria.</p></div>';
            return;
        }

        portfolioGrid.innerHTML = this.filteredProjects.map(project => this.createPortfolioCard(project)).join('');

        // Add click events to portfolio projects
        portfolioGrid.querySelectorAll('.portfolio-project').forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.dataset.projectId;
                this.openModal(projectId);
            });
        });
    }

    createPortfolioCard(project) {
        return `
            <div class="portfolio-project" data-project-id="${project.id}">
                <div class="portfolio-thumbnail">
                    <img src="images/${project.thumbnail}" alt="${project.title}" loading="lazy">
                    <div class="play-overlay">
                        <div class="play-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="portfolio-info">
                    <h3 class="portfolio-title">${project.title}</h3>
                    <p class="portfolio-description">${project.description}</p>
                    <div class="portfolio-meta">
                        <span class="portfolio-duration">${project.duration}</span>
                        <div class="portfolio-tags">
                            ${project.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    populateTagFilter() {
        const filterSelect = document.getElementById('tagFilter');
        const allTags = [...new Set(this.projects.flatMap(project => project.tags))];

        filterSelect.innerHTML = '<option value="">All Categories</option>' +
            allTags.map(tag => `<option value="${tag}">${tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}</option>`).join('');

        filterSelect.addEventListener('change', () => this.filterProjects());
    }

    filterProjects() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const selectedTag = document.getElementById('tagFilter').value;

        this.filteredProjects = this.projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                                 project.description.toLowerCase().includes(searchTerm) ||
                                 project.client?.toLowerCase().includes(searchTerm);
            const matchesTag = !selectedTag || project.tags.includes(selectedTag);

            return matchesSearch && matchesTag;
        });

        this.renderPortfolio();
    }

    searchProjects() {
        this.filterProjects();
    }

    openModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        this.currentProjectIndex = this.filteredProjects.findIndex(p => p.id === projectId);
        this.isModalOpen = true;

        // Update modal content
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalDescription').textContent = project.description;
        document.getElementById('modalClient').textContent = project.client || 'Independent Project';
        document.getElementById('modalYear').textContent = project.year;
        document.getElementById('modalDuration').textContent = project.duration;

        // Update tags
        const modalTags = document.getElementById('modalTags');
        modalTags.innerHTML = project.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('');

        // Update video
        const modalVideoContainer = document.getElementById('modalVideoContainer');
        modalVideoContainer.innerHTML = `
            <iframe
                src="https://www.youtube.com/embed/${project.youtubeId}?rel=0&modestbranding=1&autohide=1"
                title="${project.title}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        `;

        // Update navigation buttons
        this.updateModalNavigation();

        // Show modal
        document.getElementById('projectModal').classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus on close button for accessibility
        document.getElementById('modalClose').focus();
    }

    closeModal() {
        this.isModalOpen = false;
        document.getElementById('projectModal').classList.remove('active');
        document.body.style.overflow = '';

        // Clear video to stop playback
        document.getElementById('modalVideoContainer').innerHTML = '';
    }

    navigateModal(direction) {
        this.currentProjectIndex += direction;

        // Wrap around if necessary
        if (this.currentProjectIndex < 0) {
            this.currentProjectIndex = this.filteredProjects.length - 1;
        } else if (this.currentProjectIndex >= this.filteredProjects.length) {
            this.currentProjectIndex = 0;
        }

        const project = this.filteredProjects[this.currentProjectIndex];
        this.openModal(project.id);
    }

    updateModalNavigation() {
        const prevBtn = document.getElementById('modalPrev');
        const nextBtn = document.getElementById('modalNext');

        prevBtn.disabled = this.filteredProjects.length <= 1;
        nextBtn.disabled = this.filteredProjects.length <= 1;
    }

    showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }
    }

    showError() {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 4rem 2rem;">
                    <h2>Oops! Something went wrong</h2>
                    <p>Failed to load the portfolio. Please refresh the page and try again.</p>
                    <button onclick="location.reload()" class="btn">Refresh Page</button>
                </div>
            `;
        }
        this.hideLoading();
    }
}

// Initialize the portfolio app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();

    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput) {
        // Search on input with debounce
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                window.portfolioApp.searchProjects();
            }, 300);
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                window.portfolioApp.searchProjects();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            window.portfolioApp.searchProjects();
        });
    }
});

// Preload critical images
window.addEventListener('load', () => {
    const heroImage = new Image();
    heroImage.src = 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80';
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}