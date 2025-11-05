<?php

/**
 * The template for displaying all single posts proyectos
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package checkcreative
 */

get_header();
?>


<?php while (have_posts()) : the_post(); ?>

	<?php
	// Campos ACF
	$proyecto_title = get_field('post_type_proyectos_title');
	$proyecto_cliente = get_field('post_type_proyectos_client');
	$proyecto_ubicacion = get_field('post_type_proyectos_location');
	?>

	<?php if ($proyecto_title || $proyecto_cliente || $proyecto_ubicacion) : ?>
		<section class="proyecto-header container pb-5 pt-9">
			<div class="row align-items-center text-center text-md-start pt-8">

				<!-- Título -->
				<div class="col-12 text-center pb-5">
					<?php if ($proyecto_title) : ?>
						<h1 class="proyecto-header__title fw-bold text-uppercase m-0 display">
							<?php echo esc_html($proyecto_title); ?>
						</h1>
					<?php endif; ?>
				</div>

				<div class="col-6 mb-0 text-start text-uppercase pt-0 pt-md-5">
					<?php if ($proyecto_cliente) : ?>
						<p class="mb-0 text-uppercase fw-bold small ls-3">Client</p>
						<p class="mb-0 fs-6"><?php echo esc_html($proyecto_cliente); ?></p>
					<?php endif; ?>
				</div>


				<!-- Ubicación -->
				<div class="col-6 mt-0 text-end text-uppercase pt-0 pt-md-5">
					<?php if ($proyecto_ubicacion) : ?>
						<p class="mb-0 text-uppercase fw-bold small ls-3">Location</p>
						<p class="mb-0 fs-6"><?php echo esc_html($proyecto_ubicacion); ?></p>
					<?php endif; ?>
				</div>

			</div>
		</section>
	<?php endif; ?>

	<section class="proyecto-content">
		<?php the_content(); ?>
	</section>

<?php endwhile; ?>

<?php get_footer(); ?>