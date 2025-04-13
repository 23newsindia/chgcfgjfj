document.addEventListener('DOMContentLoaded', function() {
    // Initialize immediately if DOM ready
    if (document.readyState === 'complete') {
        initAllCarousels();
    } 
    // Also initialize when full DOM loads
    else {
        initAllCarousels();
    }

    // Re-init for AJAX loaded content
    document.addEventListener('ajaxComplete', initAllCarousels);
});

function initAllCarousels() {
    const carousels = document.querySelectorAll('.pc-carousel-wrapper:not(.initialized)');
    
    if (carousels.length === 0) return;

    carousels.forEach(carousel => {
        try {
            new ProductCarousel(carousel);
            carousel.classList.add('initialized');
        } catch (error) {
            console.error('Carousel init error:', error);
            fallbackToGrid(carousel);
        }
    });
}

function fallbackToGrid(carousel) {
    const container = carousel.querySelector('.pc-carousel-container');
    if (container) {
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        container.style.gap = '16px';
    }
    
    // Hide navigation elements
    ['.pc-carousel-prev', '.pc-carousel-next', '.pc-carousel-dots'].forEach(selector => {
        const el = carousel.querySelector(selector);
        if (el) el.style.display = 'none';
    });
}

class ProductCarousel {
    constructor(wrapper) {
        this.wrapper = wrapper;
        this.container = this.wrapper.querySelector('.pc-carousel-container');
        this.items = Array.from(this.wrapper.querySelectorAll('.product-item'));
        
        if (!this.container || this.items.length === 0) {
            throw new Error('Missing required carousel elements');
        }

        this.settings = {
            desktopCols: parseInt(this.wrapper.dataset.columns) || 4,
            mobileCols: parseInt(this.wrapper.dataset.mobileColumns) || 2,
            visibleMobile: parseInt(this.wrapper.dataset.visibleMobile) || 2
        };

        this.currentIndex = 0;
        this.isMobile = window.innerWidth <= 767;
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupCarousel();
    }

    setupElements() {
        // Navigation buttons
        this.prevBtn = this.wrapper.querySelector('.pc-carousel-prev');
        this.nextBtn = this.wrapper.querySelector('.pc-carousel-next');
        this.dotsContainer = this.wrapper.querySelector('.pc-carousel-dots');
        
        // Style the container
        this.container.style.overflow = 'hidden';
        this.container.style.position = 'relative';
    }

    setupEventListeners() {
        // Navigation
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
        
        // Responsive
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                const newIsMobile = window.innerWidth <= 767;
                if (newIsMobile !== this.isMobile) {
                    this.isMobile = newIsMobile;
                    this.setupCarousel();
                }
            }, 250);
        });
    }

    setupCarousel() {
        if (this.isMobile) {
            this.setupMobileCarousel();
        } else {
            this.setupDesktopGrid();
        }
        this.updateNavigation();
    }

    setupMobileCarousel() {
        // Clear existing
        this.container.innerHTML = '';
        this.container.style.display = 'flex';
        this.container.style.flexWrap = 'nowrap';
        this.container.style.gap = '16px';
        this.container.style.scrollSnapType = 'x mandatory';
        this.container.style.overflowX = 'auto';
        this.container.style.scrollBehavior = 'smooth';
        
        // Group items into slides
        const slides = [];
        const itemsPerSlide = this.settings.visibleMobile;
        
        for (let i = 0; i < this.items.length; i += itemsPerSlide) {
            const slideItems = this.items.slice(i, i + itemsPerSlide);
            slides.push(slideItems);
        }
        
        // Create slides
        slides.forEach((slideItems, index) => {
            const slide = document.createElement('div');
            slide.className = 'pc-carousel-slide';
            slide.style.flex = '0 0 100%';
            slide.style.scrollSnapAlign = 'start';
            slide.style.display = 'flex';
            slide.style.gap = '16px';
            slide.style.padding = '0 8px';
            slide.style.boxSizing = 'border-box';
            
            slideItems.forEach(item => {
                const clone = item.cloneNode(true);
                clone.style.width = `calc(${100 / this.settings.mobileCols}% - 8px)`;
                clone.style.minWidth = `calc(${100 / this.settings.mobileCols}% - 8px)`;
                slide.appendChild(clone);
            });
            
            this.container.appendChild(slide);
        });
        
        this.slides = slides;
        this.createDots();
    }

    setupDesktopGrid() {
        this.container.innerHTML = '';
        this.container.style.display = 'grid';
        this.container.style.gridTemplateColumns = `repeat(${this.settings.desktopCols}, 1fr)`;
        this.container.style.gap = '16px';
        this.container.style.overflowX = 'visible';
        
        this.items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.style.width = '';
            clone.style.minWidth = '';
            this.container.appendChild(clone);
        });
        
        if (this.dotsContainer) {
            this.dotsContainer.innerHTML = '';
        }
    }

    createDots() {
        if (!this.dotsContainer || !this.slides) return;
        
        this.dotsContainer.innerHTML = '';
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'pc-carousel-dot';
            dot.dataset.index = index;
            dot.innerHTML = `<span class="screen-reader-text">Slide ${index + 1}</span>`;
            
            // Basic dot styling
            dot.style.width = '10px';
            dot.style.height = '10px';
            dot.style.borderRadius = '50%';
            dot.style.border = 'none';
            dot.style.padding = '0';
            dot.style.cursor = 'pointer';
            dot.style.backgroundColor = index === this.currentIndex ? '#292D35' : '#e5e7eb';
            
            dot.addEventListener('click', () => this.goTo(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    updateNavigation() {
        if (!this.isMobile || !this.slides || this.slides.length <= 1) {
            if (this.prevBtn) this.prevBtn.style.display = 'none';
            if (this.nextBtn) this.nextBtn.style.display = 'none';
            return;
        }
        
        if (this.prevBtn) {
            this.prevBtn.style.display = 'flex';
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        
        if (this.nextBtn) {
            this.nextBtn.style.display = 'flex';
            this.nextBtn.disabled = this.currentIndex >= this.slides.length - 1;
        }
    }

    goTo(index) {
        if (!this.isMobile || !this.slides) return;
        
        this.currentIndex = Math.max(0, Math.min(index, this.slides.length - 1));
        
        const slideWidth = this.container.offsetWidth;
        this.container.scrollTo({
            left: slideWidth * this.currentIndex,
            behavior: 'smooth'
        });
        
        this.updateDots();
        this.updateNavigation();
    }

    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.pc-carousel-dot');
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === this.currentIndex ? '#292D35' : '#e5e7eb';
        });
    }

    next() {
        this.goTo(this.currentIndex + 1);
    }

    prev() {
        this.goTo(this.currentIndex - 1);
    }
}