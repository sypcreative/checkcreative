<?php

/**
 * Bloque Quienes Somos
 *
 * @package checkcreative
 */

$subtitulo             = get_field('block_quienes_somos_subtitulo');
$titulo             = get_field('block_quienes_somos_titulo');
$introduccion             = get_field('block_quienes_somos_introduccion');
$repeater             = get_field('block_quienes_somos_repeater');

?>

<!-- Bloque Quienes Somos -->

<section class="container block-quienes-somos pt-5">
	<div class="row">
		<div class="col-12 text-center">
			<p class="century" data-anim="lines"><?= $subtitulo ?></p>
			<h1 class="text-uppercase h-md-1 h3" data-anim="lines"><?= $titulo ?></h1>
		</div>
		<div class="col-12 col-md-6 py-4">
			<p class="" data-anim="lines"><?= $introduccion ?></p>
		</div>
	</div>
	<div class="row block-quienes-somos__repeater">
		<?php
		$index = 0;
		foreach ($repeater as $index => $row):
			$imagen = $row['block_quienes_somos_repeater_imagen'] ? $row['block_quienes_somos_repeater_imagen']['url'] : '';
			$texto = $row['block_quienes_somos_repeater_texto'];
			$position = $row['block_quienes_somos_repeater_posicion'];
			$topOrBottom = $row['block_quienes_somos_repeater_posicion_top_bottom'];
			$fontWeight = $row['block_quienes_somos_repeater_weight'];

			$fontWeightClass = '';
			if ($fontWeight === 'light') {
				$fontWeightClass = 'body fw-regular';
			} else {
				$fontWeightClass = 'fw-bold text-uppercase h5 century';
			}

			$topOrBottomClass = '';
			if ($topOrBottom === 'top') {
				$topOrBottomClass = 'align-items-start';
			} else {
				$topOrBottomClass = 'align-items-end';
			}

			$margin_class = '';
			if ($index === 0) {
				$margin_class = 'mt-0';
			} elseif ($index === 1) {
				$margin_class = 'mt-neg-2';
			} elseif ($index === 2) {
				$margin_class = 'mt-neg-2';
			} else {
				$margin_class = 'mt-neg-3';
			}
		?>
			<div class="col-12 <?= $margin_class ?>">
				<div class="row <?= $topOrBottomClass ?>">
					<?php if ($position === 'top'): ?>
						<div class="col-12 col-md-4">
							<p class="block-quienes-somos__texto <?= $fontWeightClass ?>" data-anim="lines"><?= $texto ?></p>
							<img src="<?= esc_url($imagen) ?>" alt="" class="block-quienes-somos__imagen img-fluid object-fit-cover w-100 pb-3">
						</div>
					<?php endif ?>
					<?php if ($position === 'bottom'): ?>
						<div class="col-12 col-md-4 offset-md-8">
							<img src="<?= esc_url($imagen) ?>" alt="" class="block-quienes-somos__imagen img-fluid object-fit-cover w-100 pb-3">
							<p class="block-quienes-somos__texto <?= $fontWeightClass ?>" data-anim="lines"><?= $texto ?></p>
						</div>
					<?php endif ?>
					<?php if ($position === 'left'): ?>
						<div class="col-12 col-md-4">
							<p class="block-quienes-somos__texto <?= $fontWeightClass ?>" data-anim="lines"><?= $texto ?></p>
						</div>
						<div class="col-12 col-md-4">
							<img src="<?= esc_url($imagen) ?>" alt="" class="block-quienes-somos__imagen img-fluid object-fit-cover w-100 pb-3">
						</div>
					<?php endif ?>
					<?php if ($position === 'right'): ?>
						<div class="col-12 col-md-4">
							<img src="<?= esc_url($imagen) ?>" alt="" class="block-quienes-somos__imagen img-fluid object-fit-cover w-100 pb-3">
						</div>
						<div class="col-12 col-md-4">
							<p class="block-quienes-somos__texto <?= $fontWeightClass ?>" data-anim="lines"><?= $texto ?></p>
						</div>
					<?php endif ?>
				</div>
			</div>
		<?php
			$index++;
		endforeach; ?>
	</div>
</section>