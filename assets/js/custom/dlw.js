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
		const navUl = document.querySelectorAll("nav > div > ul ul");
		const subMenu = document.querySelectorAll("nav > div > ul ul.sub-menu");
		if (subMenu) {
			for (let i = 0; i < subMenu.length; i++) {
				subMenu[i].classList.remove("sub-menu");
			}
		}

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
		const container = document.querySelector(".header-overlay");
		
		if(container) {
			header.appendChild(container);
		}
	};
	setTimeout(initHeaderCaption, 0);
})();

//wraps Mediathek for mobile
(() => {
	const initTitle = () => {
		const title = document.querySelector(".site-title");

		const getText = node => {
			if (!node) { return; }
			if (node.hasChildNodes()) {
				return getText(node.firstChild);
			} else {
				return node.textContent;
			}
		}
		
		if(title) {
			const titleText = getText(title).split("Mediathek");
			if(titleText.length === 2) {
				const text = document.createTextNode("Mediathek");
				const span = document.createElement("SPAN");
				const anker = document.createElement("A");
				span.classList.add("hide-mobile");
				span.innerHTML = titleText[1];
				anker.setAttribute("href", "/");
				title.innerHTML = "";
				title.appendChild(text);
				title.appendChild(span);
				const titleParent = title.parentElement;
				if (titleParent) {
					anker.appendChild(title);
					titleParent.appendChild(anker);	
				}
			}
		}
	};
	setTimeout(initTitle, 0);
})();


/* shows the hidden Entries */
(() => {
	const initHidenEntries = () => {
		const section = document.querySelector(".entry-content");
		const cardcontainer = document.querySelector(".wp-block-query");
		const hiddenElements = document.querySelector(".wp-block-query.more ul");

		if (cardcontainer && section) {

			const toggleMore = () => {
				if(hiddenElements) {
					const arrLength = hiddenElements.children.length;
					for (let i = 0; i < arrLength; i++) {
						const lastCard = cardcontainer.firstElementChild.lastElementChild;
						hiddenElements.firstElementChild.classList.add("new-card");
						lastCard.parentNode.insertBefore(hiddenElements.firstElementChild, lastCard.nextElementSibling);
					}
					cardcontainer.classList.add("open");
					showMoreButton.classList.add("hide");
				};	
			}

			const showMoreButton = document.createElement("BUTTON");
			showMoreButton.classList.add("show-more");
			showMoreButton.innerHTML = "Alle anzeigen";
			showMoreButton.addEventListener("click", toggleMore);
			if (hiddenElements) {
				cardcontainer.parentNode.insertBefore(showMoreButton, cardcontainer.nextSibling);
			}
		}
	};
	setTimeout(initHidenEntries, 0);
})();
