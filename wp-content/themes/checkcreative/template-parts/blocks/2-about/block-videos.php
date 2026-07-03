<?php
$title = get_field('block_videos_title');
$repeater = get_field('block_videos_repeater') ?: [];
?>

<section class="block-videos h-100 vw-100 position-relative py-5">
	<div class="block-videos__content d-flex flex-column position-relative z-1 h-100 pt-5">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<h2 class="block-videos__title w-100 text-center mb-0 display">
						<?php echo esc_html($title); ?>
					</h2>
				</div>
			</div>

			<div class="block-videos__video row g-4 pt-5 align-items-center">
				<?php foreach ($repeater as $item) {
					$video_url = $item['block_videos_repeater_url'] ?? '';
					$video = $item['block_videos_repater_video'] ?? '';
					$image = $item['block_videos_repeater_image'] ?? null;
					$img_id = is_array($image) ? ($image['ID'] ?? 0) : 0;
				?>

					<div class="col-12 col-md-6 m-0" data-play-hover>
						<a
							href="<?php echo esc_url($video_url); ?>" target="_blank" rel="noopener noreferrer"
							class="block-videos__video-item d-block">
							<?php if ($img_id) : ?>
								<?php
								echo wp_get_attachment_image(
									$img_id,
									'large',
									false,
									['class' => 'img-fluid w-100 h-auto', 'loading' => 'lazy']
								);
								?>
							<?php endif; ?>
						</a>
					</div>

				<?php } ?>
			</div>
		</div>
	</div>
	<?php get_template_part('template-parts/components/cursor-play'); ?>
</section>