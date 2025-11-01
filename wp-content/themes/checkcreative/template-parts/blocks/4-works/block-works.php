<?php
$title = get_field('block_works_title');
$show_filters = get_field('block_works_filters');

$args = array(
	'post_type' => 'proyectos',
	'posts_per_page' => -1,
	'orderby'        => 'date',
	'order'          => 'DESC',
);

$query = new WP_Query($args);
?>

<section class="block-works h-100 vw-100 position-relative pt-8">
	<div class="block-works__content container position-relative z-1 py-5">
		<div class="row">
			<div class="col-12 col-md-10 offset-md-1">
				<h3 class="block-works__title w-100 text-uppercase text-center pb-md-0 pb-3 display">
					<?php echo esc_html($title); ?>
				</h3>

				<?php if ($show_filters): ?>
					<div class="block-works__filters text-center mb-5 fs-6 ls-3">
						<span>( FILTER )</span>
						<span>( FILTER )</span>
						<span>( FILTER )</span>
					</div>
				<?php endif; ?>
			</div>
		</div>

		<?php if ($query->have_posts()): ?>
			<div class="block-works__grid row g-3">
				<?php while ($query->have_posts()): $query->the_post();
					$id = get_the_ID();

					// ACF por ID explícito
					$p_title = get_field('post_type_proyectos_title', $id);
					$p_year  = get_field('post_type_proyectos_year', $id);

					// Si sigue null, mira si existen con otra meta_key (p.ej. porque renombraste el field)
					if ($p_title === null) $p_title = get_post_meta($id, 'post_type_proyectos_title', true);
					if ($p_year  === null) $p_year  = get_post_meta($id, 'post_type_proyectos_year', true);

					// Fallbacks
					$p_title = $p_title ?: get_the_title();
				?>
					<div class="col-12 col-md-6">
						<article class="block-works__item">
							<a href="<?php the_permalink(); ?>" class="block-works__link d-block position-relative overflow-hidden">
								<div class="block-works__image">
									<?php if (has_post_thumbnail()) the_post_thumbnail('large', ['class' => ' w-100']); ?>
								</div>
								<div class="block-works__meta d-flex justify-content-between mt-2 text-dark ls-3">
									<span class="block-works__client text-uppercase"><?php echo esc_html($p_title); ?></span>
									<span class="block-works__year text-uppercase"><?php echo esc_html($p_year); ?></span>
								</div>
							</a>
						</article>
					</div>
				<?php endwhile;
				wp_reset_postdata(); ?>
			</div>
		<?php else: ?>
			<p class="text-center">No hay proyectos disponibles en este momento.</p>
		<?php endif; ?>
	</div>
</section>