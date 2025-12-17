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

$show_theme     = get_field('opciones_sitio_show_theme_toggle', 'option');
$show_language  = get_field('opciones_sitio_show_language_toggle', 'option');
$show_timestamp = get_field('opciones_sitio_show_timestamp', 'option');
$show_cta = get_field('opciones_sitio_show_cta_toggle', 'option');
$url_cal = get_field('opciones_sitio_show_url_cal', 'option');
$url_cal_url = $url_cal ? $url_cal['url'] : '';
$url_cal_title = $url_cal ? $url_cal['title'] : '';
$target_cal = $url_cal ? $url_cal['target'] : '_self';
?>

</main>
<aside class="position-fixed bottom-0 start-0 end-0 mb-3 px-5 z-10">
	<div class="d-flex justify-content-between align-items-center w-100">
		<?php if ($show_theme): ?>
			<button id="theme-toggle"
				class="theme-toggle btn-darklight"
				aria-pressed="false"
				aria-label="Cambiar tema"
				data-theme-toggle="">
				<div class="btn-darklight__icon">
					<div class="btn-darklight__icon-box">
						<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 24 24" fill="none">
							<path d="M15.5355 8.46447C17.4882 10.4171 17.4882 13.5829 15.5355 15.5355C13.5829 17.4882 10.4171 17.4882 8.46447 15.5355C6.51184 13.5829 6.51184 10.4171 8.46447 8.46447C10.4171 6.51184 13.5829 6.51184 15.5355 8.46447Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M12 4V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M12 22V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M18.3599 5.63999L19.0699 4.92999" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M4.93018 19.07L5.64018 18.36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M20 12H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M2 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M18.3599 18.36L19.0699 19.07" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M4.93018 4.92999L5.64018 5.63999" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</div>
					<div class="btn-darklight__icon-box is--absolute">
						<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 24 24" fill="none">
							<path d="M18.395 13.027C18.725 12.872 19.077 13.197 18.985 13.55C18.671 14.752 18.054 15.896 17.104 16.846C14.283 19.667 9.77001 19.726 7.02201 16.978C4.27401 14.23 4.33401 9.71601 7.15501 6.89501C8.10501 5.94501 9.24801 5.32801 10.451 5.01401C10.804 4.92201 11.128 5.27401 10.974 5.60401C9.97201 7.74301 10.301 10.305 11.998 12.002C13.694 13.7 16.256 14.029 18.395 13.027Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</div>
				</div>
			</button>
		<?php endif; ?>

		<?php if ($show_timestamp): ?>
			<div class="time-stamp text-end small text-primary">
				<p class="mb-0" data-current-time>
					<span data-current-time-hours>09</span>:
					<span data-current-time-minutes>00</span>:
					<span data-current-time-seconds>24</span>
					<span data-current-time-timezone>CET</span>
				</p>
			</div>
		<?php endif; ?>

		<?php if ($show_language): ?>
			<?php
			$langs = pll_the_languages([
				'raw'                    => 1, // Devuelve array
				'hide_if_no_translation' => 0,
			]);

			if ($langs):
				$total = count($langs);
				$i     = 0;
			?>
				<div class="language-toggle small text-end text-primary">
					<?php foreach ($langs as $lang): ?>
						<?php $i++; ?>

						<a href="<?php echo esc_url($lang['url']); ?>"
							data-barba-prevent
							class="lang-link text-primary <?php echo $lang['current_lang'] ? 'is-active' : ''; ?>">
							<?php echo strtoupper($lang['slug']); ?>
						</a>

						<?php if ($i < $total): ?>
							<span class="lang-separator"> / </span>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		<?php endif; ?>

		<?php if ($show_cta) : ?>
			<div class="ms-3">
				<a
					href="<?php echo esc_url($url_cal_url); ?>"
					class="btn btn-primary text-uppercase text-light"
					target="_blank">
					<?php echo esc_html($url_cal_title); ?>
				</a>
			</div>
		<?php endif; ?>
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
		</footer>
		<div data-footer-parallax-dark="" class="footer-wrap__dark"></div>
	</div>
</footer>

<div class="cursor-text">
	<p class="cursor-paragraph fs-6 m-0">Learn more</p>
</div>
<?php wp_footer(); ?>

</body>

</html>