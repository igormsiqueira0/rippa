const handleClick = (e) => {
	e.preventDefault();
	const txt = e.target.innerText.toLowerCase();
	window.localStorage.setItem('pref', txt);

	window.location.href = 'menu.html#menu';
};

const navigateToMenu = () => {
	const menuLinkList = document.querySelectorAll('.menu-link');

	menuLinkList.forEach((link) => {
		link.addEventListener('click', handleClick);
	});
};
navigateToMenu();
