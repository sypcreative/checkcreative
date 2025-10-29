<?php
$title = get_field('block_home_hero_title');
$video = get_field('block_home_hero_video') ? get_field('block_home_hero_video')['url'] : '';
$color = get_field('block_home_hero_text_color');
$repeater = get_field('block_home_hero_repeater');
?>

<section class="block-hero-home vh-120 vw-100 position-relative overflow-clip">
	<video class="block-hero-home__video position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-0" autoplay muted loop playsinline>
		<source src="<?= $video ?>" type="video/mp4" />
	</video>
	<div class="block-hero-home__content position-relative d-flex align-items-center justify-content-center h-100 text-center z-1">
		<h1 class="block-hero-home__title text-<?= $color ?> display w-10 w-md-50">
			<?php echo esc_html($title); ?>
		</h1>
	</div>
	<div class="position-absolute bottom-0 start-0 end-0 d-flex justify-content-between align-items-end px-3 pb-9 z-1 pe-none">
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
</section>