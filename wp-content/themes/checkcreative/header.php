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

function barba_namespace()
{
	if (is_front_page() || is_home()) return 'home';
	if (is_page_template('template-contacto.php') || is_page('contacto')) return 'contacto';
	if (is_singular('proyectos')) return 'single-proyecto';
	if (is_single()) return 'single';
	if (is_archive()) return 'archive';
	if (is_search()) return 'search';
	if (is_404()) return '404';
	if (is_page()) {
		$slug = get_post_field('post_name', get_post());
		return $slug ?: 'page';
	}
	return 'default';
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="format-detection" content="telephone=no">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon.png" sizes="150x50">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?> data-theme-status="light" data-barba="wrapper" data-cursor="<?php echo get_field('opciones_sitio_cursor_basic', 'option') ? 'basic' : 'none'; ?>" id="barba-wrapper">
	<?php wp_body_open(); ?>
	<?php if (get_field('opciones_sitio_cursor_basic', 'option')) : ?>
		<div class="cursor"></div>
	<?php endif; ?>
	<div id="page" class="site">
		<!-- Nav Cabecera -->
		<header class="position-fixed w-100 z-100">
			<div class="px-5">
				<nav class="mt-2 mt-md-4" id="menuCabecera">
					<div class="d-flex align-items-end justify-content-end d-md-none">
						<!-- Toggle móvil -->
						<button class="navbar-toggler"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#mobileNavbar"
							aria-controls="mobileNavbar"
							aria-expanded="false"
							aria-label="Toggle navigation">
							<span class="navbar-toggler-icon">MENU</span>
						</button>
					</div>

					<!-- Menú fullscreen móvil -->
					<div class="collapse fullscreen-menu d-md-none jumbo text-uppercase bg-primary gap-3 p-3" id="mobileNavbar">
						<button class="navbar-toggler position-absolute top-0 end-0 m-4"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#mobileNavbar"
							aria-controls="mobileNavbar"
							aria-expanded="true"
							aria-label="Close navigation">
							<span class="">CERRAR</span>
						</button>
						<!-- Botón de cerrar dentro del overlay -->

						<a class="navbar-nav flex-column gap-3 w-100 text-decoration-none h3" href="<?= get_home_url() ?>">
							<span>HOME</span>
						</a>
						<?php
						wp_nav_menu([
							'theme_location' => 'menu-izquierda',
							'container'      => false,
							'menu_class'     => 'navbar-nav flex-column gap-3 w-100 text-secondary h3',
							'fallback_cb'    => false,
							'link_before'    => '<span>',
							'link_after'     => '</span>',
						]);
						wp_nav_menu([
							'theme_location' => 'menu-derecha',
							'container'      => false,
							'menu_class'     => 'navbar-nav flex-column gap-3 w-100 text-secondary h3',
							'fallback_cb'    => false,
							'link_before'    => '<span>',
							'link_after'     => '</span>',
						]);
						?>
					</div>


					<!-- Rail desktop -->
					<ul class="nav-rail d-none d-md-flex">
						<?php
						wp_nav_menu([
							'theme_location' => 'menu-izquierda',
							'container'      => false,
							'items_wrap'     => '%3$s',
							'depth'          => 1,
							'fallback_cb'    => false,
							'menu_class'     => '',
							'link_class'     => 'ls-3 text-primary d-inline-block text-uppercase text-decoration-none',
						]);
						?>
						<li class="nav-rail__brand">
							<a href="<?= get_home_url(); ?>" class="nav-rail__brand-link">
								<img src="<?= get_field('opciones_sitio_logo_principal', 'option'); ?>" alt="Checkcreative" height="40">
							</a>
						</li>
						<?php
						wp_nav_menu([
							'theme_location' => 'menu-derecha',
							'container'      => false,
							'items_wrap'     => '%3$s',
							'depth'          => 1,
							'fallback_cb'    => false,
							'menu_class'     => '',
							'link_class'     => 'ls-3 text-primary d-inline-block text-uppercase text-decoration-none',
						]);
						?>
					</ul>
				</nav>

			</div>
		</header>
		<main
			class="site-main bg-secondary"
			data-barba="container"
			data-barba-namespace="<?= esc_attr(barba_namespace()); ?>">