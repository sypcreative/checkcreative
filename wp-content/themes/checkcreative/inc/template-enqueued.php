<?php

/**
 * Enqueue scripts and styles.
 */
function checkcreative_scripts()
{
	wp_enqueue_style('checkcreative-style', get_stylesheet_uri(), array(), _S_VERSION);
	wp_style_add_data('checkcreative-style', 'rtl', 'replace');

	//wp_enqueue_script('checkcreative-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true);

	if (is_singular() && comments_open() && get_option('thread_comments')) {
		wp_enqueue_script('comment-reply');
	}
}

add_action('wp_enqueue_scripts', 'checkcreative_scripts');


//! scripts y styles
function checkcreative_scripts_styles()
{

	// Estilos
	wp_enqueue_style('all', get_template_directory_uri() . '/assets/dist/css/all.css', array(), '1.0.3');
	// hoja de estilos principal
	wp_enqueue_style('style', get_stylesheet_uri(), array('all'), '1.0.0');

	wp_enqueue_script(
		'checkcreative-js',
		get_template_directory_uri() . '/assets/dist/js/bundle.js',
		array(),
		'1.0.0',
		true
	);

	wp_script_add_data('checkcreative-js', 'type', 'module');


	wp_enqueue_script(
		'places',
		'https://maps.googleapis.com/maps/api/js?key=AIzaSyBVFp7rOsdigQAvYQTmaINR74hW06j3C0g&libraries=places&loading=async',
		array(),
		'1.0.1',
		true
	);
}

add_action('wp_enqueue_scripts', 'checkcreative_scripts_styles');


//! scripts y styles
function checkcreative_scripts_styles_editor()
{

	// Estilos

	wp_enqueue_style('admin', get_template_directory_uri() . '/assets/dist/css/admin.css', array(), '1.0.0');

	wp_enqueue_style('style', get_stylesheet_uri(), array('admin'), '1.0.0');
}


add_action('enqueue_block_editor_assets', 'checkcreative_scripts_styles_editor');
