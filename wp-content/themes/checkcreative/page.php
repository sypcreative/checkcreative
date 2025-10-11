<?php

/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package checkcreative
 */
$hero = get_field('hero_general_selector');
get_header();

?>

<main id="primary" class="site-main">

	<?php
	if ($hero == "home") {
		get_template_part('template-parts/blocks/2-home/block-home-hero');
	} elseif ($hero == "nosotros") {
		get_template_part('template-parts/blocks/4-about/block-hero-nosotros');
	} else if ($hero == "blog") {
		get_template_part('template-parts/blocks/3-blog/block-hero-blog');
	} else {
		echo '<div class="py-5"></div>';
	}
	// Contenido de la página
	the_content();

	?>

</main><!-- #main -->
<?php
get_sidebar();
get_footer();
