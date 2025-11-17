<?php

/**
 * Block: Contact (normal form)
 */

$heading            = get_field('block_contact_title') ?: "LET’S START A PROJECT TOGETHER";
$description        = get_field('description') ?: '';
$privacy_label      = get_field('privacy_label') ?: 'I agree with the';
$privacy_link       = get_field('privacy_link');
$privacy_link_label = get_field('privacy_link_label') ?: 'privacy policy';
$button_label       = get_field('button_label') ?: 'SEND';

$block_id    = 'block-contact-';
?>
<section id="<?php echo esc_attr($block_id); ?>" class="block-contact">
	<div class="container vh-100">

		<div class="block-contact__header">
			<h1 class="block-contact__title display">
				<?php echo esc_html($heading); ?>
			</h1>

			<?php if ($description) : ?>
				<p class="block-contact__description">
					<?php echo esc_html($description); ?>
				</p>
			<?php endif; ?>
		</div>

		<form class="block-contact__form"
			method="post"
			action="<?php echo esc_url(admin_url('admin-post.php')); ?>">

			<input type="hidden" name="action" value="block_contact_submit">
			<?php wp_nonce_field('block_contact_submit', 'block_contact_nonce'); ?>

			<div class="block-contact__grid">
				<div class="block-contact__field">
					<label for="<?php echo esc_attr($block_id); ?>-name">Name</label>
					<input
						type="text"
						id="<?php echo esc_attr($block_id); ?>-name"
						name="name"
						required>
				</div>

				<div class="block-contact__field">
					<label for="<?php echo esc_attr($block_id); ?>-email">Email</label>
					<input
						type="email"
						id="<?php echo esc_attr($block_id); ?>-email"
						name="email"
						required>
				</div>

				<div class="block-contact__field">
					<label for="<?php echo esc_attr($block_id); ?>-project_type">Project</label>
					<input
						type="text"
						id="<?php echo esc_attr($block_id); ?>-project_type"
						name="project_type">
				</div>

				<div class="block-contact__field">
					<label for="<?php echo esc_attr($block_id); ?>-budget">Budget range</label>
					<input
						type="text"
						id="<?php echo esc_attr($block_id); ?>-budget"
						name="budget">
				</div>

				<div class="block-contact__field">
					<label for="<?php echo esc_attr($block_id); ?>-deadline">Deadline / timing</label>
					<input
						type="text"
						id="<?php echo esc_attr($block_id); ?>-deadline"
						name="deadline">
				</div>

				<div class="block-contact__field block-contact__field--full">
					<label for="<?php echo esc_attr($block_id); ?>-message">Message</label>
					<textarea
						id="<?php echo esc_attr($block_id); ?>-message"
						name="message"
						rows="5"></textarea>
				</div>
			</div>

			<div class="block-contact__footer">
				<label class="block-contact__agreement">
					<input type="checkbox" name="privacy" required>
					<span>
						<?php echo esc_html($privacy_label); ?>
						<?php if ($privacy_link) : ?>
							<a href="<?php echo esc_url($privacy_link); ?>" target="_blank" rel="noopener">
								<?php echo esc_html($privacy_link_label); ?>
							</a>
						<?php else : ?>
							<?php echo esc_html($privacy_link_label); ?>
						<?php endif; ?>
					</span>
				</label>

				<button type="submit" class="block-contact__submit">
					<?php echo esc_html($button_label); ?>
				</button>
			</div>
		</form>
	</div>
</section>