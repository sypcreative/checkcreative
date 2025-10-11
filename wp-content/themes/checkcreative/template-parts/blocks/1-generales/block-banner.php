<?php

/**
 * Bloque Banner
 *
 * @package checkcreative
 */

$block_banner_text             = get_field('block_banner_text');
$block_banner_description      = get_field('block_banner_description');
$block_banner_button_cta       = get_field('block_banner_cta');
$block_banner_button_cta_title = $block_banner_button_cta['title'] ?? '';
$block_banner_button_cta_link  = $block_banner_button_cta['url'] ?? '';
$block_banner_button_cta_target = $block_banner_button_cta['target'] ?? '_self';
?>

<section class="banner-cerveza align-items-center text-center h-100 vw-100 bg-secondary">
	<div class="container">
		<div class="row justify-content-center py-5">
			<div class="col-12 py-5">
				<div class="banner-cerveza__inner text-primary py-5">

					<?php if ($block_banner_text): ?>
						<h1 class="banner-cerveza__heading position-relative jumbo w-80 start-50 translate-middle-x" data-anim="lines">
							<?= esc_html($block_banner_text); ?>
						</h1>
					<?php endif; ?>

					<p class="body" data-anim="lines"><?= wp_kses_post($block_banner_description); ?></p>
					<button
						type="button"
						class="btn btn-pink px-5 mt-5 js-open-newsletter"
						data-newsletter-source="Banner Cerveza checkcreative"
						data-newsletter-tags="banner-cerveza-checkcreative"
						data-newsletter-title="<?= esc_attr($block_banner_text ?: 'Únete al club'); ?>"
						data-bs-toggle="modal"
						data-bs-target="#newsletterModal">
						<?= esc_html($block_banner_button_cta_title ?: '¡Unirme!'); ?>
					</button>

				</div>
			</div>
		</div>
	</div>
</section>