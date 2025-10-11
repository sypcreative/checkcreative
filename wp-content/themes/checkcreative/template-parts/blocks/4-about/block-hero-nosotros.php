<?php

/**
 * Bloque Hero Nosotros
 *
 * @package checkcreative
 */

$subtitulo             = get_field('block_hero_nosotros_subtitulo');
$titulo             = get_field('block_hero_nosotros_titulo');
$repeater             = get_field('block_hero_nosotros_pills');

?>

<!-- Bloque Hero Nosotros -->

<section class="container block-hero-nosotros vh-100 vw-100 align-content-center position-relative">
	<div class="text-center">
		<h1 class="jumbo mb-4 text-uppercase" data-anim="lines"><?= $titulo ?></h1>
		<h2 class="body century" data-anim="lines"><?= $subtitulo ?></h2>
	</div>

	<?php
	$index = 0;
	foreach ($repeater as $pill):
		$texto = $pill['block_hero_nosotros_pills_texto'];
	?>
		<p class="text-primary text-uppercase century fs-md-6 position-absolute badge rounded-pill px-4 py-2 bg-pink magnetic-badge"><?= $texto ?></p>
	<?php
	endforeach; ?>
</section>