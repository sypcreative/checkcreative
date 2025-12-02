<?php
$txt_repeater = get_field('block_history_repeater_texts');
?>
<div class="block-history__texts container position-relative h-100 z-1 py-5" data-highlight-text>
	<?php foreach ($txt_repeater as $index => $item) {
		$paragraph = $item['block_history_repeater_texts_text'] ?? '';
	?>
		<div class="row">
			<div class="block-history__text-wrap col-12 col-md-7">
				<p class="block-history__text fs-5 fs-md-5"><?php echo esc_html($paragraph); ?></p>
			</div>
		</div>
	<?php } ?>
</div>