<?php
$title = get_field('block_related_projects_title');
$cta = get_field('block_related_projects_cta');
$url = $cta['url'] ?? '';
$label = $cta['title'] ?? '';
$relation = get_field('block_related_projects_projects');
?>

<section class="block-related-projects h-100 vw-100 position-relative pt-8 pb-5">
	<div class="container pb-5">
		<div class="row">
			<div class="col-12 d-flex flex-column flex-md-row justify-content-between pb-2">
				<h3 class="h4 h-md-3" title-anim><?php echo esc_html($title); ?></h3>
				<a class="btn" href='<?php echo esc_url($url); ?>'><?php echo esc_html($label); ?></a>
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