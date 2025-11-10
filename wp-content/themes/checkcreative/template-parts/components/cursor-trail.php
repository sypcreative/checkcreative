<?php
$repeater = get_field('opciones_sitio_cursor_images_repeater', 'option');

if ($repeater) : ?>
	<div class="trail-wrap">
		<div class="trail-list">
			<?php foreach ($repeater as $item) :
				$image = $item['opciones_sitio_cursor_images_repeater_image']; // el subcampo del repeater
				if (!$image) continue;
			?>
				<div data-trail="item" class="trail-item">
					<img
						src="<?php echo esc_url($image['url']); ?>"
						alt="<?php echo esc_attr($image['alt'] ?: 'Cursor Trail'); ?>"
						class="trail-item__img" />
				</div>
			<?php endforeach; ?>
		</div>
	</div>
<?php endif; ?>