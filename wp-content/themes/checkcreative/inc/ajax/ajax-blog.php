<?php
// TODO: Unificar todo en una funcion que envie por ajax: html, numero de paginas que quedan,

// Action
add_action('wp_ajax_moreBlog', 'moreBlog');
add_action('wp_ajax_nopriv_moreBlog', 'moreBlog');

function moreBlog()
{

	$args = array(
		'paged'          => $_POST['page'],
		'post_type'      => 'post',
		'orderby'        => 'date',        // Ordena por fecha
		'order'          => 'ASC',            // Orden ascendente (A-Z)
		'post_status'    => 'publish',
		'posts_per_page' => 6,  // Número de posts por página
	);

	// The Query
	$the_query = new WP_Query($args);

	// The Loop
	if ($the_query->have_posts()) {
		ob_start(); // Iniciar el almacenamiento en búfer de salida

		while ($the_query->have_posts()) {
			$the_query->the_post();
			get_template_part('template-parts/card-otros-articulos');
		}

		$response = ob_get_clean(); // Capturar la salida en una variable y detener el almacenamiento en búfer

		$res = [
			'html' => $response,
			'more' => $the_query->max_num_pages - $_POST['page'], // Paginas que quedan por
		];

		// Convertir el array en formato JSON
		$json_response = json_encode($res);

		// Configurar las cabeceras para indicar que la respuesta es JSON
		header('Content-Type: application/json');

		// Enviar la respuesta JSON como respuesta AJAX
		echo $json_response;
	} else {
		// no posts found
		echo 'No se encontraron post.';
	}

	/* Restaurar los datos originales del Post */
	wp_reset_postdata();

	wp_die();
}


// Process ajax request
add_action('wp_ajax_nopriv_filterBlog_ajax', 'filterBlog_ajax');
add_action('wp_ajax_filterBlog_ajax', 'filterBlog_ajax');
function filterBlog_ajax()
{
	$category = $_POST['category'];

	$args = array(
		'posts_per_page' => 2,  // Número de posts por página
		'post_type'      => 'post',
		'orderby'        => 'date',        // Ordena por fecha
		'order'          => 'ASC',            // Orden ascendente (A-Z)
		'post_status'    => 'publish',
	);

	if (isset($category) && $category !== 'all') {
		$args['category_name'] = $category;
	}


	// The Query
	$the_query = new WP_Query($args);

	// The Loop
	if ($the_query->have_posts()) {
		ob_start(); // Iniciar el almacenamiento en búfer de salida

		while ($the_query->have_posts()) {
			$the_query->the_post();
			get_template_part('template-parts/card-articulos-destacados');
		}

		$response = ob_get_clean(); // Capturar la salida en una variable y detener el almacenamiento en búfer

		$res = [
			'html' => $response,
			'more' => $the_query->max_num_pages - $_POST['page'], // Paginas que quedan por delante
		];

		// Convertir el array en formato JSON
		$json_response = json_encode($res);

		// Configurar las cabeceras para indicar que la respuesta es JSON
		header('Content-Type: application/json');

		// Enviar la respuesta JSON como respuesta AJAX
		echo $json_response;
	} else {
		// no posts found
		$res = [
			'html' => '<h2>' . __("No se han encontrado post", "checkcreative") . '</h2>',
			'more' => $the_query->max_num_pages - $_POST['page'], // Paginas que quedan por delante
		];
		// Convertir el array en formato JSON
		$json_response = json_encode($res);

		// Configurar las cabeceras para indicar que la respuesta es JSON
		header('Content-Type: application/json');

		// Enviar la respuesta JSON como respuesta AJAX
		echo $json_response;
	}

	wp_die(); // Finalizar la ejecución de WordPress
}



// NUESTRA FUNCION DE BLOG
add_action('wp_ajax_load_filtered_posts', 'load_filtered_posts_callback');
add_action('wp_ajax_nopriv_load_filtered_posts', 'load_filtered_posts_callback');
function load_filtered_posts_callback()
{
	$paged    = isset($_POST['paged']) ? intval($_POST['paged']) : 1;
	$category = isset($_POST['category']) ? sanitize_text_field($_POST['category']) : '';

	$args = [
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'posts_per_page' => 10,
		'paged'          => $paged,
		'orderby'        => 'date',
		'order'          => 'DESC',
	];

	if ($category) {
		$slugs = array_filter(array_map('trim', explode(',', $category)));
		if ($slugs) {
			$args['tax_query'] = [[
				'taxonomy' => 'category',
				'field'    => 'slug',
				'terms'    => $slugs,
			]];
		}
	}

	$query = new WP_Query($args);
	ob_start();

	if ($query->have_posts()) {
		$i = 0;
		while ($query->have_posts()) {
			$query->the_post();
			get_template_part(
				'template-parts/components/blog-card',
				null,
				[
					'index'   => $i,
					'animate' => false,  // ← no añade atributos
				]
			);
			$i++;
		}
	}

	wp_reset_postdata();

	$html = trim(ob_get_clean());

	wp_send_json([
		'html'  => $html,
		'empty' => empty($html),
	]);
}
