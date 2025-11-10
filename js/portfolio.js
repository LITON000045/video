// Portfolio-specific JavaScript functionality

class PortfolioManager {
    constructor() {
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.sortBy = 'recent';
        this.viewMode = 'grid';
        this.currentPage = 1;
        this.projectsPerPage = 12;

        this.init();
    }

    init() {
        this.setupPortfolioControls();
        this.setupLazyLoading();
        this.setupKeyboardShortcuts();
        this.setupAnalytics();
    }

    setupPortfolioControls() {
        // Enhanced filter functionality
        const filterSelect = document.getElementById('tagFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.applyFilters();
                this.updateURL();
            });
        }

        // Enhanced search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchTerm = e.target.value.toLowerCase();
                    this.applyFilters();
                    this.updateURL();
                }, 400); // Slightly longer debounce for better performance
            });

            // Clear search on Escape key
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    this.searchTerm = '';
                    this.applyFilters();
                    this.updateURL();
                }
            });
        }

        // Setup advanced filtering (if controls exist)
        this.setupAdvancedFilters();

        // Setup sorting (if controls exist)
        this.setupSorting();

        // Setup view mode toggle (if controls exist)
        this.setupViewMode();
    }

    setupAdvancedFilters() {
        // This can be expanded for more advanced filtering options
        // For now, we'll keep it simple as specified in the plan
        const yearFilter = document.getElementById('yearFilter');
        const durationFilter = document.getElementById('durationFilter');

        if (yearFilter) {
            yearFilter.addEventListener('change', () => this.applyFilters());
        }

        if (durationFilter) {
            durationFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }
    }

    setupViewMode() {
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');

        if (gridBtn && listBtn) {
            gridBtn.addEventListener('click', () => {
                this.viewMode = 'grid';
                this.updateViewMode();
            });

            listBtn.addEventListener('click', () => {
                this.viewMode = 'list';
                this.updateViewMode();
            });
        }
    }

    applyFilters() {
        if (!window.portfolioApp) return;

        let projects = [...window.portfolioApp.projects];

        // Apply tag filter
        if (this.currentFilter && this.currentFilter !== 'all') {
            projects = projects.filter(project =>
                project.tags.includes(this.currentFilter)
            );
        }

        // Apply search filter
        if (this.searchTerm) {
            projects = projects.filter(project =>
                project.title.toLowerCase().includes(this.searchTerm) ||
                project.description.toLowerCase().includes(this.searchTerm) ||
                project.client?.toLowerCase().includes(this.searchTerm) ||
                project.tags.some(tag => tag.toLowerCase().includes(this.searchTerm))
            );
        }

        // Apply sorting
        projects = this.sortProjects(projects);

        // Update filtered projects
        window.portfolioApp.filteredProjects = projects;
        window.portfolioApp.renderPortfolio();

        // Track filtering for analytics
        this.trackFiltering();
    }

    sortProjects(projects) {
        switch (this.sortBy) {
            case 'recent':
                return projects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
            case 'oldest':
                return projects.sort((a, b) => parseInt(a.year) - parseInt(b.year));
            case 'alphabetical':
                return projects.sort((a, b) => a.title.localeCompare(b.title));
            case 'duration':
                return projects.sort((a, b) => {
                    const aDuration = this.durationToSeconds(a.duration);
                    const bDuration = this.durationToSeconds(b.duration);
                    return aDuration - bDuration;
                });
            default:
                return projects;
        }
    }

    durationToSeconds(duration) {
        const parts = duration.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    updateViewMode() {
        const portfolioGrid = document.getElementById('portfolioGrid');
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');

        if (portfolioGrid) {
            portfolioGrid.className = `portfolio-grid portfolio-grid--${this.viewMode}`;
        }

        if (gridBtn && listBtn) {
            gridBtn.classList.toggle('active', this.viewMode === 'grid');
            listBtn.classList.toggle('active', this.viewMode === 'list');
        }
    }

    updateURL() {
        const params = new URLSearchParams();

        if (this.currentFilter && this.currentFilter !== 'all') {
            params.set('filter', this.currentFilter);
        }

        if (this.searchTerm) {
            params.set('search', this.searchTerm);
        }

        if (this.sortBy !== 'recent') {
            params.set('sort', this.sortBy);
        }

        const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState({}, '', newURL);
    }

    loadFromURL() {
        const params = new URLSearchParams(window.location.search);

        const filter = params.get('filter');
        const search = params.get('search');
        const sort = params.get('sort');

        if (filter) {
            this.currentFilter = filter;
            const filterSelect = document.getElementById('tagFilter');
            if (filterSelect) {
                filterSelect.value = filter;
            }
        }

        if (search) {
            this.searchTerm = search;
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = search;
            }
        }

        if (sort) {
            this.sortBy = sort;
            const sortSelect = document.getElementById('sortSelect');
            if (sortSelect) {
                sortSelect.value = sort;
            }
        }

        // Apply filters after setting values
        setTimeout(() => this.applyFilters(), 100);
    }

    setupLazyLoading() {
        // Intersection Observer for lazy loading images
        const imageOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.01
        };

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Load image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }

                    // Add fade-in effect
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });

                    observer.unobserve(img);
                }
            });
        }, imageOptions);

        // Observe all images with data-src attribute
        const observeImages = () => {
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        };

        // Initial observation
        observeImages();

        // Re-observe after filtering
        const originalRender = window.portfolioApp.renderPortfolio.bind(window.portfolioApp);
        window.portfolioApp.renderPortfolio = function() {
            originalRender();
            setTimeout(observeImages, 100);
        };
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Global shortcuts
            switch (e.key) {
                case '/':
                    e.preventDefault();
                    document.getElementById('searchInput')?.focus();
                    break;
                case 'f':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        document.getElementById('searchInput')?.focus();
                    }
                    break;
                case 'Escape':
                    if (window.portfolioApp.isModalOpen) {
                        window.portfolioApp.closeModal();
                    } else {
                        // Clear search
                        const searchInput = document.getElementById('searchInput');
                        if (searchInput && searchInput.value) {
                            searchInput.value = '';
                            this.searchTerm = '';
                            this.applyFilters();
                            this.updateURL();
                        }
                    }
                    break;
            }
        });
    }

    setupAnalytics() {
        // Track project views
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.featured-project, .portfolio-project');
            if (projectCard) {
                const projectId = projectCard.dataset.projectId;
                this.trackProjectView(projectId);
            }
        });

        // Track filter usage
        document.getElementById('tagFilter')?.addEventListener('change', (e) => {
            this.trackFilterUsage(e.target.value);
        });

        // Track search usage
        let searchTimeout;
        document.getElementById('searchInput')?.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.trackSearchUsage(this.searchTerm);
            }, 1000);
        });
    }

    trackProjectView(projectId) {
        // This would integrate with Google Analytics or other analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'project_view', {
                'project_id': projectId,
                'page_title': document.title
            });
        }

        console.log('Project viewed:', projectId);
    }

    trackFilterUsage(filter) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'filter_usage', {
                'filter_value': filter
            });
        }

        console.log('Filter used:', filter);
    }

    trackSearchUsage(searchTerm) {
        if (typeof gtag !== 'undefined' && searchTerm) {
            gtag('event', 'search', {
                'search_term': searchTerm
            });
        }

        console.log('Search performed:', searchTerm);
    }

    trackFiltering() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'portfolio_filter', {
                'filter_count': window.portfolioApp.filteredProjects.length,
                'total_count': window.portfolioApp.projects.length
            });
        }
    }

    // Utility method to create share URLs
    createShareUrl(projectId) {
        const project = window.portfolioApp.projects.find(p => p.id === projectId);
        if (!project) return '';

        const url = `${window.location.origin}${window.location.pathname}#project=${projectId}`;
        const text = `Check out "${project.title}" - ${project.description}`;

        return { url, text };
    }

    // Method to export portfolio data (for backup/migration)
    exportPortfolioData() {
        const dataStr = JSON.stringify({
            projects: window.portfolioApp.projects,
            settings: window.portfolioApp.siteSettings,
            exportDate: new Date().toISOString()
        }, null, 2);

        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'portfolio-backup.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Initialize portfolio manager
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();

    // Load filters from URL after a short delay
    setTimeout(() => {
        window.portfolioManager.loadFromURL();
    }, 500);
});

// Handle direct project links from URL hash
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#project=')) {
        const projectId = hash.substring(9);
        setTimeout(() => {
            if (window.portfolioApp) {
                window.portfolioApp.openModal(projectId);
            }
        }, 1000);
    }
});

// Performance monitoring
if (window.performance && window.performance.navigation) {
    const navigationType = window.performance.navigation.type;
    if (navigationType === 1) { // Page was refreshed
        console.log('Page was refreshed');
        // You could add analytics tracking here
    }
}