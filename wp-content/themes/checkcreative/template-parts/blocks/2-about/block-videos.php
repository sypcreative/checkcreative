<?php
$title = get_field('block_videos_title');
$repeater = get_field('block_videos_repeater');
?>

<section class="block-videos h-100 vw-100 position-relative py-5">
	<div class="block-videos__content d-flex flex-column position-relative z-1 h-100 pt-5">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<h2 class="block-videos__title w-100 text-center mb-5 display">
						<?php echo esc_html($title); ?>
					</h2>
				</div>
			</div>

			<div class="block-videos__video row g-4 pt-5 align-items-center">
				<?php foreach ($repeater as $item) {
					$video_url = $item['block_videos_repeater_url'] ?? '';
					$video = $item['block_videos_repater_video'] ?? '';
					$image = $item['block_videos_repeater_image'] ?? '';

					$img_url = $image['url'] ?? '';
					$img_alt = $image['alt'] ?? '';
				?>

					<div class="col-12 col-md-6">
						<a
							href="<?php echo esc_url($video_url); ?>" target="_blank" rel="noopener noreferrer"
							class="block-videos__video-item d-block">
							<img
								src="<?php echo esc_url($img_url); ?>"
								alt="<?php echo esc_attr($img_alt); ?>"
								class="img-fluid w-100 h-auto" />
						</a>
					</div>

				<?php } ?>
			</div>
		</div>

	</div>
</section>