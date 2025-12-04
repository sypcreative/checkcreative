<?php

/**
 * Block: Contact (normal form)
 */

$heading            = get_field('block_contact_title') ?: "LET’S START A PROJECT TOGETHER";
$privacy_text      = get_field('block_contact_privacy_label') ?: 'I agree with the';
$privacy_link       = get_field('block_contact_privacy_link');
$privacy_label 	  = $privacy_link ? $privacy_link['title'] : '';
$privacy_url 		  = $privacy_link ? $privacy_link['url'] : '';

$button_label       = get_field('button_label') ?: 'SEND';
$trail              = get_field('opciones_sitio_cursor_images', 'option');

// Imagen opcional para la columna derecha
$images      = get_field('block_contact_images');

$block_id = 'block-contact-';
?>
<section id="<?php echo esc_attr($block_id); ?>" class="block-contact" data-trail="wrapper">
	<div class="container h-100">

		<div class="row g-5 align-items-start h-100">
			<!-- COL IZQUIERDA: HEADER + FORM (col-8) -->
			<div class="col-12 col-lg-8">
				<div class="block-contact__header mb-4">
					<h1 class="block-contact__title display">
						<?php echo esc_html($heading); ?>
					</h1>
				</div>

				<form class="block-contact__form"
					method="post"
					action="<?php echo esc_url(admin_url('admin-post.php')); ?>">

					<input type="hidden" name="action" value="block_contact_submit">
					<?php wp_nonce_field('block_contact_submit', 'block_contact_nonce'); ?>

					<div class="block-contact__grid">
						<div class="block-contact__field">
							<input
								type="text"
								id="<?php echo esc_attr($block_id); ?>-name"
								name="name"
								placeholder=" "
								required>
							<label for="<?php echo esc_attr($block_id); ?>-name">Name</label>
						</div>

						<div class="block-contact__field">
							<input
								type="email"
								id="<?php echo esc_attr($block_id); ?>-email"
								name="email"
								placeholder=" "
								required>
							<label for="<?php echo esc_attr($block_id); ?>-email">Email</label>
						</div>

						<div class="block-contact__field">
							<input
								type="text"
								id="<?php echo esc_attr($block_id); ?>-project_type"
								name="project_type"
								placeholder=" ">
							<label for="<?php echo esc_attr($block_id); ?>-project_type">Project</label>
						</div>

						<div class="block-contact__field">
							<input
								type="text"
								id="<?php echo esc_attr($block_id); ?>-budget"
								name="budget"
								placeholder=" ">
							<label for="<?php echo esc_attr($block_id); ?>-budget">Budget range</label>
						</div>

						<div class="block-contact__field">
							<input
								type="text"
								id="<?php echo esc_attr($block_id); ?>-deadline"
								name="deadline"
								placeholder=" ">
							<label for="<?php echo esc_attr($block_id); ?>-deadline">Deadline / timing</label>
						</div>

						<div class="block-contact__field block-contact__field--full">
							<textarea
								id="<?php echo esc_attr($block_id); ?>-message"
								name="message"
								rows="3"
								placeholder=" "></textarea>
							<label for="<?php echo esc_attr($block_id); ?>-message">Message</label>
						</div>
					</div>

					<div class="block-contact__footer mt-4">
						<label class="block-contact__agreement">
							<input type="checkbox" name="privacy" required>
							<span>
								<?php echo esc_html($privacy_text);
								?>
								<?php if ($privacy_link) : ?>
									<a href="<?php echo ($privacy_url); ?>" target="_blank" rel="noopener">
										<?php echo esc_html($privacy_label); ?>
									</a>
								<?php else : ?>
									<?php echo esc_html($privacy_label); ?>
								<?php endif; ?>
							</span>
						</label>

						<button type="submit" class="block-contact__submit text-dark">
							<?php echo esc_html($button_label); ?>
						</button>
					</div>
				</form>
			</div>

			<!-- COL DERECHA: IMAGEN (col-4) -->
			<div class="col-12 col-lg-4 h-100">
				<div class="block-contact__image-wrapper h-100 d-flex align-items-center position-relative overflow-hidden" data-contact-gallery>
					<?php foreach ($images as $image) :
						$img_url = $image ? $image['block_contact_images_image']['url'] : '';
						$img_alt = $image['block_contact_images_image']['alt'] ?: 'Contact Image';
					?>
						<img
							src="<?php echo esc_url($img_url); ?>"
							alt="<?php echo esc_attr($img_alt); ?>"
							class="img-fluid block-contact__image">
					<?php endforeach; ?>
				</div>
			</div>
		</div>

	</div>
	<?php if (is_array($trail) && in_array('contact', $trail, true)) : ?>
		<?php get_template_part('template-parts/components/cursor-trail'); ?>
	<?php endif; ?>
</section>