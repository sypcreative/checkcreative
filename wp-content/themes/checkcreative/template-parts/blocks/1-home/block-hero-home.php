<?php
$selector = get_field('block_home_hero_selector');
$title = get_field('block_home_hero_title');
$video = get_field('block_home_hero_video') ? get_field('block_home_hero_video')['url'] : '';
$color = get_field('block_home_hero_text_color');
$repeater = get_field('block_home_hero_repeater');
$images = get_field('block_home_hero_images');
$trail = get_field('opciones_sitio_cursor_images', 'option');
?>

<section class="block-hero-home <?php echo $selector == 'video' ? "vh-120" : "vh-100" ?> vw-100 position-relative overflow-clip" data-trail="wrapper">
	<?php if ($selector == 'video') : ?>
		<video class="block-hero-home__video position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-0" autoplay muted loop playsinline>
			<source src="<?= $video ?>" type="video/mp4" />
		</video>
		<div class="block-hero-home__content position-relative d-flex align-items-center justify-content-center h-100 text-center z-1">
			<h1 class="block-hero-home__title text-<?= $color ?> display w-10 w-md-50">
				<?php echo esc_html($title); ?>
			</h1>
		</div>
	<?php endif; ?>
	<?php if ($selector == 'image') : ?>
		<div class="block-hero-home__content position-relative d-flex align-items-center justify-content-center h-100 text-center z-1">
			<h1 class="block-hero-home__title text-<?= $color ?> display w-10 w-md-50">
				<?php echo esc_html($title); ?>
			</h1>
		</div>
		<div class="block-hero-home__media position-absolute bottom-0 start-0 end-0 h-100">
			<!-- <div class="d-flex justify-content-between align-items-end pb-5"> -->
			<?php foreach ($images as $image) {
				$img = $image['block_home_hero_images_image'] ? $image['block_home_hero_images_image']['url'] : '';
			?>
				<div class="block-hero-home__media__img position-absolute parallax-box">
					<img src="<?= esc_url($img) ?>" alt="" data-parallax data-parallax-amount="140" class="block-hero-home__img pe-auto position-relative parallax-image" />
				</div>
			<?php } ?>
		</div>
	<?php endif; ?>
	<div class="position-absolute bottom-0 start-0 end-0 d-flex justify-content-between align-items-end px-3 <?php echo $selector == 'video' ? "pb-9" : "" ?> z-1 pe-none">
		<div class="container d-flex justify-content-between align-items-end pb-5">
			<?php foreach ($repeater as $item) {
				$text = $item['block_home_hero_repeater_texto'] ?? '';
			?>
				<p class="m-0 pe-auto text-<?= $color ?> small-body pb-5">
					<?= $text ?>
				</p>
			<?php } ?>
		</div>
	</div>

	<?php if (in_array('home', $trail)) : ?>
		<?php get_template_part('template-parts/components/cursor-trail'); ?>
	<?php endif; ?>
</section>