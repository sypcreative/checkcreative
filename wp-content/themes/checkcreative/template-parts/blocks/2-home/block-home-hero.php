<?php

/**
 * Bloque Home Hero
 *
 * @package checkcreative
 */

//MIRAR SI ES POSIBLE HACER ESTO MERGEANDO WOOCOMMERCE CON ACF
// defined('ABSPATH') || exit;
// global $product;

$titulo               = get_field('block_home_hero_titulo');
$eslogan              = get_field('block_home_hero_eslogan');
$tituloSlider         = get_field('block_home_hero_title_slider');
$tituloIngredientes   = get_field('block_home_hero_title_ingredientes');
$beer_query = new WP_Query([
	'post_type'      => 'product',
	'posts_per_page' => -1,
	'orderby'        => 'title',
	'order'          => 'ASC',
	'tax_query'      => [
		[
			'taxonomy'         => 'product_cat',
			'field'            => 'slug',          // o 'name' o 'term_id'
			'terms'            => ['individuales'], // slug de la categoría
			'operator'         => 'IN',
			'include_children' => false            // pon true si quieres incluir subcategorías
		]
	],
]);
$beers = [];                         // array donde guardaremos cada cerveza
while ($beer_query->have_posts()) :
	$beer_query->the_post();         // cambia el post actual

	$beers[] = checkcreative_get_beer_data(get_the_ID());  // ← sin ID “a mano”
endwhile;
wp_reset_postdata();                 // importantísimo

/**
 * Helper global (solo se declara UNA vez)
 */
function stat_circle($value, $label)
{ ?>
	<div class="text-center col-6 d-flex flex-column justify-content-center align-items-center">
		<div class="border rounded-circle border-light bg-light d-flex align-items-center justify-content-center mb-2"
			style="width:80px; height:80px;">
			<span class="fs-4" data-anim="swiper-anim"><?= esc_html($value); ?></span>
		</div>
		<small class="d-block text-uppercase"><?= esc_html($label); ?></small>
	</div>
<?php }


// function get_text_class_for_bg($bg_color)
// {
//   $map = [
//     '#F58833' => 'text-white',
//     '#1CBA7F' => 'text-black',
//     '#8C18F9' => 'text-white',
//     '#F5CF5D' => 'text-black',
//     '#1D1D1B' => 'text-white',
//     '#FFFFFF' => 'text-black',
//   ];

//   $bg_color = strtoupper(trim($bg_color)); // normaliza el valor

//   return $map[$bg_color] ?? 'text-white'; // fallback
// }

?>

<!-- Bloque Home Hero -->
<div class="model z-2"></div>

<section class="hero z-3 position-relative text-uppercase vw-100 vh-100 d-flex flex-column justify-content-center align-items-center">
	<h1 class="century hero-jumbo fw-bold text-center" data-anim="lines"><?= $titulo ?></h1>
	<h2 class="century fw-bold h5" data-anim="lines"><?= $eslogan ?></h2>
</section>


<section class="section-product-swiper swiper z-1 position-relative vw-100 vh-100 overflow-hidden">
	<div class="swiper-wrapper">

		<?php foreach ($beers as $beer) :
			$bg_color = $beer['post_type_productos_fondo'];
			$text_class = 'text-dark';

			switch ($bg_color) {
				case '#002761':
					$text_class = 'text-primary';
					break;
				case 'pink':
					$text_class = 'text-primary';
					$btn_bg_class = 'bg-purple';
					break;
				case 'orange':
					$text_class = 'text-dark';
					$btn_bg_class = 'bg-primary';
					$btn_text_class = 'text-dark';
					break;
				case 'blue':
					$text_class = 'text-primary';
					$btn_bg_class = 'bg-pink';
					$btn_text_class = 'text-primary';
					break;
				case 'secondary':
					$text_class = 'text-primary';
					$btn_bg_class = 'bg-pink';
					$btn_text_class = 'text-primary';
					break;
			}
		?>

			<div class="swiper-slide <?= esc_attr($text_class); ?>"
				data-bg="<?= esc_attr($beer['post_type_productos_fondo']); ?>"
				data-permalink="<?= esc_url($beer['permalink']); ?>">
				<div class="container position-relative">
					<div class="row vh-100">
						<div class="section-product-swiper_info--left col-12 col-md-4 text-end d-flex flex-column justify-content-evenly align-items-md-end align-items-start">
							<div class="product-header text-uppercase">
								<p class="century fw-bold mb-2"><?= $tituloSlider ?></p>
								<h1 class="display-6 mb-1 text-start text-md-end" data-anim="swiper-anim"><?= esc_html($beer['post_type_productos_nombre']); ?></h1>
								<p class="small mb-4 text-start text-md-end" data-anim="swiper-anim"> <?= esc_html($beer['post_type_productos_alcohol']); ?> – <?= esc_html($beer['post_type_productos_tamano']); ?></p>
							</div>
							<div class="product-description mt-auto ms-auto ms-md-0 w-75">
								<p class="body mb-0" data-anim="swiper-anim">
									<?= esc_html($beer['post_type_productos_descripcion']); ?>
								</p>
							</div>
						</div>

						<div class="d-none d-md-flex section-product-swiper_info--center col-12 col-md-4 align-items-center justify-content-center">
							<h2 class="h1 js-anim w-50" data-anim="swiper-anim"><?= esc_html($beer['post_type_productos_ritmo']); ?></h2>
						</div>

						<div class="section-product-swiper_info--right col-12 col-md-3 d-flex flex-column justify-content-center d-none d-md-flex">
							<div class="text-uppercase">
								<h5 class="h6 century fw-bold mb-3 js-anim"><?= $tituloIngredientes ?></h5>
								<p class="fs-6 mb-2 js-anim" data-anim="swiper-anim">
									<?= esc_html($beer['post_type_productos_ingredientes']); ?>
								</p>
								<p class="legend">Contiene gluten</p>
							</div>
							<div class="d-none d-md-flex flex-wrap row-gap-4 pt-5 js-anim">
								<?php stat_circle(esc_html($beer['post_type_productos_temperatura']), 'Temperatura'); ?>
								<?php stat_circle(esc_html($beer['post_type_productos_calorias']), 'Calorías'); ?>
								<?php stat_circle(esc_html($beer['post_type_productos_ebc']), 'EBC'); ?>
								<?php stat_circle(esc_html($beer['post_type_productos_ibu']), 'IBU'); ?>
							</div>
						</div>
					</div>


				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<div class="section-product-swiper_nav position-absolute w-md-auto w-100 text-center start-50 translate-middle-x bottom-0 pb-5 z-3">
		<button class="section-product-swiper_nav--prev btn btn-white btn-circle border border-secondary me-3">&larr;</button>
		<a id="buy-button" href="https://www.cervezacheckcreative.com/tienda/" class="btn btn-white px-4">Comprar</a>
		<button class="section-product-swiper_nav--next btn btn-white btn-circle border border-secondary ms-3">&rarr;</button>
	</div>
</section>