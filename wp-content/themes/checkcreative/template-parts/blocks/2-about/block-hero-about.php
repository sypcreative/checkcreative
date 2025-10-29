<?php
$title = get_field('block_hero_about_title');
$image = get_field('block_hero_about_image') ? get_field('block_hero_about_image')['url'] : '';
$repeater = get_field('block_hero_about_repeater');
?>

<section class="block-hero-about vh-100 vw-100 position-relative">
	<div class="block-hero-about__content position-relative d-flex align-items-center justify-content-center h-100 text-center z-1">
		<h1 class="block-hero-about__title text-uppercase display w-100">
			<?php echo esc_html($title); ?>
		</h1>
	</div>
	<?php if ($image) : ?>
		<div class="block-hero-about__image-wrap position-absolute z-0 overflow-hidden">
			<img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($title); ?>" class="block-hero-about__image d-block" loading="lazy">
		</div>
	<?php endif; ?>
	<div class="position-absolute bottom-0 start-0 end-0 d-flex justify-content-between align-items-end pb-5 z-1 pe-none">
		<div class="container d-flex justify-content-between align-items-end">
			<?php foreach ($repeater as $item) {
				$text = $item['block_hero_about_repeater_text'] ?? '';
			?>
				<p class="m-0 pe-auto small-body">
					<?= $text ?>
				</p>
			<?php } ?>
		</div>
	</div>
</section>