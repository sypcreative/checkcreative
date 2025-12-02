<?php
$title = get_field('block_timeline_services_title');
$services = get_field('block_timeline_services_services') ?: [];
$images = get_field('block_timeline_services_images') ?: [];
?>
<section class="block-line overflow-visible" data-line-scroll>
	<div class="block-line__wrapper">
		<svg id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1035.78 3063.93">
			<g id="Capa_1-2" data-name="Capa 1">
				<path id="linea-trazo" class="cls-1" d="M480.97.31c-40.65,126.69-25.19,178.91,0,202.08,56.39,51.86,160.98-42.31,303.12,0,89.05,26.51,185.01,104.25,194,198.14,10.61,110.75-104.11,198.58-145.5,230.27-282.65,216.42-747.88,141.63-816.42,0-67.95-140.42,108.32-150.72,210.54-59.84,87.12,77.45,72.26,105.62,270.42,277.51,94.69,82.14,302.94,126.69,396.08,291.58,69.43,122.92,88.1,320.72-4.04,408.21-131.09,124.48-366.72-88.05-630.5,44.46-97.39,48.92-206.79,148.99-218.25,270.79-19.92,211.79,261,439,525.42,440.54,229.4,1.34,474.71-167.02,468.83-311.21-3.59-88.08-101.31-177.2-153.58-161.67-53.21,15.81-48.05,136.71-68.71,270.79-40.25,261.26-152.64,299.91-230.38,557.75-27.07,89.78-57.56,225.75-57.38,404.2" />
			</g>
		</svg>

		<?php $i = 1; ?>
		<?php if (have_rows('block_timeline_services_services')): ?>
			<?php while (have_rows('block_timeline_services_services')): the_row(); ?>
				<?php
				$service_phase = get_sub_field('block_timeline_services_services_phase');
				$service_title = get_sub_field('block_timeline_services_services_title');
				$service_text  = get_sub_field('block_timeline_services_services_text');
				?>
				<article class="process-step process-step--<?= $i ?>">
					<span class="process-step__badge"><?= esc_html($service_phase) ?></span>
					<h3 class="process-step__title"><?= esc_html($service_title) ?></h3>
					<p class="process-step__text" data-highlight-text>
						<?= esc_html($service_text) ?>
					</p>
				</article>
				<?php $i++; ?>
			<?php endwhile; ?>
		<?php endif; ?>

		<?php if (!empty($images)): ?>
			<div class="process-images">
				<?php $img_i = 1; ?>
				<?php foreach ($images as $img_item): ?>
					<?php
					$img = $img_item['block_timeline_services_images_image'] ?? null;
					$img_url = is_array($img) ? ($img['url'] ?? '') : '';
					$img_alt = is_array($img) ? ($img['alt'] ?? '') : '';

					if (!$img_url) continue;
					?>
					<div class="process-image process-image--<?= $img_i ?>">
						<img src="<?= esc_url($img_url) ?>" alt="<?= esc_attr($img_alt) ?>" loading="lazy">
					</div>
					<?php $img_i++; ?>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
		<h2 class="process-label process-label--1"><?= esc_html($title) ?></h2>
	</div>
</section>