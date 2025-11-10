<?php
$title = get_field('block_project_description_single_title');
$desc = get_field('block_project_description_single_text');
$img = get_field('block_project_description_single_img');
?>

<section class="block-single-description h-100 vw-100 position-relative pt-8">
	<div class="container">
		<div class="row">
			<div class="col-12 col-md-5">
				<h4 class="pb-md-5 h3 h-md-4"><?php echo esc_html($title); ?></h4>
				<p class="fs-6 fs-md-5" data-highlight-text><?php echo esc_html($desc); ?></p>
			</div>
			<div class="block-single-description__image col-12 col-md-6 offset-md-1 order-first order-md-last mb-3 mb-md-0">
				<div class="block-single-description__image-wrap">
					<img src="<?php echo esc_url($img['url']); ?>" alt="<?php echo esc_attr($img['alt']); ?>" class="block-single-description__image w-100">
				</div>
			</div>
		</div>
	</div>
</section>