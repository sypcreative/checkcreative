<?php
$images = get_field('block_images_images');
?>
<div class="block-history__images container-fluid py-5">
	<div class="row">
		<?php foreach ($images as $index => $item) {
			$url = $item['block_images_images_image'] ? $item['block_images_images_image']['url'] : '';
			$col_class = ($index % 2 === 0) ? 'col-7 d-none d-md-block' : 'col-md-5 col-12';
		?>
			<div class="block-history__image-wrap <?php echo esc_attr($col_class); ?>">
				<img src="<?php echo esc_url($url); ?>" alt="" class="block-history__image d-block" loading="lazy">
			</div>
		<?php } ?>
	</div>
</div>