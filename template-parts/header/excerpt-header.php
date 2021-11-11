<?php
/**
 * Displays the post header
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_One
 * @since Twenty Twenty-One 1.0
 */

// Don't show the title if the post-format is `aside` or `status`.
$post_format = get_post_format();
if ( 'aside' === $post_format || 'status' === $post_format ) {
	return;
}
?>

<header class="entry-header">
	<?php
	twenty_twenty_one_post_thumbnail();
	the_title( sprintf( '<div class="header-wrap"><h2 class="entry-title default-max-width"><a href="%s">', esc_url( get_permalink() ) ), '</a></h2></div>' );
	?>
</header><!-- .entry-header -->
