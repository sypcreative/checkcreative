<?php

/** @noinspection PhpUnused */

/**
 * Esta función crea categorías para los bloques de Gutenberg y los coloca en primera posición
 */
function checkcreative_blocks_category($categories): array
{

	$custom_block = array(
		[
			'slug'  => 'checkcreative-home',
			'title' => __('checkcreative | Home', 'checkcreative'),
		],
		[
			'slug'  => 'checkcreative-about',
			'title' => __('checkcreative | About', 'checkcreative'),
		],
		[
			'slug'  => 'checkcreative-services',
			'title' => __('checkcreative | Services', 'checkcreative'),
		],
		[
			'slug'  => 'checkcreative-works',
			'title' => __('checkcreative | Works', 'checkcreative'),
		],
		[
			'slug'  => 'checkcreative-contact',
			'title' => __('checkcreative | Contact', 'checkcreative'),
		],
		[
			'slug'  => 'checkcreative-single-works',
			'title' => __('checkcreative | Single Productos', 'checkcreative'),
		],
	);

	$categories_sorted = array();
	foreach ($custom_block as $category) {
		$categories_sorted[] = $category;
	}
	foreach ($categories as $category) {
		$categories_sorted[] = $category;
	}
	return $categories_sorted;
}

add_action('block_categories_all', 'checkcreative_blocks_category', 10, 2);
//https://stackoverflow.com/questions/65886937/show-preview-image-for-custom-gutenberg-blocks
function checkcreative_blocks(): void
{

	if (function_exists('acf_register_block')) {
		/**
		 * Block Hero Homepage
		 */
		acf_register_block(
			array(
				'name'            => 'block-hero-home',
				'title'           => __('Block Hero Homepage', 'checkcreative'),
				'post_types' => array('page'),
				'description'     => __('Bloque que contiene la cabecera para la página principal. Un vídeo de fondo, un titular y dos subtítulos.', 'checkcreative'),
				'render_template' => 'template-parts/blocks/1-home/block-hero-home.php',
				'category'        => 'checkcreative-home',
				'mode'            => 'edit',
				'icon'            => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmarks" viewBox="0 0 16 16"><path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1H4z"/><path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1z"/> </svg>',
				'keywords'        => array('categorias', 'checkcreative'),
				'render_callback' => 'render_preview',
				'example'         => array(
					'attributes' => array(
						'mode' => 'preview', // Important!
						'data' => array(
							'image' => '<img src="' . get_template_directory_uri() . '/assets/dist/img/blocks/block-hero-home.png' . '" style="display: block; margin: 0 auto;  max-width:100%;">'
						),
					),
				),
			)
		);

		/**
		 * Block Description
		 */
		acf_register_block(
			array(
				'name'            => 'block-description',
				'title'           => __('Block Description', 'checkcreative'),
				'post_types' => array('page'),
				'description'     => __('Bloque que contiene una descripción de qué es Check junto a 4 imágenes con efectos de movimiento', 'checkcreative'),
				'render_template' => 'template-parts/blocks/1-home/block-description.php',
				'category'        => 'checkcreative-home',
				'mode'            => 'edit',
				'icon'            => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmarks" viewBox="0 0 16 16"><path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1H4z"/><path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1z"/> </svg>',
				'keywords'        => array('categorias', 'checkcreative'),
				'render_callback' => 'render_preview',
				'example'         => array(
					'attributes' => array(
						'mode' => 'preview', // Important!
						'data' => array(
							'image' => '<img src="' . get_template_directory_uri() . '/assets/dist/img/blocks/block-description.png' . '" style="display: block; margin: 0 auto;  max-width:100%;">'
						),
					),
				),
			)
		);

		/**
		 * Block Clients
		 */
		acf_register_block(
			array(
				'name'            => 'block-clients',
				'title'           => __('Block Clients', 'checkcreative'),
				'post_types' => array('page'),
				'description'     => __('Bloque que contiene un carrusel con los logos de los clientes.', 'checkcreative'),
				'render_template' => 'template-parts/blocks/1-home/block-clients.php',
				'category'        => 'checkcreative-home',
				'mode'            => 'edit',
				'icon'            => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmarks" viewBox="0 0 16 16"><path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1H4z"/><path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1z"/> </svg>',
				'keywords'        => array('categorias', 'checkcreative'),
				'render_callback' => 'render_preview',
				'example'         => array(
					'attributes' => array(
						'mode' => 'preview', // Important!
						'data' => array(
							'image' => '<img src="' . get_template_directory_uri() . '/assets/dist/img/blocks/block-clients.png' . '" style="display: block; margin: 0 auto;  max-width:100%;">'
						),
					),
				),
			)
		);
	}
}

add_action('acf/init', 'checkcreative_blocks');


/**
 * Poder ver la preview de los acf
 * @link https://support.advancedcustomfields.com/forums/topic/custom-fields-on-post-preview/
 */
function fix_acf_field_post_id_on_preview($post_id, $original_post_id)
{
	// Don't do anything to options
	if (is_string($post_id) && str_contains($post_id, 'option')) {
		return $post_id;
	}
	// Don't do anything to blocks
	if (is_string($original_post_id) && str_contains($original_post_id, 'block')) {
		return $post_id;
	}

	// This should only affect on post meta fields
	if (is_preview()) {
		return get_the_ID();
	}

	return $post_id;
}

add_filter('acf/validate_post_id', __NAMESPACE__ . '\fix_acf_field_post_id_on_preview', 10, 2);


// ********** Ruta del archivo JSON Guardar campos ACF (¡esto funciona bien!)) **********

function my_acf_json_save_point(): string
{

	// update path HAVING ISSUES!!!
	// return
	return plugin_dir_path(__FILE__) . 'acf-json';
}

add_filter('acf/settings/save_json', 'my_acf_json_save_point');

// ********** Ruta del archivo JSON Cargar campos ACF (¿esto no funciona?) **********
/**
 * @param $paths
 */
function my_acf_json_load_point($paths)
{
	// Remove original path
	unset($paths[0]); // Append our new path
	$paths[] = plugin_dir_path(__FILE__) . 'acf-json';

	return $paths;
}

add_filter('acf/settings/load_json', 'my_acf_json_load_point');

/**
 * Callback block render,
 * return preview image
 * @link //https://stackoverflow.com/questions/65886937/show-preview-image-for-custom-gutenberg-blocks
 * @link https://www.grbav.com/acf-custom-block-shows-preview-image-in-gutenberg/
 * @param $block
 */
function render_preview($block): void
{
	/**
	 * Back-end preview
	 */

	/**
	 * Back-end preview
	 */
	if (!empty($block['data']['image'])) {
		echo $block['data']['image'];
	} else {
		if ($block) :
			$template = $block['render_template'];
			$template = str_replace('.php', '', $template);
			get_template_part('/' . $template);
		endif;
	}
}
