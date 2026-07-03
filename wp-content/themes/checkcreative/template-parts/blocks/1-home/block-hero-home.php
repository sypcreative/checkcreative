<?php
$selector = get_field('block_home_hero_selector');
$title = get_field('block_home_hero_title');
$video = get_field('block_home_hero_video') ? get_field('block_home_hero_video')['url'] : '';
$color = get_field('block_home_hero_text_color');
$repeater = get_field('block_home_hero_repeater') ?: [];
$images = get_field('block_home_hero_images') ?: [];
$trail = get_field('opciones_sitio_cursor_images', 'option') ?: [];
?>

<section class="block-hero-home <?php echo $selector == 'video' ? "vh-100" : "vh-100" ?> vw-100 position-relative overflow-clip" data-trail="wrapper">
	<?php if ($selector == 'video') : ?>
		<video class="block-hero-home__video position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-0" autoplay muted loop playsinline preload="metadata">
			<source src="<?= esc_url($video) ?>" type="video/mp4" />
		</video>
		<button
			type="button"
			class="block-hero-home__video-toggle"
			data-hero-video-toggle
			data-video-status="playing"
			aria-pressed="true"
			aria-label="<?php esc_attr_e('Pausar vídeo de fondo', 'checkcreative'); ?>"
			data-label-pause="<?php esc_attr_e('Pausar vídeo de fondo', 'checkcreative'); ?>"
			data-label-play="<?php esc_attr_e('Reproducir vídeo de fondo', 'checkcreative'); ?>">
			<svg class="block-hero-home__video-toggle-icon block-hero-home__video-toggle-icon--pause" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5Zm5 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5Z"/></svg>
			<svg class="block-hero-home__video-toggle-icon block-hero-home__video-toggle-icon--play" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M10.804 8 5 4.633v6.734L10.804 8Zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692Z"/></svg>
		</button>
		<div class="block-hero-home__content position-relative d-flex align-items-center justify-content-center h-100 text-center z-1 px-5 ">
			<h1 class="block-hero-home__title text-<?= esc_attr($color) ?> display">
				
				<?php echo esc_html($title) ?>
			</h1>
		</div>
	<?php endif; ?>
	<?php if ($selector == 'image') : ?>
		<div class="block-hero-home__content position-relative d-flex align-items-center justify-content-center h-100 text-center z-1 px-5 ">
			<h1 class="block-hero-home__title text-<?= esc_attr($color) ?> display-md h1">
				
				<?php echo esc_html($title); ?>
			</h1>
		</div>
		<div class="block-hero-home__media position-absolute bottom-0 start-0 end-0 h-100">
			<!-- <div class="d-flex justify-content-between align-items-end pb-5"> -->
			<?php foreach ($images as $image) {
				$img_field = $image['block_home_hero_images_image'] ?? null;
				$img_id = is_array($img_field) ? ($img_field['ID'] ?? 0) : 0;
			?>
				<div class="block-hero-home__media__img position-absolute parallax-box">
					<?php if ($img_id) : ?>
						<?php
						echo wp_get_attachment_image(
							$img_id,
							'large', // accesorios decorativos (25-45% alto), no full-bleed
							false,
							[
								'class' => 'block-hero-home__img pe-auto position-relative parallax-image',
								'alt' => '',
								'data-parallax' => '',
								'data-parallax-amount' => '140',
								'loading' => 'lazy',
							]
						);
						?>
					<?php endif; ?>
				</div>
			<?php } ?>
		</div>
	<?php endif; ?>
	<div class="position-absolute bottom-0 start-0 end-0 d-flex justify-content-between align-items-end px-3 <?php echo $selector == 'video' ? "pb-9" : "" ?> z-1 pe-none">
		<div class="container d-flex justify-content-between align-items-end pb-5">
			<?php foreach ($repeater as $item) {
				$text = $item['block_home_hero_repeater_texto'] ?? '';
			?>
				<p class="m-0 pe-auto text-<?= esc_attr($color) ?> small-body pb-5">
					<?= esc_html($text) ?>
				</p>
			<?php } ?>
		</div>
	</div>

	<?php if (in_array('home', $trail)) : ?>
		<?php get_template_part('template-parts/components/cursor-trail'); ?>
	<?php endif; ?>
</section>