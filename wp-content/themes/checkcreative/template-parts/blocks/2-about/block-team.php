<?php
$title = get_field('block_team_title');
$repeater = get_field('block_team_repeater');
?>

<section class="block-team vh-100 vw-100 position-relative py-5">
	<div class="block-team__content container position-relative z-1 h-100 py-5">
		<h2 class="block-team__title w-100 text-center mb-5 display">
			<?php echo esc_html($title); ?>
		</h2>
		<div class="block-team__members row g-4 pt-5 align-items-center">
			<?php foreach ($repeater as $item) {
				$name = $item['block_team_repeater_name'] ?? '';
				$role = $item['block_team_repeater_charge'] ?? '';
			?>
				<div class="block-team__member col-12 col-md-8 text-start">
					<h3 class="block-team__member-name h1 mb-2 text-uppercase">
						<?= esc_html($name) ?>
					</h3>
				</div>
				<div class="col-md-4">
					<p class="block-team__member-role fs-5 text-uppercase m-0 text-end">
						<?= esc_html($role) ?>
					</p>
				</div>
			<?php } ?>
		</div>
	</div>
</section>