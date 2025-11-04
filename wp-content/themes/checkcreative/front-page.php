<?php

/**
 * Front Page
 */

$hero = get_field('hero_general_selector');

get_header(); ?>


	<?php
	if ($hero == "home") {
		get_template_part('template-parts/blocks/2-home/block-home-hero');
	} elseif ($hero == "nosotros") {
		get_template_part('template-parts/blocks/4-about/block-hero-nosotros');
	} else if ($hero == "blog") {
		get_template_part('template-parts/blocks/3-blog/block-hero-blog');
	} else {
		// echo '<div class="py-5"></div>';
	}
	// Contenido de la página
	the_content();
	?>

<?php get_footer(); ?>
