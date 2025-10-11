<?php
$args  = [
	'post_type'      => 'post',
	'posts_per_page' => 2,
	'post_status'    => 'publish',
	'orderby'        => 'date',
	'order'          => 'DESC',
];
$posts = get_posts($args);

$titulo = get_field('block_home_blog_title');
$subtitulo = get_field('block_home_blog_subtitle');
?>

<div class="block-home-blog container pb-5 py-md-5" id="<?php echo esc_attr($block['id']); ?>">
	<div class="text-center mb-md-5">
		<h2 class="titulo-seccion jumbo" data-anim="lines"><?= $titulo ?></h2>
		<p class="body" data-anim="lines"><?= $subtitulo ?></p>
	</div>

	<div class="block-home-blog__wrapper row">
		<?php
		$index = 0; // contador para alternar estilos
		foreach ($posts as $post) : setup_postdata($post);
			$post_cats = wp_get_post_categories($post->ID, ['fields' => 'slugs']);
			$cat_slugs = implode(' ', $post_cats);

			// Definir fondo y texto según patrón: amarillo - negro - negro - amarillo - ...
			$position = $index % 4;
			$bg_class = ($position === 0 || $position === 3) ? 'bg-primary' : 'bg-dark';
			$text_class = ($position === 0 || $position === 3) ? 'text-dark' : 'text-white';
		?>
			<article style="min-height: 350px; max-height: 350px" class="blog-card col-12 col-md-6 col-lg-6 rounded-5 mb-5" data-cat="<?php echo esc_attr($cat_slugs); ?>">
				<div class="w-100 h-100 <?php echo $bg_class; ?> rounded-5 overflow-hidden">
					<div class="block-home-blog__content p-3 d-flex flex-column h-100 justify-content-between <?php echo $text_class; ?>">
						<div class="d-flex align-items-center justify-content-between my-3">
							<h5 class="fw-normal text-uppercase m-0" data-anim="lines"><?php echo esc_html(get_the_title($post->ID), 2, '…'); ?></h5>
							<a style="width: 30px; height: 30px" class="read-more bg-pink rounded-circle d-flex align-items-center justify-content-center" href="<?php echo get_permalink($post->ID); ?>" aria-label="<?php esc_attr_e('Leer la entrada completa', 'textdomain'); ?>">
								<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M9.33325 22.6665L21.9999 9.99986" stroke="#F5CF5D" stroke-width="2" stroke-linejoin="round" />
									<path d="M22.899 16.8284C23.5216 15.75 23.771 14.4962 23.6084 13.2616C23.4459 12.027 22.8805 10.8805 22 10C21.1194 9.11947 19.973 8.55409 18.7384 8.39155C17.5037 8.22901 16.25 8.4784 15.1716 9.10103" stroke="#F5CF5D" stroke-width="2" stroke-linejoin="round" />
								</svg>
							</a>
						</div>

						<!-- extracto -->
						<div>
							<p class="body text-break" data-anim="lines">
								<?php echo wp_trim_words(get_the_excerpt($post->ID), 35, '…'); ?>
							</p>
						</div>
						<div class="d-flex align-items-center justify-content-between mt-3">
							<div>
								<!-- etiquetas de categoría -->
								<?php foreach ($post_cats as $slug) :
									$c = get_category_by_slug($slug); ?>
									<span class="mt-1 century fw-bold text-uppercase border rounded-4 border-black badge cat-<?php echo esc_attr($slug); ?>__pill">
										<?php echo esc_html($c->name); ?>
									</span>
								<?php endforeach; ?>
							</div>
							<div>
								<time class="century fw-bold" datetime="<?php echo get_the_date('c', $post->ID); ?>">
									<?php echo get_the_date('d/m/Y', $post->ID); ?>
								</time>
							</div>
						</div>
					</div>
				</div>
			</article>
		<?php
			$index++;
		endforeach;
		wp_reset_postdata();
		?>
	</div>
</div>