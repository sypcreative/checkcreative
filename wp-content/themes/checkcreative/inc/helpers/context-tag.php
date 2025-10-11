<?php

if (! function_exists('checkcreative_get_newsletter_context_tag')) {
	function checkcreative_get_newsletter_context_tag()
	{

		static $cached = null;
		if ($cached !== null) {
			return $cached;
		}

		if (is_front_page())  $cached = 'home';
		elseif (is_home())    $cached = 'blog';

		elseif (is_page()) {
			$cached = 'page-' . sanitize_title(get_post_field('post_name', get_queried_object_id()));
		} elseif (is_singular()) {
			$type   = get_post_type();
			$slug   = get_post_field('post_name', get_queried_object_id());
			$cached = $type . '-' . sanitize_title($slug);
		} elseif (is_category()) {
			$cached = 'cat-' . get_queried_object()->slug;
		} elseif (is_tag()) {
			$cached = 'tag-' . get_queried_object()->slug;
		} elseif (is_tax()) {
			$qo     = get_queried_object();
			$cached = 'tax-' . $qo->taxonomy . '-' . $qo->slug;
		} elseif (is_post_type_archive()) {
			$cached = 'archive-' . sanitize_title(get_query_var('post_type'));
		} elseif (is_search()) $cached = 'search';
		elseif (is_404())    $cached = '404';

		else {
			$path   = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
			$cached = $path ? sanitize_title_with_dashes(str_replace('/', '-', $path)) : 'unknown';
		}

		return apply_filters('checkcreative/newsletter/context_tag', $cached);
	}
}
