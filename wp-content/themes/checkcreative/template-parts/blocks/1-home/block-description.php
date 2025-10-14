<?php
$desc = get_field('block_description_text');
$imagenes = get_field('block_description_repeater');
?>

<section class="block-description container vh-100 vw-100 position-relative overflow-clip">
	<div class="block-description__content position-relative d-flex align-items-center justify-content-center h-100 text-center z-1">
		<h1 class="fs-3 w-80 text-center"><?php echo esc_html($desc) ?></h1>
	</div>

	<?php foreach ($imagenes as $item) {
		$imagen = $item['block_description_repeater_image'] ? $item['block_description_repeater_image']['url'] : "";
	?>
		<img class="block-description__img position-absolute object-fit-cover" src="<?= $imagen ?>" />
	<?php } ?>
</section>