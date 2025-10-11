<?php
defined('ABSPATH') || exit;

$text     = get_field('block_animated_banner_text');
$logo_url = get_template_directory_uri() . '/assets/img/logo-banner.png';

if (empty($text)) return;

$context_tag = checkcreative_get_newsletter_context_tag();
$tags_attr   = esc_attr('animated-banner-' . $context_tag);
?>
<div class="animated-banner bg-primary py-3">
	<div class="animated-banner__track">
		<div class="animated-banner__unit">
			<span
				type="button"
				class="animated-banner__text fw-bold display-6 me-2 js-open-newsletter"
				data-newsletter-source="Animated Banner"
				data-newsletter-tags="<?= $tags_attr; ?>"
				data-newsletter-title="<?= esc_attr($text ?: 'Únete al club'); ?>"
				data-bs-toggle="modal"
				data-bs-target="#newsletterModal">
				<?= esc_html($text); ?>
			</span>

			<img src="<?= esc_url($logo_url); ?>"
				alt="Logo checkcreative"
				class="animated-banner__img"
				height="40" />
		</div>
	</div>
</div>