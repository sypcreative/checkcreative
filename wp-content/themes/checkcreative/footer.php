<?php

/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *< ?php woocommerce_mini_cart(); ?>
 * @package checkcreative
 */

$args_footer = [
	'theme_location'  => 'menu-footer',
	'container'       => 'ul',
	'menu_class'      => 'list-unstyled',
	'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
	'list_item_class' => '',
	'link_class'      => 'enlace-footer d-block',
	'fallback_cb'     => false,
];

$pages = [
	'aviso-legal',
	'politica-de-cookies',
	'politica-de-privacidad',
	'envios-y-devoluciones',
	'terminos-condiciones'
];

?>

<!-- Footer -->

</div><!-- #page -->
<div class="row">
	<div id="mini-cart-drawer" class="col-12 col-md-5 position-fixed top-0 end-0 h-100 bg-white">
		<button class="mc-close position-absolute bg-transparent border-0 h5 century pt-5" aria-label="<?php esc_attr_e('Close cart', 'textdomain'); ?>">×</button>
		<div class="mc-wrapper pt-5 p-3 overflow-y-auto h-100">
			<?php wc_get_template('cart/mini-cart.php'); ?>
		</div>
	</div>

	<div id="mini-checkout-wrapper" data-lenis-prevent class="mini-checkout col-7 d-none d-md-block position-fixed bg-white start-0 top-0">
		<div class="mini-checkout__content">
			<button class="mini-checkout__close">×</button>
			<div id="mini-checkout-form">
			</div>
		</div>
	</div>
</div>

<footer id="site-footer" class="bg-primary text-dark ">
	<div class="row pt-5 pb-2 px-4 me-0 ms-0">
		<div class="mb-lg-0 mb-4 col-6 col-md-6 col-lg-6 tex-center d-flex flex-column justify-content-start ps-4">
			<div>
				<h5 class="century text-pink">ENLACES DE INTERÉS</h5>
			</div>
			<div class="text-left">
				<a class="h6 century text-decoration-none d-block" href="https://www.cervezacheckcreative.com/">HOME</a>
				<a class="h6 century text-decoration-none d-block" href="https://www.cervezacheckcreative.com/nosotros/">NOSOTROS</a>
				<a class="h6 century text-decoration-none d-block" href="https://www.cervezacheckcreative.com/blog/">BLOG</a>
				<a class="h6 century text-decoration-none d-block" href="https://www.cervezacheckcreative.com/contacto/">CONTACTO</a>
				<a class="h6 century text-decoration-none d-block" href="https://www.cervezacheckcreative.com/tienda/">TIENDA</a>
				<a class="h6 century text-decoration-none d-block" href="https://www.cervezacheckcreative.com/puntos-de-venta/">PUNTOS DE VENTA</a>
			</div>
		</div>
		<div class="col-12 col-md-6 col-lg-6  d-flex flex-column justify-content-start align-items-end">
			<h4 class="century text-end">Calle Francisco Mateo Rodriguez 20, 05600, Barco de Avila</h4>
			<h6 class="century text-end"> <a href="mailto:<?= get_field('opciones_sitio_email', 'option') ?>"><?= get_field('opciones_sitio_email', 'option') ?></a></h6>
			<!-- <h6 class="century text-end">+34 612 345 678</h6> -->
			<!-- <h6 class="century text-end">RRSS</h6> -->
		</div>

		<div class="col-12 col-md-6 col-lg-6 pb-2 pt-4 d-flex flex-md-row flex-column align-items-end align-items-md-center justify-content-end w-100">
			<?php foreach ($pages as $slug) :
				$page = get_page_by_path($slug);
				if ($page): ?>
					<a href="<?php echo get_permalink($page->ID); ?>" class="ms-4 pointer text-uppercase">
						<?php echo esc_html(get_the_title($page->ID)); ?>
					</a>
			<?php endif;
			endforeach; ?>
		</div>
	</div>


	<div class="footer-logo position-relative">
	</div>
	<div id="footer-liquid" aria-hidden="true"></div>
	</div>

</footer>


<?php wp_footer(); ?>

</div> <!-- cierre de data-barba="container" -->
</div> <!-- cierre de data-barba="container" -->
<!-- <div class="barba-transition-overlay"></div> -->

</body>

</html>