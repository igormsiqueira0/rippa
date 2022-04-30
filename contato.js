const contatoLabel = () => {
	const labels = document.querySelectorAll('label'),
		inputs = document.querySelectorAll('input'),
		textarea = document.querySelector('textarea');
	fields = [...inputs, textarea];

	function handleFocus(i) {
		labels[i].classList.add('active');
	}

	function handleBlur(field, i) {
		if (field.value.length === 0) {
			labels[i].classList.remove('active');
		}
	}

	[...fields].forEach((field, index) => {
		field.addEventListener('focus', () => {
			handleFocus(index);
		});
		field.addEventListener('blur', () => {
			handleBlur(field, index);
		});
	});
};

contatoLabel();
