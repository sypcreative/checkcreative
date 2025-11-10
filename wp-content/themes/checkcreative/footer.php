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

// Páginas legales
$pages = [
	'aviso-legal',
	'politica-de-cookies',
	'politica-de-privacidad',
	'envios-y-devoluciones',
	'terminos-condiciones'
];
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
	<div class="container py-5">
		<div class="row g-4 align-items-start">
			<div class="col-md">
				<a class="d-inline-block mb-3 text-dark text-decoration-none" href="<?php echo esc_url(home_url('/')); ?>">
					<?php bloginfo('name'); ?>
				</a>
				<p class="small mb-0">© <?php echo esc_html(date('Y')); ?> <?php bloginfo('name'); ?>. Todos los derechos reservados.</p>
			</div>

			<div class="col-md-auto">
				<?php wp_nav_menu($args_footer); ?>
			</div>

			<div class="col-md-auto">
				<ul class="list-unstyled small mb-0">
					<?php foreach ($pages as $slug) :
						$p = get_page_by_path($slug);
						if ($p) : ?>
							<li>
								<a class="enlace-footer d-block" href="<?php echo esc_url(get_permalink($p->ID)); ?>">
									<?php echo esc_html(get_the_title($p->ID)); ?>
								</a>
							</li>
					<?php endif;
					endforeach; ?>
				</ul>
			</div>
		</div>
	</div>
</footer>


<?php wp_footer(); ?>

</body>

</html>