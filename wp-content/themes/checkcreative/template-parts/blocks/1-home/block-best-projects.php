<?php
$proyectos = get_field('block_best_projects_relation');
$overlay = get_field('block_best_projects_overlay');
$view = get_field('block_best_projects_vista');
$title = get_field('block_best_projects_title');
$link = get_field('block_best_projects_link');
$url = $link ? $link['url'] : '';
$target = $link ? $link['target'] : '_self';
$url_title = $link ? $link['title'] : '';

if ($proyectos && is_array($proyectos)) : ?>

	<section class="block-best-projects h-100 overflow-clip position-relative py-5">
		<div class="container h-100">
			<?php if ($view == 'vertical') : ?>
				<div class="block-best-projects__content d-flex flex-column align-items-center">
					<?php foreach ($proyectos as $item) :
						$post = is_object($item) ? $item : get_post((int) $item);
						if (!$post) continue;

						// ACF del CPT "Proyecto"
						$acf_title = get_field('post_type_proyectos_title', $post->ID);
						$year      = get_field('post_type_proyectos_year',  $post->ID);

						$title      = get_the_title($post);
						$permalink  = get_permalink($post);
						$thumb_html = has_post_thumbnail($post->ID)
							? get_the_post_thumbnail($post->ID, 'large', ['class' => 'block-best-projects__thumb w-30 h-100 d-block'])
							: '';
					?>
						<article class="block-best-projects__item d-flex align-items-center justify-content-center w-100">
							<a href="<?= esc_url($permalink) ?>"
								class="block-best-projects__card d-flex flex-column gap-3 text-decoration-none">
								<div class="block-best-projects__media position-relative overflow-hidden rounded-3 flex-grow-1">
									<?= $thumb_html ?>
								</div>
								<div class="block-best-projects__meta d-flex justify-content-between align-items-end w-100 px-1">
									<h3 class="block-best-projects__name m-0 fw-bold text-dark fs-4"><?= esc_html($title) ?></h3>
									<?php if (!empty($year)) : ?>
										<p class="block-best-projects__year m-0 fw-bold text-dark fs-4 text-uppercase"><?= esc_html($year) ?></p>
									<?php endif; ?>
								</div>
							</a>
						</article>


					<?php endforeach; ?>
				</div>

			<?php endif; ?>
			<?php if ($view == 'cards') : ?>
				<div data-init-projects-cards="" class="block-best-projects__card-group position-relative">
					<div class="block-best-projects__relative-object opacity-0 pointer-events-none position-relative">
						<div class="block-best-projects__relative-object-before"></div>
					</div>
					<div data-projects-cards-collection="" class="block-best-projects__collection w-100 h-100 position-absolute top-0 start-0">
						<div class="block-best-projects__card-title">
							<h2 class="block-best-projects__card-title-h2 text-center w-100 text-uppercase display text-center"><?= ($title) ?></h2>
						</div>
						<div data-projects-cards-list="" class="block-best-projects__list justify-content-center align-items-center d-flex h-100 w-100 position-relative">

							<?php foreach ($proyectos as $item) :
								$post = is_object($item) ? $item : get_post((int) $item);
								if (!$post) continue;

								// ACF del CPT "Proyecto"
								$acf_title = get_field('post_type_proyectos_title', $post->ID);
								$year      = get_field('post_type_proyectos_year',  $post->ID);

								$title      = get_the_title($post);
								$permalink  = get_permalink($post);
								$thumb_html = has_post_thumbnail($post->ID)
									? get_the_post_thumbnail($post->ID, 'large', ['class' => 'block-best-projects__thumb w-30 h-100 d-block'])
									: '';
							?>
								<div data-projects-cards-item-status="" data-projects-cards-project="" class="block-best-projects__item position-absolute">
									<div class="block-best-projects__card-drag position-relative overflow-hidden d-flex align-items-center justify-content-center">
										<?php if ($overlay) : ?>
											<div class="block-best-projects__overlay"></div>
										<?php endif; ?>
										<div class="block-best-projects__card-drag-before"></div>
										<div class="block-best-projects__media d-flex position-absolute justify-content-center align-items-center top-0 start-0 w-100 h-100">
											<?= $thumb_html ?>
											<a href="<?= esc_url($permalink) ?>" class="block-best-projects__btn z-2"><span class="block-best-projects__btn-span">View Project</span></a>
											<h3 class="block-best-projects__h3 position-absolute text-center z-2"><?= esc_html($title) ?></h3>
										</div>
									</div>
								</div>
							<?php endforeach; ?>
						</div>
						<?php if ($url) : ?>
							<div class="block-best-projects__link d-flex justify-content-center position-relative">
								<a
									href="<?php echo esc_url($url); ?>"
									target="<?php echo esc_attr($target); ?>">
									<?php echo esc_html($url_title); ?>
								</a>
							</div>
						<?php endif; ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>