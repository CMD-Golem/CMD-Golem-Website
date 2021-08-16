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
		<tr data-date="${counter.data.date}">
			<td><p class="date">${counter.data.date}<p></td>
			<td><p class="name">${counter.data.name}<p></td>
			<td><p>${counter.data.count}<p></td>
			<td><p>${counter.data.count_yesterday}<p></td>
			<td><p>${counter.data.count_yyesterday}<p></td>
			<td><p>${counter.data.count_last_month}<p></td>
		</tr>
		`).join('');

	document.getElementsByTagName("table")[0].innerHTML = html;

});

readAll("all_resource_packs").then((response) => { resource_packs = response });



// #################################################################################################
// sort Table (https://stackoverflow.com/a/49041392/14225364)
function sortTable(th) {
	var getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

	var comparer = (idx, asc) => (a, b) => ((v1, v2) => 
		v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
		)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

	
	var table = th.closest('table');
	Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
		.sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
		.forEach(tr => table.appendChild(tr) );
}

var th = document.getElementsByTagName("th");
for (var i = 0; i < th.length; i++) {
	th[i].addEventListener("click", e => {
		var el = e.target;
		sortTable(el);
	});

	if (th[i].innerHTML == "<p>Date</p>") {
		sortTable(th[i]);
		sortTable(th[i]);
	}
}