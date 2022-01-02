// load json
var article_elements, article_array, not_found;
async function loadJson() {
	var res = await fetch("https://raw.githubusercontent.com/CMD-Golem/CMD-Golem/master/elements/javascript/special/powered_enchanting/enchantments.json");
	// var res = await fetch("http://127.0.0.1:5500/elements/javascript/special/powered_enchanting/enchantments.json");
	article_array = await res.json();
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
			comp_items = "axe boots bow chestplate crossbow elytra fishing rod helmet hoe leggings pickaxe shovel sword trident "
		}
		if (article.incomp_ench != "false") {
			article.style = article.style + " show_incomp"
		}
		var max_lvl = convertToRoman(article.max_lvl);

		html = html + `
		<article id="${article.id}" class="${article.style}" onclick="selectToggle(this)" title="Select" data-chance="${article.chance}" data-arrayId="${i}">
			<div class="settings_button" onclick="setting(this)" title="Options"><img src="../../elements/nav/settings.svg"></div>
			<div class="content">
				<h1>${article.title}</h1>
				<p>${article.description}</p>
				<div class="comp_items">${comp_items}</div>
			</div>
			<table>
				<tr><td>Max Level:</td><td>${max_lvl}</td></tr>
				<tr title="Can be enchanted on the following tools"><td>Compatible Items:</td><td>${img_path}</td></tr>
				<tr class="incomp_ench" title="Can't be enchantent on the same tool"><td>Incompatible:</td><td>${article.incomp_ench}</td></tr>
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


function convertToRoman(num) {
	var roman = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};
	var str = '';
  
	for (var i of Object.keys(roman)) {
		var q = Math.floor(num / roman[i]);
		num -= q * roman[i];
		str += i.repeat(q);
	}
	return str;
}

// ###########################################################
// Site Search
var site_search = document.getElementById("site_search");

function siteSearch() {
	var search_value = site_search.value;
	var search_input = search_value.toUpperCase().split(" ");

	// hide settings
	try {
		document.getElementsByClassName("settings_box")[0].remove();
	}
	catch (e) {}

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
// Select and Sidebar
var body = document.getElementsByTagName("body")[0];
var link_bar = document.getElementsByClassName("link_bar")[0];
var sidebar_hidden = true;

function changeEdition(edition) {
	if (edition == "all") {
		var select_array = document.getElementsByTagName("article");
		for (var i = 0; i < select_array.length; i++) { select(select_array[i]); }
	}
	else if (edition == "golem") {
		var select_array = document.getElementsByClassName("golem");
		for (var i = 0; i < select_array.length; i++) { select(select_array[i], true); }
	}
	else if (edition == "vanilla") {
		var select_array = document.getElementsByClassName("vanilla");
		for (var i = 0; i < select_array.length; i++) { select(select_array[i], true); }
	}
	else {
		var select_array = document.getElementsByTagName("article");
		for (var i = 0; i < select_array.length; i++) {
			if (select_array[i].classList.contains("selected")) { deselect(select_array[i]); }
		}
	}
}

function selectToggle(article) {
	if (article.classList.contains("selected")) { deselect(article) }
	else { select(article, false) }
}


function select(article, preselection) {
	if (article.classList.contains("selected") == false) {
		article.classList.add("selected");
		if (preselection) {
			article.classList.add("preselected");
		}

		// Add sidebar link
		var new_link = document.createElement("div");
		new_link.innerHTML = `<div class="dot" title="Remove from list" onclick="removeEnch('${article.id}')"></div><span class="disable_link link_text">${article.getElementsByTagName("h1")[0].innerHTML}</span><br>`;
		new_link.classList.add("sidebar_link");
		new_link.id = "link_" + article.id;
		new_link.title = "Click to go to enchantment"
		new_link.setAttribute("onclick", "scrollToParent('" + article.id + "')");
		link_bar.appendChild(new_link);

		// show sidebar
		if (sidebar_hidden) {
			body.classList.add("sidebar_show");
			sidebar_hidden = false;
		}
	}
}

function deselect(article) {
	article.classList.remove("selected");
	try { article.classList.remove("preselected"); }
	catch (e) {}

	// remove sidebar link
	var remove_link = document.getElementById("link_" + article.id);
	remove_link.remove();

	// hide sidebar
	if (link_bar.firstElementChild == null) {
		body.classList.remove("sidebar_show");
		sidebar_hidden = true;
	}
}


function removeEnch(id) {
	event.stopPropagation();
	var article = document.getElementById(id);
	deselect(article);
}

// Scroll in view
function scrollToParent(id) {	
	var sel_element = document.getElementById(id)
	sel_element.scrollIntoView({block: 'center', behavior: 'smooth'});
}

function hideSelected(option) {
	try {
		body.classList.remove("hide_selected");
		body.classList.remove("hide_preselected");
		body.classList.remove("hide_vanilla");
	}
	catch (e) {}

	if (option == "hide") {
		body.classList.add("hide_selected");
	}
	else if (option == "hide_presel") {
		body.classList.add("hide_preselected");
	}
	else if (option == "vanilla") {
		body.classList.add("hide_vanilla");
	}
}

// ###########################################################
// Settings
var article_setting_el = document.createElement("div"); 
article_setting_el.classList.add("settings_box");

function setting(article) {
	event.stopPropagation();
	article = article.parentNode;

	if (article.nextElementSibling.classList.contains("settings_box")) {
		article.nextElementSibling.remove();
	}
	else {
		var chance = article.getAttribute("data-chance");
		var chance1 = "";
		var chance2 = "";
		var chance5 = "";
		var chance0 = "";
		if (chance == "1") {chance1 = "selected";}
		if (chance == "2") {chance2 = "selected";}
		if (chance == "5") {chance5 = "selected";}
		if (chance == "0") {chance0 = "selected";}


		if (article.classList.contains("advanced_ench")) { var adv_ench = "checked"; }
		else { var adv_ench = ""; }


		if (article.classList.contains("options")) {
			if (article.classList.contains("ignore_incomp")) { var incomp_ench_checked = "checked"; }
			else { var incomp_ench_checked = ""; }
			var incomp_ench = '<tr><td>Ignore incompatible Enchantments</td><td><input type="checkbox" onclick="incompEnch(this)" ' + incomp_ench_checked + '></td></tr>';
		}
		else { var incomp_ench = ""; }
		

		article_setting_el.innerHTML = `
		<p style="font-weight: bold;">Settings</p>
		<table class="settings_table">
			<tr><td>Enchanting chance</td>
				<td>
					<select onchange="changeChance(this)">
						<option value="1" ${chance1}>10% (e.g. Infinity)</option>
						<option value="2" ${chance2}>20% (e.g. Looting)</option>
						<option value="5" ${chance5}>50% (e.g. Knockback)</option>
						<option value="0" ${chance0}>100% (e.g. Sharpness)</option>
					</select>
				</td>
			</tr>
			<tr><td>Advanced Enchantment</td><td><input type="checkbox" onclick="advEnch(this)" ${adv_ench}></td></tr>
			${incomp_ench}
		</table>`

		article.parentNode.insertBefore(article_setting_el, article.nextSibling);
	}
}

function changeChance(input) {
	var article = input.closest(".settings_box").previousSibling;
	article.setAttribute("data-chance", input.value);
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
	var incomp_enches = article_array[article.getAttribute("data-arrayId")].ench;
	var ench_id_array = article_array.map(a => a.ench[0]);

	if (input.checked) {
		article.classList.add("ignore_incomp");
		for (var i = 0; i < incomp_enches.length; i++) {
			if (i != 0) {
				article_elements[ench_id_array.indexOf(incomp_enches[i])].classList.add("ignore_incomp");
			}
		}
	}
	else {
		article.classList.remove("ignore_incomp");
		for (var i = 0; i < incomp_enches.length; i++) {
			if (i != 0) {
				article_elements[ench_id_array.indexOf(incomp_enches[i])].classList.remove("ignore_incomp");
			}
		}
	}
}


//#################################################################################################
//Scroll on top
var scroll_top = document.getElementById("scroll_top");

window.onscroll = () => {
	if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
		scroll_top.style.display = "block";
	} else {
		scroll_top.style.display = "none";
	}
}

function goTop() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}