var table = document.getElementsByTagName("table")[0];
var datapacks, resource_packs, maps, help, powered_enchanting, versions, countries, sel_db;

// determan what data should be loaded
async function initDatabase(hash) {
	// if (hash == undefined) {
	// 	hash = window.location.hash.substr(1);
	// }
	sel_db = hash;

	if (hash == "packs") {
		datapacks = datapacks ?? await readDatabase("all_datapacks");
		resource_packs = resource_packs ?? await readDatabase("all_resource_packs");

		printOut(datapacks.concat(resource_packs), "date");
	}
	else if (hash == "datapacks") { printOut(datapacks, "date") }
	else if (hash == "resource_packs") { printOut(resource_packs, "date"); }
	
	else if (hash == "maps") {
		maps = maps ?? await readDatabase("all_maps");
		printOut(maps, "date");
	}
	else if (hash == "help") {
		help = help ?? await readDatabase("all_help");
		printOut(help), "date";
	}
	else if (hash == "powered_enchanting") {
		powered_enchanting = powered_enchanting ?? await readDatabase("all_powered_enchanting");
		printOut(powered_enchanting, "date");
	}
	else if (hash == "versions") {
		versions = versions ?? await readDatabase("all_versions", "no_date");
		printOut(versions, "versions");
	}
	else if (hash == "countries") {
		countries = countries ?? await readDatabase("all_countries", "countries");
		printOut(countries, "countries");
	}
}

initDatabase("packs");

// refresh Table
function refreshDatabase() {
	datapacks = undefined;
	resource_packs = undefined;
	maps = undefined;
	help = undefined;
	powered_enchanting = undefined;
	versions = undefined;
	countries = undefined;

	table.innerHTML = "";

	initDatabase(sel_db);
}

// #################################################################################################
// get data from db
async function readDatabase(hash, special) {
	var response = await fetch(`/.netlify/functions/read_all/${hash}`);
	var db_data = await response.json();

	if (special == "no_date") {
		return db_data.map(counter => `
			<tr class="show_more_button" data-name="${counter.data.name}">
				<td><p>${counter.data.name}</p></td>
				<td><p>${counter.data.downloads.toLocaleString('de-CH')}</p></td>
				<td></td>
			</tr>
			`).join('');
	}
	else if (special == "countries") {
		return db_data.map(counter => `
			<tr class="show_more_button" data-name="${counter.data.counter}">
				<td><p>${counter.data.country}</p></td>
				<td><p>${counter.data.counter.toLocaleString('de-CH')}</p></td>
				<td></td>
			</tr>
			`).join('');
	}
	else {
		return db_data.map(counter => `
			<tr onclick="spoilerTable(this)" class="show_more_button" data-date="${counter.data.date}">
				<td><p>${counter.data.name}<span class="mobile_date">${new Date(counter.data.date).getDate()}.${new Date(counter.data.date).getMonth() + 1}.${new Date(counter.data.date).getFullYear()}</span></p></td>
				<td><p>${counter.data.count.toLocaleString('de-CH')}</p></td>
				<td><p>${new Date(counter.data.date).getDate()}.${new Date(counter.data.date).getMonth() + 1}.${new Date(counter.data.date).getFullYear()}</p></td>
			</tr>
			<tr class="show_more_content">
				<td>Downloads yesterday:</td>
				<td>${counter.data.count_yesterday.toLocaleString('de-CH')}</td>
				<td></td>
			</tr>
			<tr class="show_more_content">
				<td>Downloads dby:</td>
				<td>${counter.data.count_yyesterday.toLocaleString('de-CH')}</td>
				<td></td>
			</tr>
			<tr class="show_more_content tr_last">
				<td>Downloads last month:</td>
				<td>${counter.data.count_last_month.toLocaleString('de-CH')}</td>
				<td></td>
			</tr>
			`).join('');
	}
}

// #################################################################################################
// fill html
function printOut(html, sorting) {
	table.innerHTML = html;

	var table_header = document.createElement("tr");
	table_header.innerHTML = `<th><p>Name</p></th><th class="download_th"><p>Downloads</p><img src="../elements/nav/download.svg"></th><th><p>Date</p></th>`;
	table.insertBefore(table_header, table.firstChild);

	sortTable(table, sorting);
}


// Spoiler
function spoilerTable(el) {
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

function closeSpoiler(el) {
	el.classList.remove("active");
	var panel = el.nextElementSibling;
	panel.style.display = null;
	panel.nextElementSibling.style.display = null;
	panel.nextElementSibling.nextElementSibling.style.display = null;
}


// #################################################################################################
// Search
var packs = table.getElementsByClassName("show_more_button");
var input = document.getElementById("search");
var not_found = document.getElementById("not_found");

function search() {
	var filter = input.value.toUpperCase();

	for (var i = 0; i < packs.length; i++) {
		var filterwords = packs[i].firstElementChild.firstElementChild.innerHTML;
		if (filterwords.toUpperCase().indexOf(filter) > -1) {
			packs[i].classList.remove("hide_search");
		} else {
			closeSpoiler(packs[i]);
			packs[i].classList.add("hide_search");
		}
	}

	if (packs.length - document.getElementsByClassName("hide_search").length <= 0) {
		not_found.style.display = "block";
	}
	else {
		not_found.style.display = "none";
	}
}

// sort Table
function sortTable(table, sorting) {
	var switching = true;

	while (switching == true) {
		switching = false;
		var rows = table.getElementsByClassName("show_more_button");

		for (var i = 0; i < (rows.length - 1); i++) {
			var should_switch = false;

			if (sorting == "date" && rows[i].dataset.date < rows[i + 1].dataset.date) {
				should_switch = true;
				break;
			}
			else if (sorting == "version" && rows[i].dataset.name < rows[i + 1].dataset.name) {
				should_switch = true;
				break;
			}
			else if (sorting == "countries" && parseInt(rows[i].dataset.name) < parseInt(rows[i + 1].dataset.name)) {
				should_switch = true;
				break;
			}
		}

		if (should_switch == true) {
			switching = true;

			if (sorting != "date") {
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			}
			else {
				var yesterday = rows[i + 1].nextElementSibling;
				var yyesterday = rows[i + 1].nextElementSibling.nextElementSibling;
				var last_month = rows[i + 1].nextElementSibling.nextElementSibling.nextElementSibling;

				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				rows[i].parentNode.insertBefore(yesterday, rows[i + 1]);
				rows[i].parentNode.insertBefore(yyesterday, rows[i + 1]);
				rows[i].parentNode.insertBefore(last_month, rows[i + 1]);
			}
		}
	}
}