// insert packs in list
var article_list = document.getElementById("article_list");
var search_array = [];

pack_array.sort((a,b) => b.updated - a.updated);

function loadPacks() {
	var html = "";

	for (var i = 0; i < pack_array.length; i++) {
		var pack = pack_array[i];
		if (pack.search_keys !== false) {
			search_array.push(pack);

			// Pack Type
			var pack_path = "packs";
			
			if (pack.pack_type == "datapacks") { var pack_type = "Data Pack"; }
			else if (pack.pack_type == "resource_packs") { var pack_type = "Resource Pack"; }
			else if (pack.pack_type == "maps") { var pack_type = "Map"; }
			else if (pack.pack_type == "generators") {
				var pack_type = "Generator";
				var pack_path = "help";
			}
			else {
				var pack_type = "Miscellaneous";
				var pack_path = "help";
			}

			// Compatible MC Version
			var first_version_id = pack.pack_version_id[pack.pack_version_id.length - 1]; // oldest comp version
			var last_version_id = pack.last_version_id; // newest comp version

			var first_version = version_id_array.find(e => e.id == first_version_id).name;

			if (last_version_id == false) { var pack_version = first_version + " +"; }
			else { var pack_version = first_version + " - " + version_id_array.find(e => e.id == last_version_id).name; }

			// Generate HTML
			html += `<a id="${pack.pack_id}" data-arrayid="${i}" href="${pack_path}/${pack.pack_id}.html">
				<div class="img_container">
					<img src="elements/pictures/${pack_path}/${pack.pack_id}/logo_1.png" loading="lazy" alt="${pack.name} ${pack_type} Logo">
				</div>
				<p class="description">${pack.description}</p>
				<div class="info">
					<p>${pack_type}</p>
					<p>${pack_version}</p>
				</div>
			</a>`
		}
	}
	article_list.innerHTML = html;
}

loadPacks();


//#################################################################################################
// Version Filter // nearly the same funtcion as in pack.js
var version_id_array_filtered = [];
var article = article_list.children;
var html_main_version = "";
var no_filter;

function openFilter() {
	// create a html list with all compatible main versions
	var array_main = [];
	version_id_array_filtered = [];
	html_main_version = `<div onclick="noFilter()" id="no_filter">All</div>`;

	for (var i = 0; i < version_id_array.length; i++) {
		var version_id = version_id_array[i];

		version_id_array_filtered.push(version_id);

		if (!array_main.includes(version_id.main)) {
			html_main_version += `<div onclick="mainVersion(this)" id="${version_id.main_id}">${version_id.main}</div>`;
			array_main.push(version_id.main);
		}
	}

	version_main.innerHTML = html_main_version;
	no_filter = document.getElementById("no_filter");

	// check if last selected version is compatible with this pack
	var selected_version_id = parseInt(window.sessionStorage.getItem("selected_version_id"));

	if (!isNaN(selected_version_id)) {
		// select last selected version
		var selected_version = version_id_array.find(e => e.id == selected_version_id);

		select_version.innerHTML = selected_version.main + "." + selected_version.sub;

		var selected_main = document.getElementById(selected_version.main_id);
		selected_main.classList.add("version_main_selected");

		mainVersion(selected_main);
		subVersion(document.getElementById("subid" + selected_version.id));
	}
	else {
		// Select no Version filter 
		select_version.innerHTML = "All";
		no_filter.classList.add("version_main_selected");
		noFilter();
	}
}

function mainVersion(selected_version_el) {
	document.getElementsByClassName("version_main_selected")[0].classList.remove("version_main_selected")
	selected_version_el.classList.add("version_main_selected");
	var html = "";

	// show sub versions
	for (var i = 0; i < version_id_array_filtered.length; i++) {
		var version_id = version_id_array_filtered[i];

		if (version_id.main == selected_version_el.innerHTML) {

			html += `<div onclick="subVersion(this)", id="subid${version_id.id}">.${version_id.sub}</div>`;
		}
	}
	version_sub.innerHTML = html;

	// auto select sub version if only one is aviable
	if (version_sub.childElementCount == 1) {
		subVersion(version_sub.firstElementChild);
	}
}

function subVersion(selected_version_el) {
	try { document.getElementsByClassName("version_sub_selected")[0].classList.remove("version_sub_selected"); } catch (e) {}
	selected_version_el.classList.add("version_sub_selected");

	var selected_version = version_id_array.find(e => "subid" + e.id == selected_version_el.id);
	window.sessionStorage.setItem("selected_version_id", selected_version.id);

	select_version.innerHTML = selected_version.name.replace(" Preview", "");
	selection_box.classList.add("hidden");

	// hide all elements which dont support selected version
	for (var i = 0; i < pack_array.length; i++) {
		var pack = pack_array[i];
		if (pack.search_keys === false) { continue; }

		var element = document.getElementById(pack.pack_id);
		var first_version = pack.pack_version_id[pack.pack_version_id.length - 1]; // oldest comp version
		var last_version = pack.last_version_id; // newest comp version
		var incomp_version_id = pack.incomp_version_id ?? [];

		if (last_version == false) {
			last_version = version_id_array[0].id;
		}

		if (!(selected_version.id <= last_version && selected_version.id >= first_version)) {
			element.classList.add("hide_filter");
		}
		else if (incomp_version_id.includes(selected_version.id)) {
			element.classList.add("hide_filter");
		}
		else {
			element.classList.remove("hide_filter");
		}
	}
}

function noFilter() {
	try { document.getElementsByClassName("version_main_selected")[0].classList.remove("version_main_selected"); } catch (e) {}
	no_filter.classList.add("version_main_selected");

	version_sub.innerHTML = "<div></div>";
	window.sessionStorage.removeItem("selected_version_id");
	select_version.innerHTML = "All";
	selection_box.classList.add("hidden");

	// unhide all elements
	for (var i = 0; i < article.length; i++) {
		article[i].classList.remove("hide_filter");
	}
}

//#################################################################################################
// Site Search
var input = document.getElementById("site_search");
var not_found = document.getElementById("not_found");

function siteSearch() {
	var filter = input.value.toUpperCase();

	for (var i = 0; i < search_array.length; i++) {
		var search_item = search_array[i];
		var search_string = (search_item.name + " " + search_item.search_keys).toUpperCase();

		if (search_string.includes(filter)) {
			document.getElementById(search_item.pack_id).classList.remove("hide_search");
		}
		else {
			document.getElementById(search_item.pack_id).classList.add("hide_search");
		}
	}
	notFound()
};


// Show not found when no results
function notFound() {
	var hide_search = document.querySelectorAll(".hide_search:not(.hide_filter)").length;
	var hide_filter = document.getElementsByClassName("hide_filter").length;

	if (article.length - hide_filter - hide_search <= 0) {
		not_found.style.display = "block";
	}
	else {
		not_found.style.display = "none";
	};
}


//#################################################################################################
// Load Filter on reload
window.onload = function onload() {
	siteSearch();
	openFilter();
}

// Counter
// var index_counted = false;

// async function indexCounter() {
// 	var current_day = local_date.getFullYear + "." + local_date.getMonth + "." + local_date.getDay;
// 	var was_counted = window.localStorage.getItem("index_counter");

// 	if (was_counted != current_day && user_role != "hidden") {
// 		window.localStorage.setItem("index_counter", current_day);
// 		fetch();
// 	}
// 	else {
// 		index_counted = true;
// 	}
// }

// indexCounter();