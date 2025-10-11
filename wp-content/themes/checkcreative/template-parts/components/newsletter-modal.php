<?php
defined('ABSPATH') || exit;
?>
<div class="modal fade" id="newsletterModal" tabindex="-1" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content bg-secondary text-primary p-4">
			<div class="modal-header border-0">
				<h5 class="modal-title js-nl-title" id="newsletter-modal-title">Únete al club</h5>
				<button type="button" class="btn-close bg-pink" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<form id="newsletter-form" class="js-nl-form">
					<div class="mb-3">
						<label for="newsletter-email" class="form-label">Tu email</label>
						<input type="email" class="form-control" id="newsletter-email" name="email" required>
					</div>

					<input type="hidden" name="action" value="checkcreative_save_newsletter">
					<input type="hidden" name="nonce" value="<?php echo wp_create_nonce('checkcreative_newsletter'); ?>">
					<input type="hidden" name="source" id="newsletter-source" value="">
					<input type="hidden" name="tags[]" id="newsletter-tags" value="banner-acf">
					<button type="submit" class="btn btn-pink m-auto px-4">Enviar</button>

				</form>

				<div id="newsletter-msg" class="text-primary mt-3 d-none js-nl-msg"></div>
			</div>
		</div>
	</div>
</div>