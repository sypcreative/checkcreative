<?php
$title = get_field('block_services_home_title') ?: '';
$visible = get_field('block_services_home_title_visible') ?: '';
$services = get_field('block_services_home_service');
$link = get_field('block_services_home_link');
$url = $link ? $link['url'] : '';
$url_title = $link ? $link['title'] : '';
$target = $link ? $link['target'] : '_self';
?>

<section class="block-services-home w-100 pt-9">
	<?php if (!$visible) : ?>
		<div class="container">
			<h1 class="block-services-home__title-visible text-center">
				<?= esc_html($title); ?>
			</h1>
			<?php if ($url) : ?>
				<a
					data-underline-link
					href="<?php echo esc_url($url); ?>"
					target="<?php echo esc_attr($target); ?>">
					<?php echo esc_html($url_title); ?>
				</a>
			<?php endif; ?>
		</div>
	<?php endif; ?>
	<div class="container d-flex flex-column" data-stacking-cards>
		<?php if ($visible) : ?>
			<div class="d-flex flex-column flex-md-row justify-content-between align-items-center text-uppercase mb-2">
				<h1 class="block-services-home__title-visible h-md-1 h2">
					<?= esc_html($title); ?>
				</h1>

				<?php if ($url) : ?>
					<a
						data-underline-link
						href="<?php echo esc_url($url); ?>"
						target="<?php echo esc_attr($target); ?>">
						<?php echo esc_html($url_title); ?>
					</a>
				<?php endif; ?>
			</div>
		<?php endif; ?>
		<?php if ($services) : ?>
			<?php foreach ($services as $index => $service) :
				$num         = $index + 1;
				$shownum     = $service['block_services_home_service_number'];
				$name        = $service['block_services_home_service_name'];
				$description = $service['block_services_home_service_description'];
				$image       = $service['block_services_home_service_image'];
				$keywords    = $service['block_services_home_service_keywords'];
				$image_url   = $image ? $image['url'] : '';
			?>
				<article
					class="block-services-home__service d-flex flex-column position-relative bg-light"
					data-stacking-cards-item="">
					<div class="row align-items-stretch py-5 border-0 border-top">
						<?php if ($shownum) : ?>
							<div class="col-2">
								<span class="block-services-home__service-number d-block display-4 fw-bold lh-1">
									<?php echo esc_html(str_pad($num, 2, '0', STR_PAD_LEFT)); ?>
								</span>
							</div>
						<?php endif; ?>
						<div class="col-10 col-lg-6 d-flex flex-column justify-content-between">
							<div class="row align-items-start g-3 mb-4">
								<div class="col d-flex align-items-center">
									<h3 class="block-services-home__service-title fw-bold mb-0 text-uppercase h-4 h-md-2">
										<?php echo esc_html($name); ?>
									</h3>
								</div>
							</div>

							<div class="row mb-5">
								<div class="col-12 col-xl-10">
									<p class="block-services-home__service-description fs-5 py-5 mb-0" data-stacking-cards-desc>
										<?php echo esc_html($description); ?>
									</p>
								</div>
							</div>

							<?php if (!empty($keywords)) : ?>
								<div class="row align-items-center gy-3">
									<div class="col-12 col-md-auto">
										<ul class="nav gap-4 text-uppercase small fw-semibold p-0 m-0">
											<?php foreach ($keywords as $keyword) :
												$kw = $keyword['block_services_home_service_keywords_keyword'] ?>
												<li class="nav-item"><?php echo esc_html($kw); ?></li>
											<?php endforeach; ?>
										</ul>
									</div>
								</div>
							<?php endif; ?>
						</div>

						<div class="col-12 col-lg-4 d-flex justify-content-lg-end mt-4 mt-lg-0 d-none d-md-block" data-stacking-cards-image>
							<div class="block-services-home__service-image ratio ratio-3x4 bg-secondary d-flex align-items-center justify-content-center w-100">
								<img
									src="<?php echo esc_url($image_url); ?>"
									alt="<?php echo esc_attr($name); ?>"
									class="img-fluid w-100 h-100 object-fit-cover">
							</div>
						</div>
					</div>
				</article>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>
</section>
<div data-stacking-cards-spacer></div>