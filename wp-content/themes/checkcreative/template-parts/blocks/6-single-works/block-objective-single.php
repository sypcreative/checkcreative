<?php
$title = get_field('block_single_objective_title');
$objective = get_field('block_single_objective_objective');
?>

<section class="block-single-objective h-100 vw-100 position-relative pt-8">
	<div class="container">
		<div class="row">
			<div class="col-6 offset-3 text-center">
				<h4 class="pb-5"><?php echo esc_html($title); ?></h4>
				<p class="fs-6"><?php echo esc_html($objective); ?></p>
			</div>
		</div>
	</div>
</section>