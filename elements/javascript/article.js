// Site Search
var article = document.getElementById("article_list").getElementsByClassName("filterme");
var input = document.getElementById("site_search");

function siteSearch() {
	var filter = input.value.toUpperCase();

	for (var i = 0; i < article.length; i++) {
		var filterwords = article[i].className;
		if (filterwords.toUpperCase().indexOf(filter) > -1) {
			article[i].classList.remove("hide_search");
		} else {
			article[i].classList.add("hide_search");
		}
	}
	notFound()
};


//#################################################################################################
// set filter from hash
var hashfilter = document.getElementById(window.location.hash.substr(1));
if (hashfilter != null) {
	hashfilter.checked = true;
}

// eventlistener
var checkboxes = document.getElementById("filters").querySelectorAll("input[type=checkbox]");
for (var i = 0; i < checkboxes.length; i++) {
	checkboxes[i].addEventListener("click", siteFilter);
}

var filter_box = document.getElementById("filters");

function siteFilter() {
	// Get filter words from all checkboxes and put it in a array
	var getFilters = function (category) {
		var keywords = [];
		var filters = filter_box.querySelectorAll("." + category + ":checked");
		for (var i = 0; i < filters.length; i++) {
			keywords.push(filters[i].id);
		}
		return keywords;
	}

	var version = getFilters("version");
	var type = getFilters("type");
	var pack = getFilters("pack");

	// loop trough all article
	for (var i = 0; i < article.length; i++) {
		var show_version = false;
		var show_type = false;
		var show_pack = false;

		// check if group has checked checkbox and if filter word is in classlist
		if (version.length == 0) {show_version = true;}
		else {
			for (var j = 0; j < version.length; j++) {
				if (article[i].classList.contains(version[j])) {show_version = true;}
			}
		}

		if (type.length == 0) {show_type = true;}
		else {
			for (var j = 0; j < type.length; j++) {
				if (article[i].classList.contains(type[j])) {show_type = true;}
			}
		}

		if (pack.length == 0) {show_pack = true;}
		else {
			for (var j = 0; j < pack.length; j++) {
				if (article[i].classList.contains(pack[j])) {show_pack = true;}
			}
		}

		// hide if filter word from one group wasn't in class list
		if (show_version == false || show_pack == false || show_type == false) {
			article[i].classList.add("hide_filter");
		}
		else {
			article[i].classList.remove("hide_filter");
		}
	}
	notFound()
}

//#################################################################################################
// Show not found when no results
var not_found = document.getElementById("not_found")

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
	siteFilter();
}

// Counter
var index_counted = false;

async function indexCounter() {
	var current_day = local_date.getFullYear + "." + local_date.getMonth + "." + local_date.getDay;
	var was_counted = window.localStorage.getItem("index_counter");

	if (was_counted != current_day && user_role != "hidden") {
		window.localStorage.setItem("index_counter", current_day);
		fetch(`/.netlify/functions/update/help/350149262119535177`);
	}
	else {
		index_counted = true;
	}
}

indexCounter();