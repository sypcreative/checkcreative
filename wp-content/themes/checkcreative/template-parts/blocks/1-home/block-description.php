<?php
$desc = get_field('block_description_text');
$imagenes = get_field('block_description_repeater');
$show = get_field('block_description_show');

// Ejemplo: si estás en la página “about”
$extra_class = '';

if (is_page('about') || is_page('sobre-nosotros')) {
	$extra_class = 'block-description--about py-12';
} elseif (is_page('servicios')) {
	$extra_class = 'block-description--services';
} elseif (is_front_page()) {
	$extra_class = 'block-description vh-70 vh-md-100';
}
?>

<section class="<?= esc_attr($extra_class) ?> vw-100 overflow-clip position-relative">
	<div class="container h-100">
		<div class="block-description__content position-relative d-flex align-items-center justify-content-center h-100 text-center z-1">
			<h1 class="fs-3 w-80 text-center" data-highlight-text><?php echo esc_html($desc) ?></h1>
		</div>
	</div>
	<?php if ($show && $imagenes) : ?>
		<div class="block-description__overlay position-absolute vw-100 vh-100 bg-white z-2"></div>

		<?php foreach ($imagenes as $item) :
			// 1) Sacamos la imagen del repeater
			$imagen = $item['block_description_repeater_image'] ?? null;

			if (!$imagen) {
				continue; // por si algún item viene vacío
			}

			// 2) Usamos el tamaño personalizado `description-block`
			$img_src = $imagen['sizes']['description-block'] ?? $imagen['url'];
			$img_alt = $imagen['alt'] ?? '';
			// var_dump($img_src); // si quieres comprobar
		?>
			<img
				class="block-description__img position-absolute object-fit-cover"
				src="<?= esc_url($img_src); ?>"
				alt="<?= esc_attr($img_alt); ?>"
				decoding="async" />
		<?php endforeach; ?>
	<?php endif; ?>

</section>