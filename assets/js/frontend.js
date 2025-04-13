document.addEventListener('DOMContentLoaded', function() {
    initAllCarousels();
    document.addEventListener('ajaxComplete', initAllCarousels);
});

function initAllCarousels() {
    const carousels = document.querySelectorAll('.pc-carousel-wrapper:not(.initialized)');
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

class ProductCarousel {
    constructor(wrapper) {
        this.wrapper = wrapper;
        this.container = wrapper.querySelector('.pc-carousel-container');
        this.slides = Array.from(this.container.children);
        this.currentIndex = 0;
        this.isMobile = window.innerWidth < 768;
        
        // Get settings from data attributes
        this.settings = {
            desktopCols: parseInt(wrapper.dataset.columns) || 5,
            visibleItems: this.isMobile ? 2 : parseInt(wrapper.dataset.columns) || 5
        };

        this.init();
    }

    init() {
        this.setupCarousel();
        this.setupNavigation();
        this.bindEvents();
        this.updateSlideVisibility();
    }

    setupCarousel() {
        if (this.isMobile) {
            this.wrapper.classList.add('pc-carousel-mode');
            this.wrapper.classList.remove('pc-grid-mode');
        } else {
            this.wrapper.classList.add('pc-grid-mode');
            this.wrapper.classList.remove('pc-carousel-mode');
            
            // Set initial transform
            this.container.style.transform = 'translateX(0)';
        }

        // Calculate item width
        const gap = 20;
        const containerWidth = this.wrapper.offsetWidth;
        const itemWidth = (containerWidth - (gap * (this.settings.visibleItems - 1))) / this.settings.visibleItems;

        this.slides.forEach(slide => {
            slide.style.flex = `0 0 ${itemWidth}px`;
            slide.style.maxWidth = `${itemWidth}px`;
        });
    }

    setupNavigation() {
        // Create navigation buttons
        const prevBtn = this.wrapper.querySelector('.pc-carousel-prev') || this.createNavButton('prev');
        const nextBtn = this.wrapper.querySelector('.pc-carousel-next') || this.createNavButton('next');
        
        prevBtn.addEventListener('click', () => this.navigate(-1));
        nextBtn.addEventListener('click', () => this.navigate(1));

        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
    }

    createNavButton(direction) {
        const btn = document.createElement('button');
        btn.className = `pc-carousel-${direction}`;
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="${direction === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}"/>
        </svg>`;
        this.wrapper.appendChild(btn);
        return btn;
    }

    bindEvents() {
    window.addEventListener('resize', () => {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;
        
        if (wasMobile !== this.isMobile) {
            this.currentIndex = 0;
            this.settings.visibleItems = this.isMobile ? 2 : parseInt(this.wrapper.dataset.columns) || 5;
            this.setupCarousel();
            this.updateSlideVisibility();
            this.container.style.transform = 'translateX(0)';
        } else if (!this.isMobile) {
            // Recalculate item widths on desktop resize
            this.setupCarousel();
        }
    });
}

    navigate(direction) {
    if (this.isMobile) return;

    const totalSlides = this.slides.length;
    const maxIndex = Math.max(0, Math.ceil(totalSlides / this.settings.visibleItems) - 1);
    
    this.currentIndex = Math.max(0, Math.min(this.currentIndex + direction, maxIndex));
    
    // Use wrapper's width as the move amount
    const translateX = -(this.currentIndex * this.wrapper.offsetWidth);
    
    this.container.style.transform = `translateX(${translateX}px)`;
    this.updateSlideVisibility();
}

    updateSlideVisibility() {
        if (this.isMobile) {
            this.prevBtn.style.display = 'none';
            this.nextBtn.style.display = 'none';
            return;
        }

        const totalSlides = this.slides.length;
        const maxIndex = Math.max(0, Math.ceil(totalSlides / this.settings.visibleItems) - 1);

        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= maxIndex;

        this.prevBtn.style.display = 'flex';
        this.nextBtn.style.display = 'flex';
    }
}

function fallbackToGrid(carousel) {
    const container = carousel.querySelector('.pc-carousel-container');
    if (container) {
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        container.style.gap = '20px';
    }

    // Hide navigation
    const nav = carousel.querySelectorAll('.pc-carousel-prev, .pc-carousel-next');
    nav.forEach(btn => btn.style.display = 'none');
}
