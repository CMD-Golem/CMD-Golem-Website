// read db
var readAll = (index_type) => {
	return fetch(`/.netlify/functions/read/${index_type}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

readAll("all_datapacks").then((todos) => { console.log('all todos', todos) });
readAll("all_resource_packs").then((todos2) => { console.log('all todos', todos2) });
