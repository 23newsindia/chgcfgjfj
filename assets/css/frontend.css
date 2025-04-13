/* Base Carousel Styles */
.pc-carousel-wrapper {
    position: relative;
    width: 100%;
    margin: 0 auto;
    padding: 0;
}

.pc-carousel-container {
    display: flex;
    width: 100%;
    transition: transform 0.5s ease;
    will-change: transform;
    gap: 20px;
}

/* Desktop Grid Mode c*/
@media (min-width: 768px) {
    .pc-grid-mode .pc-carousel-container {
        display: flex;
        flex-wrap: nowrap;
        gap: 20px;
        overflow: hidden;
    }

    .pc-grid-mode .product-item {
        flex: 0 0 calc(20% - 16px); /* 5 items per row with gap */
        max-width: calc(20% - 16px);
        transition: transform 0.3s ease;
    }
}

/* Mobile Carousel Mode */
@media (max-width: 767px) {
    .pc-carousel-mode .pc-carousel-container {
        flex-wrap: nowrap;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        padding-bottom: 10px;
    }

    .pc-carousel-mode .pc-carousel-container::-webkit-scrollbar {
        display: none;
    }

    .pc-carousel-mode .product-item {
        flex: 0 0 calc(50% - 10px);
        scroll-snap-align: start;
    }
}

/* Product Card Styles */
.product-item {
    position: relative;
    margin-bottom: 30px;
    cursor: pointer;
}

.product-img-wrap {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.product-img-wrap img {
    width: 100%;
    height: auto;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-img-wrap:hover img {
    transform: scale(1.01);
}

/* Top Badge */
.top-badge {
    position: absolute;
    top: 0;
    left: 0;
    padding: 4px 8px;
    background: #fff;
    font-size: 8px;
    font-weight: 600;
    color: #000;
    max-width: 90%;
    z-index: 1;
}

/* Rating Badge */
.rating-badge {
    position: absolute;
    bottom: 12px;
    left: 8px;
    padding: 4px 8px;
    background: #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 3px;
}

.star-wrapper {
    display: flex;
    align-items: center;
    gap: 2px;
}

.rating-value {
    font-size: 11px;
    font-weight: 700;
}

.rating-tag {
    font-size: 11px;
    font-weight: 700;
}

/* Product Info */
.product-info {
    padding: 8px 0;
    min-height: 82px;
}

.brand-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.brand-name {
    font-weight: 600;
    color: #737e93;
    text-transform: capitalize;
    font-size: 12px;
}

.product-title {
    font-size: 11px;
    font-weight: 600;
    color: #2d2d2d;
    margin: 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.price-container {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 6px;
}

.current-price {
    font-size: 14px;
    font-weight: 600;
}

.original-price {
    font-size: 12px;
    text-decoration: line-through;
    color: #949494;
}

.discount {
    color: #00b852;
    font-size: 11px;
}

.fabric-tag {
    font-size: 11px;
    color: #737e93;
    margin-top: 4px;
}

/* Navigation Buttons */
.pc-carousel-prev,
.pc-carousel-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 47px;
    height: 47px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    border-image: linear-gradient(#f4f4f4 0%, rgba(181,181,181,0) 100%) 1;
    cursor: pointer;
    z-index: 10;
    transition: opacity 0.3s ease;
}

.pc-carousel-prev:disabled,
.pc-carousel-next:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pc-carousel-prev {
    left: 20px;
}

.pc-carousel-next {
    right: 20px;
}

.pc-carousel-prev svg,
.pc-carousel-next svg {
    width: 20px;
    height: 20px;
}

/* Hide navigation on mobile */
@media (max-width: 767px) {
    .pc-carousel-prev,
    .pc-carousel-next {
        display: none;
    }
}

/* Wishlist Button */
.wishlist-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}

.wishlist-btn svg {
    width: 16px;
    height: 16px;
    color: #000;
}

/* Dots Navigation */
.pc-carousel-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
}

.pc-carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e5e7eb;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.pc-carousel-dot.active {
    background: #292D35;
}

/* Hide scrollbar */
.pc-carousel-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.pc-carousel-container::-webkit-scrollbar {
    display: none;
}
