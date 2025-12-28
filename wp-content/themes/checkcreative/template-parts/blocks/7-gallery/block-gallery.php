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
									echo wp_get_attachment_image(
										$image['ID'],
										'large', // ✅ NO 'full' en grids; usa 'large' o un tamaño custom
										false,
										[
											'class' => 'masonry-item__visual-img',
											'loading' => 'lazy',
											'decoding' => 'async',
											'fetchpriority' => 'low',
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
									<video
										class="masonry-item__visual-video"
										muted
										loop
										playsinline
										preload="none"
										data-autoplay="1"
										data-src="<?php echo esc_url($video_url); ?>"></video>
								<?php endif; ?>

							<?php endif; ?>

						</div>
					</div>

				<?php endwhile; ?>

			</div>
		</div>
	</div>
<?php endif; ?>