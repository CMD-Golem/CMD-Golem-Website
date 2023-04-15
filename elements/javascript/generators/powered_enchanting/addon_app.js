// Batch generate more tools (Not used on website) 
function addModedItems(moded_items) {
	var string = "";
	var unused_items = [];

	for (var i = 0; i < moded_items.length; i++) {
		var moded_item = moded_items[i];

		if (moded_item.includes("helmet")) {string += `execute if entity @s[nbt={Item:{id:"mythicmetals:${moded_item}"}}] run function #powerench:items/helmet`;}
		else if (moded_item.includes("chestplate")) {string += `execute if entity @s[nbt={Item:{id:"mythicmetals:${moded_item}"}}] run function #powerench:items/chestplate`}
		else if (moded_item.includes("leggings")) {string += `execute if entity @s[nbt={Item:{id:"mythicmetals:${moded_item}"}}] run function #powerench:items/leggings`}
		else if (moded_item.includes("boots")) {string += `execute if entity @s[nbt={Item:{id:"mythicmetals:${moded_item}"}}] run function #powerench:items/boots`}
		else if (moded_item.includes("sword")) {string += `execute if entity @s[nbt={Item:{id:"mythicmetals:${moded_item}"}}] run function #powerench:items/sword`}
		else if (moded_item.includes("pickaxe")) {string += `execute if entity @s[nbt={Item:{id:"mythicmetals:${moded_item}"}}] run function #powerench:items/pickaxe`}
		else if (moded_item.includes("axe")) {string += `execute if entity @s[nbt={Item:{id:"mythicmetals:${moded_item}"}}] run function #powerench:items/axe`}
		else if (moded_item.includes("shovel")) {string += `execute if entity @s[nbt={Item:{id:"mythicmetals:${moded_item}"}}] run function #powerench:items/shovel`}
		else if (moded_item.includes("hoe")) {string += `execute if entity @s[nbt={Item:{id:"mythicmetals:${moded_item}"}}] run function #powerench:items/hoe`}
		else if (moded_item.includes("shield")) {string += `execute if entity @s[nbt={Item:{id:"mythicmetals:${moded_item}"}}] run function #powerench:items/shield`}
		// not initalised: flint_and_steel, shears, elytra, carrot_on_a_stick, warped_fungus_on_a_stick, bow, crossbow, fishing_rod, trident
		else if (
			// excluded
			!moded_item.includes("block") &&
			!moded_item.includes("ingot") && 
			!moded_item.includes("dust") &&
			!moded_item.includes("anvil") &&
			!moded_item.includes("nugget") &&
			!moded_item.includes("ore") &&
			!moded_item.includes("raw")
			) {
				unused_items.push(moded_item)
		}
	}

	console.log(string)
	console.log(unused_items)
}


// Add new Enchantment
var settings_box = document.getElementById("settings_box");
var counter = 0;
var is_addon_for_mod = false;

function addEnch(el) {
	// Add Article with Enchantment
	if (el != undefined) {el.blur()};

	counter = counter + 1;

	if (!is_addon_for_mod) {
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
			<input type="text" placeholder='pickaxe' class="key_input" list="input_items" onkeyup="setTagged(this, true)">
		</code>
		
		<p>Incompatible Enchantment Ids <small>(separate with space)</small></p>
		<code class="fullwidth ench_comp" onclick="this.getElementsByTagName('input')[0].focus();">
			<input type="text" placeholder='silk_touch' class="key_input" list="input_comp" onkeyup="setTagged(this, true)">
		</code>
		
		<p>Chance that an Enchantment shows in the Selection for Enchanting</p>
		<select class="ench_chance">
			<option value="1">10% (e.g. Infinity)</option>
			<option value="2" selected>20% (e.g. Looting)</option>
			<option value="5">50% (e.g. Knockback)</option>
			<option value="0">100% (e.g. Sharpness)</option>
		</select>
		`;
	}
	else {
		var template_ench = `
		<div onclick="removeEnch(this)" class="close" style="padding-right: 20px;" title="Remove Enchantment">
			<img src="../../elements/nav/close.svg" alt="Close">
		</div>

		<p>Id of the Enchantment</p>
		<input type="text" placeholder='vein_miner' class="ench_id">
		
		<p>Max Level of the Enchantment: <input type="text" placeholder='3' class="ench_maxlvl" style="display: inline-block; width: 43px; padding: 8px;"><br>

		<input type="checkbox" class="ench_adv" id="ench_adv"><label for="ench_adv"> Enchantment is an <a href="../powered_enchanting.html#advanced_enchanting" target="_blank">Advanced Enchantment</a></label></p>
		
		<p>Tools or Armor, the enchantment can be enchanted on <small>(separate with space)</small></p>
		<code class="fullwidth ench_items" onclick="this.getElementsByTagName('input')[0].focus();">
			<input type="text" placeholder='pickaxe' class="key_input" list="input_items" onkeyup="setTagged(this, true)">
		</code>
		
		<p>Incompatible Enchantment Ids <small>(separate with space)</small></p>
		<code class="fullwidth ench_comp" onclick="this.getElementsByTagName('input')[0].focus();">
			<input type="text" placeholder='silk_touch' class="key_input" list="input_comp" onkeyup="setTagged(this, true)">
		</code>
		
		<p>Chance that an Enchantment shows in the Selection for Enchanting</p>
		<select class="ench_chance">
			<option value="1">10% (e.g. Infinity)</option>
			<option value="2" selected>20% (e.g. Looting)</option>
			<option value="5">50% (e.g. Knockback)</option>
			<option value="0">100% (e.g. Sharpness)</option>
		</select>
	`;
	}

	var el_last_article = document.getElementsByTagName("article");

	// Add Sidebar Link
	var el_last_link = document.getElementsByClassName("sidebar_link");
	var el_last_link = el_last_link[el_last_link.length - 1];
 
	var new_link = document.createElement("div");
	new_link.innerHTML = '<div class="dot"></div><span class="disable_link link_text">Enchantment ' + counter + '</span><br>';
	new_link.classList.add("sidebar_link");
	new_link.id = "link_" + counter;
	new_link.setAttribute("onclick", "scrollToParent('" + counter + "')");


	if (el_last_article.length == 0) {
		// no other articles present
		sidebar.insertBefore(new_link, null);
		el_last_article = settings_box;
	}
	else {
		sidebar.insertBefore(new_link, el_last_link.nextSibling);
		el_last_article = el_last_article[el_last_article.length - 1];
	}

	// Add Article
	var new_ench = document.createElement("article");
	new_ench.innerHTML = template_ench;
	new_ench.id = counter;
	el_last_article.parentNode.insertBefore(new_ench, el_last_article.nextSibling);

	


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
function setTagged(input_el, input_check) {
	if ((input_el.value.includes(" ") || input_el.value.includes(",") || input_check == false) && input_el.value != "") {
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

async function loadEnch() {
	var list = "";

	for (var i = 0; i < article_array.length; i++) {
		list += '<option value="' + article_array[i].ench[0] + '"></option>';
	}

	input_comp_el.innerHTML = list;
}
loadEnch();


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


// #################################################################################################
// change Type of Addon
var namespace_box = document.getElementById("namespace_box");

function addonType(selected) {
	var el_article = document.querySelectorAll('article');
	var confirm_msg = false;

	// Warn before deletion
	if (el_article.length > 1) {
		confirm_msg = confirm("You will delete all already entered Enchantments!");
	}
	else {
		confirm_msg = true;
	}
	
	if (confirm_msg == true) {
		counter = 0;
		// delete all articles
		sidebar.innerHTML = "";
		el_article.forEach(article => { article.remove(); });

		// create new articles
		if (selected == "1") {
			is_addon_for_mod = true;
			namespace_box.style.display = "block";
			addEnch(undefined);
		}
		else {
			is_addon_for_mod = false;
			namespace_box.style.display = "none";
			addEnch(undefined);
		}
	}
}