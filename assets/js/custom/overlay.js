/* exported showOverlay,hideOverlay,overlayCloseHandlers,callOverlayCloseHandlers */

// We have to preserve the old scrollTop because we disable scrolling
// while an overlay is acive.
let oldScrollTop   = 0;
let overlayElement = null;
let overlayActive  = false;
const overlayCloseHandlers = [];

const getBox = node => {
	console.log(node.querySelector("section[content-type=box]"));
	return node.querySelector("section[content-type=box]");
}

// We need to to gather all Elements, because they are not on one Level like systemx
const entryLeft = document.querySelector(".entry-left");
const entryRight = document.querySelector(".entry-right");
const entryHeader = document.querySelector("header.entry-header");
const entryFooter = document.querySelector(".entry-footer");
const entryPostNavigation = document.querySelector(".navigation.post-navigation");
const entryFooterWidgets = document.querySelector("aside.widget-area.footer-widgets");
const entryCenter = document.querySelector(".entry-center");
const entryContent = document.querySelector(".entry-content");

const AllSelectors = [entryLeft, entryRight, entryHeader, entryFooter, entryPostNavigation, entryFooterWidgets];

let blurredSections = [];

(() => {
	const addAllElements = () => {
		if (entryCenter) {
			for (let i = 0; i < entryCenter.children.length; i++) {
				blurredSections.push(entryCenter.children[i]);
			}
		}
		if (entryContent) {
			for (let i = 0; i < entryContent.children.length; i++) {
				blurredSections.push(entryContent.children[i]);
			}
		}
		for (let i = 0; i < AllSelectors.length; i++) {
			if (AllSelectors[i]) {
				blurredSections.push(AllSelectors[i]);
			}
		}
	};
	setTimeout(addAllElements, 0);
})();


const showOverlay = (blurException) => {
	overlayElement.setAttribute("open","open");
	overlayElement.classList.add("active");

	if(!overlayActive){
		oldScrollTop = document.documentElement.scrollTop|0;
		document.body.style.top = (-oldScrollTop)+"px";
	}
	overlayActive = true;
	// This needs to be last, because as soon as we add this class scrolling is disabled, setting scrollTop to 0
	document.body.classList.add("modal-active");

	for(const child of blurredSections){
		if(child === blurException.parentElement){
			child.classList.remove("overlay-blur");
		}else{
			child.classList.add("overlay-blur");
		}
	}
};

const callOverlayCloseHandlers = () => {
	for(const cb of overlayCloseHandlers){cb();}
};

const hideOverlay = () => {
	if(!overlayActive){return;}
	overlayElement.removeAttribute("open");
	callOverlayCloseHandlers();

	for(const child of blurredSections){
		child.classList.remove("overlay-blur");
	}

	// Now it needs to be first, because otherwise there is nowhere to scroll to
	document.body.classList.remove("modal-active");
	document.documentElement.scrollTop = oldScrollTop;
	document.body.style.top = "";
	overlayActive = false;
};

(() => {
	const initOverlay = () => {
		overlayElement = document.createElement("PAGE-OVERLAY");
		article = document.querySelector("article");

		article.appendChild(overlayElement);
		overlayElement.addEventListener("click", hideOverlay);
		// This is important so we can set scrollTop before leaving the site
		// because most browsers save the scrollTop position and restore it when using the history
		addEventListener("beforeunload",hideOverlay);

		// active class should be removed last, since it sets the z-index
		overlayElement.addEventListener("transitionend",e => {
			if(e.propertyName !== 'opacity')                 {return;}
			if(overlayElement.getAttribute("open") !== null) {return;}
			overlayElement.classList.remove("active");
		});
	};
	setTimeout(initOverlay, 0);
})();
