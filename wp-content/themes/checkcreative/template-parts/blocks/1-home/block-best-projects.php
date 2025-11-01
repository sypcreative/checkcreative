<?php
$proyectos = get_field('block_best_projects_relation');
if ($proyectos && is_array($proyectos)) : ?>

	<section class="block-best-projects vh-100 position-relative overflow-clip">
		<div class="container h-100 ">
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
		</div>
	</section>
<?php endif; ?>