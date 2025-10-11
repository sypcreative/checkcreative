<?php
defined('ABSPATH') || exit;

add_action('wp_ajax_nopriv_checkcreative_save_newsletter', 'checkcreative_save_newsletter');
add_action('wp_ajax_checkcreative_save_newsletter',        'checkcreative_save_newsletter');

function checkcreative_save_newsletter()
{
	check_ajax_referer('checkcreative_newsletter', 'nonce');

	$email = sanitize_email($_POST['email'] ?? '');
	$source = sanitize_text_field($_POST['source'] ?? '');

	$raw_tags = $_POST['tags'] ?? [];
	if (!is_array($raw_tags)) {
		$raw_tags = explode(',', $raw_tags);
	}
	$tags = array_values(array_unique(array_filter(array_map('sanitize_text_field', $raw_tags))));
	if (empty($tags)) {
		$tags = ['banner-acf'];
	}

	$result = checkcreative_subscribe_email($email, $source, $tags);

	if (empty($result['success'])) {
		wp_send_json_error(['message' => $result['message'] ?? 'Error desconocido']);
	}

	wp_send_json_success([
		'message'  => $result['message'],
		'existing' => $result['existing'],
	]);
}
