<?php
$images = get_field('block_project_gallery_repeater');
if ($images) : ?>
	<section class="block-single-gallery container position-relative py-5">
		<div class="gallery-slider__viewport position-relative vw-100">
			<div class="gallery-slider__track d-flex align-items-stretch justify-content-en gap-3" data-slider-track>
				<?php foreach ($images as $image) {
					$url = $image['block_project_gallery_repeater_image'] ? $image['block_project_gallery_repeater_image']['url'] : '';
					$alt = $image['block_project_gallery_repeater_image'] ? $image['block_project_gallery_repeater_image']['alt'] : '';
				?>
					<article class="gallery-slider__slide">
						<img
							src="<?php echo esc_url($url); ?>"
							alt="<?php echo esc_attr($alt); ?>"
							class="gallery-slider__image pointer-events-none"
							loading="lazy">
					</article>
				<?php } ?>
			</div>
		</div>
	</section>
<?php endif; ?>