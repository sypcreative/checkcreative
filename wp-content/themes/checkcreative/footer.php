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
<!-- <div class="row">
	<footer id="site-footer" class="bg-primary text-dark vh-100">
</div> -->
</div>

</footer>


<?php wp_footer(); ?>

</div> <!-- cierre de data-barba="container" -->
</div> <!-- cierre de data-barba="container" -->
<!-- <div class="barba-transition-overlay"></div> -->

</body>

</html>