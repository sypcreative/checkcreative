<?php if (have_rows('block_gallery_content')) : ?>
	<div class="masonry-wrap container pt-8 pb-5">
		<div class="masonry-collection">
			<div data-masonry-list="" class="masonry-list">

				<?php while (have_rows('block_gallery_content')) : the_row(); ?>
					<?php
					$media_type = get_sub_field('block_gallery_content_type'); // 'image' o 'video'
					$item_size  = get_sub_field('block_gallery_content_size');  // 'default', 'wide', 'square', 'tall'

					// Clases base
					$visual_classes = 'masonry-item__visual';

					// Añadir modificador si no es "default"
					if ($item_size && $item_size !== 'default') {
						$visual_classes .= ' ' . esc_attr($item_size);
					}
					?>

					<div class="masonry-item">
						<div class="<?php echo esc_attr($visual_classes); ?>">

							<?php if ($media_type === 'image') : ?>

								<?php
								$image = get_sub_field('block_gallery_content_image');
								if ($image) :
									// Usa wp_get_attachment_image para mejor control
									echo wp_get_attachment_image(
										$image['ID'],
										'full',
										false,
										[
											'class' => 'masonry-item__visual-img',
											'loading' => 'lazy',
										]
									);
								endif;
								?>

							<?php elseif ($media_type === 'video') : ?>

								<?php
								$video_file = get_sub_field('block_gallery_content_video');
								$video_url = is_array($video_file) ? ($video_file['url'] ?? '') : $video_file;
								if ($video_url) :
								?>
									<video class="masonry-item__visual-video" autoplay muted loop playsinline>
										<source src="<?php echo esc_url($video_url); ?>" type="video/mp4">
										Your browser does not support the video tag.
									</video>
								<?php endif; ?>

							<?php endif; ?>

						</div>
					</div>

				<?php endwhile; ?>

			</div>
		</div>
	</div>
<?php endif; ?>