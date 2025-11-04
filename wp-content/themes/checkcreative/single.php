<?php

/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package checkcreative
 */
$hero = get_field('hero_general_selector');
get_header();
?>


	<?php
	while (have_posts()) :
		the_post();
		// Contenido de la página
		the_content();

	endwhile; // End of the loop.
	?>


<?php get_footer(); ?>
