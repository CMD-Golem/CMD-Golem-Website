// read db
const readAll = () => {
	return fetch('/.netlify/functions/read_all').then((response) => {
		return response.json()
	})
}

readAll().then((todos) => { console.log('all todos', todos) });