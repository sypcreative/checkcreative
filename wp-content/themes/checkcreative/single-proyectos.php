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

<main id="primary" class="site-main">

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

					<div class="col-12 col-md-6 mb-3 mb-md-0 text-md-start text-uppercase">
						<?php if ($proyecto_cliente) : ?>
							<p class="mb-0 text-uppercase fw-bold small ls-3">Cliente</p>
							<p class="mb-0 fs-6"><?php echo esc_html($proyecto_cliente); ?></p>
						<?php endif; ?>
					</div>


					<!-- Ubicación -->
					<div class="col-12 col-md-6 mt-3 mt-md-0 text-md-end text-uppercase">
						<?php if ($proyecto_ubicacion) : ?>
							<p class="mb-0 text-uppercase fw-bold small ls-3">Ubicación</p>
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

</main><!-- #primary -->

<?php get_footer(); ?>