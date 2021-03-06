function debounce(callback, delay) {
	let timer;
	return (...args) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			callback(...args);
			timer = null;
		}, delay);
	};
}

class Slide {
	constructor(slide, wrapper) {
		this.slide = document.querySelector(slide);
		this.wrapper = document.querySelector(wrapper);
		this.dist = {
			finalPosition: 0,
			startX: 0,
			moved: 0,
		};

		this.activeClass = 'active';

		this.changeEvent = new Event('changeEvent');
	}

	transition(active) {
		this.slide.style.transition = active ? 'transform .3s' : 'none';
	}

	moveSlide(distX) {
		this.dist.movedPosition = distX;
		this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
	}

	updatePosition(clientX) {
		this.dist.moved = (this.dist.startX - clientX) * 1.6;
		return this.dist.finalPosition - this.dist.moved;
	}

	onStart(event) {
		let movetype;

		if (event.type === 'mousedown') {
			event.preventDefault();
			this.dist.startX = event.clientX;
			movetype = 'mousemove';
		} else {
			this.dist.startX = event.changedTouches[0].clientX;
			movetype = 'touchmove';
		}

		this.wrapper.addEventListener(movetype, this.onMove);
		this.transition(false);
	}

	onMove(event) {
		const pointerPos =
			event.type === 'mousemove'
				? event.clientX
				: event.changedTouches[0].clientX;
		const finalPosition = this.updatePosition(pointerPos);
		this.moveSlide(finalPosition);
	}

	onEnd(event) {
		const movetype = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
		this.wrapper.removeEventListener(movetype, this.onMove);
		this.dist.finalPosition = this.dist.movedPosition;

		this.transition(true);
		this.changeOnEnd();
	}

	changeOnEnd() {
		if (this.dist.moved > 120 && this.index.next !== undefined) {
			this.activeNextSlide();
		} else if (this.dist.moved < -120 && this.index.prev !== undefined) {
			this.activePrevSlide();
		} else {
			this.changeSlide(this.index.active);
		}
	}

	changeActiveClass() {
		this.slideArray.forEach((item) => {
			item.element.classList.remove(this.activeClass);
		});

		this.slideArray[this.index.active].element.classList.add(this.activeClass);
	}

	slidePosition(slide) {
		const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
		return -(slide.offsetLeft - margin);
	}

	slideConfig() {
		this.slideArray = [...this.slide.children].map((element) => {
			const position = this.slidePosition(element);

			return {
				element,
				position,
			};
		});
	}

	slideIndexNav(i) {
		const last = this.slideArray.length - 1;

		this.index = {
			prev: i ? i - 1 : undefined,
			active: i,
			next: i === last ? undefined : i + 1,
		};
	}

	activePrevSlide() {
		if (this.index.prev !== undefined) {
			this.changeSlide(this.index.prev);
		}
	}

	activeNextSlide() {
		if (this.index.next !== undefined) {
			this.changeSlide(this.index.next);
		}
	}

	changeSlide(i) {
		const activeSlide = this.slideArray[i];
		this.moveSlide(activeSlide.position);
		this.slideIndexNav(i);

		this.dist.finalPosition = activeSlide.position;
		this.changeActiveClass();
		this.wrapper.dispatchEvent(this.changeEvent);
	}

	onResize() {
		setTimeout(() => {
			this.slideConfig();
			this.changeSlide(this.index.active);
		}, 1000);
	}

	addSlideEvents() {
		this.wrapper.addEventListener('mousedown', this.onStart);
		this.wrapper.addEventListener('mouseup', this.onEnd);

		this.wrapper.addEventListener('touchstart', this.onStart);
		this.wrapper.addEventListener('touchend', this.onEnd);

		window.addEventListener('resize', this.onResize);
	}

	bindEvents() {
		this.onStart = this.onStart.bind(this);
		this.onMove = this.onMove.bind(this);
		this.onEnd = this.onEnd.bind(this);
		this.onResize = debounce(this.onResize.bind(this), 200);
		this.activePrevSlide = this.activePrevSlide.bind(this);
		this.activeNextSlide = this.activeNextSlide.bind(this);
		this.controlEvent = this.controlEvent.bind(this);
		this.activeControlItem = this.activeControlItem.bind(this);
	}

	init() {
		this.bindEvents();
		this.transition(true);
		this.addSlideEvents();
		this.slideConfig();
		this.changeSlide(0);
		this.onResize();
		return this;
	}
}

class SlideNav extends Slide {
	addArrow(prev, next) {
		this.prevElement = document.querySelector(prev);
		this.nextElement = document.querySelector(next);
		this.addArrowEvent();
	}

	addArrowEvent() {
		this.prevElement.addEventListener('click', this.activePrevSlide);
		this.nextElement.addEventListener('click', this.activeNextSlide);
	}

	createControl() {
		const control = document.createElement('ul');
		control.dataset.control = 'slide';

		this.slideArray.forEach((item, index) => {
			control.innerHTML += `<li><a href="#slide${index}">${index}</a></li>`;
		});

		this.wrapper.appendChild(control);
		return control;
	}

	controlEvent(item, index) {
		item.addEventListener('click', (e) => {
			e.preventDefault();
			this.changeSlide(index);
			this.activeControlItem();
		});
		this.wrapper.addEventListener('changeEvent', this.activeControlItem);
	}

	activeControlItem() {
		this.controlArr.forEach((item) => {
			item.classList.remove(this.activeClass);
		});
		this.controlArr[this.index.active].classList.add(this.activeClass);
	}

	addControl(customControl) {
		this.control =
			document.querySelector(customControl) || this.createControl();

		this.controlArr = [...this.control.children];
		this.controlArr.forEach(this.controlEvent);
		this.activeControlItem();
	}
}

const slide = new SlideNav('.slide', '.wrapper');
slide.init();
slide.addArrow('.prev', '.next');
slide.addControl('.custom-controls');
