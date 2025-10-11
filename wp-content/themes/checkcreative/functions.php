<?php

/**
 * checkcreative functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package checkcreative
 */

if (! defined('_S_VERSION')) {
	// Replace the version number of the theme on each release.
	define('_S_VERSION', '1.0.0');
}

/**
 * Configura los valores predeterminados del tema y registra la compatibilidad con varias funciones de WordPress.
 * Tenga en cuenta que esta función está enlazada con el gancho after_setup_theme, que
 * se ejecuta antes del gancho de inicio. El gancho de inicio es demasiado tarde para algunas funciones, como
 * para la indicación de soporte para miniaturas de publicaciones.
 */
function checkcreative_setup()
{
	add_theme_support('woocommerce');
	remove_all_actions('woocommerce_before_cart');
	remove_all_actions('woocommerce_before_checkout_form');
	remove_all_actions('woocommerce_before_single_product');

	remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20);
	remove_action('woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10);
	remove_action('woocommerce_before_main_content', 'woocommerce_output_all_notices', 10);

	/**
	 * Deje que WordPress administre el título del documento.
	 * Al agregar compatibilidad con temas, declaramos que este tema no utiliza un
	 * etiqueta <título> codificada de forma rígida en el encabezado del documento, y espera que WordPress
	 * proporcionarlo para nosotros.
	 */
	add_theme_support('title-tag');

	/**
	 * Habilite el soporte para Publicar miniaturas en publicaciones y páginas.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support('post-thumbnails');

	/**
	 * Menús que se van a usar en este theme
	 */
	register_nav_menus(
		array(
			'menu-izquierda' => esc_html__('Menú izquierdo', 'checkcreative'),
			'menu-derecha'   => esc_html__('Menú derecho', 'checkcreative'),
			'menu-footer'    => esc_html__('Footer', 'checkcreative'),
		)
	);
}

add_action('after_setup_theme', 'checkcreative_setup');

/**
 * Encolar scripts y estilos.
 */
require get_template_directory() . '/inc/template-enqueued.php';
require get_template_directory() . '/inc/template-functions.php';

if (defined('JETPACK__VERSION')) {
	require get_template_directory() . '/inc/jetpack.php';
}

require get_template_directory() . '/inc/acf-config.php';
require get_template_directory() . '/inc/custom-config.php';
require get_template_directory() . '/inc/custom-post-taxonomy.php';
require get_template_directory() . '/inc/ajax/ajax-config.php';
require get_template_directory() . '/inc/navs/custom-nav-walker.php';
require get_template_directory() . '/inc/navs/custom-nav-menu.php';
require get_template_directory() . '/inc/gtm-functions.php';

function dump($data)
{
	echo '<pre class="text-white bg-black w-max fs-7 py-5">';
	var_dump($data);
	echo '</pre>';
}

/**
 * Devuelve un array con todos los datos de cerveza de un producto.
 *
 * @param int|null $product_id  ID del producto (por defecto, el post actual).
 * @return array<string, mixed>
 */
function checkcreative_get_beer_data($product_id = null)
{
	$product_id = $product_id ?: get_the_ID();  // Usa el post actual si no se pasa ID

	// Todas tus keys ACF ↓
	$keys = [
		'post_type_productos_nombre',
		'post_type_productos_alcohol',
		'post_type_productos_tamano',
		'post_type_productos_descripcion',
		'post_type_productos_ingredientes',
		'post_type_productos_temperatura',
		'post_type_productos_calorias',
		'post_type_productos_ebc',
		'post_type_productos_ibu',
		'post_type_productos_fondo',
		'post_type_productos_ritmo',
		'post_type_productos_formatos_repeater',
	];

	$data = [];
	foreach ($keys as $key) {
		$data[$key] = get_field($key, $product_id);
	}

	$data['permalink'] = get_permalink($product_id);

	return $data;
}

/**
 * Filtros y botón de ver más en ajax
 */
require get_template_directory() . '/inc/ajax/ajax-blog.php';
require get_template_directory() . '/inc/ajax/ajax-woocommerce.php';
require get_template_directory() . '/inc/ajax/ajax-newsletter.php';


// Enqueue javascript file
add_action('wp_enqueue_scripts', 'checkcreative_insert_custom_js');
function checkcreative_insert_custom_js()
{
	wp_localize_script(
		'checkcreative-js',
		'checkcreative_ajax',
		[
			'ajaxUrl'  => admin_url('admin-ajax.php'),
			'nonce' => wp_create_nonce('checkcreative_update_cart'),
		]
	);
}
