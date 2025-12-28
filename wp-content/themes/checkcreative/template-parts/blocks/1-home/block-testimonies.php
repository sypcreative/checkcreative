<?php
$title = get_field('block_testimonies_title');
$repeater = get_field('block_testimonies_repeater');
?>

<section class="block-testimonies vw-100 position-relative pt-0 pt-md-7 pb-10">
	<div class="block-testimonies__content container position-relative z-1">
		<div class="row">
			<div class="col-12">
				<h1 class="display-md h2 text-center pb-5"><?php echo esc_html($title); ?></h1>
			</div>

			<div class="col-12">
				<div class="block-testimonies__marquee" data-css-marquee-testimonies>
					<div class="block-testimonies__marquee-track">
						<div class="block-testimonies__marquee-list" data-css-marquee-list-testimonies>
							<?php foreach ($repeater as $item) {
								$text = $item['block_testimonies_repeater_text'] ?? '';
								$author = $item['block_testimonies_repeater_title'] ?? '';
							?>
								<div class="block-testimonies__item">
									<blockquote class="block-testimonies__quote px-4 px-md-5 py-2 d-flex flex-column justify-content-center">
										<p class="block-testimonies__text fs-6 mb-3 h-auto">
											<?php echo esc_html($text); ?>
										</p>
										<div class="block-testimonies__author text-end h-auto fw-bold">
											<?php echo esc_html($author); ?>
										</div>
										<span class="block-testimonies__corner top-left"></span>
										<span class="block-testimonies__corner top-right"></span>
										<span class="block-testimonies__corner bottom-right"></span>
										<span class="block-testimonies__corner bottom-left"></span>
									</blockquote>
								</div>
							<?php } ?>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</section>