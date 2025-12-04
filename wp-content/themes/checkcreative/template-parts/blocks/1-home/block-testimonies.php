<?php
$title = get_field('block_testimonies_title');
$repeater = get_field('block_testimonies_repeater');
?>

<section class="block-testimonies vw-100 position-relative pt-7 pb-10">
	<div class="block-testimonies__content container position-relative z-1">
		<div class="row g-4">
			<div class="col-12">
				<h1 class="display text-center"><?php echo esc_html($title); ?></h1>
			</div>
			<?php foreach ($repeater as $item) {
				$text = $item['block_testimonies_repeater_text'] ?? '';
				$author = $item['block_testimonies_repeater_title'] ?? '';
			?>
				<div class="col-12 col-md-6">
					<blockquote class="block-testimonies__quote p-4 h-100 d-flex flex-column justify-content-between">
						<p class="block-testimonies__text fs-5 mb-4 text-center">
							<?php echo esc_html($text); ?>
						</p>
						<footer class="block-testimonies__author text-end fw-bold">
							<?php echo esc_html($author); ?>
						</footer>
					</blockquote>
				</div>
			<?php } ?>
		</div>
	</div>
</section>