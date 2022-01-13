// Define variables
var datapack_name = "powerench"; // define data pack namespace
var pack_version = "3"; // define version of data pack
var pack_id_load = "1-"; // define version of pack id
var pack_id;

// {"id":"L", "title":"Swarm", "description":"Low life will spawn a swarm of bees", "max_lvl":"2", "chance":"1", "comp_items":["chestplate"], "comp_itemsId":[2], "ench":["swarm"], "incomp_ench":"false", "style":""},

// all 0
// helmet 1, chestplate 2, leggings 3, boots 4
// sword 5, pickaxe 6, axe 7, shovel 8, hoe 9
// bow 10, carrot_on_a_stick 11, crossbow 12, elytra 13, fishing_rod 14, flint_and_steal 15, shears 16, shield 17, trident 18
// var comb_detect_items = ["all", "armor/helmet", "armor/chestplate", "armor/leggings", "armor/boots", "tools/sword", "tools/pickaxe", "tools/axe", "tools/shovel", "tools/hoe", "others/bow", "others/carrot_on_a_stick", "others/crossbow", "others/elytra", "others/fishing_rod", "others/flint_and_steal", "others/shears", "others/shield", "others/trident"];
var comb_detect_items = ["all", "helmet", "chestplate", "leggings", "boots", "sword", "pickaxe", "axe", "shovel", "hoe", "bow", "carrot_on_a_stick", "crossbow", "elytra", "fishing_rod", "flint_and_steal", "shears", "shield", "trident"];

// ###########################################################
// Generate
async function generate() {
	var check_selected = checkSelected(document.getElementsByClassName("selected"));
	if (!check_selected) {return}

	var sel_article = document.querySelectorAll(".selected,.vanilla");
	if (show_info == true) { openInfo() }

	var comb_lore = "";
	var enchanting = "";
	var adv_enchanting = "";
	var tick_function = "";
	var load_function = "";
	var comb_detect = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

	pack_id = pack_id_load;

	// user display
	loadProgressModal();
	disableScroll();
	var progress_bar = document.getElementById("bar");
	var article_length = sel_article.length;
	var progress_width_per_ench = document.getElementById("progress_bar").offsetWidth / article_length;
	var progress_width = 0;

	//zip
	var zip = new JSZip();
	// Set folderpaths
	var pack_folder = zip.folder("data/" + datapack_name);

	// load main pack
	ench_pack = await fetch("../../elements/files/powered_enchanting/main_pack.zip");
	await zip.loadAsync(ench_pack.blob());

	// ###########################################################
	// load dynamic content
	for (var i = 0; i < article_length; i++) {
		var ench = sel_article[i];
		var ench_array = article_array[ench.getAttribute("data-arrayId")];
		var is_vanilla = ench.classList.contains("vanilla");
		var is_selected = ench.classList.contains("selected");

		// user display
		progress_width += progress_width_per_ench;
		progress_bar.style.width = progress_width + "px";

		// generate pack id
		if (is_selected) { packId(ench); }

		if (!is_vanilla) {
			// load files
			if (!ench.classList.contains("no_files")) {
				ench_pack = await fetch("../../elements/files/powered_enchanting/" + ench_array.ench[0] + ".zip");
				await pack_folder.loadAsync(ench_pack.blob());
			}

			// FUNCTIONS: tick and load (all ench in one file)
			if (ench_array.tick != undefined) {
				tick_function = tick_function + ench_array.tick + "\n";
			}
			if (ench_array.load != undefined) {
				load_function = load_function + ench_array.load + "\n";
			}
		}

		if (!ench.classList.contains("nooptions")) {
			// ENCHANTING (all ench and all adv ench in one file) !#! set vanilla:0b Achutng bei mending
			if (is_selected) {
				var ench_chance = ench.getAttribute("data-chance")
				var ench_ench = `execute if predicate powerench_main:enchanting/chance${ench_chance} run summon item ~ ~ ~ {Tags:["powerench_quartz_select"],Item:{id:"minecraft:enchanted_book",Count:1b,tag:{vanilla:0b,display:{Name:'{"text":"${ench_array.title}","italic":false,"color":"aqua"}',Lore:['{"text":"${ench_array.title}","color":"gray","italic":false}']},powerench:[{id:"minecraft:${ench_array.ench[0]}",lvl:1s}]}}}\n`;

				if (ench.classList.contains("advanced_ench")) {
					adv_enchanting += ench_ench;
				}
				else {
					enchanting += ench_ench;
				}
			}

			// COMBINING: Detect Items (same tools)
			if (!ench.classList.contains("ignore_incomp")) {
				var incompatible = "";
				for (var j = 0; j < ench_array.ench.length; j++) {
					if (j != 0) {
						incompatible += ' if entity @s[nbt=!{Item:{tag:{Enchantments:[{id:"minecraft:' + ench_array.ench[j] + '"}]}}}]';
					} 
				}
			}

			for (var j = 0; j < ench_array.comp_itemsId.length; j++) {
				var pos_id = ench_array.comp_itemsId[j];
				comb_detect[pos_id] += `execute if entity @e[distance=..1,tag=powerench_combine_second,nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}]${incompatible} run function ${datapack_name}:combining/enchantments/${ench_array.ench[0]}\n`;
			}

			if (is_vanilla) {
				// COMBINING: Enchant
				pack_folder.file("functions/combining/enchantments/" + ench_array.ench[0] + ".mcfunction", `#get level and max level of book\nexecute as @e[tag=powerench_combine_second,distance=..1,limit=1] store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#get level of tool\nexecute store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#test of both have the same ench level and add one level\nexecute if score @e[tag=powerench_combine_second,distance=..1,limit=1] powerench = @s powerench run tag @s add powerench_combine_same\nexecute if score @e[tag=powerench_combine_second,distance=..1,limit=1] powerench = @s powerench run scoreboard players add @s powerench 1\n#test if ench level of book is higher than ench level of tool and set ench level of tool to the of book\nexecute if entity @s[tag=!powerench_combine_same] if score @e[tag=powerench_combine_second,distance=..1,limit=1] powerench > @s powerench run scoreboard players operation @s powerench = @e[tag=powerench_combine_second,distance=..1,limit=1] powerench\n#test if max ench level is smaller than ench level of tool and set ench level of tool to max level\nexecute if score @e[tag=powerench_combine_second,distance=..1,limit=1] powerench >= #${ench_array.ench[0]} powerench run scoreboard players operation @s powerench = #${ench_array.ench[0]} powerench\n#test if tool hasn't ench and add ench\nexecute unless entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] run data modify entity @s Item.tag.Enchantments append from entity @e[tag=powerench_combine_second,distance=..1,limit=1] Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}] \n#set ench level\nexecute store result entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl short 1 run scoreboard players get @s powerench\n#finish book\ntag @e[tag=powerench_combine_second,distance=..1,limit=1] add powerench_combine_remove`);
			}
			else {
				pack_folder.file("functions/combining/enchantments/" + ench_array.ench[0] + ".mcfunction", `#get level and max level of book\nexecute as @e[tag=powerench_combine_second,distance=..1,limit=1] store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#get level of tool\nexecute store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#test of both have the same ench level and add one level\nexecute if score @e[tag=powerench_combine_second,distance=..1,limit=1] powerench = @s powerench run tag @s add powerench_combine_same\nexecute if score @e[tag=powerench_combine_second,distance=..1,limit=1] powerench = @s powerench run scoreboard players add @s powerench 1\n#test if ench level of book is higher than ench level of tool and set ench level of tool to the of book\nexecute if entity @s[tag=!powerench_combine_same] if score @e[tag=powerench_combine_second,distance=..1,limit=1] powerench > @s powerench run scoreboard players operation @s powerench = @e[tag=powerench_combine_second,distance=..1,limit=1] powerench\n#test if max ench level is smaller than ench level of tool and set ench level of tool to max level\nexecute if score @e[tag=powerench_combine_second,distance=..1,limit=1] powerench matches ${ench_array.max_lvl}.. run scoreboard players set @s powerench ${ench_array.max_lvl}\n#test if tool hasn't ench and add ench\nexecute unless entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] run data modify entity @s Item.tag.Enchantments append from entity @e[tag=powerench_combine_second,distance=..1,limit=1] Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}] \n#set ench level\nexecute store result entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl short 1 run scoreboard players get @s powerench\n#finish book\ntag @e[tag=powerench_combine_second,distance=..1,limit=1] add powerench_combine_remove`);

				// COMBINING: Lore (all ench in one file)
				var max_lvl = parseInt(ench_array.max_lvl);
				if (max_lvl == 1) {
					comb_lore += `data modify entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_array.title}","color":"gray","italic":false}'\n\n`;
				}
				else {
					for (var j = 0; j < max_lvl; j++) {
						var lvl = convertToRoman(j + 1); // in app.js
						comb_lore += `data modify entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}",lvl:${j + 1}s}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_array.title} ${lvl}","color":"gray","italic":false}'\n`;
						if (j == max_lvl - 1) {
							comb_lore += "\n";
						}
					}
				}
			}
		}
	}

	//#################################################################################################
	// enchanting files
	if (adv_enchanting != "") {
		pack_folder.file("tags/functions/enchanting/adv_enchanting.json", '{"values": ["#powerench:enchanting/enchanting", "' + datapack_name + ':enchanting/adv_enchantments"]}');
		pack_folder.file("functions/enchanting/adv_enchantments.mcfunction", adv_enchanting);
	}
	if (enchanting != "") {
		pack_folder.file("tags/functions/enchanting/enchanting.json", '{"values": ["' + datapack_name + ':enchanting/enchantments"]}');
		pack_folder.file("functions/enchanting/enchantments.mcfunction", enchanting);
	}

	// functions
	if (tick_function != "") {
		pack_folder.file("tags/functions/tick.json", '{"values": ["' + datapack_name + ':tick"]}');
		pack_folder.file("functions/tick.mcfunction", tick_function);
	}
	if (load_function != "") {
		pack_folder.file("tags/functions/load.json", '{"values": ["' + datapack_name + ':load"]}');
		pack_folder.file("functions/load.mcfunction", load_function);
	}

	// COMBINING: Lore
	pack_folder.file("tags/functions/lore.json", '{"values": ["' + datapack_name + ':combining/lore"]}');
	pack_folder.file("functions/combining/lore.mcfunction", comb_lore);

	// COMBINING: Detect Items
	pack_folder.file("tags/functions/items/book.json", '{"values": [{"id":"#powerench:items/boots", "required":false},{"id":"#powerench:items/leggings", "required":false},{"id":"#powerench:items/chestplate", "required":false},{"id":"#powerench:items/helmet", "required":false},{"id":"#powerench:items/bow", "required":false},{"id":"#powerench:items/carrot_on_a_stick", "required":false},{"id":"#powerench:items/crossbow", "required":false},{"id":"#powerench:items/elytra", "required":false},{"id":"#powerench:items/flint_and_steal", "required":false},{"id":"#powerench:items/shears", "required":false},{"id":"#powerench:items/shield", "required":false},{"id":"#powerench:items/trident", "required":false},{"id":"#powerench:items/fishing_rod", "required":false},{"id":"#powerench:items/axe", "required":false},{"id":"#powerench:items/sword", "required":false},{"id":"#powerench:items/hoe", "required":false},{"id":"#powerench:items/pickaxe", "required":false},{"id":"#powerench:items/shovel", "required":false}]}');
	for (var i = 0; i < comb_detect.length; i++) {
		var comb_detect_tag = "";
		if (comb_detect[i] != "") {
			comb_detect_tag = ',{"id":"' + datapack_name + ':combining/items/' + comb_detect_items[i] + '", "required":false}'
			pack_folder.file("functions/combining/items/"+ comb_detect_items[i] + ".mcfunction", comb_detect[i]);
		}
		if (i != 0) {
			pack_folder.file("tags/functions/items/" + comb_detect_items[i] + ".json", '{"values": [{"id":"#powerench:items/all", "required":false}' + comb_detect_tag + ']}');
		}
		else if (comb_detect[i] != "" && i == 0) {
			pack_folder.file("tags/functions/items/" + comb_detect_items[i] + ".json", '{"values": ["' + datapack_name + ':combining/items/all"]}');
		}
	}

	// pack.mcmeta
	var version = document.getElementById("version").value;

	zip.file("pack.mcmeta", '{"pack": {"pack_format": ' + version + ',"description": "Powered Enchanting Datapack by CMD-Golem"}}');
	zip.file("Pack ID.txt", pack_id);

	document.getElementById("progress_action").innerHTML = "Creating ZIP file"
	zip.generateAsync({type:"base64"}, function updateCallback(metadata) {
		progress_bar.style.width = metadata.percent + "%";
	}).then(function (content) {
		closeModal();
		enableScroll();

		var link = document.createElement('a');
		link.download = "[1.1" + version + "] Powered Enchanting Datapack v" + pack_version + ".zip";
		link.href = "data:application/zip;base64," + content;
		link.click();

		// Counter
		mc_version = "1.1" + version;
		updateCounter();
	});
}

function loadProgressModal() {
	var modal_text = document.createElement("div");
	modal_text.classList.add("modal_text");
	modal_text.classList.add("center");
	modal_text.innerHTML = '<h3 id="progress_action">Downloading Files</h3><div id="progress_bar"><div id="bar"></div></div>';
	modal_box.appendChild(modal_text);
}

//#################################################################################################
// generate pack id
function packId(ench) {
	// get adv_ench and ignore incomp
	is_adv_ench = ench.classList.contains("advanced_ench");
	is_ign_incomp = ench.classList.contains("ignore_incomp");

	if (!is_adv_ench && !is_ign_incomp) {var settings_id = "0";}
	else if (is_adv_ench && !is_ign_incomp) {var settings_id = "1";}
	else if (!is_adv_ench && is_ign_incomp) {var settings_id = "2";}
	else {var settings_id = "3";}

	pack_id = pack_id + ench.id + ench.getAttribute("data-chance") + settings_id;
}

// get pack id
function getPackId(button) {	
	var sel_article = document.getElementsByClassName("selected");
	pack_id = pack_id_load;
	var check_selected = checkSelected(sel_article);
	if (!check_selected) {return}

	for (var i = 0; i < sel_article.length; i++) {
		packId(sel_article[i]);
	}

	console.log("Pack Id: " + pack_id);

	var copy = document.createElement("textarea");
	copy.value = pack_id;
	document.body.appendChild(copy);
	copy.select();
	document.execCommand("copy");
	copy.remove();

	button.style.backgroundColor = "#16472B";
	setTimeout(function(){ button.removeAttribute("style"); }, 800);

	if (show_info == true) { openInfo() }
}

// #####################################################################
// Download/ pack id check
function checkSelected(sel_article) {
	if (sel_article.length == 0) {
		alert("Please select your enchantments first!");
		return false;
	}
	else if (sel_article.length <= 5) {
		var confirm_msg = confirm("Please select at least 5 enchantments.\nPress OK to continue anyway.");
		if (confirm_msg == true) {
			return true;
		}
		if (confirm_msg == false) {
			return false;
		}
	}
	else {
		return true;
	}
}

// #####################################################################
// Download counter
// update db
var update = (pack_id, pack_type) => {
	return fetch(`/.netlify/functions/update/${pack_type}/${pack_id}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

// version statistic
var version = (mc_version) => {
	return fetch(`/.netlify/functions/version/${mc_version}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

// update counter
var already_download = false;
var selected_edition = "none";
var mc_version;

function updateCounter() {
	if (already_download != true) {
		already_download = true;

		update("320699416718606924", "datapacks"); // normal counter
		version(mc_version); // version statistic

		// edition counter
		if (selected_edition == "golem") {var edition = "320699550069162572"}
		else if (selected_edition == "all") {var edition = "320699603872645708"}
		else if (selected_edition == "vanilla") {var edition = "320699566604157516"}
		else if (selected_edition == "pack_id") {var edition = "320699587095429708"}
		else {var edition = "320699649726874188"}
		update(edition, "powered_enchanting");

	}
	else {
		console.log("Already downloaded");
	}
}


// #####################################################################
// Prevent Scrolling (https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily)
function preventDefault(e) {
	e.preventDefault();
}
  
function preventDefaultForScrollKeys(e) {
	var keys = {37: 1, 38: 1, 39: 1, 40: 1};
	if (keys[e.keyCode]) {
		preventDefault(e);
		return false;
	}
}
  
// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
	window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
		get: function () { supportsPassive = true; } 
	}));
} catch(e) {}
  
var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
  
// call this to Disable
function disableScroll() {
	window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
	window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
	window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
	window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}
  
// call this to Enable
function enableScroll() {
	window.removeEventListener('DOMMouseScroll', preventDefault, false);
	window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
	window.removeEventListener('touchmove', preventDefault, wheelOpt);
	window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}