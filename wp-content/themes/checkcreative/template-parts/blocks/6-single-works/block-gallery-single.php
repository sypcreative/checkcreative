<?php
$items = get_field('block_project_gallery_items');
if ($items) : ?>
	<section class="block-single-gallery container position-relative py-5">
		<div class="gallery-slider__viewport position-relative vw-100">
			<div class="gallery-slider__track d-flex align-items-stretch justify-content-en gap-3" data-slider-track>
				<?php foreach ($items as $item) :
					$image = isset($item['block_project_gallery_items_img']) ? $item['block_project_gallery_items_img'] : null;
					$video = isset($item['block_project_gallery_items_video']) ? $item['block_project_gallery_items_video'] : null;
				?>
					<article class="gallery-slider__slide">
						<?php if (!empty($video['url'])) :
							$video_type = !empty($video['mime_type']) ? $video['mime_type'] : 'video/mp4'; ?>
							<video
								class="gallery-slider__video pointer-events-none"
								playsinline
								muted
								loop
								autoplay>
								<source src="<?php echo esc_url($video['url']); ?>" type="<?php echo esc_attr($video_type); ?>">
								Tu navegador no soporta video HTML5.
							</video>
						<?php elseif (!empty($image['url'])) :
							$alt = !empty($image['alt']) ? $image['alt'] : ''; ?>
							<img
								src="<?php echo esc_url($image['url']); ?>"
								alt="<?php echo esc_attr($alt); ?>"
								class="gallery-slider__image pointer-events-none"
								loading="lazy">
						<?php endif; ?>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
<?php endif; ?>