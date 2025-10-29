<?php
$image = get_field('block_image_image') ? get_field('block_image_image')['url'] : '';
?>

<section class="block-image vh-100 vw-100 position-relative parallax-box">
	<img src="<?php echo esc_url($image); ?>" alt="" class="block-image__image d-block object-fit-cover parallax-image position-absolute" data-parallax loading="lazy">
</section>