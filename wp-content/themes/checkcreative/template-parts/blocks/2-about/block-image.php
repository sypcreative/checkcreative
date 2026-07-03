<?php
$image_field       = get_field('block_image_image');
$image_id          = $image_field['ID'] ?? 0;

$image_small_field = get_field('block_image_image_small');
$image_small_id    = $image_small_field['ID'] ?? 0;
?>

<section class="block-image position-relative">
	<div class="parallax-box vh-100 vw-100 position-relative">
		<?php if ($image_id) : ?>
			<?php
			echo wp_get_attachment_image(
				$image_id,
				'full', // full-bleed vh-100/vw-100: deja que el srcset llegue hasta el tamaño real
				false,
				[
					'class' => 'block-image__image d-block object-fit-cover parallax-image position-absolute',
					'data-parallax' => '',
					'loading' => 'lazy',
					'sizes' => '100vw',
				]
			);
			?>
		<?php endif; ?>
	</div>
	<div class="block-image__small parallax-box vw-100 position-absolute">
		<?php if ($image_small_id) : ?>
			<?php
			echo wp_get_attachment_image(
				$image_small_id,
				'large',
				false,
				[
					'class' => 'block-image__image d-block object-fit-cover parallax-image position-absolute',
					'data-parallax' => '',
					'loading' => 'lazy',
				]
			);
			?>
		<?php endif; ?>
	</div>
</section>