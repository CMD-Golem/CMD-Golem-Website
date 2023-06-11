var already_download = false;

async function downloadCheck() {
	var zip = undefined;
	zip = new JSZip();

	var recipe_array = [];
	var advancement_array = [];
	var function_array = [];
	var tag_array = [];

	// Get data pack name, scoreboard and pack version
	var datapack_name = document.getElementsByClassName("datapack_name")[0].value;

	var el_score = document.getElementsByClassName("score")[0];
	if (el_score.value == "") {var score = el_score.placeholder;}
	else {var score = el_score.value;}

	var version = el_version.value;

	// go throug all recipes
	var article = document.getElementsByTagName("article");

	for (var i = 0; i < article.length; i++) {
		// #####################################################################################
		// Get Recipe
		var recipe_text = article[i].getElementsByClassName("recipe_text")[0].value;
		
		// Get Tag
		var el_tag = article[i].getElementsByClassName("tag")[0];
		if (el_tag.value == "") {var tag = el_tag.placeholder;}
		else {var tag = el_tag.value;}

		// Get Item
		var nbt_item = cleanGive(article[i]);

		// Get Recipe Id
		var el_recipe_id = article[i].getElementsByClassName("recipe_id")[0];
		if (el_recipe_id.value == "") {var recipe_id = el_recipe_id.placeholder;}
		else {var recipe_id = el_recipe_id.value;}

		// #####################################################################################
		// Error Check
		if (nbt_item == "" || recipe_text == "" || datapack_name == "") {
			confirm("You need to fill out all Fields which are marked with (needed)!");
			return;
		}
		try {
			// test json from Recipe
			var placeholder = JSON.parse(recipe_text).result.item;
			var count = JSON.parse(recipe_text).result.count;
		}
		catch (e) {
			confirm("Your Recipe isn't correct!");
			return;
		}

		// Get folder path
		recipe_path = generatePath("recipe", recipe_id, article[i]);
		advancement_path = generatePath("advancement", recipe_id, article[i]);
		function_detect_path = generatePath("function_detect", recipe_id, article[i]);
		function_craft_path = generatePath("function_craft", recipe_id, article[i]);
		function_mass_path = generatePath("function_mass", recipe_id, article[i]);

		// collect folder paths
		recipe_array.push(recipe_path);
		advancement_array.push(advancement_path);
		function_array.push(function_detect_path);
		function_array.push(function_craft_path);
		function_array.push(function_mass_path);
		tag_array.push(tag);

		// #####################################################################################
		// Advancement
		var advancement_text = `{"criteria": {"unlock": {"trigger": "minecraft:recipe_unlocked","conditions": {"recipe": "${datapack_name}:${recipe_path}"}}},"rewards": {"function": "${datapack_name}:${function_detect_path}"}}`;
		zip.file(`data/${datapack_name}/advancements/${advancement_path}.json`, advancement_text);
		
		// Recipe
		zip.file(`data/${datapack_name}/recipes/${recipe_path}.json`, recipe_text);
		
		// Function Detect
		var function_detect_text = `advancement revoke @s only ${datapack_name}:${advancement_path}\nrecipe take @a ${datapack_name}:${recipe_path}\n\nexecute unless entity @s[tag=${tag}] run scoreboard players reset @s ${score}\nscoreboard players add @s ${score} 1\ntag @s add ${tag}\n\nschedule function ${datapack_name}:${function_craft_path} 2t`;
		zip.file(`data/${datapack_name}/functions/${function_detect_path}.mcfunction`, function_detect_text);
		
		// Function craft
		var function_craft_text = `execute as @a[tag=${tag}] at @s unless entity @e[type=item,nbt={Item:{id:"${placeholder}",Count:${count}b},Age:1s},distance=..3] run clear @s ${placeholder} ${count}\nexecute at @a[tag=${tag}] run kill @e[type=item,nbt={Item:{id:"${placeholder}",Count:${count}b},Age:1s},distance=..3]\n\ngive @a[tag=${tag}] ${nbt_item} ${count}\nscoreboard players remove @a[tag=${tag}] ${score} 1\n\nexecute as @a[tag=${tag},scores={${score}=1..}] run function ${datapack_name}:${function_mass_path}\n\ntag @a[tag=${tag}] remove ${tag}`;
		zip.file(`data/${datapack_name}/functions/${function_craft_path}.mcfunction`, function_craft_text);
		
		// Function Mass Craft
		var function_mass_text = `execute as @s run kill @e[type=item,nbt={Item:{id:"${placeholder}",Count:${count}b},Age:1},distance=..3]\n\nclear @s ${placeholder} ${count}\ngive @s ${nbt_item} ${count}\nscoreboard players remove @s ${score} 1\n\nexecute if entity @s[scores={${score}=1..}] run function ${datapack_name}:${function_mass_path}`;
		zip.file(`data/${datapack_name}/functions/${function_mass_path}.mcfunction`, function_mass_text);
	}

	// #####################################################################################
	// Load Function
	var function_load_text = "scoreboard objectives add " + score + " dummy";
	zip.file(`data/${datapack_name}/functions/load.mcfunction`, function_load_text);

	// Minecraft Load Tag
	var function_tag_load = '{"values": ["' + datapack_name + ':load"]}';
	zip.file("data/minecraft/tags/functions/load.json", function_tag_load);

	// Minecraft pack.mcmeta
	var pack_mcmeta = '{"pack": {"pack_format": ' + version + ',"description": "Made with the NBT-Crafting Generator by CMD-Golem\\ncmd-golem.netlify.app/help/nbt_crafting"}}';
	zip.file("pack.mcmeta", pack_mcmeta);

	// test that each path exists only once
	if (checkPath(recipe_array, "recipe")) {return}
	if (checkPath(advancement_array, "advancement")) {return}
	if (checkPath(function_array, "function")) {return}
	if (checkPath(tag_array, "tag")) {return}
	
	// Download
	var progress_bar = document.getElementById("progress_bar");
	progress_bar.style.display = "block";
	preventScroll(true); // footer.js

	zip.generateAsync({type:"base64"}, function updateCallback(metadata) {
		document.getElementById("bar").style.width = metadata.percent + "%";
	}).then(function (content) {
		progress_bar.style.display = "none";
		preventScroll(false); // footer.js
		
		var link = document.createElement('a');
		link.download = "NBT-Crafting";
		link.href = "data:application/zip;base64," + content;
		link.click();

		// Count download
		if (already_download != true) {
			already_download = true;
			fetch(`/.netlify/functions/update/help/306824373484913163`);
		}
		else {
			console.log("Already downloaded");
		}
	});
}

// #####################################################################################
// Stop generating file if dublicated name
function checkPath(array, error_type) {
	for (var i = 0; i < array.length; i++) {
		if (array.includes(array[i], i + 1)){
			if (error_type = "tag") {
				confirm("You have used the Tag " + array[i] + " more than once.")
			}
			else if (error_type = "recipe") {
				confirm("You have used the path recipes/" + array[i] + ".json more than once.");
			}
			else if (error_type = "advancement") {
				confirm("You have used the path advancements/" + array[i] + ".json more than once.");
			}
			else if (error_type = "function") {
				confirm("You have used the path functions/" + array[i] + ".mcfunction more than once.");
			}
			return true;
		}
		else {
			return false;
		}
	}
}


// #####################################################################################
// Remove Give command
function cleanGive(article) {
	var nbt_item = article.getElementsByClassName("nbt_item")[0].value;

	if (nbt_item.charAt(0) == "/") {nbt_item = nbt_item.substring(1)}
	if (/[0-9]+$/.test(nbt_item)) {nbt_item = nbt_item.slice(0, -2);}

	if (nbt_item.startsWith("give")) {
		nbt_item = nbt_item.replace(/give @[a|p|s|r] /, "");
	}

	return nbt_item;
}


// #####################################################################################
function generatePath(path_class, recipe_id, article) {
	// Folder Path
	var el_folder = article.getElementsByClassName(path_class + "_folder")[0];
	
	// test folder input 
	if (el_folder.value == "") {
		var folder = el_folder.placeholder;
	}
	else {
		var folder = el_folder.value;
	}

	// replace $
	if (folder.includes("$")) {
		folder = folder.replace(/\u0024/g, recipe_id);
	}

	// Add / at end and remove / at beginning
	if (folder.slice(-1) != "/") {
		folder = folder + "/";
	}
	if (folder.charAt(0) == "/") {
		folder = folder.substring(1);
	}

	// #####################################################################################
	// Name
	var el_file_name = article.getElementsByClassName(path_class + "_name")[0];

	if (el_file_name.value == "") {
		var file_name = el_file_name.placeholder;
	}
	else {
		var file_name = el_file_name.value;
	}

	if (file_name.includes("$")) {
		file_name = file_name.replace(/\u0024/g, "");
	}

	// #####################################################################################
	// Combine
	var path = folder + file_name;

	return path;
}