// Site Search
function siteSearch() {
	var input, filter, ul, article, filterwords, i;
	input = document.getElementById("site_search");
	filter = input.value.toUpperCase();
	ul = document.getElementById("article-list");
	article = ul.getElementsByClassName("filterme");

	for (i = 0; i < article.length; i++) {
		filterwords = article[i].className;
		if (filterwords.toUpperCase().indexOf(filter) > -1) {
			article[i].classList.remove("hide_search");
		} else {
			article[i].classList.add("hide_search");
		}
	}

	if (article.length - document.getElementsByClassName("hide_search").length == 0) {
		document.getElementById("not-found").style.display = "block";
	}

	else {
		document.getElementById("not-found").style.display = "none";
	};
};


//#################################################################################################
// Add filter
var hashfilter = window.location.hash.substr(1);

if (document.getElementById(hashfilter) == null) {
	console.log("Filter in Hash isn't a real Filter!");
}
else {
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
};


//#################################################################################################
// Load Filter on reload
window.onload = function onload() {
	siteSearch();
	loadFilter();
}
