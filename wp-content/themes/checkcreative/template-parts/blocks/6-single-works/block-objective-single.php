<?php
$title = get_field('block_single_objective_title');
$objective = get_field('block_single_objective_objective');
$imagen = get_field('block_single_objective_image');
$image_id = is_array($imagen) ? ($imagen['ID'] ?? 0) : 0;
?>

<section class="block-single-objective h-100 vw-100 position-relative pt-0 pt-md-8">
	<div class="container">
		<div class="row">
			<div class="col-12 d-md-none d-block">
				<?php if ($image_id) : ?>
					<?php
					echo wp_get_attachment_image(
						$image_id,
						'large',
						false,
						[
							'class' => 'img-fluid',
							'alt' => '',
							'aria-hidden' => 'true',
							'loading' => 'lazy',
						]
					);
					?>
				<?php endif; ?>
			</div>
			<div class="col-12 col-md-8 offset-md-2 text-start text-md-center py-md-0 py-5">
				<h4 class="pb-0 pb-md-5 h3 h-md-4 text-uppercase" title-anim><?php echo esc_html($title); ?></h4>
				<p class="fs-6 fs-md-5" data-highlight-text data-highlight-scroll-start="top 70%"><?php echo esc_html($objective); ?></p>
			</div>
		</div>
	</div>
</section>