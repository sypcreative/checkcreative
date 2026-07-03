<?php

/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package checkcreative
 */

get_header();
?>

<section class="block-404 vh-100 vw-100 d-flex align-items-center justify-content-center position-relative overflow-clip text-center">
	<div class="container">
		<span class="block-404__eyebrow d-block small text-uppercase ls-3 mb-3">
			<?php esc_html_e('Error 404', 'checkcreative'); ?>
		</span>

		<div class="block-404__number display d-flex justify-content-center mb-4" aria-hidden="true">
			<span class="block-404__count" data-count-to="404">0</span>
		</div>

		<h1 class="block-404__title h2 mx-auto mb-4">
			<?php esc_html_e('Esta página se ha perdido en el camino.', 'checkcreative'); ?>
		</h1>

		<p class="block-404__text fs-6 mx-auto mb-5">
			<?php esc_html_e('Puede que el enlace esté roto o que la página ya no exista. Vuelve al inicio y sigue explorando.', 'checkcreative'); ?>
		</p>

		<div class="btn-group justify-content-center d-flex">
			<a href="<?php echo esc_url(home_url('/')); ?>" class="btn-icon-link d-flex text-primary text-decoration-none w-inline-block">
				<div class="btn-icon-content bg-dark justify-content-start d-flex position-relative overflow-hidden align-items-center text-light">
					<div class="btn-icon-content__mask z-1 justify-content-start d-flex align-items-center position-relative overflow-hidden">
						<span data-button-anim-target="" class="btn-icon-content__text">
							<?php esc_html_e('Volver al inicio', 'checkcreative'); ?>
						</span>
					</div>
					<div data-button-anim-target="" class="btn-icon-content__bg bg-primary position-absolute bottom-0"></div>
				</div>
			</a>
		</div>
	</div>
</section>

<?php
get_footer();
