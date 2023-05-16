// Define Variables
var tag = "nbt_craft";
var recipe = ["/", "nbt_craft", "nbt_craft"];
var advancement = ["/", "nbt_craft", "nbt_craft"];
var function_detect = ["craft/$/", "detect_craft", "detect_craft"];
var function_craft = ["craft/$/", "craft", "craft"];
var function_mass = ["craft/$/", "mass_craft", "mass_craft"];

// #####################################################################
// Add new Recipe
var counter = 0;

function addRecipe(el) {
	// Add Article with Recipe
	var el_last_article = document.getElementsByTagName("article");
	var el_last_article = el_last_article[el_last_article.length - 1];

	if (el != undefined) { el.blur() };

	counter = counter + 1;

	// Refresh Var
	recipe = refreshVar("recipe", el_last_article, recipe[2]);
	advancement = refreshVar("advancement", el_last_article, advancement[2]);
	function_detect = refreshVar("function_detect", el_last_article, function_detect[2]);
	function_craft = refreshVar("function_craft", el_last_article, function_craft[2]);
	function_mass = refreshVar("function_mass", el_last_article, function_mass[2]);

	var el_tag = el_last_article.getElementsByClassName("tag")[0].value;
	if (el_tag != "") { tag = el_tag; }

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
						<td><input type="text" placeholder='${advancement[0]}' class="advancement_folder folder"></td>
						<td><input type="text" placeholder='${advancement[1]}' class="advancement_name"></td>
					</tr>
					<tr>
						<td><br>Recipe Folder Path</td>
						<td><br>Recipe File Name</td>
					</tr>
					<tr>
						<td><input type="text" placeholder='${recipe[0]}' class="recipe_folder folder"></td>
						<td><input type="text" placeholder='${recipe[1]}' class="recipe_name"></td>
					</tr>
					<tr>
						<td><br>Function Detect Folder Path</td>
						<td><br>Function Detect File Name</td>
					</tr>
					<tr>
						<td><input type="text" placeholder='${function_detect[0]}' class="function_detect_folder folder"></td>
						<td><input type="text" placeholder='${function_detect[1]}' class="function_detect_name"></td>
					</tr>
					<tr>
						<td>Function Craft Folder Path</td>
						<td>Function Craft File Name</td>
					</tr>
					<tr>
						<td><input type="text" placeholder='${function_craft[0]}' class="function_craft_folder folder"></td>
						<td><input type="text" placeholder='${function_craft[1]}' class="function_craft_name"></td>
					</tr>
					<tr>
						<td>Function Mass Craft Folder Path</td>
						<td>Function Mass Craft File Name</td>
					</tr>
					<tr>
						<td><input type="text" placeholder='${function_mass[0]}' class="function_mass_folder folder"></td>
						<td><input type="text" placeholder='${function_mass[1]}' class="function_mass_name"></td>
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

	scrollToParent(counter);

	// Add Sidebar Link
	var el_last_link = document.getElementsByClassName("sidebar_link");
	var el_last_link = el_last_link[el_last_link.length - 1];
 
	var new_link = document.createElement("div");
	new_link.innerHTML = '<div class="dot"></div><span class="disable_link link_text">Recipe ' + counter + '</span><br>';
	new_link.classList.add("sidebar_link");
	new_link.id = "link_" + counter;
	new_link.setAttribute("onclick", "scrollToParent('" + counter + "')");
	el_last_link.parentNode.insertBefore(new_link, el_last_link.nextSibling);
}


// Create variables for new recipe
function refreshVar(path_class, last_article, last_value) {
	var el_folder = last_article.getElementsByClassName(path_class + "_folder")[0];
	var el_file_name = last_article.getElementsByClassName(path_class + "_name")[0];

	// Get folder path
	if (el_folder.value != "") {
		var folder = el_folder.value;
	}
	else {
		var folder = el_folder.placeholder
	}

	// Get File Name or use old value
	if (el_file_name.value != "") {
		var file_name = el_file_name.value;
	}
	else {
		var file_name = last_value;
	}

	// Set Number if path isn't relativ
	if (!folder.includes("$")) {
		file_name_counter = file_name + counter;
	}
	else {
		file_name_counter = file_name;
	}

	return [folder, file_name_counter, file_name];
}


// #####################################################################
// refresh placeholders with Recipe id
function recipeId(input) {
	var el_article = input.parentNode.parentNode;
	var input_text = input.value;
	var el_sidebar = document.getElementById("link_" + el_article.id).getElementsByClassName("link_text")[0];

	if (input_text == "") {
		var input_text = input.placeholder;
	}

	// Refresh variables and placeholders
	recipe[2] = refreshVarLive("recipe", el_article, input_text, recipe[2]);
	advancement[2] = refreshVarLive("advancement", el_article, input_text, advancement[2]);
	function_detect[2] = refreshVarLive("function_detect", el_article, input_text, function_detect[2]);
	function_craft[2] = refreshVarLive("function_craft", el_article, input_text, function_craft[2]);
	function_mass[2] = refreshVarLive("function_mass", el_article, input_text, function_mass[2]);

	el_article.getElementsByClassName("tag")[0].placeholder = input_text;
	tag = input_text;

	// Refresh sidebar
	el_sidebar.innerHTML = input_text;
	el_sidebar.classList.add("has_recipe_id");
}



function refreshVarLive(path_class, el_article, input_text, last_value) {
	var el_folder = el_article.getElementsByClassName(path_class + "_folder")[0];

	if (el_folder.value != "") {
		var folder = el_folder.value;
	}
	else {
		var folder = el_folder.placeholder;
	}

	if (!folder.includes("$")) {
		if (path_class == "function_detect") {
			var text = "detect_" + input_text;
		}
		else if (path_class == "function_craft") {
			var text = "craft_" + input_text;
		}
		else if (path_class == "function_mass") {
			var text = "mass_" + input_text;
		}
		else {
			var text = input_text;
		}

		el_article.getElementsByClassName(path_class + "_name")[0].placeholder = text;
		return text;
	}
	else {
		return last_value;
	}
}

// Refresh sidebar from result item
function resultItem(input) {
	var el_article = input.parentNode;
	var input_text = input.value;
	var el_sidebar = document.getElementById("link_" + el_article.id).getElementsByClassName("link_text")[0];

	if (!el_sidebar.classList.contains("has_recipe_id")) {
		if (input_text == "") {
			el_sidebar.innerHTML = "Recipe " + el_article.id;
		}
		else {
			var input_text = cleanGive(el_article) // save.js
			input_text = input_text.replace("minecraft:", "").split("{")[0];
			el_sidebar.innerHTML = input_text;
		}
	}
}


// #####################################################################
// Onclick function in sidebar
function scrollToParent(id) {	
	var sel_element = document.getElementById(id)
	sel_element.scrollIntoView({block: 'center', behavior: 'smooth'});
	sel_element.style.backgroundColor = "#A10000";

	closeSpoiler(sel_element);

	setTimeout(function(){ sel_element.style.backgroundColor = "#1c1c1c"; }, 500);
}


// Remove Recipe
function removeRecipe(el) {
	var el_article = document.getElementsByTagName("article");
	if (el_article.length > 1) {
		var confirm_msg = confirm("You will delete your input irreversible!");
		if (confirm_msg == true) {
			var remove_id = el.parentNode.id;
			var remove_link = document.getElementById("link_" + remove_id);
			remove_link.remove();
			el.parentNode.remove();
		}
	}
}


// shortcuts
document.addEventListener("keydown", e => {
	// Add new recipe crtl + enter
	if (e.ctrlKey && (e.which == 13 || e.keyCode == 13) ) { addRecipe(); }
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
	localStorage.setItem("advanced_mode", checkbox.checked);
	
	if (checkbox.checked == true) {
		document.documentElement.style.setProperty("--show_advanced_mode", "block");
	}
	else {
		document.documentElement.style.setProperty("--show_advanced_mode", "none");
	}
}


// Compact View
var el_compact_view = document.getElementById("compact_view");

if (localStorage.getItem("compact_view") == "true") {
	var compact_view = "false";
	compactView();
}

function compactView(used_element) {
	if (compact_view == "true") {
		localStorage.setItem("compact_view", "false");
		compact_view = "false";

		el_compact_view.title = "Change to compact View (removes all unnecessary text)";
		el_compact_view.getElementsByTagName("img")[0].src = "../elements/nav/compress.svg";

		document.documentElement.style.setProperty("--hide_compact", "block");
	}
	else {
		localStorage.setItem("compact_view", "true");
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
