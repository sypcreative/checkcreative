<?php

/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package checkcreative
 */

$menu_principal = [
	'theme_location' => 'menu-principal',
	'container'      => 'ul',
	'menu_class'     => 'navbar-nav mx-auto py-2 py-md-0',
	'walker'         => new PrimaryMenu_Walker_Nav_Menu(),
	'fallback_cb'    => false,
];
?>
<!doctype html>
<html <?php language_attributes(); ?>>

<head>
	<?php get_template_part('template-parts/gtm/gtm', 'head') ?>
	<!-- Cookiebot -->
	<script id="Cookiebot"
		src="https://consent.cookiebot.com/uc.js"
		data-cbid="38c723d1-4681-485a-95cb-3c93bb20e480"
		data-blockingmode="auto"
		type="text/javascript"></script>
	<?php get_template_part('template-parts/gtm/gtm', 'script') ?>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="format-detection" content="telephone=no">
	<link rel="profile" href="https://gmpg.org/xfn/11">


	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<div class="barba-transition-overlay"></div>
	<div data-barba="wrapper">
		<?php wp_body_open(); ?>
		<div id="page" class="site" data-barba="container" data-barba-namespace="<?php echo get_post_field('post_name', get_post()); ?>">
			<!-- Nav Cabecera -->
			<header class="position-fixed w-100 z-4">
				<div class="container-fluid">
					<div class="row">
						<div class="col-12">
							<nav class="navbar navbar-expand-md mt-2 mt-md-4 position-relative" id="menuCabecera">
								<div class="container-fluid py-1">
									<!-- Enlaces izquierda -->
									<div class="d-none d-md-flex me-auto text-uppercase">
										<?php
										wp_nav_menu([
											'theme_location' => 'menu-izquierda',
											'container' => false,
											'menu_class' => 'navbar-nav flex-row gap-3',
											'fallback_cb' => false,
										]);
										?>
									</div>
									<!-- Logo centrado -->
									<a class="navbar-brand position-absolute top-50 start-50 translate-middle d-md-block d-none" href="<?= get_home_url() ?>">
										<img src="<?= get_field('opciones_sitio_logo_principal', 'option') ?>" alt="checkcreative Logo" style="height: 40px;">
									</a>
									<a class="navbar-brand position-absolute top-50 start-50 translate-middle d-md-none d-block" href="<?= get_home_url() ?>">
										<img src="<?= get_field('opciones_sitio_logo_principal', 'option') ?>" alt="checkcreative Logo" style="height: 40px;">
									</a>
									<!-- Botón toggle -->
									<button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
										<span class="navbar-toggler-icon"></span>
									</button>
								</div>
								<!-- Enlaces derecha -->
								<div class="d-none d-md-flex ms-auto text-uppercase">
									<?php
									wp_nav_menu([
										'theme_location' => 'menu-derecha',
										'container' => false,
										'menu_class' => 'navbar-nav ms-auto flex-row gap-3',
										'fallback_cb' => false,
									]);
									?>
								</div>
								<!-- Menú Mobile a pantalla completa -->
								<div class="collapse-mobile fullscreen-menu d-md-none jumbo text-uppercase tumb bg-primary gap-3" id="mobileNavbar">
									<a class="navbar-nav flex-row gap-3 w-100 text-secondary" href="<?= get_home_url() ?>">
										<span data-anim="nav-links">HOME</span>
									</a>
									<?php
									wp_nav_menu([
										'theme_location' => 'menu-izquierda',
										'container' => false,
										'menu_class' => 'navbar-nav flex-row gap-3 w-100 text-secondary',
										'fallback_cb' => false,
										'link_before' => '<span data-anim="nav-links">',
										'link_after' => '</span>',
									]);
									wp_nav_menu([
										'theme_location' => 'menu-derecha',
										'container' => false,
										'menu_class' => 'navbar-nav flex-row gap-3 w-100 text-secondary',
										'fallback_cb' => false,
										'link_before' => '<span data-anim="nav-links">',
										'link_after' => '</span>',
									]);
									?>
								</div>
							</nav>
						</div>
					</div>
				</div>
			</header>