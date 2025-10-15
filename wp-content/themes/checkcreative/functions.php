<?php

/**
 * Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 * @package checkcreative
 */

// -----------------------------------------------------------------------------
// Constantes del tema
// -----------------------------------------------------------------------------
if (! defined('CHECKCREATIVE_PATH')) {
	define('CHECKCREATIVE_PATH', get_template_directory());
}
if (! defined('CHECKCREATIVE_URI')) {
	define('CHECKCREATIVE_URI', get_template_directory_uri());
}
if (! defined('CHECKCREATIVE_VERSION')) {
	$theme = wp_get_theme();
	define('CHECKCREATIVE_VERSION', $theme->get('Version') ?: '1.0.0');
}

// -----------------------------------------------------------------------------
// Soporte del tema + Menús
// -----------------------------------------------------------------------------
function checkcreative_setup()
{

	// Carga de textos
	load_theme_textdomain('checkcreative', CHECKCREATIVE_PATH . '/languages');

	// Título del documento gestionado por WP
	add_theme_support('title-tag');

	// Imágenes destacadas
	add_theme_support('post-thumbnails');

	// HTML5 en salidas comunes
	add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));

	// Alineaciones anchas en editor
	add_theme_support('align-wide');

	// Menús
	register_nav_menus(array(
		'menu-izquierda' => esc_html__('Menú izquierdo', 'checkcreative'),
		'menu-derecha'   => esc_html__('Menú derecho', 'checkcreative'),
		'menu-footer'    => esc_html__('Menú footer', 'checkcreative'),
	));
}
add_action('after_setup_theme', 'checkcreative_setup');

// -----------------------------------------------------------------------------
// Content width (opcional, útil para embeds)
// -----------------------------------------------------------------------------
function checkcreative_content_width()
{
	$GLOBALS['content_width'] = apply_filters('checkcreative_content_width', 1200);
}
add_action('after_setup_theme', 'checkcreative_content_width', 0);

// -----------------------------------------------------------------------------
// Includes del tema (sin AJAX)
// -----------------------------------------------------------------------------
/**
 * Usa require_once solo si el archivo existe.
 */
function checkcreative_require($relative_path)
{
	$path = CHECKCREATIVE_PATH . $relative_path;
	if (file_exists($path)) {
		require_once $path;
	}
}

// Encolado de assets (mantenido en un archivo separado para claridad)
checkcreative_require('/inc/template-enqueued.php');

// Funciones helpers del tema
checkcreative_require('/inc/template-functions.php');

// Jetpack (si está activo)
if (defined('JETPACK__VERSION')) {
	checkcreative_require('/inc/jetpack.php');
}

// ACF y config personalizada
checkcreative_require('/inc/acf-config.php');
checkcreative_require('/inc/custom-config.php');

// CPTs y taxonomías
checkcreative_require('/inc/custom-post-taxonomy.php');

// Navegación
checkcreative_require('/inc/navs/custom-nav-walker.php');
checkcreative_require('/inc/navs/custom-nav-menu.php');

// GTM / scripts de cabecera personalizados
checkcreative_require('/inc/gtm-functions.php');

// -----------------------------------------------------------------------------
// Utilidades de depuración
// -----------------------------------------------------------------------------
if (! function_exists('dump')) {
	function dump($data)
	{
		echo '<pre class="text-white bg-black w-max fs-7 py-5" style="white-space:pre-wrap;">';
		var_dump($data);
		echo '</pre>';
	}
}
