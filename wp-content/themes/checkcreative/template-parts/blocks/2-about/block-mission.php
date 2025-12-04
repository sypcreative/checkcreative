<?php

$title = get_field('block_mission_title') ?? '';
$mission = get_field('block_mission_mission') ?? '';
?>

<section class="block-mission position-relative py-md-5 pt-15">
	<div class="container h-100">
		<div class="row h-100">
			<div class="col-12 col-md-5 offset-md-6 d-flex flex-column justify-content-center h-100 text-center">
				<h2 class="block-mission__title h2 mb-4">
					<?php echo esc_html($title); ?>
				</h2>

				<p class="block-mission__mission fs-6">
					<?php echo esc_html($mission); ?>
				</p>
			</div>
		</div>
	</div>
</section>