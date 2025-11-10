<?php
$title = get_field('block_team_title');
$repeater = get_field('block_team_repeater');
?>

<section class="block-team h-100 vw-100 position-relative py-5">
	<div class="block-team__content d-flex flex-column position-relative z-1 h-100 pt-5" data-directional-hover="" data-type="y">
		<h2 class="block-team__title w-100 text-center mb-5 display">
			<?php echo esc_html($title); ?>
		</h2>
		<div class="block-team__members row g-4 pt-5 align-items-center">
			<?php foreach ($repeater as $item) {
				$name = $item['block_team_repeater_name'] ?? '';
				$role = $item['block_team_repeater_charge'] ?? '';
			?>
				<div data-directional-hover-item="" class="block-team__members_member position-relative d-flex flex-row align-items-center justify-content-between directional-list__item overflow-hidden text-decoration-none">
					<div data-directional-hover-tile="" class="directional-list__hover-tile"></div>
					<div class="directional-list__border is--item"></div>
					<div class="block-team__members_member_info d-flex flex-row justify-content-between align-items-center position-relative w-100">
						<p class="block-team__members_member_info_name h1 text-uppercase mb-0 fw-600">
							<?php echo esc_html($name); ?>
						</p>
						<p class="block-team__members_member_info_role mb-0 fs-5 text-uppercase">
							<?php echo esc_html($role); ?>
						</p>
					</div>
				</div>
			<?php } ?>
		</div>
		<div class="directional-list__border"></div>
	</div>
</section>