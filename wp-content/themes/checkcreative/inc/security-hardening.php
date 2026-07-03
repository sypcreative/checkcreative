<?php

/**
 * Endurecimiento de seguridad que no depende de ningún plugin.
 */

/**
 * Oculta /wp-json/wp/v2/users y /wp-json/wp/v2/users/<id> para visitantes
 * no autenticados. Por defecto WordPress expone ahí username, nombre público
 * y slug del autor — verificado en este sitio que devolvía el username real
 * del admin sin autenticación. Los usuarios logueados (admin del sitio, etc.)
 * siguen teniendo acceso normal, así que no rompe nada del backend.
 */
function checkcreative_restrict_users_rest_endpoint($endpoints)
{
	if (is_user_logged_in()) {
		return $endpoints;
	}

	unset($endpoints['/wp/v2/users']);
	unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);

	return $endpoints;
}
add_filter('rest_endpoints', 'checkcreative_restrict_users_rest_endpoint');
