const headerActivate = () => {
	const nav = document.querySelector('header #main-nav ul').children;
	const page = document.documentElement.dataset.page;
	let index;

	[...nav].forEach((li, i) => {
		if (li.innerText.toLowerCase() === page) index = i;
	});
	nav[index].classList.add('active');
};
headerActivate();

// menu mobile -------------

function outsideClick(element, events, callback) {
	const html = document.documentElement;
	const outside = 'data-outside';
	function handleOutsideClick(event) {
		if (!element.contains(event.target)) {
			element.removeAttribute(outside);
			events.forEach((userEvent) => {
				html.removeEventListener(userEvent, handleOutsideClick);
			});
			callback();
		}
	}

	if (!element.hasAttribute(outside)) {
		events.forEach((userEvent) => {
			setTimeout(() => html.addEventListener(userEvent, handleOutsideClick));
		});
		element.setAttribute(outside, '');
	}
}

class MenuMobile {
	constructor(button, list, events) {
		this.menuButton = document.querySelector(button);
		this.menuList = document.querySelector(list);
		this.activeClass = 'active';

		if (events === undefined) this.events = ['touchstart', 'click'];
		else this.events = events;

		this.openMenu = this.openMenu.bind(this);
	}

	openMenu(e) {
		e.preventDefault();
		this.menuList.classList.add(this.activeClass);
		this.menuButton.classList.add(this.activeClass);
		outsideClick(this.menuList, this.events, () => {
			this.menuList.classList.remove(this.activeClass);
			this.menuButton.classList.remove(this.activeClass);
		});
	}

	addEvents() {
		this.events.forEach((evento) =>
			this.menuButton.addEventListener(evento, this.openMenu)
		);
	}

	init() {
		if (this.menuButton && this.menuList) {
			this.addEvents();
		}
		return this;
	}
}

const menumobile = new MenuMobile('[data-menu="button"]', '[data-menu="list"]');
menumobile.init();
