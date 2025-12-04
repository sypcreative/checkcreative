<?php

/**
 * Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 * @package checkcreative
 */

// -----------------------------------------------------------------------------
// Constantes del tema
// -----------------------------------------------------------------------------
if (! defined('CHECKCREATIVE_PATH')) {
	define('CHECKCREATIVE_PATH', get_template_directory());
}
if (! defined('CHECKCREATIVE_URI')) {
	define('CHECKCREATIVE_URI', get_template_directory_uri());
}
if (! defined('CHECKCREATIVE_VERSION')) {
	$theme = wp_get_theme();
	define('CHECKCREATIVE_VERSION', $theme->get('Version') ?: '1.0.0');
}

// -----------------------------------------------------------------------------
// Soporte del tema + Menús
// -----------------------------------------------------------------------------
function checkcreative_setup()
{

	// Carga de textos
	load_theme_textdomain('checkcreative', CHECKCREATIVE_PATH . '/languages');

	// Título del documento gestionado por WP
	add_theme_support('title-tag');

	// Imágenes destacadas
	add_theme_support('post-thumbnails');

	// HTML5 en salidas comunes
	add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));

	// Alineaciones anchas en editor
	add_theme_support('align-wide');

	// Menús
	register_nav_menus(array(
		'menu-izquierda' => esc_html__('Menú izquierdo', 'checkcreative'),
		'menu-derecha'   => esc_html__('Menú derecho', 'checkcreative'),
		'menu-footer'    => esc_html__('Menú footer', 'checkcreative'),
	));
}
add_action('after_setup_theme', 'checkcreative_setup');

// -----------------------------------------------------------------------------
// Content width (opcional, útil para embeds)
// -----------------------------------------------------------------------------
function checkcreative_content_width()
{
	$GLOBALS['content_width'] = apply_filters('checkcreative_content_width', 1200);
}
add_action('after_setup_theme', 'checkcreative_content_width', 0);

// -----------------------------------------------------------------------------
// Includes del tema (sin AJAX)
// -----------------------------------------------------------------------------
/**
 * Usa require_once solo si el archivo existe.
 */
function checkcreative_require($relative_path)
{
	$path = CHECKCREATIVE_PATH . $relative_path;
	if (file_exists($path)) {
		require_once $path;
	}
}

// Encolado de assets (mantenido en un archivo separado para claridad)
checkcreative_require('/inc/template-enqueued.php');

// Funciones helpers del tema
checkcreative_require('/inc/template-functions.php');

// Jetpack (si está activo)
if (defined('JETPACK__VERSION')) {
	checkcreative_require('/inc/jetpack.php');
}

// ACF y config personalizada
checkcreative_require('/inc/acf-config.php');
checkcreative_require('/inc/custom-config.php');

// CPTs y taxonomías
checkcreative_require('/inc/custom-post-taxonomy.php');

// Navegación
checkcreative_require('/inc/navs/custom-nav-walker.php');
checkcreative_require('/inc/navs/custom-nav-menu.php');

// GTM / scripts de cabecera personalizados
checkcreative_require('/inc/gtm-functions.php');

// -----------------------------------------------------------------------------
// Utilidades de depuración
// -----------------------------------------------------------------------------
if (! function_exists('dump')) {
	function dump($data)
	{
		echo '<pre class="text-white bg-black w-max fs-7 py-5" style="white-space:pre-wrap;">';
		var_dump($data);
		echo '</pre>';
	}
}

// FORMULARIO CONTACTO: HANDLER
add_action('admin_post_nopriv_block_contact_submit', 'handle_block_contact_submit');
add_action('admin_post_block_contact_submit', 'handle_block_contact_submit');

function handle_block_contact_submit()
{
	error_log('CONTACT FORM: handler ejecutado ✅');

	// 1. Comprobar nonce
	if (
		!isset($_POST['block_contact_nonce']) ||
		!wp_verify_nonce($_POST['block_contact_nonce'], 'block_contact_submit')
	) {
		error_log('CONTACT FORM: nonce fallo ❌');
		wp_die('Security check failed', 'Error', ['response' => 403]);
	}

	// 2. Recoger y sanear campos
	$name        = isset($_POST['name']) ? sanitize_text_field($_POST['name']) : '';
	$email       = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
	$project_type = isset($_POST['project_type']) ? sanitize_text_field($_POST['project_type']) : '';
	$budget      = isset($_POST['budget']) ? sanitize_text_field($_POST['budget']) : '';
	$deadline    = isset($_POST['deadline']) ? sanitize_text_field($_POST['deadline']) : '';
	$message     = isset($_POST['message']) ? wp_kses_post($_POST['message']) : '';
	$privacy     = isset($_POST['privacy']) ? 'Accepted' : 'Not accepted';

	// 3. Validaciones mínimas (por si quieres)
	if (empty($name) || empty($email) || !is_email($email)) {
		$redirect_url = wp_get_referer() ?: home_url('/');
		$redirect_url = add_query_arg('contact_status', 'error', $redirect_url);
		wp_safe_redirect($redirect_url);
		exit;
	}

	// 4. Configurar destinatario
	// 👉 Puedes poner aquí tu email directamente si quieres:
	// $to = 'tu-correo@tudominio.com';
	$to = get_option('admin_email');

	$subject = sprintf('New contact from %s', get_bloginfo('name'));

	// 5. Cuerpo del correo
	$body  = "You have received a new contact request:\n\n";
	$body .= "Name: {$name}\n";
	$body .= "Email: {$email}\n";
	$body .= "Project: {$project_type}\n";
	$body .= "Budget range: {$budget}\n";
	$body .= "Deadline / timing: {$deadline}\n\n";
	$body .= "Message:\n{$message}\n\n";
	$body .= "Privacy: {$privacy}\n";

	// 6. Cabeceras (para poder responder directamente al remitente)
	$headers   = [];
	$headers[] = 'Content-Type: text/plain; charset=UTF-8';
	$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';

	// 7. Enviar
	$sent = wp_mail($to, $subject, $body, $headers);

	if ($sent) {
		error_log('CONTACT FORM: wp_mail enviado correctamente ✅');
	} else {
		error_log('CONTACT FORM: wp_mail FALLÓ ❌');
	}


	// 8. Redirigir con estado
	$redirect_url = wp_get_referer() ?: home_url('/');
	$redirect_url = add_query_arg(
		'contact_status',
		$sent ? 'ok' : 'error',
		$redirect_url
	);

	wp_safe_redirect($redirect_url);
	exit;
}

// Tamaño específico para las imágenes del bloque description
add_image_size(
	'description-block', // nombre
	700,                 // ancho máximo (px)
	875,                 // alto máximo (px) → 4:5 aprox
	true                 // hard crop
);
