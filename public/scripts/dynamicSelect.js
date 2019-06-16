HTMLElement.prototype.clear = function () {
    while(this.firstChild) {
        this.removeChild(this.firstChild);
    }
    return this;
};


// Forslag: Omdøb "entity" til "formInputName"

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
		option.setAttribute('value', element.id);
		if (element.id == id) {
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
			let id = element.dataset['cat'];
			element.clear();
			element.appendChild(buildCategoryList(data, entity, id));
		})
	});
};

getList('categories', 'categoryUpdate');
getList('roles', 'roleUpdate');
getList('theatres', 'theatreUpdate');

	
// HTMLElement.prototype.clear = function () {
// 	while (this.firstChild) {
// 		this.removeChild(this.firstChild)
// 	}
// 	return this;
//  };
//  const buildList = function (data, element, id) {
// 	let select = document.createElement('select');
// 	select.setAttribute('name', 'id_' + element);
// 	let option = document.createElement('option');
// 	option.setAttribute('value', 0);
// 	option.textContent = 'vælg ' + element;
// 	select.appendChild(option);
 
// 	data.forEach(element => {
// 		let option = document.createElement('option');
// 		option.setAttribute('value', element.id);
// 		if (element.id == id) {
// 			option.setAttribute('selected', "selected");
// 		}
// 		option.textContent = element.navn;
// 		select.appendChild(option);
// 	});
// 	return select;
//  };
//  const getList = function (type) {
// 	/* fetch(`https://localhost:1339/api/${type}`) */
// 	fetch(`http://localhost:1339/api/${type}`)
// 		.then(response => response.json())
// 		.then(data => {
// 			let id = document.querySelector('#' + type).dataset['id'];
// 			document
// 				.querySelector('#' + type)
// 				.clear()
// 				.appendChild(buildList(data, type, id));
 
// 		});
//  };