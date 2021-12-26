// load json
var test;
var article_elements, not_found;
async function loadJson() {
	//var res = await fetch("https://raw.githubusercontent.com/CMD-Golem/CMD-Golem/master/elements/javascript/special/powered_enchanting/enchantments.json);
	var res = await fetch("http://127.0.0.1:5500/elements/javascript/special/powered_enchanting/enchantments.json");
	article_array = await res.json();
	test = article_array
	var html = "<p id='not_found'>No Results</p>";

	for (var i = 0; i < article_array.length; i++) {
		var article = article_array[i];
		// set path
		var items = article.comp_items;
		var img_path = "";
		for (var j = 0; j < items.length; j++) {
			img_path = img_path + `<img src="../../elements/pictures/datapacks/powered_enchanting/items/${items[j]}.png">`
		}

		html = html + `
		<article id="${article.id}" class="${article.style}" onclick="select(this)">
			<div class="settings_button" onclick="setting(this)"><img src="../../elements/nav/settings.svg"></div>
			<div class="content">
				<h1>${article.title}</h1>
				<p>${article.description}</p>
			</div>
			<table>
				<tr><td>Max Level:</td><td>${article.max_lvl}</td></tr>
				<tr><td>Compatible Items:</td><td>${img_path}</td></tr>
				<tr class="incomp_ench"><td>Incompatible:</td><td>${article.incomp_ench}</td></tr>
			</table>
		</article>

		`
	}
	article_list.innerHTML = html;
	article_elements = article_list.getElementsByTagName("article");
	not_found = document.getElementById("not_found");
	siteSearch();
}
loadJson();


function test(items) {
	
	console.log(img_path)
}

// ###########################################################
// Site Search
var input = document.getElementById("site_search");

function siteSearch() {
	var filter = input.value.toUpperCase();

	for (var i = 0; i < article_elements.length; i++) {
		var filterwords = article_elements[i].getElementsByTagName("h1")[0].innerHTML;
		console.log(filterwords)
		if (filterwords.toUpperCase().indexOf(filter) > -1) {
			article_elements[i].classList.remove("hide_search");
		} else {
			article_elements[i].classList.add("hide_search");
		}
	}
	var hide_search = document.getElementsByClassName("hide_search").length;

	if (article_elements.length - hide_search <= 0) {
		not_found.style.display = "block";
	}
	else {
		not_found.style.display = "none";
	}
};

// ###########################################################
// Select and Settings
var article_setting_el = document.createElement("div"); 
article_setting_el.classList.add("settings_box")

function setting(article) {
	event.stopPropagation();
	article = article.parentNode;

	var chance = "5";
	var adv_ench = " checked"
	var incomp_ench = '<tr><td>Ignore incompatible Enchantments</td><td><input type="checkbox" onclick="incompEnch(this)"></td></tr>';

	article_setting_el.innerHTML = `
	<p style="font-weight: bold;">Settings</p>
	<table class="settings_table">
		<tr><td>Enchanting chance</td><td><span onkeyup="changeChance(this)">${chance}</span>%</td></tr>
		<tr><td>Advanced Enchantment</td><td><input type="checkbox" onclick="advEnch(this)"${adv_ench}></td></tr>
		${incomp_ench}
	</table>`

	if (article.nextElementSibling.classList.contains("settings_box")) {
		article.nextElementSibling.remove();
	}
	else {
		article.parentNode.insertBefore(article_setting_el, article.nextSibling);
	}
	
}

function select(article) {
	article.classList.toggle("selected");
}