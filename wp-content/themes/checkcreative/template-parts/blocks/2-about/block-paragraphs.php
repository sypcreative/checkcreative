<?php
$txt_repeater = get_field('block_history_repeater_texts');
?>
<div class="block-history__texts container position-relative h-100 z-1 pt-md-5" data-highlight-text>
	<?php foreach ($txt_repeater as $index => $item) {
		$paragraph = $item['block_history_repeater_texts_text'] ?? '';
		$pos = $item['block_history_repeater_texts_pos'] ?? '';
		$pos_class = $pos === 'right' ? 'offset-md-5 text-end' : '';
	?>
		<div class="row">
			<div class="block-history__text-wrap col-12 col-md-7 <?php echo esc_attr($pos_class); ?> mb-4 mb-md-5">
				<p class="block-history__text fs-5 fs-md-5"><?php echo esc_html($paragraph); ?></p>
			</div>
		</div>
	<?php } ?>
</div>