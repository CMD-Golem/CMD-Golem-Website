// load json
var article_elements, article_array, not_found;
var comp_items_key = ["all", "helmet", "chestplate", "leggings", "boots", "sword", "pickaxe", "axe", "shovel", "hoe", "bow", "carrot_on_a_stick", "crossbow", "elytra", "fishing_rod", "flint_and_steel", "shears", "shield", "trident"];

async function loadJson() {
	var res = await fetch("https://raw.githubusercontent.com/CMD-Golem/CMD-Golem/master/elements/javascript/generators/powered_enchanting/enchantments.json");
	// var res = await fetch("http://127.0.0.1:5500/elements/javascript/generators/powered_enchanting/enchantments.json");
	article_array = await res.json();
	var html = "<p id='not_found'>No Results</p>";

	for (var i = 0; i < article_array.length; i++) {
		var article = article_array[i];

		// set path
		var items = article.comp_items;
		var img_path = "";
		var comp_items = "";
		for (var j = 0; j < items.length; j++) {
			var item = comp_items_key[items[j]];
			img_path = img_path + `<img src="../../elements/pictures/datapacks/powered_enchanting/items/${item}.png">`
			comp_items = comp_items + item + " ";
		}

		if (comp_items == "all ") {
			comp_items = "helmet chestplate leggings boots sword pickaxe axe shovel hoe bow crossbow elytra fishing rod flint and steal shears shield trident"
		}
		if (article.incomp_ench != "false") {
			article.style = article.style + " show_incomp"
		}
		var max_lvl = convertToRoman(article.max_lvl);

		html = html + `
		<article id="${article.id}" class="${article.style}" onclick="selectToggle(this)" title="Select" data-chance="${article.chance}" data-arrayId="${i}">
			<div class="settings_button" onclick="setting(this)" title="Options"><img src="../../elements/nav/settings.svg"></div>
			<div class="content">
				<h3>${article.title}</h3>
				<p>${article.description}</p>
				<div class="comp_items">${comp_items}</div>
			</div>
			<table>
				<tr><td>Max Level:</td><td>${max_lvl}</td></tr>
				<tr title="Can be enchanted on the following tools"><td>Compatible items:</td><td>${img_path}</td></tr>
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


// ###########################################################
// Select and Sidebar
var body = document.getElementsByTagName("body")[0];
var link_bar = document.getElementById("link_bar");
var sidebar_hidden = true;

// edition preselection
function changeEdition(edition) {
	selected_edition = edition;
	if (edition == "all") {
		var select_array = document.getElementsByTagName("article");
		for (var i = 0; i < select_array.length; i++) { select(select_array[i]); }
	}
	else if (edition == "golem") {
		var select_array = document.getElementsByClassName("e_golem");
		for (var i = 0; i < select_array.length; i++) { select(select_array[i], true); }
	}
	else if (edition == "vanilla") {
		var select_array = document.getElementsByClassName("e_vanilla");
		for (var i = 0; i < select_array.length; i++) { select(select_array[i], true); }
	}
	else {
		var select_array = document.getElementsByTagName("article");
		for (var i = 0; i < select_array.length; i++) {
			if (select_array[i].classList.contains("selected")) { deselect(select_array[i]); }
		}
	}
}

// click on enchantment in list
function selectToggle(article) {
	if (article.classList.contains("selected")) { deselect(article) }
	else { select(article, false) }
}

// dissselect enchantment on sidebar
function removeEnch(id) {
	event.stopPropagation();
	var article = document.getElementById(id);
	deselect(article);
}

// select enchantment and add to sidebar
function select(article, preselection) {
	if (article.classList.contains("selected") == false) {
		article.classList.add("selected");
		if (preselection) {
			article.classList.add("preselected");
		}

		// Add sidebar link
		var new_link = document.createElement("div");
		new_link.innerHTML = `<div class="dot" title="Remove from list" onclick="removeEnch('${article.id}')"></div><span class="disable_link link_text">${article.getElementsByTagName("h3")[0].innerHTML}</span><br>`;
		new_link.classList.add("sidebar_link");
		new_link.id = "link_" + article.id;
		new_link.title = "Click to go to enchantment"
		new_link.setAttribute("onclick", "scrollToParent('" + article.id + "')");
		link_bar.appendChild(new_link);

		sortSidebar();

		// show sidebar
		if (sidebar_hidden) {
			body.classList.add("sidebar_show");
			sidebar_hidden = false;
		}
	}
}

// disselect enchantment and remove from sidebar
function deselect(article) {
	article.classList.remove("selected");
	article.classList.remove("preselected");

	// remove sidebar link
	var remove_link = document.getElementById("link_" + article.id);
	remove_link.remove();

	// hide sidebar
	if (link_bar.firstElementChild == null) {
		body.classList.remove("sidebar_show");
		sidebar_hidden = true;
	}
}

// Sort selected items
function sortSidebar() {
	var switching = true;

	while (switching == true) {
		switching = false;
		var items = link_bar.getElementsByClassName("sidebar_link");

		for (var i = 0; i < (items.length - 1); i++) {
			var should_switch = false;
			if (items[i].getElementsByTagName("span")[0].innerHTML > items[i + 1].getElementsByTagName("span")[0].innerHTML) {
				should_switch = true;
				break;
			}
		}

		if (should_switch == true) {
			items[i].parentNode.insertBefore(items[i + 1], items[i]);
			switching = true;
		}
	}
}

// Scroll in view
function scrollToParent(id) {	
	var sel_element = document.getElementById(id)
	sel_element.scrollIntoView({block: 'center', behavior: 'smooth'});
}

function hideEnch(option) {
	body.classList.remove("hide_selected");
	body.classList.remove("hide_preselected");
	body.classList.remove("hide_vanilla");
	body.classList.remove("show_all");

	body.classList.add(option);
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
			var incomp_ench = '<tr><td>Ignore incompatible enchantments</td><td><input type="checkbox" onclick="incompEnch(this)" ' + incomp_ench_checked + '></td></tr>';
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

// execute changes
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


// ###########################################################
// Modal Box
var modal_box = document.getElementById("modal_box");

function closeModal() {
	modal_box.innerHTML = "";
	modal_box.classList = "";

	enableScroll(); //save.js
}

// ###########################################################
// Import from pack id
function loadPackIdModal() {
	var modal_text = document.createElement("div");
	modal_text.classList.add("modal_text");
	modal_text.classList.add("center");
	modal_text.innerHTML = '<div class="modal_padding_box"><input placeholder="Insert Pack Id..."></div><button onclick="importPackId()">Load</button><button onclick="closeModal()" style="margin-left:10px;">Close</button>';
	modal_box.appendChild(modal_text);

	disableScroll();
}

function importPackId() {
	var pack_id = modal_box.getElementsByTagName("input")[0].value;
	var pack_id_input = modal_box.getElementsByTagName("input")[0];
	var pack_id_length = (pack_id.length - 2) / 3;

	// test for corruption
	if (pack_id.substring(0,2) != "1-" || pack_id_length % 1 != 0) {
		importPackIdFail(pack_id_input);
		return;
	}
	// remove pack id version
	pack_id = pack_id.substr(2);

	// unselect all selected
	var select_array = document.getElementsByTagName("article");
	for (var i = 0; i < select_array.length; i++) {
		if (select_array[i].classList.contains("selected")) { deselect(select_array[i]); }
	}

	for (var i = 0; i < pack_id_length; i++) {
		var set_article = document.getElementById(pack_id.charAt());
		var set_article_setting = pack_id.charAt(2);

		// test for corruption
		if (set_article == null || set_article_setting >= 4) {
			importPackIdFail(pack_id_input);
			return;
		}

		select(set_article, true);
		set_article.setAttribute("data-chance", pack_id.charAt(1));

		if (set_article_setting == 1 || set_article_setting == 3) {set_article.classList.add("advanced_ench");}
		else {set_article.classList.remove("advanced_ench");}
		if (set_article_setting >= 2 && set_article.classList.contains("options")) {set_article.classList.add("ignore_incomp");}
		else {set_article.classList.remove("ignore_incomp");}

		pack_id = pack_id.substr(3);
	}
	selected_edition = "pack_id";
	closeModal();
}

function importPackIdFail(pack_id_input) {
	pack_id_input.placeholder = "Pack Id is corrupted!";
	pack_id_input.style.backgroundColor = "#A10000";
	pack_id_input.value = "";

	setTimeout(function(){
		pack_id_input.placeholder = "Insert Pack Id...";
		pack_id_input.removeAttribute("style");
	}, 2000);
}

// ###########################################################
// Download older versions
// function loadOldVerionsModal() {
// 	var modal_text = document.createElement("div");
// 	modal_text.classList.add("modal_text");
// 	modal_text.classList.add("center");
// 	modal_text.innerHTML = `
// 	<div class="modal_padding_box">These Versions don't support all functions from the new Pack.<br>
// 		<a class="button disable_link" rel="nofollow" href="https://drive.google.com/uc?export=download&id=1gAzwM7zLzSuPm6Wbxwh3uUvPBzUwl54e" style="margin:10px; display:inline-block;" onclick="downloadOld('golem', '1.16')">1.16 CMD-Golem Edition</a>
// 		<a class="button disable_link" rel="nofollow" href="https://drive.google.com/uc?export=download&id=1f8DwFicAWHD8ldJ8_NhYTTU8VCi2XPcI" style="margin:10px; display:inline-block;" onclick="downloadOld('vanilla', '1.16')">1.16 Vanilla Edition</a><br>
// 		<a class="button disable_link" rel="nofollow" href="https://drive.google.com/uc?export=download&id=1foON8BPIUkX8Bp6qj4k5GbxLbJZZA1Pl" style="margin:10px; display:inline-block;" onclick="downloadOld('golem', '1.15')">1.15 CMD-Golem Edition</a>
// 		<a class="button disable_link" rel="nofollow" href="https://drive.google.com/uc?export=download&id=1aMJxjydyyNAtFtzqf7PJurD_R6IdQ6yE" style="margin:10px; display:inline-block;" onclick="downloadOld('vanilla', '1.15')">1.15 Vanilla Edition</a><br>
// 		<button onclick="closeModal()">Close</button>
// 	</div>`;
// 	modal_box.appendChild(modal_text);

// 	disableScroll();
// }

// function downloadOld(edition, version) {
// 	selected_edition = edition;
// 	mc_version = version;
// 	updateCounter(); //download_counter.js
// }


// #################################################################################################
// More settingsinfo
var section = document.getElementsByTagName("section")[0];
var main = document.getElementsByTagName("main")[0];
var sidebar = document.getElementsByTagName("aside")[0];
var title = document.getElementsByTagName("title")[0];
var show_info = false;

function changeInfo() {
	if (show_info == false && window.location.hash.substr(1) == "info") {
		section.style.display = "block";
		main.style.display = "none";
		sidebar.style.display = "none";
		show_info = true;

		title.innerHTML = "CMD-Golem - Powered Enchanting Download Information";
	}

	else {
		section.style.display = "none";
		main.style.display = "block";
		sidebar.removeAttribute("style");
		show_info = false;

		title.innerHTML = "CMD-Golem - Powered Enchanting Download";
	}
}

changeInfo();
window.onhashchange = function() { changeInfo() }

function openInfo() {
	if (show_info == false) { window.location.hash = "info"; }
	else { window.location.hash = ""; }
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

// ###########################################################
// convert to roman number
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
var site_search_mobile = document.getElementById("site_search_mobile");
var scroll_point = document.getElementById("scroll_point")

function siteSearch() {
	var search_value = site_search.value;
	var search_input = search_value.toUpperCase().split(" ");
	if (show_info == true) { openInfo() }

	if (search_value != "") {
		scroll_point.scrollIntoView({behavior: 'smooth'});
	}

	// hide settings
	try {
		document.getElementsByClassName("settings_box")[0].remove();
	}
	catch (e) {}

	for (var i = 0; i < article_elements.length; i++) {
		var filter_data = article_elements[i].getElementsByClassName("comp_items")[0].innerHTML + article_elements[i].getElementsByTagName("h3")[0].innerHTML;
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

function siteSearchMobile() {
	site_search.value = site_search_mobile.value;
	siteSearch();
}