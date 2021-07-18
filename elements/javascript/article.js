// Site Search
var article = document.getElementById("article-list").getElementsByClassName("filterme");

function siteSearch() {
	var input = document.getElementById("site_search");
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
// Add filter
var hashfilter = window.location.hash.substr(1);

if (document.getElementById(hashfilter) != null) {
	document.getElementById(hashfilter).checked = true;
}


//#################################################################################################
// Filter //https://stackoverflow.com/a/45146800
var getFilter = function (category) {
	var filter = $("#filters ." + category + ":checked").map(function () {
		return '[class*="' + this.id + '"]';
	}).get().join(",");
	filter = (filter.length > 0) ? filter : "*";
	return filter;
}

$("#filters :checkbox").click(function () {
	var all = $(".filterme");
	var tgts = all.filter(getFilter("version")).filter(getFilter("type")).filter(getFilter("pack"));
	all.not(tgts).addClass("hide_filter");
	tgts.removeClass("hide_filter");
	notFound();
});


// Filter if return to page
function loadFilter() {
	var getFilter = function (category) {
		var filter = $("#filters ." + category + ":checked").map(function () {
			return '[class*="' + this.id + '"]';
		}).get().join(",");
		filter = (filter.length > 0) ? filter : "*";
		return filter;
	}

	var all = $(".filterme");
	var tgts = all.filter(getFilter("version")).filter(getFilter("type")).filter(getFilter("pack"));
	all.not(tgts).addClass("hide_filter");
	tgts.removeClass("hide_filter");
	notFound();
};

//#################################################################################################
// Show not found when no results
function notFound() {
	var hide_search = document.getElementsByClassName("hide_search").length;
	var hide_filter = document.getElementsByClassName("hide_filter").length;

	if (article.length - hide_filter - hide_search <= 0) {
		document.getElementById("not-found").style.display = "block";
	}
	else {
		document.getElementById("not-found").style.display = "none";
	};
}



//#################################################################################################
// Load Filter on reload
window.onload = function onload() {
	siteSearch();
	loadFilter();
}
