// read db
var readDatabase = (database) => {
	var readAll = (index_type) => {
		return fetch(`/.netlify/functions/read_all/${index_type}`, {
			method: 'POST',
		}).then(response => {
			return response.json()
		 })
	}

	var readAllOffline = (index_type) => {
		return fetch(`https://raw.githubusercontent.com/CMD-Golem/cmd-golem.github.io/master/${index_type}.json`).then(response => {
			return response.json()
		})
	}

	return readAll(database).then((response) => {
		return response.map(counter => `
			<tr onclick="spoiler(this)" class="show_more_button" data-date="${counter.data.date}">
				<td><p>${counter.data.name}<span class="mobile_date">${new Date(counter.data.date).getDate()}.${new Date(counter.data.date).getMonth() + 1}.${new Date(counter.data.date).getFullYear()}</span></p></td>
				<td><p>${counter.data.count}</p></td>
				<td><p>${new Date(counter.data.date).getDate()}.${new Date(counter.data.date).getMonth() + 1}.${new Date(counter.data.date).getFullYear()}</p></td>
			</tr>
			<tr class="show_more_content">
				<td>Downloads yesterday:</td>
				<td>${counter.data.count_yesterday}</td>
				<td></td>
			</tr>
			<tr class="show_more_content">
				<td>Downloads dby:</td>
				<td>${counter.data.count_yyesterday}</td>
				<td></td>
			</tr>
			<tr class="show_more_content tr_last">
				<td>Downloads last month:</td>
				<td>${counter.data.count_last_month}</td>
				<td></td>
			</tr>
			`).join('');
	});
}

function initDatabase(hash) {
	if (hash == undefined) {
		hash = window.location.hash.substr(1);
	}

	if (hash == "packs" || hash == "") {
		readDatabase("all_datapacks").then(response => {
			var datapacks = response;
			readDatabase("all_resource_packs").then(response => {
				var resource_packs = response;
				readDatabase("all_maps").then(response => {
					var maps = response;

					printOut(datapacks.concat(resource_packs.concat(maps)))
				});
			});
		});
	}

	else if (hash == "datapacks") { readDatabase("all_datapacks").then(response => { printOut(response); }); }
	else if (hash == "resource_packs") { readDatabase("all_resource_packs").then(response => { printOut(response); }); }
	else if (hash == "maps") { readDatabase("all_maps").then(response => { printOut(response); }); }

	else if (hash == "help") { readDatabase("all_help").then(response => { printOut(response); }); }

	else if (hash == "powered_enchanting") { readDatabase("all_powered_enchanting").then(response => { printOut(response); }); }
}


function printOut(html) {
	var table = document.getElementsByTagName("table")[0];
	table.innerHTML = html;

	var table_header = document.createElement("tr");
	table_header.innerHTML = `<th><p>Name</p></th><th class="download_th"><p>Downloads</p><img src="../elements/nav/download.svg"></th><th><p>Date</p></th>`;
	table.insertBefore(table_header, table.firstChild);

	sortTable(table);
}

initDatabase();

// #################################################################################################
// sort Table
function sortTable(table) {
	var switching = true;

	while (switching == true) {
		switching = false;
		var rows = table.getElementsByClassName("show_more_button");

		for (var i = 0; i < (rows.length - 1); i++) {
			var should_switch = false;
			if (rows[i].dataset.date < rows[i + 1].dataset.date) {
				should_switch = true;
				break;
			}
		}

		if (should_switch == true) {
			var yesterday = rows[i + 1].nextElementSibling;
			var yyesterday = rows[i + 1].nextElementSibling.nextElementSibling;
			var last_month = rows[i + 1].nextElementSibling.nextElementSibling.nextElementSibling;

			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			rows[i].parentNode.insertBefore(yesterday, rows[i + 1]);
			rows[i].parentNode.insertBefore(yyesterday, rows[i + 1]);
			rows[i].parentNode.insertBefore(last_month, rows[i + 1]);

			switching = true;
		}
	}
}


// #################################################################################################
// Spoiler
function spoiler(el) {
	el.classList.toggle("active");
	var panel = el.nextElementSibling;
	if (panel.style.display) {
		panel.style.display = null;
		panel.nextElementSibling.style.display = null;
		panel.nextElementSibling.nextElementSibling.style.display = null;
	}
	else {
		panel.style.display = "table-row";
		panel.nextElementSibling.style.display = "table-row";
		panel.nextElementSibling.nextElementSibling.style.display = "table-row";
	}
}