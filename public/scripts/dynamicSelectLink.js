HTMLElement.prototype.clear = function () {
    while(this.firstChild) {
        this.removeChild(this.firstChild);
    }
    return this;
};

const buildCategoryList = function (data, entity) {
	let select = document.createElement('select');
	select.setAttribute('name', entity);
	data.forEach(element => {
		let option = document.createElement('option');
		option.setAttribute('value', element.sanitized_url);
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
            element.clear()
			element.appendChild(buildCategoryList(data, entity));
		})
	});
};

getList('categories', 'categoryUpdate');
getList('roles', 'roleUpdate');
getList('pages', 'pageUpdate');

	
