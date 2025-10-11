<?php

/**
 * Bloque Banner
 *
 * @package checkcreative
 */

$block_meet_us_title             = get_field('block_meet_us_title');
$block_meet_us_subtitle          = get_field('block_meet_us_subtitle');

?>

<section class="block-meet-us d-flex align-items-center justify-content-center text-start text-md-center h-100 vw-100 bg-secondary d-none d-md-block">
	<div class="container py-5">
		<div class="row py-5">
			<div class="col-12 col-md-10 offset-md-1">
				<div class="block-meet-us__inner text-primary">
					<!-- <h1 class="block-meet-us__heading position-relative meet-us-jumbo d-none d-md-block pb-1" data-anim="lines"><?= esc_html($block_meet_us_title); ?></h1> -->
					<h1 class="block-meet-us__heading position-relative meet-us-jumbo pb-1" data-anim="lines"><?= esc_html($block_meet_us_title); ?></h1>
					<p class="h6 century fw-light" data-anim="lines"><?= $block_meet_us_subtitle ?></p>
				</div>
			</div>
		</div>
	</div>
</section>