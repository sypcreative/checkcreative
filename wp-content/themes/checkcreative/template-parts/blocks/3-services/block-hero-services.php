<?php
$title = get_field('block_hero_services_title');
$repeater = get_field('block_hero_services_images') ?: [];
?>

<section class="block-hero-services container vh-100 vw-100 position-relative">
	<div class="block-hero-services__content row position-relative d-flex align-items-center justify-content-center h-100 text-center z-1">
		<h1 class="block-hero-services__title col-12 text-dark display-md h1">
			<?php echo esc_html($title); ?>
		</h1>
	</div>
	<div class="block-hero-services__media position-absolute bottom-0 start-0 end-0 h-100">
		<!-- <div class="d-flex justify-content-between align-items-end pb-5"> -->
		<?php foreach ($repeater as $image) {
			$img_field = $image['block_hero_services_images_image'] ?? null;
			$img_id = is_array($img_field) ? ($img_field['ID'] ?? 0) : 0;
		?>
			<div class="block-hero-services__media__img position-absolute parallax-box">
				<?php if ($img_id) : ?>
					<?php
					echo wp_get_attachment_image(
						$img_id,
						'large', // accesorios decorativos (25-45% alto), no full-bleed
						false,
						[
							'class' => 'block-hero-services__img pe-auto position-relative parallax-image',
							'alt' => '',
							'data-parallax' => '',
							'data-parallax-amount' => '140',
							'loading' => 'lazy',
						]
					);
					?>
				<?php endif; ?>
			</div>
		<?php } ?>
	</div>
	<!-- </div> -->
</section>