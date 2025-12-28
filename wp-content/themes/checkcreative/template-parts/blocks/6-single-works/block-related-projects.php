<?php
$title = get_field('block_related_projects_title');
$cta = get_field('block_related_projects_cta');
$url = $cta['url'] ?? '';
$label = $cta['title'] ?? '';
$relation = get_field('block_related_projects_projects');
?>

<section class="block-related-projects h-100 vw-100 position-relative pt-4 pt-md-8 pb-5">
	<div class="container pb-0 pb-md-5">
		<div class="row align-items-center mb-4">
			<div class="col-6 text-uppercase mb-0 mb-md-2">
				<h3 class="h4 h-md-3 lh-1 mb-0" title-anim><?php echo esc_html($title); ?></h3>
			</div>
			<div class="col-6">
				<div class="btn-group justify-content-end d-flex">
					<a href="<?php echo esc_url($url); ?>" target="<?php echo esc_attr($target); ?>" class="btn-icon-link d-flex text-primary text-decoration-none w-inline-block">
						<div class="btn-icon-content bg-dark justify-content-start d-flex position-relative overflow-hidden align-items-center text-light">
							<div class="btn-icon-content__mask z-1 justify-content-start d-flex align-items-center position-relative overflow-hidden">
								<span data-button-anim-target="" class="btn-icon-content__text"><?php echo esc_html($label); ?></span>
							</div>
							<div data-button-anim-target="" class="btn-icon-content__bg bg-primary position-absolute bottom-0"></div>
						</div>
					</a>
				</div>
			</div>
		</div>
		<div class="block-related-projects__content row">
			<?php foreach ($relation as $item) :
				$post = is_object($item) ? $item : get_post((int) $item);
				if (!$post) continue;

				// ACF del CPT "Proyecto"
				$acf_title = get_field('post_type_proyectos_title', $post->ID);
				$year      = get_field('post_type_proyectos_year',  $post->ID);

				$title      = get_the_title($post);
				$permalink  = get_permalink($post);
				$thumb_html = has_post_thumbnail($post->ID)
					? get_the_post_thumbnail($post->ID, 'large', ['class' => 'block-related-projects__thumb'])
					: '';
				$post_count = is_array($relation) ? count($relation) : 0;
				$col_class = ($post_count === 2) ? 'col-12 col-md-6 pb-3 pb-md-0' : 'col-12 col-md-4';
			?>
				<article class="block-related-projects__item <?= esc_attr($col_class) ?>">
					<a href="<?= esc_url($permalink) ?>"
						class="block-related-projects__card">
						<div class="block-related-projects__media">
							<?= $thumb_html ?>
						</div>
						<div class="block-related-projects__meta d-flex justify-content-between mt-2 text-dark ls-3">
							<span class="block-related-projects__name text-uppercase"><?= esc_html($title) ?></span>
							<?php if (!empty($year)) : ?>
								<span class="block-related-projects__year"><?= esc_html($year) ?></span>
							<?php endif; ?>
						</div>
					</a>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>