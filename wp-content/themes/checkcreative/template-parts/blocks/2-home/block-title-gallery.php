<?php

/**
 * Bloque Title Gallery
 *
 * @package checkcreative
 */
$titulo    = get_field('block_title_gallery_titulo');
$subtitulo = get_field('block_title_gallery_subtitulo');
$imagenes  = get_field('block_title_gallery_repeater');

?>

<section class="container block-title-gallery py-5">
	<div class="text-center mb-md-5 py-md-5">
		<h2 class="titulo-seccion jumbo" data-anim="lines"><?= $titulo ?></h2>
		<p class="body" data-anim="lines"><?= $subtitulo ?></p>
	</div>

	<?php if ($imagenes): ?>
		<div class="row">
			<?php foreach ($imagenes as $slide):
				$imagen = isset($slide['block_title_gallery_repeater_imagen']['url'])
					? $slide['block_title_gallery_repeater_imagen']['url']
					: '';
			?>
				<div class="col-12 col-sm-6 col-md-4 mb-4">
					<div class="h-100">
						<img
							src="<?= esc_url($imagen) ?>"
							alt=""
							class="img-fluid object-fit-cover w-100 h-100">
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</section>