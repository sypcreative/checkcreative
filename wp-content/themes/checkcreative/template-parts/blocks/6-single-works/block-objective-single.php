<?php
$title = get_field('block_single_objective_title');
$objective = get_field('block_single_objective_objective');
$imagen = get_field('block_single_objective_image');
?>

<section class="block-single-objective h-100 vw-100 position-relative pt-8">
	<div class="container">
		<div class="row">
			<div class="col-12 d-md-none d-block">
				<img src="<?php echo esc_url($imagen); ?>" alt="Line Objective Mobile" class="img-fluid mb-4">
			</div>
			<div class="col-12 col-md-8 offset-md-2 text-start text-md-center">
				<h4 class="pb-0 pb-md-5 h3 h-md-4 text-uppercase" title-anim><?php echo esc_html($title); ?></h4>
				<p class="fs-6 fs-md-5" data-highlight-text><?php echo esc_html($objective); ?></p>
			</div>
		</div>
	</div>
</section>