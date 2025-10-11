<?php add_action('wp_ajax_load_filtered_products', 'load_filtered_products_callback');
add_action('wp_ajax_nopriv_load_filtered_products', 'load_filtered_products_callback');

function load_filtered_products_callback()
{
	$category = isset($_POST['category']) ? sanitize_text_field($_POST['category']) : '';

	$args = [
		'post_type'      => 'product',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
	];

	if (!empty($category) && $category !== 'todos-los-productos') {
		$args['tax_query'] = [[
			'taxonomy' => 'product_cat',
			'field'    => 'slug',
			'terms'    => $category,
		]];
	}

	$query = new WP_Query($args);

	ob_start();

	if ($query->have_posts()) {
		echo '<div class="row">';
		while ($query->have_posts()) {
			$query->the_post();
			echo '<div class="col-md-6 col-lg-4 col-12 py-2">';
			wc_get_template_part('content', 'product-card');
			echo '</div>';
		}
		echo '</div>';
	} else {
		echo '<p>No hay productos en esta categoría.</p>';
	}

	wp_reset_postdata();

	$html = trim(ob_get_clean());

	echo json_encode([
		'html'  => $html,
		'empty' => empty($html),
	]);

	wp_die();
}

add_action('wp_ajax_checkcreative_update_qty',        'checkcreative_update_qty');
add_action('wp_ajax_nopriv_checkcreative_update_qty', 'checkcreative_update_qty');

function checkcreative_update_qty()
{
	check_ajax_referer('checkcreative_update_cart', 'security');

	$key = wc_clean(wp_unslash($_POST['key'] ?? ''));
	$q   = max(0, intval($_POST['qty'] ?? 0));

	if ($key && isset(WC()->cart->get_cart()[$key])) {
		WC()->cart->set_quantity($key, $q, true);
	}

	$fragments = [];

	/* subtotal de la línea */
	if ($item = WC()->cart->get_cart()[$key] ?? null) {
		$prod                 = $item['data'];
		$fragments['#subtotal-' . $key] =
			WC()->cart->get_product_subtotal($prod, $q);
	}

	/* bloque totales completo */
	ob_start();
	wc_get_template('cart/cart-totals.php');
	$fragments['#cart-totals-wrapper'] = ob_get_clean();
	$fragments['#cart-total-amount'] = wc_price(WC()->cart->get_total('edit'));
	$fragments['#cart-subtotal-amount'] = wc_price(WC()->cart->get_subtotal());
	$fragments['#mini-cart-subtotal'] = wc_price(WC()->cart->get_subtotal());
	wp_send_json_success(['fragments' => $fragments]);
}

// functions.php o plugin
add_action('wp_ajax_checkcreative_remove_from_cart',        'checkcreative_remove_from_cart');
add_action('wp_ajax_nopriv_checkcreative_remove_from_cart', 'checkcreative_remove_from_cart');


function checkcreative_remove_from_cart()
{

	check_ajax_referer('checkcreative_update_cart', 'security');

	$key = wc_clean(wp_unslash($_POST['key'] ?? ''));

	if ($key && isset(WC()->cart->get_cart()[$key])) {
		WC()->cart->remove_cart_item($key);
	}

	$fragments = [];

	/* bloque totales completo */
	ob_start();
	wc_get_template('cart/cart-totals.php');
	$fragments['#cart-totals-wrapper'] = ob_get_clean();
	$fragments['#cart-total-amount'] = wc_price(WC()->cart->get_total('edit'));
	$fragments['#cart-subtotal-amount'] = wc_price(WC()->cart->get_subtotal());
	wp_send_json_success(['fragments' => $fragments]);
}

add_action('wp_ajax_checkcreative_remove_from_mini_cart',        'checkcreative_remove_from_mini_cart');
add_action('wp_ajax_nopriv_checkcreative_remove_from_mini_cart', 'checkcreative_remove_from_mini_cart');

function checkcreative_remove_from_mini_cart()
{

	check_ajax_referer('checkcreative_update_cart', 'security');

	$key = wc_clean(wp_unslash($_POST['key'] ?? ''));

	if ($key && isset(WC()->cart->get_cart()[$key])) {
		WC()->cart->remove_cart_item($key);
	}

	$fragments = [];

	/* bloque totales completo */
	ob_start();
	wc_get_template('cart/mini-cart-items.php');
	$fragments['#mini-cart-items'] = ob_get_clean();
	// $fragments['#cart-total-amount'] = wc_price(WC()->cart->get_total('edit'));
	$fragments['.mc-subtotal-amount'] = wc_price(WC()->cart->get_subtotal());
	// $fragments['.mc-count']
	wp_send_json_success(['fragments' => $fragments]);
}

add_action('wp_ajax_get_mini_cart_fragments_custom', 'get_mini_cart_fragments_custom');
add_action('wp_ajax_nopriv_get_mini_cart_fragments_custom', 'get_mini_cart_fragments_custom');

function get_mini_cart_fragments_custom()
{
	$fragments = [];

	// Fragmento con solo los <li>
	ob_start();
	get_template_part('woocommerce/cart/mini-cart-items');
	$fragments['#mini-cart-items'] = ob_get_clean();

	// Subtotal del carrito
	$fragments['#mini-cart-subtotal'] = WC()->cart->get_cart_subtotal();

	wp_send_json_success(['fragments' => $fragments]);
}

add_action('wp_ajax_get_mini_checkout', 'get_mini_checkout');
add_action('wp_ajax_nopriv_get_mini_checkout', 'get_mini_checkout');

function get_mini_checkout()
{
	// Asegura que WooCommerce esté cargado
	if (!function_exists('wc_get_template')) {
		wp_die('WooCommerce no disponible');
	}

	// Carga solo el contenido del mini checkout
	wc_get_template('checkout/mini-checkout.php');
	wp_die();
}

add_action('wp_ajax_syp_refresh_totals', 'syp_refresh_totals');
add_action('wp_ajax_nopriv_syp_refresh_totals', 'syp_refresh_totals');
function syp_refresh_totals()
{
	if (! WC()->cart) wc_load_cart();

	ob_start();
	wc_cart_totals_subtotal_html();
	$subtotal_html = ob_get_clean();

	ob_start();
	foreach (WC()->cart->get_coupons() as $code => $coupon) {
		echo '<li class="list-group-item d-flex justify-content-between checkcreative-coupon-row">';
		echo '<span>';
		wc_cart_totals_coupon_label($coupon);
		echo '</span>';
		echo '<strong>';
		wc_cart_totals_coupon_html($coupon);
		echo '</strong>';
		echo '</li>';
	}
	$coupons_html = ob_get_clean();

	$shipping_html = '';
	if (WC()->cart->needs_shipping() && WC()->cart->show_shipping()) {
		$shipping_html = WC()->cart->get_cart_shipping_total();
	}

	ob_start();
	wc_cart_totals_order_total_html();
	$total_html = ob_get_clean();

	wp_send_json_success([
		'subtotal' => $subtotal_html,
		'coupons'  => $coupons_html,
		'shipping' => $shipping_html,
		'total'    => $total_html,
	]);
}
