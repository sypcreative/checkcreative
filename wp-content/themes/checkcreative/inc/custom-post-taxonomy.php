<?php


// Register Custom Post Type
function custom_post_type()
{
	// Check Creative -> ID 1
	/**
	 * Post type Proyectos
	 */
	$labels  = array(
		'name'                  => _x('Proyectos', 'checkcreative'),
		'singular_name'         => _x('Proyecto', 'checkcreative'),
		'menu_name'             => __('Proyectos', 'checkcreative'),
		'name_admin_bar'        => __('Proyectos', 'checkcreative'),
		'archives'              => __('Archivos de proyectos', 'checkcreative'),
		'attributes'            => __('Atributos de proyectos', 'checkcreative'),
		'parent_item_colon'     => __('Proyectos padre', 'checkcreative'),
		'all_items'             => __('Todos los proyectos', 'checkcreative'),
		'add_new_item'          => __('Añadir nuevo proyecto', 'checkcreative'),
		'add_new'               => __('Añadir nuevo', 'checkcreative'),
		'new_item'              => __('Nuevo proyecto', 'checkcreative'),
		'edit_item'             => __('Editar proyecto', 'checkcreative'),
		'update_item'           => __('Actualizar proyecto', 'checkcreative'),
		'view_item'             => __('Ver proyecto', 'checkcreative'),
		'view_items'            => __('Ver proyectos', 'checkcreative'),
		'search_items'          => __('Buscar proyecto', 'checkcreative'),
		'not_found'             => __('No se han encontrado proyectos', 'checkcreative'),
		'not_found_in_trash'    => __('No se han encontrado proyectos en la papelera', 'checkcreative'),
		'featured_image'        => __('Imagen destacada', 'checkcreative'),
		'set_featured_image'    => __('Establecer imagen destacada', 'checkcreative'),
		'remove_featured_image' => __('Eliminar imagen destacada', 'checkcreative'),
		'use_featured_image'    => __('Usar como imagen destacada', 'checkcreative'),
		'insert_into_item'      => __('Insertar en proyecto', 'checkcreative'),
		'uploaded_to_this_item' => __('Subir proyecto', 'checkcreative'),
		'items_list'            => __('Lista de proyectos', 'checkcreative'),
		'items_list_navigation' => __('Navegar en los proyectos', 'checkcreative'),
		'filter_items_list'     => __('Filtrar proyectos', 'checkcreative'),
	);
	$rewrite = array(
		'slug' => 'proyectos', //proyectos
		'with_front' => false,
		'pages'      => true,
		'feeds'      => true,
	);
	$args    = array(
		'label'               => __('Proyecto', 'checkcreative'),
		'description'         => __('Añade y gestiona todos tus proyectos', 'checkcreative'),
		'labels'              => $labels,
		'supports'            => array('title', 'editor', 'custom-fields', 'page-attributes', 'revisions', 'thumbnail'),
		'taxonomies'          => array(),
		'hierarchical'        => true,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'menu_position'       => 4,
		'menu_icon'           => 'dashicons-tablet',
		'show_in_admin_bar'   => true,
		'show_in_nav_menus'   => true,
		'show_in_rest'        => true,
		'can_export'          => true,
		'has_archive'         => false,
		'exclude_from_search' => true,
		'publicly_queryable'  => true,
		'rewrite'             => $rewrite,
		'capability_type'     => 'page',
	);

	register_post_type('proyectos', $args);
}

add_action('init', 'custom_post_type');


// add_action('init', 'checkcreative_taxonomy', 0);
