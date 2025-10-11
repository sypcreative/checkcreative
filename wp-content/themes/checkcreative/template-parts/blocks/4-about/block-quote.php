<?php

/**
 * Bloque Quote
 *
 * @package checkcreative
 */

$titulo   = get_field('block_quote_quote');
$imagenes = get_field('block_quote_repeater');
?>

<section class="container block-quote h-100 vh-md-100 d-flex align-items-center justify-content-center position-relative overflow-hidden py-5 py-md-0">
	<h1 class="text-uppercase text-start text-md-center position-relative z-2 h-md-1 h3" data-anim="lines"><?= esc_html($titulo) ?></h1>

	<?php if ($imagenes): ?>
		<?php foreach ($imagenes as $index => $item):
			$img_url = !empty($item['block_quote_repeater_imagen']['url']) ? $item['block_quote_repeater_imagen']['url'] : '';
			if (!$img_url) continue;
		?>
			<img
				src="<?= esc_url($img_url) ?>"
				class="quote-img position-absolute z-1 d-none d-md-block"
				data-quote-img="<?= $index ?>"
				alt="">
		<?php endforeach; ?>
	<?php endif; ?>
</section>