<?php

/**
 * Structured data (JSON-LD) básico: Organization + BreadcrumbList.
 *
 * Igual que con los OG tags de header.php: si Yoast SEO (u otro plugin que
 * pinte su propio schema) está activo, no imprimimos nada aquí para no
 * duplicar/competir con el suyo.
 */

function checkcreative_organization_schema()
{
	if (defined('WPSEO_VERSION')) {
		return;
	}

	// El campo devuelve directamente la URL (return_format "url" en ACF),
	// igual que se usa en header.php para el logo del nav.
	$logo_url = get_field('opciones_sitio_logo_principal', 'option') ?: '';

	$email = get_field('opciones_sitio_mail', 'option');
	$phone = get_field('opciones_sitio_phone', 'option');

	$schema = [
		'@context' => 'https://schema.org',
		'@type'    => 'Organization',
		'name'     => get_bloginfo('name'),
		'url'      => home_url('/'),
	];

	if ($logo_url) {
		$schema['logo'] = $logo_url;
	}

	if ($email || $phone) {
		$contact_point = ['@type' => 'ContactPoint', 'contactType' => 'customer service'];
		if ($email) {
			$contact_point['email'] = $email;
		}
		if ($phone) {
			$contact_point['telephone'] = $phone;
		}
		$schema['contactPoint'] = [$contact_point];
	}

	// Único perfil social verificado en el theme (footer.php). Si añades más
	// (LinkedIn, Behance...) súmalos aquí en vez de solo en el footer.
	$schema['sameAs'] = ['https://www.instagram.com/checkcreative_/'];

	echo '<script type="application/ld+json">' . wp_json_encode($schema) . '</script>' . "\n";
}
add_action('wp_head', 'checkcreative_organization_schema');

/**
 * BreadcrumbList simple (Inicio > Página actual). No intenta reconstruir
 * jerarquías de "Proyectos" porque esa página cambia de slug por idioma
 * (Polylang) y forzarlo mal es peor que no ponerlo.
 */
function checkcreative_breadcrumb_schema()
{
	if (defined('WPSEO_VERSION') || is_front_page()) {
		return;
	}

	$title = is_singular() ? get_the_title() : wp_get_document_title();
	if (!$title) {
		return;
	}

	$schema = [
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => [
			[
				'@type'    => 'ListItem',
				'position' => 1,
				'name'     => get_bloginfo('name'),
				'item'     => home_url('/'),
			],
			[
				'@type'    => 'ListItem',
				'position' => 2,
				'name'     => wp_strip_all_tags($title),
			],
		],
	];

	echo '<script type="application/ld+json">' . wp_json_encode($schema) . '</script>' . "\n";
}
add_action('wp_head', 'checkcreative_breadcrumb_schema');
