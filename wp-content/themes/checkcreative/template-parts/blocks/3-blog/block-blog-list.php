<?php

/**
 * Bloque Blog List
 *
 * @package checkcreative
 */

$args  = [
	'post_type'      => 'post',
	'posts_per_page' => 10,
	'post_status'    => 'publish',
	'orderby'        => 'date',
	'order'          => 'DESC',
];
$posts = get_posts($args);

$titulo    = get_field('block_home_blog_title');
$subtitulo = get_field('block_home_blog_subtitle');
$categories = get_categories(['hide_empty' => true]);
?>

<div class="block-blog-list p-4 container py-5" id="<?php echo esc_attr($block['id']); ?>">
	<div class="text-center mb-md-5">
		<h2 class="titulo-seccion jumbo">EL BLOG</h2>
		<p class="body">Entérate de las últimas noticias</p>
	</div>

	<!-- Filtros por categoría -->
	<div class="blog-filters mb-5 d-md-block d-flex flex-wrap gap-2">
		<button class="me-md-3 me-0 filter-btn active bg-primary text-dark px-3 py-1 rounded-5 text-uppercase border-3 border border-dark century fw-bold legend body-md" data-filter="all">Ver todos</button>
		<?php foreach ($categories as $cat) : ?>
			<button class="me-md-3 me-0 filter-btn bg-light px-3 py-1 rounded-5 text-uppercase border-3 border border-dark century fw-bold legend body-md" data-filter="<?php echo esc_attr($cat->slug); ?>">
				<?php echo esc_html($cat->name); ?>
			</button>
		<?php endforeach; ?>
	</div>

	<div class="block-home-blog__wrapper row" id="blog-posts-container">
		<?php
		$index = 0;
		foreach ($posts as $post) :
			setup_postdata($post);
			get_template_part(
				'template-parts/components/blog-card',
				null,
				[
					'index'   => $index,
					'animate' => true,
				]
			);
			$index++;
		endforeach;
		wp_reset_postdata();
		?>
	</div>


	<!-- Botón para cargar más -->
	<div class="text-center">
		<p id="no-more-posts-msg" class="d-none col-xl-4 col-md-6 col-8 m-auto text-center mt-4 century fw-bold text-uppercase bg-warning p-3 d-inline">No hay más entradas.</p>
		<button id="load-more-posts" class="btn btn-outline-dark px-4 py-2 fs-6 border border-3 border-dark">Cargar más</button>
	</div>
</div>