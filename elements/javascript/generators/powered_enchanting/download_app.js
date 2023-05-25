// load json
var article_elements, not_found, list_options;
var body = document.getElementsByTagName("body")[0];
var comp_items_key = ["all", "helmet", "chestplate", "leggings", "boots", "sword", "pickaxe", "axe", "shovel", "hoe", "bow", "carrot_on_a_stick", "crossbow", "elytra", "fishing_rod", "flint_and_steel", "shears", "shield", "trident"];
var selected_edition_db = "320699649726874188";

function loadEnch(lang_id) {
	var html = "<p id='not_found'>No Results<br><br><br>If you can't find the Enchantment you're looking for, remember to select the appropriate Minecraft version.</p>";

	for (var i = 0; i < article_array.length; i++) {
		var article = article_array[i];

		// set comp items path
		var items = article.comp_items;
		var img_path = "";
		var comp_items = "";
		for (var j = 0; j < items.length; j++) {
			var item = comp_items_key[items[j]];
			img_path += `<img src="../../elements/pictures/packs/powered_enchanting/items/${item}.png">`;
			comp_items += item.replaceAll("_", " ") + " ";
		}

		// set serach for comp items
		if (comp_items == "all ") {
			comp_items = "helmet chestplate leggings boots sword pickaxe axe shovel hoe bow crossbow elytra fishing rod flint and steal shears shield trident ";
			img_path = "all tools";
		}

		// hide settings if no incomp enchantments
		if (article.ench.length >= 2) {
			article.style += " has_incomp";
		}

		// add incomp enchantments to ui
		var incomp_array = [];
		for (var j = 1; j < article.ench.length; j++) {
			var incomp_obj = article_array.find(ench => ench.ench[0] == article.ench[j]);
			incomp_array.push(incomp_obj.title[lang_id]);
		}

		html += `
		<article id="${article.id}" class="${article.style}" onclick="selectToggle(this)" title="Select" data-chance="${article.chance}" data-arrayId="${i}" data-version="${article.version_id[article.version_id.length - 1]}">
			<div class="settings_button" onclick="setting(this)" title="Options"><img src="../../elements/nav/settings.svg"></div>
			<div class="content">
				<h3>${article.title[lang_id]}</h3>
				<p>${article.description}</p>
				<div class="comp_items">${comp_items}</div>
			</div>
			<table>
				<tr><td>Max Level:</td><td>${convertToRoman(article.max_lvl)}</td></tr>
				<tr title="Can be enchanted on the following tools"><td>Compatible items:</td><td>${img_path}</td></tr>
				<tr class="incomp_ench" title="Can't be enchantent on the same tool"><td>Incompatible:</td><td>${incomp_array.join(", ")}</td></tr>
			</table>
		</article>

		`
	}
	article_list.innerHTML = html;
	article_elements = article_list.getElementsByTagName("article");
	not_found = document.getElementById("not_found");
	list_options = body.classList[0];
	loadVersions();
	// hideIncomp();
	// siteSearch();
}

// ###########################################################
// Select and Sidebar
var link_bar = document.getElementById("link_bar");
var sidebar_hidden = true;

// edition preselection
function changeEdition(edition) {
	var deselect_array = document.getElementsByClassName("selected");
	while (deselect_array.length > 0) {
		deselect(deselect_array[0]);
	}

	if (edition == "all") {
		var selector = "article:not(.incomp_version)";
		var preselection = false;
		selected_edition_db = "320699603872645708";
	}
	else if (edition == "golem") {
		var selector = ".e_golem:not(.incomp_version)";
		var preselection = true;
		selected_edition_db = "320699550069162572";
	}
	else if (edition == "vanilla") {
		var selector = ".e_vanilla:not(.incomp_version)";
		var preselection = true;
		selected_edition_db = "320699566604157516";
	}
	else {
		selected_edition_db = "320699649726874188";
		return;
	}

	var select_array = document.querySelectorAll(selector + ":not(.curse)");

	for (var i = 0; i < select_array.length; i++) {
		select(select_array[i], preselection);
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

		// Sort selected items
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

// Scroll in view
function scrollToParent(id) {	
	var sel_element = document.getElementById(id)
	sel_element.scrollIntoView({block: 'center', behavior: 'smooth'});
}

// Selection
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


		if (article.classList.contains("has_incomp")) {
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

	preventScroll(false); //footer.js
}

// ###########################################################
// Import from pack id
function loadPackIdModal() {
	var modal_text = document.createElement("div");
	modal_text.classList.add("modal_text");
	modal_text.classList.add("center");
	modal_text.innerHTML = '<div class="modal_padding_box"><input placeholder="Insert Pack Id..."></div><button onclick="importPackId()">Load</button><button onclick="closeModal()" style="margin-left:10px;">Close</button>';
	modal_box.appendChild(modal_text);

	preventScroll(true) //footer.js
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
		if (set_article_setting >= 2 && set_article.classList.contains("has_incomp")) {set_article.classList.add("ignore_incomp");}
		else {set_article.classList.remove("ignore_incomp");}

		pack_id = pack_id.substr(3);
	}
	selected_edition_db = "320699587095429708";
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

// #################################################################################################
// More settingsinfo
var section = document.getElementById("info_box");
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

var scroll_point = document.getElementById("scroll_point");
function goTop() { scroll_point.scrollIntoView(); }

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
var list_options_el = document.getElementById("list_options");
var searched = false;
var incomp_packs = 0;

function siteSearch() {
	var search_value = site_search.value;
	var search_input = search_value.toUpperCase().split(" ");
	if (show_info == true) { openInfo() }

	if (searched == false && search_value.length >= 1) {
		scroll_point.scrollIntoView();
		list_options = list_options_el.value;
		hideEnch("show_all");
		searched = true;
	}
	else if (search_value.length == 0) {
		hideEnch(list_options);
		searched = false;
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
		if (hide || article_elements[i].classList.contains("curse")) {
			article_elements[i].classList.add("hide_search");
		}
		else {
			article_elements[i].classList.remove("hide_search");
		}
	}
	var hide_search = document.getElementsByClassName("hide_search").length;

	if (article_elements.length - hide_search - incomp_packs <= 0) {
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



// ###########################################################
// Version Selection // nearly the same funtcion as in pack.js
var selection_box = document.getElementById("selection_box");
var version_main = document.getElementById("version_main");
var version_sub = document.getElementById("version_sub");
var select_version = document.getElementById("select_version");
var preview_warning = document.getElementById("preview_warning");

var version_id_array_filtered = [];
var html_main_version = "";
var selected_pack_obj = pack_array.find(e => e.pack_id == "powered_enchanting");
var selected_version;

function loadVersions() {
	// get first and last version compatible with datapack
	var first_version = selected_pack_obj.pack_version_id[selected_pack_obj.pack_version_id.length - 1]; // oldest comp version
	var last_version = selected_pack_obj.last_version_id; // newest comp version
	var incomp_version_id = selected_pack_obj.incomp_version_id ?? []; // check for incompatible versions

	if (last_version == false) {
		last_version = version_id_array[0].id;
	}
	while (incomp_version_id.includes(last_version)) {
		last_version--;
	}

	// create a html list with all compatible main versions  // nearly the same funtcion as in article.js
	var array_main = [];
	version_id_array_filtered = [];
	html_main_version = "";

	for (var i = 0; i < version_id_array.length; i++) {
		var version_id = version_id_array[i];

		if (version_id.id <= last_version && version_id.id >= first_version && !incomp_version_id.includes(version_id.id)) {
			version_id_array_filtered.push(version_id);

			if (!array_main.includes(version_id.main)) {
				html_main_version += `<div onclick="mainVersion(this)" id="${version_id.main_id}">${version_id.main}</div>`;
				array_main.push(version_id.main);
			}
		}
	}

	version_main.innerHTML = html_main_version;

	// check if last selected version is compatible with this pack
	var selected_version_id = parseInt(window.sessionStorage.getItem("selected_version_id"));
	if (!isNaN(selected_version_id) && selected_version_id <= last_version && selected_version_id >= first_version && !incomp_version_id.includes(selected_version_id)) {
		// select last selected version
		selected_version = version_id_array.find(e => e.id == selected_version_id);
	}
	else {
		// select newest version stable version
		var i = 0;
		while (version_id_array_filtered[i].preview) { i++; }
		selected_version = version_id_array_filtered[i];
	}

	select_version.innerHTML = selected_version.main + "." + selected_version.sub;

	var selected_main = document.getElementById(selected_version.main_id);
	selected_main.classList.add("version_main_selected");

	mainVersion(selected_main);
	subVersion(document.getElementById("subid" + selected_version.id));
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

	selected_version = version_id_array.find(e => "subid" + e.id == selected_version_el.id);
	window.sessionStorage.setItem("selected_version_id", selected_version.id);

	select_version.innerHTML = selected_version.name;
	selection_box.classList.add("hidden");

	// show unstable version link
	if (selected_version.preview) {
		preview_warning.style.display = "block";
	}
	else {
		preview_warning.style.display = "none";
	}

	// Only show compatible Enchantments
	for (var i = 0; i < article_elements.length; i++) {
		if (parseInt(article_elements[i].getAttribute("data-version")) > selected_version.id) {
			article_elements[i].classList.add("incomp_version");
		}
		else {
			article_elements[i].classList.remove("incomp_version");
		}
	}
	incomp_packs = document.getElementsByClassName("incomp_version").length;
}

// load html
loadEnch(0);