<?php
$items = get_field('block_project_gallery_items');
if ($items) : ?>
	<section class="block-single-gallery container position-relative py-5">
		<div class="gallery-slider__viewport position-relative vw-100">
			<div class="gallery-slider__track d-flex align-items-stretch justify-content-en gap-3" data-slider-track>

				<?php foreach ($items as $item) :
					$image = $item['block_project_gallery_items_img'] ?? null;
					$video = $item['block_project_gallery_items_video'] ?? null;

					$image_id  = is_array($image) && !empty($image['ID']) ? $image['ID'] : 0;
					$image_alt = is_array($image) && !empty($image['alt']) ? $image['alt'] : '';
					$video_url = is_array($video) && !empty($video['url']) ? $video['url'] : '';
					$video_type = is_array($video) && !empty($video['mime_type']) ? $video['mime_type'] : 'video/mp4';
				?>
					<article class="gallery-slider__slide">

						<?php if ($video_url) : ?>
							<!-- ✅ LAZY VIDEO: NO autoplay inmediato, NO source inicial -->
							<video
								class="gallery-slider__video pointer-events-none"
								playsinline
								muted
								loop
								preload="none"
								data-autoplay="1"
								data-src="<?php echo esc_url($video_url); ?>"
								data-type="<?php echo esc_attr($video_type); ?>">
								Tu navegador no soporta video HTML5.
							</video>

						<?php elseif ($image_id) : ?>
							<!-- ✅ IMAGEN RESPONSIVE + async decode -->
							<?php
							echo wp_get_attachment_image(
								$image_id,
								'large', // ✅ evita servir "full" aquí también
								false,
								[
									'class' => 'gallery-slider__image pointer-events-none',
									'loading' => 'lazy',
									'decoding' => 'async',
									'fetchpriority' => 'low',
									'alt' => $image_alt,
								]
							);
							?>

						<?php endif; ?>

					</article>
				<?php endforeach; ?>

			</div>
		</div>
	</section>
<?php endif; ?>