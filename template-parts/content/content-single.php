<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_One
 * @since Twenty Twenty-One 1.0
 */

?>

<article class="entry-wrap" id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header alignwide">
		<?php the_title( '<div class="header-wrap"><h1 class="entry-title">', '</h1></div>' ); ?>
		<?php twenty_twenty_one_post_thumbnail(); ?>
	</header><!-- .entry-header -->

	<section class="entry-content">

		<div class="entry-left"></div>
		<div class="entry-center">
			<div class="post-info">
				<?php
					// Posted on
					twenty_twenty_one_posted_on();
					// Posted by.
					twenty_twenty_one_posted_by();
				?>
			</div>
			<?php the_content(); ?>
	</div>
	<div class="entry-right">
		<nav id="side-nav">
			<?php get_template_part( 'template-parts/footer/sidebar-widgets' ); ?>
		</nav>
	</div>
	</section><!-- .entry-content -->
	<?php
		wp_link_pages(
			array(
				'before'   => '<nav class="page-links" aria-label="' . esc_attr__( 'Page', 'twentytwentyone' ) . '">',
				'after'    => '</nav>',
			)
		);
		?>

	<footer class="entry-footer default-max-width">
		<?php twenty_twenty_one_entry_meta_footer(); ?>
	</footer><!-- .entry-footer -->

	<?php if ( ! is_singular( 'attachment' ) ) : ?>
		<?php get_template_part( 'template-parts/post/author-bio' ); ?>
	<?php endif; ?>
</article><!-- #post-<?php the_ID(); ?> -->
