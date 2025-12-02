<?php
$subtitle = get_field('block_history_subtitle');
$intro = get_field('block_history_intro');
$img_repeater = get_field('block_history_repeater');
?>

<section class="block-history h-100 vw-100 position-relative">
	<div class="block-history__content container position-relative z-1 py-5">
		<div class="row">
			<div class="col-12 col-md-3">
				<h3 class="block-history__title w-100 fs-6 pb-md-0 pb-3" title-anim>
					<?php echo esc_html($subtitle); ?>
				</h3>
			</div>
			<div class="col-12 col-md-9">
				<p class="block-history__intro w-100 fs-5 text-end" data-highlight-text>
					<?php echo esc_html($intro); ?>
				</p>
			</div>
		</div>
	</div>
	
</section>