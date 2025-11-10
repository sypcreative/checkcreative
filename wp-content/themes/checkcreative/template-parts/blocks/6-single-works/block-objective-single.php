<?php
$title = get_field('block_single_objective_title');
$objective = get_field('block_single_objective_objective');
?>

<section class="block-single-objective h-100 vw-100 position-relative pt-8">
	<div class="container">
		<div class="row">
			<div class="col-12 col-md-6 offset-md-3 text-start text-md-center">
				<h4 class="pb-0 pb-md-5 h3 h-md-4" title-anim><?php echo esc_html($title); ?></h4>
				<p class="fs-6 fs-md-5" data-highlight-text><?php echo esc_html($objective); ?></p>
			</div>
		</div>
	</div>
	<!-- <div class="block-single-objective__circle position-relative rounded-circle d-flex align-items-center justify-content-center">
		<div class="block-single-objective__circle-stamp w-100 h-100 position-relative w-100 h-100">
			<span class="block-single-objective__circle-stamp__text" id="roundedText"> SYP CREATIVE · VISUAL DESIGN · DIGITAL EXPERIENCE · </span>
		</div>
	</div> -->
</section>