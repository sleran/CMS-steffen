HTMLElement.prototype.clear = function () {
    while(this.firstChild) {
        this.removeChild(this.firstChild);
    }
    return this;
};

const buildCategoryList = function (data, entity, id) {
	let select = document.createElement('select');
	select.setAttribute('name', entity);
	select.setAttribute('class', 'ddList');
	let defaultOpt = document.createElement('option');
		defaultOpt.setAttribute('value', '');
		defaultOpt.setAttribute('selected', '');
		defaultOpt.setAttribute('hidden', '');
		defaultOpt.setAttribute('disabled', '');
		defaultOpt.textContent = 'Vælg';
		select.appendChild(defaultOpt);
	data.forEach(element => {
		let option = document.createElement('option');
		option.setAttribute('value', element.sanitized_url);
		if (element.sanitized_url == id) {
			option.setAttribute('selected', '');
		}
		option.textContent = element.name;
		select.appendChild(option);

	});
	return select;
};

const getList = function (type,entity) {
	fetch(`http://localhost:1337/api/${type}`)
      .then(response => response.json())
      .then(data => { 
        
        document.querySelectorAll( '.' + entity).forEach(element => {
			let id = element.dataset['url'];
			element.clear()
			element.appendChild(buildCategoryList(data, entity));
		})
	});
};


getList('pages', 'pageUpdate');

	
