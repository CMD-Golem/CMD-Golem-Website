// load json
var test;
var article_elements, not_found;
async function loadJson() {
	var res = await fetch("https://raw.githubusercontent.com/CMD-Golem/CMD-Golem/master/elements/javascript/special/powered_enchanting/enchantments.json");
	// var res = await fetch("http://127.0.0.1:5500/elements/javascript/special/powered_enchanting/enchantments.json");
	article_array = await res.json();
	test = article_array
	var html = "<p id='not_found'>No Results</p>";

	for (var i = 0; i < article_array.length; i++) {
		var article = article_array[i];
		// set path
		var items = article.comp_items;
		var img_path = "";
		var comp_items = "";
		for (var j = 0; j < items.length; j++) {
			img_path = img_path + `<img src="../../elements/pictures/datapacks/powered_enchanting/items/${items[j]}.png">`
			comp_items = comp_items + items[j] + " ";
		}
		if (comp_items == "all_items ") {
			comp_items = "axe boots bow chestplate crossbow elytra fishing rod helmet hoe leggings pickaxe shovel sword trident"
		}

		html = html + `
		<article id="${article.id}" class="${article.style}" onclick="select(this)" title="Select">
			<div class="settings_button" onclick="setting(this)" title="Options"><img src="../../elements/nav/settings.svg"></div>
			<div class="content">
				<h1>${article.title}</h1>
				<p>${article.description}</p>
				<div class="comp_items">${comp_items}</div>
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
var site_search = document.getElementById("site_search");

function siteSearch() {
	var search_value = site_search.value;
	var search_input = search_value.toUpperCase().split(" ");

	for (var i = 0; i < article_elements.length; i++) {
		var filter_data = article_elements[i].getElementsByClassName("comp_items")[0].innerHTML + article_elements[i].getElementsByTagName("h1")[0].innerHTML;
		var search_data = filter_data.toUpperCase().split(" ");

		var hide = false;

		// Search: loop trough array from input
		for (var j = 0; j < search_input.length; j++) {
			var prehide = true;

			// Check if keywords are in input
			for (var k = 0; k < search_data.length; k++) {
				if (search_data[k].startsWith(search_input[j])) { var prehide = false; }
			}
			if (prehide == false && hide != true) { var hide = false; }
				else { var hide = true; }
		}
		if (hide) {
			article_elements[i].classList.add("hide_search");
		}
		else {
			article_elements[i].classList.remove("hide_search");
		}
	}
	var hide_search = document.getElementsByClassName("hide_search").length;

	if (article_elements.length - hide_search <= 0) {
		not_found.style.display = "block";
	}
	else {
		not_found.style.display = "none";
	}
}

// ###########################################################
// Select
var aside = document.getElementsByTagName("aside")[0];
var link_bar = document.getElementsByClassName("link_bar")[0];

function select(article) {
	if (article.classList.contains("selected")) {
		article.classList.remove("selected");

		// remove sidebar link
		var remove_link = document.getElementById("link_" + article.id);
		remove_link.remove();
	}
	else {
		article.classList.add("selected");

		aside.style.right = "0";

		// Add sidebar link
		var new_link = document.createElement("div");
		new_link.innerHTML = '<div class="dot"></div><span class="disable_link link_text">' + article.getElementsByTagName("h1")[0].innerHTML + '</span><br>';
		new_link.classList.add("sidebar_link");
		new_link.id = "link_" + article.id;
		new_link.setAttribute("onclick", "scrollToParent('" + article.id + "')");
		link_bar.appendChild(new_link);
	}
}

// Scroll in view
function scrollToParent(id) {	
	var sel_element = document.getElementById(id)
	sel_element.scrollIntoView({block: 'center', behavior: 'smooth'});
}

// ###########################################################
// Settings
var article_setting_el = document.createElement("div"); 
article_setting_el.classList.add("settings_box");

function setting(article) {
	event.stopPropagation();
	article = article.parentNode;

	var chance = "5";

	if (article.classList.contains("advanced_ench")) {
		var adv_ench = "checked";
	}
	else {
		var adv_ench = "";
	}

	if (article.classList.contains("show_incomp")) {
		var incomp_ench = '<tr><td>Ignore incompatible Enchantments</td><td><input type="checkbox" onclick="incompEnch(this)"></td></tr>';
	}
	else {
		var incomp_ench = "";
	}
	

	article_setting_el.innerHTML = `
	<p style="font-weight: bold;">Settings</p>
	<table class="settings_table">
		<tr><td>Enchanting chance</td><td><span onkeyup="changeChance(this)">${chance}</span>%</td></tr>
		<tr><td>Advanced Enchantment</td><td><input type="checkbox" onclick="advEnch(this)" ${adv_ench}></td></tr>
		${incomp_ench}
	</table>`

	if (article.nextElementSibling.classList.contains("settings_box")) {
		article.nextElementSibling.remove();
	}
	else {
		article.parentNode.insertBefore(article_setting_el, article.nextSibling);
	}
}

function changeChance(input) {
	var article = input.closest(".settings_box").previousSibling;
}

function advEnch(input) {
	var article = input.closest(".settings_box").previousSibling;
	if (input.checked) {
		article.classList.add("advanced_ench");
	}
	else {
		article.classList.remove("advanced_ench");
	}
}

function incompEnch(input) {
	var article = input.closest(".settings_box").previousSibling;
}