// Add article to list
var getjson = new XMLHttpRequest();
getjson.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(this.responseText);
			const article = document.getElementById('article-list');

		const html = data.map(item => `
			<a class="filterme ${item.search} ${item.versions}" href="${item.link}.html">
				<div class="img_container">
					<img src="elements/pictures/${item.link}/logo_1.png" loading="lazy">
				</div>
				<p class="description">${item.description}</p>
				<div class="info">
					<p>${item.type}</p>
					<p>${item.compatibility}</p>
				</div>
			</a>

			`).join('');

		article.innerHTML = html;
	}
};
getjson.open("GET", "https://raw.githubusercontent.com/CMD-Golem/CMD-Golem/master/elements/creations.json", true);
getjson.send();



//#################################################################################################
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

window.addEventListener("load", function(){
	siteSearch();
});



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
$(window).on('load', function(){
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
});
