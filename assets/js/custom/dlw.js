/* exported showOverlay,hideOverlay,overlayCloseHandlers,callOverlayCloseHandlers */

// We have to preserve the old scrollTop because we disable scrolling
// while an overlay is acive.
let oldScrollTop   = 0;
let overlayElement = null;
let overlayActive  = false;
const overlayCloseHandlers = [];

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

	for(const child of document.querySelector("main").children){
		if(child === blurException){
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

	for(const child of document.querySelector("main").children){
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

		document.body.appendChild(overlayElement);
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

const initNavBar = () => {
	const navBar = document.querySelector("body aside#navigation");
	const navButton = document.querySelector("#button-navigation");

	const navCloseButton = document.createElement("NAV-CLOSE-BUTTON");
	navBar.append(navCloseButton);
	navCloseButton.addEventListener("click", () => {
		navBar.classList.remove("active");
		navBar.setAttribute('aria-hidden', true);
		hideOverlay();
	});
	navBar.setAttribute('aria-hidden', true);

	navButton.addEventListener("click", () => {
		if (navBar.classList.contains("active")) {
			navBar.classList.remove("active");
			navBar.setAttribute('aria-hidden', true);
			hideOverlay();
		} else {
			navBar.classList.add("active");
			showOverlay(navBar);
			navBar.setAttribute('aria-hidden', false);
		}
	});
	overlayCloseHandlers.push(() => {
		navBar.classList.remove("active");
		navBar.setAttribute('aria-hidden', true);
	});
};
setTimeout(initNavBar, 0);

/* Don't pollute the global scope if avoidable */
(() => {
	const initNavigation = () => {
		const navUl = document.querySelectorAll("nav > ul ul");

		const showNavigationActive = ele => {
			if((ele === null) || ((ele.tagName !== "UL") && (ele.tagName !== "LI"))){return;}
			if(ele.tagName === "UL"){
				ele.classList.remove("hidden");
			}else{
				ele.firstElementChild.classList.add("active");
			}
			for(const chi of ele.children){
				if(chi.tagName === "UL"){
					chi.classList.remove("hidden");
					chi.setAttribute('role', 'group');
				}
			}
			showNavigationActive(ele.parentElement);
		};

		const refreshNavigationList = () => {
			for(const ele of document.querySelectorAll("nav ul")){
				ele.classList.add("hidden");
			}
			for(const ele of document.querySelectorAll("nav")){
				if(ele.firstElementChild){
					ele.firstElementChild.classList.remove("hidden");
				}
			}
			for(const ele of document.querySelectorAll("nav-toggle.active")){
				ele.classList.remove("active");
			}
			showNavigationActive(document.querySelector("nav li.active"));

			//this opens the menu on Jura-Museum
			if (navUl.length < 50) {
				const firstLevel = document.querySelectorAll("nav > ul > li > ul > li");
				for (let i = 0; i < firstLevel.length; i++) {
					firstLevel[i].firstElementChild.classList.add("active");
					const ulHidden = firstLevel[i].querySelector("ul");
					if (ulHidden !== null) {
						ulHidden.classList.remove("hidden");
					}
				}
			}
			const activeEntry = document.querySelector("nav a.active");
			const activeTopEntry = document.querySelector("nav li.active");
			if (activeEntry !== null) {
				activeEntry.scrollIntoView(true);
			}
			if (activeTopEntry !== null) {
				activeTopEntry.scrollIntoView(true);
			}
		};

		navUl.forEach(ele => {
			const parentLi = ele.parentElement;
			const toggle = document.createElement("NAV-TOGGLE");
			parentLi.prepend(toggle);
			parentLi.setAttribute('aria-expanded', false);

			toggle.addEventListener("click", () => {
				if(ele.classList.contains("hidden")){
					ele.classList.remove("hidden");
					toggle.classList.add("active");
					parentLi.setAttribute('aria-expanded', true);
				} else {
					ele.classList.add("hidden");
					toggle.classList.remove("active");
					parentLi.setAttribute('aria-expanded', false);
				}
			});
		});

		refreshNavigationList();

		overlayCloseHandlers.push(() => {
			refreshNavigationList();
		});
	};
	setTimeout(initNavigation, 0);
})();

/* Don't pollute the global scope if avoidable */
(() => {
	const initHeaderCaption = () => {
		const header = document.querySelector("#main header.entry-header > figure");
		const headerCaption = document.querySelector(".header-caption");
		const container = document.createElement("DIV");
		if(headerCaption) {
			container.classList.add("header-overlay");
			container.appendChild(headerCaption);
			header.appendChild(container);
		}
	};
	setTimeout(initHeaderCaption, 0);
})();