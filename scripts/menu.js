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

function insertData(arr) {
	const ul = document.querySelector('.menu-pratos ul');
	ul.innerHTML = '';

	arr.forEach((item) => {
		const li = document.createElement('li');
		const img = document.createElement('img');
		const paragraph = document.createElement('p');

		img.setAttribute('src', item.img);
		paragraph.innerText = item.nome;

		li.appendChild(img);
		li.appendChild(paragraph);

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
