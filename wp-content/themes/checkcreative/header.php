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
	<script>
		(function() {
			try {
				var key = 'theme';
				var saved = localStorage.getItem(key); // 'light-theme' | 'dark-theme' | null
				var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
				var initial = saved || (prefersDark ? 'dark-theme' : 'light-theme');
				document.documentElement.classList.add(initial);
				// lo guardamos para que el bundle lo lea sin recalcular
				window.__SITE_THEME__ = initial;
			} catch (e) {}
		})();
	</script>

	<meta name="format-detection" content="telephone=no">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?> data-barba="wrapper" id="barba-wrapper">
	<?php wp_body_open(); ?>
	<div id="page" class="site">
		<!-- Nav Cabecera -->
		<header class="position-fixed w-100 z-4">
			<div class="px-5">
				<nav class="mt-2 mt-md-4" id="menuCabecera">
					<!-- Rail desktop -->
					<ul class="nav-rail d-none d-md-flex">
						<?php
						// 1) Items del menú izquierdo (solo <li>, sin <ul>)
						wp_nav_menu([
							'theme_location' => 'menu-izquierda',
							'container'      => false,
							'items_wrap'     => '%3$s',
							'depth'          => 1,
							'fallback_cb'    => false,
							'menu_class'     => '', // ignorado porque no hay <ul>
							'link_class'    => 'ls-3',
						]);
						?>

						<!-- 2) Logo centrado como un item más -->
						<li class="nav-rail__brand">
							<a href="<?= get_home_url(); ?>" class="nav-rail__brand-link">
								<img src="<?= get_field('opciones_sitio_logo_principal', 'option'); ?>" alt="Checkcreative" height="40">
							</a>
						</li>

						<?php
						// 3) Items del menú derecho (solo <li>, sin <ul>)
						wp_nav_menu([
							'theme_location' => 'menu-derecha',
							'container'      => false,
							'items_wrap'     => '%3$s',
							'depth'          => 1,
							'fallback_cb'    => false,
							'menu_class'     => '',
						]);
						?>
					</ul>

					<!-- Toggle + menú móvil (lo que ya tienes) -->
					<button class="navbar-toggler d-md-none ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#mobileNavbar" aria-controls="mobileNavbar" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>

					<div class="collapse-mobile fullscreen-menu d-md-none jumbo text-uppercase tumb bg-primary gap-3" id="mobileNavbar">
						<a class="navbar-nav flex-row gap-3 w-100 text-secondary" href="<?= get_home_url() ?>">
							<span data-anim="nav-links">HOME</span>
						</a>
						<?php
						wp_nav_menu([
							'theme_location' => 'menu-izquierda',
							'container'      => false,
							'menu_class'     => 'navbar-nav flex-column text-center gap-3 w-100 text-secondary',
							'fallback_cb'    => false,
							'link_before'    => '<span data-anim="nav-links">',
							'link_after'     => '</span>',
						]);
						wp_nav_menu([
							'theme_location' => 'menu-derecha',
							'container'      => false,
							'menu_class'     => 'navbar-nav flex-column text-center gap-3 w-100 text-secondary',
							'fallback_cb'    => false,
							'link_before'    => '<span data-anim="nav-links">',
							'link_after'     => '</span>',
						]);
						?>
					</div>
				</nav>
			</div>
		</header>
		<button id="theme-toggle" class="btn btn-sm theme-toggle position-fixed z-3 bottom-0" aria-pressed="false" aria-label="Cambiar tema">
			<span class="theme-toggle__label">Tema</span>
		</button>
		<main
			class="site-main bg-secondary"
			data-barba="container"
			data-barba-namespace="<?= esc_attr(barba_namespace()); ?>">