// read db
var readAll = (index_type) => {
	return fetch(`/.netlify/functions/read_all/${index_type}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

var datapacks, resource_packs;


readAll("all_datapacks").then((response) => {
	var html = response.map(counter => `
		<p data-date="${counter.data.date}">${counter.data.name}: ${counter.data.count}</p>
		`).join('');

	document.getElementsByTagName("main")[0].innerHTML = html;

});

readAll("all_resource_packs").then((response) => { resource_packs = response });


