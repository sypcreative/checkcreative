<?php

/**
 * Bloque About Cards
 * ----------------------------------
 * Diseño basado en el mock‑up adjunto y utilizando Bootstrap 5
 * Clases de color disponibles en el tema:
 *   bg-green | bg-purple | bg-pink | text-primary | text-light | text-dark
 *
 * @package checkcreative
 * Para estilos complementarios (tipografías, letter‑spacing, etc.) añade reglas
 * a tu hoja SCSS. Ejemplo incluido más abajo en el chat.
 */

$subtitle = get_field('block_about_cards_subtitle');
$title    = get_field('block_about_cards_title');
$repeater = get_field('block_about_cards_repeater');
?>

<section class="container about-cards-block text-center py-5">
	<div class="row">
		<div class="col-12 col-md-10 offset-md-1">
			<?php if ($subtitle) : ?>
				<h3 class="body fw-light text-uppercase mb-3 century">
					<?php echo esc_html($subtitle); ?>
				</h3>
			<?php endif; ?>

			<?php if ($title) : ?>
				<h2 class="h-md-1 h3 text-uppercase fw-bold mb-5">
					<?php echo esc_html($title); ?>
				</h2>
			<?php endif; ?>
		</div>
	</div>

	<div class="row g-4 justify-content-center">
		<?php foreach ($repeater as $card) :
			$title = $card['block_about_cards_repeater_titulo'];
			$description = $card['block_about_cards_repeater_descripcion'];
			$color = $card['block_about_cards_repeater_color'];
			$cta = $card['block_about_cards_repeater_cta'] ?? null;
			$cta_url = $cta['url'] ?? '';
			$cta_title = $cta['title'] ?? '';
			$cta_target = $cta['target'] ?? '_self';

			$text_class = 'text-dark'; // Valor por defecto
			$btn_bg_class = "bg-pink"; // Valor por defecto
			$btn_text_class = "text-primary"; // Valor por defecto

			switch ($color) {
				case 'green':
				case 'purple':
					$text_class = 'text-light';
					$btn_text_class = 'text-light';
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
			<div class="col-12 col-md-6">
				<article class="about-cards-block__card bg-<?php echo $color; ?> <?php echo esc_attr($text_class); ?>  rounded-4 h-100 d-flex flex-column justify-content-center align-items-center p-5 text-center">
					<?php if ($title) : ?>
						<h3 class="h-md-1 h3 fw-bold century mb-3 text-uppercase">
							<?php echo esc_html($title); ?>
						</h3>
					<?php endif; ?>

					<?php if ($description) : ?>
						<p class="body mb-4">
							<?php echo esc_html($description); ?>
						</p>
					<?php endif; ?>

					<a class="btn <?php echo esc_attr($btn_bg_class); ?>  <?php echo esc_attr($btn_text_class); ?> century px-4 py-2 fw-bold text-uppercase" href="<?= $cta_url ?>" target="<?php echo esc_attr($target); ?>">
						<?php echo esc_html($cta_title); ?>
					</a>
				</article>
			</div>
		<?php endforeach; ?>
	</div>
</section>