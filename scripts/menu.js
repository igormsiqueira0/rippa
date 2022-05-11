// fetch
let menuData;
const fetchMenu = async () => {
	const data = await (await fetch('menu.json')).json();

	menuData = data;
};
fetchMenu();

// eventControl
const nav = document.querySelectorAll('.nav-item');
const mobileSelect = document.querySelector('.mobile-nav #pref');
const ul = document.querySelector('.menu-pratos ul');

function insertData(arr) {
	ul.innerHTML = '';

	arr.forEach((item) => {
		const li = document.createElement('li');

		li.innerHTML = `
			<img src=${item.img} alt="Foto de ${item.nome}" />
			<p>${item.nome}</p>
		`;

		ul.appendChild(li);
	});
}

const handleClick = ({ target }) => {
	const selectedTab = target.innerText.toLowerCase();

	menuData.forEach((category) => {
		if (category.categoria === selectedTab) {
			insertData(category.pratos);
			window.localStorage.setItem('pref', selectedTab);
		}
	});

	activateTab();
};
nav.forEach((item) => {
	item.addEventListener('click', handleClick);
});

// mobile select -----------------------------------------

const handleMobileChange = (e) => {
	menuData.forEach((category) => {
		if (category.categoria === e.target.value) {
			insertData(category.pratos);
			window.localStorage.setItem('pref', e.target.value);
		}
	});
};

const mobileSelection = () => {
	if (mobileSelect) mobileSelect.addEventListener('change', handleMobileChange);
};

const changeMobileVal = (val) => {
	if (mobileSelect) mobileSelect.value = val;
};

// scroll on anchor --------------------------------------

function scrollToMenu() {
	if (window.location.hash === '#menu') {
		setTimeout(() => {
			ul.scrollIntoView({ block: 'center', behavior: 'smooth' });
		}, 501);
	}
}

// onload ------------------------------------------------

const handleLoad = (pref) => {
	setTimeout(() => {
		menuData.forEach((category) => {
			if (category.categoria === pref) {
				insertData(category.pratos);
			}
		});
	}, 500);
};
const initialPreference = window.localStorage.getItem('pref') || 'entradas';
window.onload = () => {
	handleLoad(initialPreference);
	changeMobileVal(initialPreference);
	activateTab();
	mobileSelection();
	scrollToMenu();
};

// activate tab ------------------------------------------

const activateTab = () => {
	const preference = window.localStorage.getItem('pref');

	nav.forEach((item) => {
		item.classList.remove('active');
		if (preference === item.innerText.toLowerCase())
			item.classList.add('active');
	});
};
