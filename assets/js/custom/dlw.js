const addBlogBgImage = () => {
	const allBlogImages = document.querySelectorAll(".wp-block-query ul.is-flex-container li .wp-block-post-featured-image a");
	for (let i = 0; i < allBlogImages.length; i++) {
		const bg = document.createElement("IMG");
		bg.setAttribute("src", "/wp-content/themes/systemw/assets/images/blog-hover.svg");
		bg.classList.add("blog-overlay");
		allBlogImages[i].appendChild(bg)
	}
}

document.addEventListener('DOMContentLoaded', function() {
	setTimeout(() => {
		addBlogBgImage();
	}, 0);
});