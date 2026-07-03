<?php
$images = get_field('block_images_images') ?: [];
?>
<div class="block-history__images container-fluid py-5">
	<div class="row">
		<?php foreach ($images as $index => $item) {
			$image_field = $item['block_images_images_image'] ?? null;
			$image_id = $image_field['ID'] ?? 0;
			$col_class = ($index % 2 === 0) ? 'col-7 d-none d-md-block' : 'col-md-5 col-12';
		?>
			<div class="block-history__image-wrap <?php echo esc_attr($col_class); ?>">
				<?php if ($image_id) : ?>
					<?php
					echo wp_get_attachment_image(
						$image_id,
						'large',
						false,
						[
							'class' => 'block-history__image d-block',
							'loading' => 'lazy',
						]
					);
					?>
				<?php endif; ?>
			</div>
		<?php } ?>
	</div>
</div>