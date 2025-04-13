<?php
class PC_Shortcode {
    public function __construct() {
        add_shortcode('product_carousel', [$this, 'render_carousel']);
        add_action('wp_ajax_pc_load_carousel', [$this, 'ajax_load_carousel']);
        add_action('wp_ajax_nopriv_pc_load_carousel', [$this, 'ajax_load_carousel']);
    }

    public function render_carousel($atts) {
        $atts = shortcode_atts(['slug' => ''], $atts);
        
        // For AJAX loading, return empty container
        if (wp_doing_ajax()) {
            return '<div class="pc-carousel-wrapper" data-slug="' . esc_attr($atts['slug']) . '"></div>';
        }
        
        return $this->get_carousel_html($atts['slug']);
    }

    public function ajax_load_carousel() {
        check_ajax_referer('pc_ajax_nonce', 'nonce');
        
        if (empty($_POST['slug'])) {
            wp_send_json_error('No slug provided');
        }
        
        wp_send_json_success([
            'html' => $this->get_carousel_html(sanitize_text_field($_POST['slug']))
        ]);
    }

    protected function get_carousel_html($slug) {
        if (empty($slug)) {
            error_log('Carousel Error: No slug provided');
            return '<!-- Carousel Error: No slug provided -->';
        }
        
        $carousel = PC_DB::get_carousel($slug);
        if (!$carousel) {
            error_log('Carousel Error: Carousel not found for slug: ' . $slug);
            return '<!-- Carousel Error: Carousel not found -->';
        }
        
        $settings = json_decode($carousel->settings, true);
        
        if (!function_exists('wc_get_products')) {
            error_log('WooCommerce function wc_get_products() not available');
            return '<!-- WooCommerce not functioning properly -->';
        }

        $args = [
            'status' => 'publish',
            'limit' => $settings['products_per_page'],
            'return' => 'objects'
        ];

        if (!empty($settings['category'])) {
            $args['tax_query'] = [
                [
                    'taxonomy' => 'product_cat',
                    'field' => 'term_id', 
                    'terms' => [$settings['category']]
                ]
            ];
        }

        switch ($settings['order_by']) {
            case 'popular':
                $args['orderby'] = 'meta_value_num';
                $args['meta_key'] = 'total_sales';
                break;
            case 'latest':
                $args['orderby'] = 'date';
                $args['order'] = 'DESC';
                break;
            case 'rating':
                $args['orderby'] = 'meta_value_num';
                $args['meta_key'] = '_wc_average_rating';
                $args['order'] = 'DESC';
                break;
            case 'price_low':
                $args['orderby'] = 'meta_value_num';
                $args['meta_key'] = '_price';
                $args['order'] = 'ASC';
                break;
            case 'price_high':
                $args['orderby'] = 'meta_value_num';
                $args['meta_key'] = '_price';
                $args['order'] = 'DESC';
                break;
            default:
                $args['orderby'] = 'menu_order title';
        }

        try {
            $products = wc_get_products($args);
            
            if (empty($products)) {
                return '<!-- No products found -->';
            }
            
            ob_start();
            ?>
            <div class="pc-carousel-wrapper"
                 data-slug="<?php echo esc_attr($slug); ?>"
                 data-columns="<?php echo esc_attr($settings['desktop_columns']); ?>"
                 data-mobile-columns="<?php echo esc_attr($settings['mobile_columns']); ?>"
                 data-visible-mobile="<?php echo esc_attr($settings['visible_mobile']); ?>">
                
                <div class="pc-carousel-container">
                    <?php foreach ($products as $product) : ?>
                        <?php echo $this->render_product($product); ?>
                    <?php endforeach; ?>
                </div>
                
                <button class="pc-carousel-prev" aria-label="<?php esc_attr_e('Previous', 'product-carousel'); ?>">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                <button class="pc-carousel-next" aria-label="<?php esc_attr_e('Next', 'product-carousel'); ?>">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
                
                <div class="pc-carousel-dots"></div>
            </div>
            <?php
            return ob_get_clean();
            
        } catch (Exception $e) {
            error_log('Exception getting products: ' . $e->getMessage());
            return '<!-- Error loading products -->';
        }
    }

    protected function render_product($product) {
        if (!is_a($product, 'WC_Product')) {
            return '';
        }

        $product_fit = get_post_meta($product->get_id(), '_product_fit', true) ?: '';
        $fabric_type = get_post_meta($product->get_id(), '_fabric_type', true) ?: '100% COTTON';
        $product_rating = $product->get_average_rating();
        $product_tag = get_post_meta($product->get_id(), '_product_tag', true) ?: 'BEWAKOOF BIRTHDAY BASH';
        $product_categories = wc_get_product_category_list($product->get_id(), ', ', '<span class="brand-name">', '</span>');
        
        ob_start();
        ?>
        <div <?php wc_product_class('product-item', $product); ?>>
            <div class="product-img-wrap">
                <?php if ($product->is_on_sale()) : ?>
                    <div class="top-badge">BUY 2 FOR 999</div>
                <?php endif; ?>

                <a href="<?php echo esc_url($product->get_permalink()); ?>" class="product-link">
                    <?php echo $product->get_image('woocommerce_thumbnail', ['class' => 'product-img', 'loading' => 'lazy']); ?>
                    
                    <?php if ($product_rating > 0) : ?>
                        <div class="rating-badge">
                            <div class="rating-inner">
                                <div class="star-wrapper">
                                    <div class="star-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                                            <path fill="currentColor" d="M5.58 1.15a.5.5 0 0 1 .84 0l1.528 2.363a.5.5 0 0 0 .291.212l2.72.722a.5.5 0 0 1 .26.799L9.442 7.429a.5.5 0 0 0-.111.343l.153 2.81a.5.5 0 0 1-.68.493L6.18 10.063a.5.5 0 0 0-.36 0l-2.625 1.014a.5.5 0 0 1-.68-.494l.153-2.81a.5.5 0 0 0-.11-.343L.781 5.246a.5.5 0 0 1 .26-.799l2.719-.722a.5.5 0 0 0 .291-.212L5.58 1.149Z"/>
                                        </svg>
                                    </div>
                                    <span class="rating-value"><?php echo number_format($product_rating, 1); ?></span>
                                </div>
                                <span class="rating-tag"><?php echo esc_html($product_tag); ?></span>
                            </div>
                        </div>
                    <?php endif; ?>
                </a>
            </div>

            <div class="product-info">
                <div class="product-info-container">
                    <div class="brand-row">
                        <?php echo $product_categories; ?>
                        <button class="wishlist-btn" aria-label="<?php esc_attr_e('Add to wishlist', 'product-carousel'); ?>">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 18">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 16.561S1.5 11.753 1.5 5.915c0-1.033.354-2.033 1.002-2.83a4.412 4.412 0 0 1 2.551-1.548 4.381 4.381 0 0 1 2.944.437A4.449 4.449 0 0 1 10 4.197a4.449 4.449 0 0 1 2.002-2.223 4.381 4.381 0 0 1 2.945-.437 4.412 4.412 0 0 1 2.551 1.547 4.492 4.492 0 0 1 1.002 2.83c0 5.839-8.5 10.647-8.5 10.647Z"/>
                            </svg>
                        </button>
                    </div>

                    <h2 class="product-title">
                        <a href="<?php echo esc_url($product->get_permalink()); ?>">
                            <?php echo esc_html($product->get_name()); ?>
                        </a>
                    </h2>

                    <div class="price-container">
                        <span class="current-price">₹<?php echo $product->get_price(); ?></span>
                        <?php if ($product->get_regular_price() > $product->get_price()) : ?>
                            <span class="original-price">₹<?php echo $product->get_regular_price(); ?></span>
                            <span class="discount"><?php echo round((($product->get_regular_price() - $product->get_price()) / $product->get_regular_price()) * 100); ?>% off</span>
                        <?php endif; ?>
                    </div>

                    <?php if ($fabric_type) : ?>
                        <div class="fabric-tag"><?php echo esc_html($fabric_type); ?></div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}