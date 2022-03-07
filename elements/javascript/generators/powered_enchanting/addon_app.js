// Add new Enchantment
var counter = 0;

function addEnch(el) {
	// Add Article with Enchantment
	var el_last_article = document.getElementsByTagName("article");
	var el_last_article = el_last_article[el_last_article.length - 1];

	if (el != undefined) {el.blur()};

	counter = counter + 1;

	var template_ench = `
	<div onclick="removeEnch(this)" class="close" style="padding-right: 20px;" title="Remove Enchantment">
		<img src="../../elements/nav/close.svg" alt="Close">
	</div>
	
	<p>Name of the Enchantment</p>
	<input type="text" placeholder='Vein Miner' class="ench_name" onchange="enchName(this)">

	<p>Id of the Enchantment</p>
	<input type="text" placeholder='vein_miner' class="ench_id">
	
	<p>Max Level of the Enchantment: <input type="text" placeholder='3' class="ench_maxlvl" style="display: inline-block; width: 43px; padding: 8px;"><br>

	<input type="checkbox" class="ench_adv" id="ench_adv"><label for="ench_adv"> Enchantment is an <a href="../powered_enchanting.html#advanced_enchanting" target="_blank">Advanced Enchantment</a></label></p>
	
	<p>Tools or Armor, the enchantment can be enchanted on <small>(separate with space)</small></p>
	<code class="fullwidth ench_items" onclick="this.getElementsByTagName('input')[0].focus();">
		<input type="text" placeholder='pickaxe' class="key_input" list="input_items" onkeyup="setTagged(this)">
	</code>
	
	<p>Incompatible Enchantment Ids <small>(separate with space)</small></p>
	<code class="fullwidth ench_comp" onclick="this.getElementsByTagName('input')[0].focus();">
		<input type="text" placeholder='silk_touch' class="key_input" list="input_comp" onkeyup="setTagged(this)">
	</code>
	
	<p>Chance that an Enchantment shows in the Selection for Enchanting</p>
	<select class="ench_chance">
		<option value="1">10% (e.g. Infinity)</option>
		<option value="2" selected>20% (e.g. Looting)</option>
		<option value="5">50% (e.g. Knockback)</option>
		<option value="0">100% (e.g. Sharpness)</option>
	</select>
	`;

	// Add Article
	var new_ench = document.createElement("article");
	new_ench.innerHTML = template_ench;
	new_ench.id = counter;
	el_last_article.parentNode.insertBefore(new_ench, el_last_article.nextSibling);

	// Add Sidebar Link
	var el_last_link = document.getElementsByClassName("sidebar_link");
	var el_last_link = el_last_link[el_last_link.length - 1];
 
	var new_link = document.createElement("div");
	new_link.innerHTML = '<div class="dot"></div><span class="disable_link link_text">Enchantment ' + counter + '</span><br>';
	new_link.classList.add("sidebar_link");
	new_link.id = "link_" + counter;
	new_link.setAttribute("onclick", "scrollToParent('" + counter + "')");
	el_last_link.parentNode.insertBefore(new_link, el_last_link.nextSibling);


	// Finishing up
	scrollToParent(counter);
}

// scroll to ench
function scrollToParent(id) {	
	var sel_element = document.getElementById(id)
	sel_element.scrollIntoView({block: 'center', behavior: 'smooth'});
}

// shortcuts
document.addEventListener("keydown", e => {
	// Add new ench crtl + enter
	if (e.ctrlKey && (e.which == 13 || e.keyCode == 13) ) {
		addEnch();
	}
	// Save datapack ctrl + s
	if (e.ctrlKey && (e.which == 83 || e.keyCode == 83) ) {
		downloadCheck();
		e.preventDefault();
	}
});

// #####################################################################
// Refresh name from ench id
function enchName(input) {
	var input_text = input.value;
	var article = input.parentNode;

	// Change sidebar
	if (input_text == "") {input_text = "Enchantment " + article.id};
	document.getElementById("link_" + article.id).getElementsByClassName("link_text")[0].innerHTML = input_text;

	//generate id
	var input_id = article.getElementsByClassName("ench_id")[0];
	if (input_id.value == "") {
		var input_text = input_text.replaceAll(" ", "_");
		input_id.value = input_text.toLowerCase();
	}
}

// #####################################################################
// set tools, weapons and armor
function setTagged(input_el) {
	if (input_el.value.includes(" ") || input_el.value.includes(",")) {
		var item_el = document.createElement("span");
		item_el.innerHTML = input_el.value.replace(/[^a-zA-Z_]/g, "");
		item_el.classList.add("tagged_item");
		item_el.addEventListener("click", removeTagged);

		input_el.parentNode.insertBefore(item_el, input_el);

		input_el.value = "";
		input_el.blur();
		input_el.focus();
	}
}

function removeTagged(remove_tag) {
	remove_tag.target.remove();
}

// get enchantments from json
var input_comp_el = document.getElementById("input_comp");

async function loadJson() {
	var res = await fetch("https://raw.githubusercontent.com/CMD-Golem/CMD-Golem/master/elements/javascript/generators/powered_enchanting/enchantments.json");
	article_array = await res.json();
	var list = "";

	for (var i = 0; i < article_array.length; i++) {
		list += '<option value="' + article_array[i].ench[0] + '"></option>';
	}

	input_comp_el.innerHTML = list;
}
loadJson();


// #####################################################################
// Remove Ench
function removeEnch(el) {
	var el_article = document.getElementsByTagName("article");
	if (el_article.length > 1) {
		var confirm_msg = confirm("You will delete your Input irreversible!");
		if (confirm_msg == true) {
			var remove_id = el.parentNode.id;
			var remove_link = document.getElementById("link_" + remove_id);
			remove_link.remove();
			el.parentNode.remove();
		}
	}
}

// #####################################################################
// Select items
// https://www.w3schools.com/howto/howto_js_autocomplete.asp
var filter_items = ["Chestplate", "Leggings", "Boots", "Helmet"];
var filter_items_id = ["chestplate", "leggings", "boots", "helmet"];

const search = document.getElementById('search');
const matchList = document.getElementById('match-list');
const explore = document.getElementById('explore');
const not_found = document.getElementById('not_found');


// Search search.json and filter it
function filterItems(input) {
	var input_text = input.value.toUpperCase();
	var html = "";
	for (var i = 0; i < filter_items.length; i++) {
		if (filter_items[i].toUpperCase().indexOf(input_text) > -1) {
			html += "<div>" + filter_items[i] + "</div>";
		}
	}
	var filter_list = document.getElementsByClassName("filter_list");
	if (filter_list.length != 0) {
		filter_list[0].remove();
	}
	if (html != "" && input_text != "") {
		var filtered = document.createElement("div");
		filtered.innerHTML = html;
		filtered.classList.add("filter_list");
		input.parentNode.insertBefore(filtered, input.nextSibling);
	}
};


// #####################################################################
// Compact View
// var el_compact_view = document.getElementById("compact_view");
// var compact_view;

// if (localStorage.getItem("compact_view") == "true") {
// 	compact_view = "false";
// 	compactView();
// }

// function compactView(used_element) {
// 	var hide_compact = document.getElementsByClassName("hide_compact")

// 	if (compact_view == "true") {
// 		if (cookies == true) {localStorage.setItem("compact_view", "false");}
// 		compact_view = "false";

// 		el_compact_view.title = "Change to compact View (removes all unnecessary text)";
// 		el_compact_view.getElementsByTagName("img")[0].src = "../elements/nav/compress.svg"

// 		for (var i = 0; i < hide_compact.length; i++) {
// 			hide_compact[i].style.display = "block";
// 		}
// 	}
// 	else {
// 		if (cookies == true) {localStorage.setItem("compact_view", "true");}
// 		compact_view = "true";

// 		el_compact_view.title = "Change to expanded View";
// 		el_compact_view.getElementsByTagName("img")[0].src = "../elements/nav/expand.svg"

// 		for (var i = 0; i < hide_compact.length; i++) {
// 			hide_compact[i].style.display = "none";
// 		}
// 	}

// 	if (used_element == "button") {
// 		el_compact_view.style.backgroundColor = "#A10000";
// 		setTimeout(function(){ sel_element.removeAttribute("style"); }, 500);
// 	}
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

		title.innerHTML = "CMD-Golem - Powered Enchanting Addons Information";
	}

	else {
		section.style.display = "none";
		main.style.display = "block";
		sidebar.removeAttribute("style");
		show_info = false;

		title.innerHTML = "CMD-Golem - Powered Enchanting Addons";
	}
}

changeInfo();
window.onhashchange = function() { changeInfo() }

function openInfo() {
	if (show_info == false) { window.location.hash = "info"; }
	else { window.location.hash = ""; }
}