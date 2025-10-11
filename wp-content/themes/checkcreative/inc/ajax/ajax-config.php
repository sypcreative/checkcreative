<?php

// Enqueue javascript file
add_action('wp_enqueue_scripts', 'checkcreative_insert_custom_js_ajax');
function checkcreative_insert_custom_js_ajax()
{
	wp_localize_script(
		'checkcreative-js',
		'ajax_forms',
		[
			'ajaxUrl'  => admin_url('admin-ajax.php'),
			'frmNonce' => wp_create_nonce('secret-key-form')
		]
	);
}
