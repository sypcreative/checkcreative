<?php
$subtitle = get_field('block_history_subtitle');
$intro = get_field('block_history_intro');
$img_repeater = get_field('block_history_repeater');
$txt_repeater = get_field('block_history_repeater_texts');
?>

<section class="block-history h-100 vw-100 position-relative">
	<div class="block-history__content container position-relative z-1 py-5">
		<div class="row">
			<div class="col-12 col-md-3">
				<h3 class="block-history__title w-100 fs-md-5 fs-6 pb-md-0 pb-3">
					<?php echo esc_html($subtitle); ?>
				</h3>
			</div>
			<div class="col-12 col-md-9">
				<p class="block-history__intro w-100 fs-5 fs-md-4 text-end">
					<?php echo esc_html($intro); ?>
				</p>
			</div>
		</div>
	</div>
	<div class="block-history__images container-fluid py-5">
		<div class="row">
			<?php foreach ($img_repeater as $index => $item) {
				$image = $item['block_history_repeater_image'] ? $item['block_history_repeater_image']['url'] : '';
				$text = $txt_repeater[$index]['block_history_repeater_texts_text'] ?? '';

				$col_class = ($index % 2 === 0) ? 'col-7 d-none d-md-block' : 'col-md-5 col-12';
			?>
				<div class="block-history__image-wrap <?php echo esc_attr($col_class); ?>">
					<img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($text); ?>" class="block-history__image d-block" loading="lazy">
				</div>
			<?php } ?>
		</div>
	</div>
	<div class="block-history__texts container position-relative h-100 z-1 py-5">
		<?php foreach ($txt_repeater as $index => $item) {
			$paragraph = $item['block_history_repeater_texts_text'] ?? '';
		?>
			<div class="row">
				<div class="block-history__text-wrap col-12 col-md-7">
					<p class="block-history__text fs-5 fs-md-4"><?php echo esc_html($paragraph); ?></p>
				</div>
			</div>
		<?php } ?>
	</div>
</section>