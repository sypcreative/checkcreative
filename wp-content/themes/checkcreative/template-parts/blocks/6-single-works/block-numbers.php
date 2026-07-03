<?php

$title = get_field('block_numbers_title') ?: '';
$items = get_field('block_numbers_items') ?: [];

if (!$items) {
	return;
}
?>

<section class="block-numbers position-relative py-5 py-md-8">
	<div class="container">
		<?php if ($title) : ?>
			<h4 class="block-numbers__title h3 h-md-4 text-uppercase text-center mb-5 mb-md-6">
				<?php echo esc_html($title); ?>
			</h4>
		<?php endif; ?>

		<div class="block-numbers__row row gy-5 gy-md-0">
			<?php foreach ($items as $index => $item) :
				$num    = str_pad($index + 1, 2, '0', STR_PAD_LEFT);
				$prefix = $item['block_numbers_items_prefix'] ?? '';
				$value  = $item['block_numbers_items_value'] ?? 0;
				$value  = is_numeric($value) ? $value + 0 : 0;
				$suffix = $item['block_numbers_items_suffix'] ?? '';
				$label  = $item['block_numbers_items_label'] ?? '';
			?>
				<div class="col-12 col-md-4 block-numbers__col position-relative">
					<div class="block-numbers__item text-center px-md-4">

						<div class="block-numbers__value display d-flex justify-content-center align-items-start mb-3">
							<?php if ($prefix !== '') : ?>
								<span class="block-numbers__prefix"><?php echo esc_html($prefix); ?></span>
							<?php endif; ?>

							<span
								class="block-numbers__count"
								data-count-to="<?php echo esc_attr($value); ?>">0</span>

							<?php if ($suffix !== '') : ?>
								<span class="block-numbers__suffix"><?php echo esc_html($suffix); ?></span>
							<?php endif; ?>
						</div>

						<p class="block-numbers__label fs-6 mb-0"><?php echo esc_html($label); ?></p>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>