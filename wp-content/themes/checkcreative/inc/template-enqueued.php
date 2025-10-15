<?php

/**
 * Enqueue scripts and styles
 *
 * @package checkcreative
 */

// Encola los estilos y scripts del tema principal
function checkcreative_enqueue_assets()
{

	$theme_uri  = get_template_directory_uri();
	$theme_path = get_template_directory();

	// ------------------------
	// Estilos públicos
	// ------------------------
	$css_main = '/assets/dist/css/all.css';
	wp_enqueue_style(
		'checkcreative-all',
		$theme_uri . $css_main,
		array(),
		filemtime($theme_path . $css_main)
	);

	// Hoja de estilos del tema (style.css)
	wp_enqueue_style(
		'checkcreative-style',
		get_stylesheet_uri(),
		array('checkcreative-all'),
		filemtime($theme_path . '/style.css')
	);

	// ------------------------
	// Script principal (bundle.js)
	// ------------------------
	$js_bundle = '/assets/dist/js/bundle.js';
	wp_enqueue_script(
		'checkcreative-js',
		$theme_uri . $js_bundle,
		array(),
		filemtime($theme_path . $js_bundle),
		true // carga en footer
	);
}
add_action('wp_enqueue_scripts', 'checkcreative_enqueue_assets', 20);


// ------------------------
// Evita bloqueo por Cookiebot y añade defer
// ------------------------
add_filter('script_loader_tag', function ($tag, $handle, $src) {
	if ('checkcreative-js' === $handle) {
		// Añade atributos defer y data-cookieconsent="ignore"
		$tag = str_replace(
			'<script ',
			'<script defer data-cookieconsent="ignore" ',
			$tag
		);
	}
	return $tag;
}, 10, 3);


// ------------------------
// Estilos del editor (Gutenberg / ACF)
// ------------------------
function checkcreative_enqueue_editor_assets()
{

	$theme_uri  = get_template_directory_uri();
	$theme_path = get_template_directory();

	$admin_css = '/assets/dist/css/admin.css';
	if (file_exists($theme_path . $admin_css)) {
		wp_enqueue_style(
			'checkcreative-admin',
			$theme_uri . $admin_css,
			array(),
			filemtime($theme_path . $admin_css)
		);
	}

	wp_enqueue_style(
		'checkcreative-style',
		get_stylesheet_uri(),
		array('checkcreative-admin'),
		filemtime($theme_path . '/style.css')
	);
}
add_action('enqueue_block_editor_assets', 'checkcreative_enqueue_editor_assets');


// ------------------------
// Soporte de comentarios (nativo de WP)
// ------------------------
function checkcreative_enqueue_comment_reply()
{
	if (is_singular() && comments_open() && get_option('thread_comments')) {
		wp_enqueue_script('comment-reply');
	}
}
add_action('wp_enqueue_scripts', 'checkcreative_enqueue_comment_reply');
