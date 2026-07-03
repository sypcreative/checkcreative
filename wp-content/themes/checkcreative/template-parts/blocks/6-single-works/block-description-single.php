<?php
$title = get_field('block_project_description_single_title');
$desc = get_field('block_project_description_single_text');
$img = get_field('block_project_description_single_img');
$img_id = is_array($img) ? ($img['ID'] ?? 0) : 0;
$img_alt = (is_array($img) ? ($img['alt'] ?? '') : '') ?: $title;
?>

<section class="block-single-description h-100 vw-100 position-relative pt-8">
	<div class="container">
		<div class="row">
			<div class="col-12 col-md-5 py-md-0 py-5">
				<h4 class="pb-md-5 h3 h-md-4"><?php echo esc_html($title); ?></h4>
				<p class="fs-6 fs-md-5" data-highlight-text data-highlight-scroll-start="top 60%"><?php echo esc_html($desc); ?></p>
			</div>
			<div class="block-single-description__image col-12 col-md-6 offset-md-1 order-first order-md-last mb-0">
				<div class="block-single-description__image-wrap">
					<?php if ($img_id) : ?>
						<?php
						echo wp_get_attachment_image(
							$img_id,
							'large',
							false,
							[
								'class' => 'block-single-description__image w-100',
								'alt' => $img_alt,
								'loading' => 'lazy',
							]
						);
						?>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
</section>