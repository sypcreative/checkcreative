<?php
$logos = get_field('block_clientes_repeater') ?: [];
if ($logos):
?>
	<section class="block-clients position-relative py-4">
		<div class="container">
			<div class="logo-marquee overflow-hidden position-relative">
				<div class="logo-track d-flex align-items-center">
					<?php
					foreach ($logos as $item):
						$img = $item['block_clientes_repeater_logo'] ?? null;
						$url = is_array($img) ? ($img['url'] ?? '') : (string)$img;
						$alt = is_array($img) ? ($img['alt'] ?? '') : '';
						if (!$url) continue;
					?>
						<div class="logo-item d-flex align-items-center justify-content-center">
							<img src="<?= esc_url($url); ?>" alt="<?= esc_attr($alt); ?>" loading="lazy">
						</div>
					<?php endforeach; ?>

					<?php

					foreach ($logos as $item):
						$img = $item['block_clientes_repeater_logo'] ?? null;
						$url = is_array($img) ? ($img['url'] ?? '') : (string)$img;
						$alt = is_array($img) ? ($img['alt'] ?? '') : '';
						if (!$url) continue;
					?>
						<div class="logo-item d-flex align-items-center justify-content-center">
							<img src="<?= esc_url($url); ?>" alt="<?= esc_attr($alt); ?>" loading="lazy">
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</section>
<?php endif; ?>