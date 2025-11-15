<?php

/**
 * Footer template
 * @package checkcreative
 */

// Menú del footer
$args_footer = [
	'theme_location'  => 'menu-footer',
	'container'       => 'nav',
	'container_class' => 'footer-nav',
	'menu_class'      => 'list-unstyled mb-0',
	'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
	'fallback_cb'     => false,
];

$menu_name = 'menu-footer';

// Obtener el objeto del menú a partir de la ubicación (theme_location)
$locations = get_nav_menu_locations();

if (isset($locations[$menu_name])) {
	$menu_id = $locations[$menu_name];
	$menu_items = wp_get_nav_menu_items($menu_id);
}

?>

</main>
<aside class="position-fixed bottom-0 start-0 end-0 mb-3 px-5 z-3">
	<div class="d-flex justify-content-between align-items-center w-100">
		<button
			id="theme-toggle"
			class="btn btn-sm theme-toggle"
			aria-pressed="false"
			aria-label="Cambiar tema">
			<span class="theme-toggle__label">Tema</span>
		</button>

		<div class="time-stamp text-end small">
			<p class="mb-0" data-current-time>
				<span data-current-time-hours>09</span>:
				<span data-current-time-minutes>00</span>:
				<span data-current-time-seconds>24</span>
				<span data-current-time-timezone>CET</span>
			</p>
		</div>
	</div>
</aside>

<footer id="site-footer" class="bg-primary text-dark z-0">
	<div data-footer-parallax="" class="footer-wrap position-relative overflow-hidden">
		<footer data-footer-parallax-inner="" class="block-check-footer container position-relative  d-flex flex-column justify-content-between ls-3 p-4">
			<div class="block-check-footer__links-row d-flex text-light row">
				<div class="block-check-footer__col d-flex flex-column col-4">
					<p class="demo-eyebrow">( Pages )</p>
					<div class="block-check-footer__links d-flex align-items-start flex-column gap-1">
						<?php if (!empty($menu_items)) :
							foreach ($menu_items as $item) : ?>
								<a data-underline-link
									href="<?php echo esc_url($item->url); ?>"
									class="block-check-footer__a text-capitalize h4 m-0">
									<?php echo esc_html($item->title); ?>
								</a>
						<?php endforeach;
						endif; ?>
					</div>
				</div>
				<div class="block-check-footer__col d-flex flex-column col-4">
					<p class="demo-eyebrow">( Socials )</p>
					<div class="block-check-footer__links d-flex align-items-start flex-column gap-1">
						<a data-underline-link="" href="#" class="block-check-footer__a">LinkedIn</a>
						<a data-underline-link="" href="#" class="block-check-footer__a">Instagram</a>
						<a data-underline-link="" href="#" class="block-check-footer__a">X/Twitter</a>
					</div>
				</div>
				<div class="block-check-footer__col d-flex flex-column col-4">
					<p class="demo-eyebrow">( Contact )</p>
					<div class="block-check-footer__links d-flex align-items-start flex-column gap-1">
						<a data-underline-link="" href="mailto:<?= get_field('opciones_sitio_mail', 'option') ?>" class="block-check-footer__a"><?= get_field('opciones_sitio_mail', 'option') ?></a>
						<a data-underline-link="" href="tel:<?= get_field('opciones_sitio_phone', 'option') ?>" class="block-check-footer__a"><?= get_field('opciones_sitio_phone', 'option') ?></a>
					</div>
				</div>
			</div>
			<div class="block-check-footer__logo-row d-flex flex-row text-light">
				<?php if (get_field('opciones_sitio_show_logo', 'option')) : ?>
					<img src="<?= get_field('opciones_sitio_logo_principal_white', 'option'); ?>" alt="Checkcreative" height="40">
				<?php else : ?>
					<div class="display block-check-footer__logo-text"><?= get_field('opciones_sitio_show_footer_text', 'option') ?></div>
				<?php endif; ?>
			</div>
		</footer>
		<div data-footer-parallax-dark="" class="footer-wrap__dark"></div>
	</div>
</footer>


<?php wp_footer(); ?>

</body>

</html>