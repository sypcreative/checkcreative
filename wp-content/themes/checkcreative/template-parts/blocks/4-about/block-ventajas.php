<?php

/**
 * Bloque Ventajas
 *
 * @package checkcreative
 */


$titulo             = get_field('block_ventajas_titulo');
$repeater             = get_field('block_ventajas_repeater');

?>

<!-- Bloque Ventajas -->

<section class="container block-ventajas py-5 min-vh-100">
	<h1 class="jumbo text-center" data-anim="lines"><?= $titulo ?></h1>

	<div class="content-drag-area start-0  w-100 d-flex align-items-center justify-content-center mt-neg-1">
		<div class="row p-4 justify-content-center">
			<?php
			foreach ($repeater as $index => $row):
				$titulo = $row['block_ventajas_repeater_titulo'];
				$descripcion = $row['block_ventajas_repeater_descripcion'];
				$color = sanitize_html_class($row['block_ventajas_repeater_color']);
			?>
				<div class="col-12 col-md-4">
					<div class=" block-ventajas__card text-white bg-<?php echo $color; ?> p-4 rounded-4 img-drag position-relative d-block">
						<div class="card-body p-0 d-flex flex-column justify-content-between h-100">
							<h2 class="fw-bold lh-sm mb-0 mb-md-5 h6" data-anim="lines">
								<?= $titulo ?>
							</h2>
							<p class="mt-5 mb-0 text-end body-md legend" data-anim="lines">
								<?= $descripcion ?>
							</p>
						</div>
					</div>
				</div>
			<?php
			endforeach; ?>
		</div>
	</div>

</section>