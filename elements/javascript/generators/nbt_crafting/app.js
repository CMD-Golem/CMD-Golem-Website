// Define Variables
var datapack_name = "";
var score = "nbt_craft";
var version = "7";


var placeholder = "";
var nbt_item = "";
var count = "";

var tag = "nbt_craft";
var recipe_id = "";

// Recipe
var recipe_folder = "/";
var recipe_name = "nbt_craft";
var recipe_text = "";
var recipe_counter

// Advancement
var advancement_folder = "/";
var advancement_name = "nbt_craft";
var advancement_counter

// Function Detect
var function_detect_folder = "craft/$/";
var function_detect_name = "detect_craft";
var function_detect_counter

// Function Craft
var function_craft_folder = "craft/$/";
var function_craft_name = "craft";
var function_craft_counter

// Function Mass
var function_mass_folder = "craft/$/";
var function_mass_name = "mass_craft";
var function_mass_counter


// #####################################################################
// Add new Recipe
var counter = 0;

function addRecipe(el) {
	// Add Article with Recipe
	var el_last_article = document.getElementsByTagName("article");
	var el_last_article = el_last_article[el_last_article.length - 1];

	if (el != undefined) {el.blur()};

	counter = counter + 1;

	refreshVar(el_last_article);


	var template_recipe = `
	<div onclick="removeRecipe(this)" class="close" style="padding-right: 20px;" title="Remove Recipe">
		<img src="../elements/nav/close.svg">
	</div>

	<p>Recipe (needed)</p>
	<textarea class="recipe_text needed code" style="height: 405px;" placeholder='{&#10;    "type": "minecraft:crafting_shaped",&#10;    "pattern": [&#10;        "#",&#10;        "/",&#10;        "#"&#10;    ],&#10;    "key": {&#10;        "#": {&#10;            "item": "minecraft:amethyst_shard"&#10;        },&#10;        "/": {&#10;            "item": "minecraft:stick"&#10;        }&#10;    },&#10;    "result": {&#10;        "item": "minecraft:debug_stick",&#10;        "count": 1&#10;    }&#10;}'></textarea>
	<p>Result Item with NBT-Data (needed)</p>
	<input type="text" placeholder='stick{Enchantments:[{id:"minecraft:knockback",lvl:5s}]}' class="nbt_item needed" onchange="resultItem(this)">
		<div class="advanced_mode">
		<p>Recipe Id</p>
		<input type="text" placeholder='${tag}${counter}' onchange="recipeId(this)" class="recipe_id">

		<br><br><hr>
		<h3 class="spoiler_title" title="Open for more Informations" style="font-weight: normal; font-size: inherit;" onclick="closeSpoiler(this)">Advanced Options</h3>
		<div class="spoiler_show">
			<div class="spoiler_content">
				<table style="width: 100%;">
					<tr>
						<td colspan="2"><br>Tag Name</td>
					</tr>
					<tr>
						<td colspan="2"><input type="text" placeholder='${tag}${counter}' class="tag"></td>
					</tr>
					<tr>
						<td><br>Advancement Folder Path</td>
						<td><br>Advancement File Name</td>
					</tr>
					<tr>
						<td><input type="text" placeholder='${advancement_folder}' class="advancement_folder folder"></td>
						<td><input type="text" placeholder='${advancement_name}${advancement_counter}' class="advancement_name"></td>
					</tr>
					<tr>
						<td><br>Recipe Folder Path</td>
						<td><br>Recipe File Name</td>
					</tr>
					<tr>
						<td><input type="text" placeholder='${recipe_folder}' class="recipe_folder folder"></td>
						<td><input type="text" placeholder='${recipe_name}${recipe_counter}' class="recipe_name"></td>
					</tr>
					<tr>
						<td><br>Function Detect Folder Path</td>
						<td><br>Function Detect File Name</td>
					</tr>
					<tr>
						<td><input type="text" placeholder='${function_detect_folder}' class="function_detect_folder folder"></td>
						<td><input type="text" placeholder='${function_detect_name}${function_detect_counter}' class="function_detect_name"></td>
					</tr>
					<tr>
						<td>Function Craft Folder Path</td>
						<td>Function Craft File Name</td>
					</tr>
					<tr>
						<td><input type="text" placeholder='${function_craft_folder}' class="function_craft_folder folder"></td>
						<td><input type="text" placeholder='${function_craft_name}${function_craft_counter}' class="function_craft_name"></td>
					</tr>
					<tr>
						<td>Function Mass Craft Folder Path</td>
						<td>Function Mass Craft File Name</td>
					</tr>
					<tr>
						<td><input type="text" placeholder='${function_mass_folder}' class="function_mass_folder folder"></td>
						<td><input type="text" placeholder='${function_mass_name}${function_mass_counter}' class="function_mass_name"></td>
					</tr>
				</table>
			</div>
		</div>
	</div>
	`;

	// Add Article
	var new_recipe = document.createElement("article");
	new_recipe.innerHTML = template_recipe;
	new_recipe.id = counter;
	el_last_article.parentNode.insertBefore(new_recipe, el_last_article.nextSibling);

	// Add Sidebar Link
	var el_last_link = document.getElementsByClassName("sidebar_link");
	var el_last_link = el_last_link[el_last_link.length - 1];
 
	var new_link = document.createElement("div");
	new_link.innerHTML = '<div class="dot"></div><span class="disable_link link_text">Recipe ' + counter + '</span><br>';
	new_link.classList.add("sidebar_link");
	new_link.id = "link_" + counter;
	new_link.setAttribute("onclick", "scrollToParent('" + counter + "')");
	el_last_link.parentNode.insertBefore(new_link, el_last_link.nextSibling);


	// Finishing up
	scrollToParent(counter);
}

// #####################################################################
// Create variables for new recipe
function refreshVar(last_article) {
	var el_tag = last_article.getElementsByClassName("tag")[0].value;
	if (el_tag != "") {tag = el_tag;}

	// Preset Counter
	recipe_counter = counter;
	advancement_counter = counter;
	function_detect_counter = counter;
	function_craft_counter = counter;
	function_mass_counter = counter;

	// Recipe
	var el_recipe_folder = last_article.getElementsByClassName("recipe_folder")[0];
	if (el_recipe_folder.value != "") {recipe_folder = el_recipe_folder.value;}
	else {el_recipe_folder = recipe_folder.placeholder}

	var el_recipe_name = last_article.getElementsByClassName("recipe_name")[0];
	if (el_recipe_name.value != "") {recipe_name = el_recipe_name.value;}
	if (recipe_folder.includes("$") == true) {recipe_counter = "";}

	// Advancement
	var el_advancement_folder = last_article.getElementsByClassName("advancement_folder")[0];
	if (el_advancement_folder.value != "") {advancement_folder = el_advancement_folder.value;}
	else {el_advancement_folder = advancement_folder.placeholder}

	var el_advancement_name = last_article.getElementsByClassName("advancement_name")[0];
	if (el_advancement_name.value != "") {advancement_name = el_advancement_name.value;}
	if (advancement_folder.includes("$") == true) {advancement_counter = "";}

	// Function Detect
	var el_function_detect_folder = last_article.getElementsByClassName("function_detect_folder")[0];
	if (el_function_detect_folder.value != "") {function_detect_folder = el_function_detect_folder.value;}
	else {el_function_detect_folder = function_detect_folder.placeholder}

	var el_function_detect_name = last_article.getElementsByClassName("function_detect_name")[0];
	if (el_function_detect_name.value != "") {function_detect_name = el_function_detect_name.value;}
	if (function_detect_folder.includes("$") == true) {function_detect_counter = "";}

	// Function Craft
	var el_function_craft_folder = last_article.getElementsByClassName("function_craft_folder")[0];
	if (el_function_craft_folder.value != "") {function_craft_folder = el_function_craft_folder.value;}
	else {el_function_craft_folder = function_craft_folder.placeholder}

	var el_function_craft_name = last_article.getElementsByClassName("function_craft_name")[0];
	if (el_function_craft_name.value != "") {function_craft_name = el_function_craft_name.value;}
	if (function_craft_folder.includes("$") == true) {function_craft_counter = "";}

	// Function Mass
	var el_function_mass_folder = last_article.getElementsByClassName("function_mass_folder")[0];
	if (el_function_mass_folder.value != "") {function_mass_folder = el_function_mass_folder.value;}
	else {el_function_mass_folder = function_mass_folder.placeholder}

	var el_function_mass_name = last_article.getElementsByClassName("function_mass_name")[0];
	if (el_function_mass_name.value != "") {function_mass_name = el_function_mass_name.value;}
	if (function_mass_folder.includes("$") == true) {function_mass_counter = "";}
}

// #####################################################################
// Remove Recipe
function removeRecipe(el) {
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
// refresh placeholders with Recipe id
function recipeId(input) {
	var el_recipe_id = input.parentNode.parentNode;
	refreshSidebarLink(el_recipe_id, input);

	el_recipe_id.getElementsByClassName("tag")[0].placeholder = input.value;
	tag = input.value;

	// Recipe Name
	var el_recipe_folder = el_recipe_id.getElementsByClassName("recipe_folder")[0];
	if (el_recipe_folder.value != "") {el_recipe_folder = el_recipe_folder.value}
	else {el_recipe_folder = el_recipe_folder.placeholder}
	if (el_recipe_folder.includes("$") == false) {
		el_recipe_id.getElementsByClassName("recipe_name")[0].placeholder = input.value;
		recipe_name = input.value;
	}

	// Advancement Name
	var el_advancement_folder = el_recipe_id.getElementsByClassName("advancement_folder")[0];
	if (el_advancement_folder.value != "") {el_advancement_folder = el_advancement_folder.value}
	else {el_advancement_folder = el_advancement_folder.placeholder}
	if (el_advancement_folder.includes("$") == false) {
		el_recipe_id.getElementsByClassName("advancement_name")[0].placeholder = input.value;
		advancement_name = input.value;
	}

	// Function Mass Name
	var el_function_mass_folder = el_recipe_id.getElementsByClassName("function_mass_folder")[0];
	if (el_function_mass_folder.value != "") {el_function_mass_folder = el_function_mass_folder.value}
	else {el_function_mass_folder = el_function_mass_folder.placeholder}
	if (el_function_mass_folder.includes("$") == false) {
		el_recipe_id.getElementsByClassName("function_mass_name")[0].placeholder = "mass_" + input.value;
		function_mass_name = "mass_" + input.value;
	}

	// Function Craft Name
	var el_function_craft_folder = el_recipe_id.getElementsByClassName("function_craft_folder")[0];
	if (el_function_craft_folder.value != "") {el_function_craft_folder = el_function_craft_folder.value}
	else {el_function_craft_folder = el_function_craft_folder.placeholder}
	if (el_function_craft_folder.includes("$") == false) {
		el_recipe_id.getElementsByClassName("function_craft_name")[0].placeholder = "craft_" + input.value;
		function_craft_name = "craft_" + input.value;
	}

	// Function Detect Name
	var el_function_detect_folder = el_recipe_id.getElementsByClassName("function_detect_folder")[0];
	if (el_function_detect_folder.value != "") {el_function_detect_folder = el_function_detect_folder.value}
	else {el_function_detect_folder = el_function_detect_folder.placeholder}
	if (el_function_detect_folder.includes("$") == false) {
		el_recipe_id.getElementsByClassName("function_detect_name")[0].placeholder = "detect_" + input.value;
		function_detect_name = "detect_" + input.value;
	}
}

// #####################################################################
// Scroll from Sidebar
var link_from_recipe_name;

// Onclick function in sidebar
function scrollToParent(id) {	
	var sel_element = document.getElementById(id)
	sel_element.scrollIntoView({block: 'center', behavior: 'smooth'});
	sel_element.style.backgroundColor = "#A10000";

	closeSpoiler(sel_element);

	setTimeout(function(){ scrollToParentColor(sel_element) }, 500);
}

// Timer
function scrollToParentColor(sel_element) {
	sel_element.style.backgroundColor = "#1C1C1C";
}

// Refresh name from recipe id
function refreshSidebarLink(parent, input) {
	var input_text = input.value;
	if (input_text == "") {input_text = "Recipe " + parent.id};
	document.getElementById("link_" + parent.id).getElementsByClassName("link_text")[0].innerHTML = input_text;
}

// Refresh name from result item
function resultItem(input) {
	if (checkbox.checked == false) {
		var input_text = input.value;
		input_text = input_text.replace("minecraft:", "").split("{")[0];
		if (input_text == "") {input_text = "Recipe " + input.parentNode.id};
		document.getElementById("link_" + input.parentNode.id).getElementsByClassName("link_text")[0].innerHTML = input_text;
	}
}

// #####################################################################
// shortcuts
document.addEventListener("keydown", e => {
	// Add new recipe crtl + enter
	if (e.ctrlKey && (e.which == 13 || e.keyCode == 13) ) {
		addRecipe();
	}
	// Save datapack ctrl + s
	if (e.ctrlKey && (e.which == 83 || e.keyCode == 83) ) {
		downloadCheck();
		e.preventDefault();
	}
});

// #####################################################################
// Toggle Advanced Mode
var checkbox = document.getElementById("advanced_mode_toggle");

if (localStorage.getItem("advanced_mode") == "true") {
	checkbox.checked = true;
	toggleAdvMode();
}

function toggleAdvMode() {
	if (cookies == true) {localStorage.setItem("advanced_mode", checkbox.checked);}
	
	if (checkbox.checked == true) {
		document.documentElement.style.setProperty("--show_advanced_mode", "block");
		//show_advanced_mode[i].style.display = "block";
	}
	else {
		document.documentElement.style.setProperty("--show_advanced_mode", "none");
		//show_advanced_mode[i].style.display = "none";
	}
}

// #####################################################################
// Compact View
var el_compact_view = document.getElementById("compact_view");

if (localStorage.getItem("compact_view") == "true") {
	var compact_view = "false";
	compactView();
}

function compactView(used_element) {
	if (compact_view == "true") {
		if (cookies == true) {localStorage.setItem("compact_view", "false");}
		compact_view = "false";

		el_compact_view.title = "Change to compact View (removes all unnecessary text)";
		el_compact_view.getElementsByTagName("img")[0].src = "../elements/nav/compress.svg";

		document.documentElement.style.setProperty("--hide_compact", "block");
	}
	else {
		if (cookies == true) {localStorage.setItem("compact_view", "true");}
		compact_view = "true";

		el_compact_view.title = "Change to expanded View";
		el_compact_view.getElementsByTagName("img")[0].src = "../elements/nav/expand.svg";

		document.documentElement.style.setProperty("--hide_compact", "none");
	}

	if (used_element == "button") {
		el_compact_view.style.backgroundColor = "#A10000";
		setTimeout(function(){ el_compact_view.removeAttribute("style"); }, 500);
	}
}