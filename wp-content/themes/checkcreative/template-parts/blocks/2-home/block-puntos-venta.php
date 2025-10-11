<?php

/**
 * Bloque Title Gallery
 *
 * @package checkcreative
 */
$titulo    = get_field('block_puntos_venta_title');
$subtitulo = get_field('block_puntos_venta_subtitulo');
$puntos  = get_field('block_puntos_venta_repeater');

?>

<section class="container block-title-gallery pb-5 <?php if ($titulo) : ?> pt-5 <?php endif ?>">
	<?php if ($titulo) : ?>
		<div class="text-center mb-md-5 py-md-5">
			<h2 class="titulo-seccion jumbo text-uppercase" data-anim="lines"><?= $titulo ?></h2>
			<p class="body" data-anim="lines"><?= $subtitulo ?></p>
		</div>
	<?php endif ?>

	<?php if ($puntos): ?>
		<div class="row">
			<div class="d-flex flex-wrap justify-content-center gap-2">
				<?php foreach ($puntos as $punto):
					$title = $punto['block_puntos_venta_repeater_text'];
					$color = $punto['block_puntos_venta_repeater_color'];
					$text_color = 'primary';

					switch ($color) {
						case 'green':
							$text_color = 'blue';
							break;
						case 'primary':
							$text_color = 'blue';
							break;
					}
				?>
					<p class="badge rounded-pill bg-<?php echo $color; ?> w-auto text-<?php echo $text_color; ?> fs-md-6 legend fw-bold px-4 py-2 text-wrap"><?= $title ?></p>
				<?php endforeach; ?>
			</div>
		</div>
	<?php endif; ?>
</section>