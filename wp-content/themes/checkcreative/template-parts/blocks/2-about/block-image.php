<?php
$image = get_field('block_image_image') ? get_field('block_image_image')['url'] : '';
$image_small = get_field('block_image_image_small') ? get_field('block_image_image_small')['url'] : '';
?>

<section class="block-image position-relative">
	<div class="parallax-box vh-100 vw-100 position-relative">
		<img src="<?php echo esc_url($image); ?>" alt="" class="block-image__image d-block object-fit-cover parallax-image position-absolute" data-parallax loading="lazy">
	</div>
	<div class="block-image__small parallax-box vw-100 position-absolute">
		<img src="<?php echo esc_url($image_small); ?>" alt="" class="block-image__image d-block object-fit-cover parallax-image position-absolute" data-parallax loading="lazy">
	</div>
</section>