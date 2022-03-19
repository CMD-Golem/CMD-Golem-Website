// Define variables
var datapack_name = "powerench"; // define data pack namespace
var pack_version = "3"; // define version of data pack
var pack_id_load = "1-"; // define version of pack id
var pack_id;

// Missing Enchantments
// {"id":"xx", "title":"Swarm", "description":"Low life will spawn a swarm of bees", "max_lvl":"2", "chance":"1", "comp_items":[2], "ench":["swarm"], "incomp_ench":"false", "style":""},
// Chopping

// ###########################################################
// Generate
async function generate() {
	// var check_selected = checkSelected(document.getElementsByClassName("selected"));
	// if (!check_selected) {return}

	var sel_article = document.querySelectorAll(".selected,.vanilla");
	if (show_info == true) { openInfo() }

	var comb_lore = "";
	var enchanting = "";
	var adv_enchanting = "";
	var tick_function = "";
	var load_function = "";
	var maxlvl_load = "";
	var comb_book = "";
	var comb_detect = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

	pack_id = pack_id_load;

	// user display
	closeModal();
	loadProgressModal();
	// disableScroll();
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
		var is_advanced = ench.classList.contains("advanced_ench");

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
			// ENCHANTING (all ench and all adv ench in one file)
			if (is_selected) {
				var ench_chance = ench.getAttribute("data-chance");

				var ench_is_adv = 0;
				if (is_advanced) {var ench_is_adv = 1;}
				var ench_is_vanilla = 0;
				if (is_vanilla) {var ench_is_vanilla = 1;}

				var ench_ench = `execute if predicate powerench_main:enchanting/chance${ench_chance} run summon item ~ ~ ~ {Tags:["powerench_enchantment"],Item:{id:"minecraft:enchanted_book",Count:1b,tag:{vanilla:${ench_is_vanilla}b,advanced_ench:${ench_is_adv}b,max_lvl:${ench_array.max_lvl}b,name:"${ench_array.title}",powerench:[{id:"minecraft:${ench_array.ench[0]}",lvl:1s}]}}}\n`

				if (is_advanced) {
					adv_enchanting += ench_ench;
				}
				else {
					enchanting += ench_ench;
				}
			}

			// COMBINING: incompatible enchantments
			var incompatible = "";
			if (!ench.classList.contains("ignore_incomp") && ench_array.ench.length >= 2) {
				for (var j = 1; j < ench_array.ench.length; j++) {
					incompatible += 'execute unless score #final_combine powerench matches -1 if entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:' + ench_array.ench[j] + '"}]}}}] run scoreboard players set #final_combine powerench -1\n';

				}
				pack_folder.file("functions/combining/incompatible/" + ench_array.ench[0] + ".mcfunction", incompatible);
				pack_folder.file("tags/functions/combining/" + ench_array.ench[0] + ".json", '{"values": ["' + datapack_name + ':combining/incompatible/' + ench_array.ench[0] + '"]}');
			}

			// COMBINING: Detect Items (same tools)
			for (var j = 0; j < ench_array.comp_items.length; j++) {
				var pos_id = ench_array.comp_items[j];
				comb_detect[pos_id] += `execute if entity @e[distance=..1,tag=powerench_combine_second,nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] run function ${datapack_name}:combining/enchantments/${ench_array.ench[0]}\n`;
			}

			comb_book += `execute if entity @e[distance=..1,tag=powerench_combine_second,nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] run function ${datapack_name}:combining/enchantments/${ench_array.ench[0]}\n`;

			if (is_vanilla) {
				// COMBINING: load vanilla max level (all ench in one file)
				maxlvl_load += "scoreboard players set #" + ench_array.ench[0] + " powerench " + ench_array.max_lvl + "\n"

				// COMBINING: Enchant
				pack_folder.file("functions/combining/enchantments/" + ench_array.ench[0] + ".mcfunction", `#get levels\nexecute store result score #first_combine powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\nexecute store result score #second_combine powerench as @e[tag=powerench_combine_second,distance=..1,limit=1] run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n\n#set level\nexecute if score #first_combine powerench <= #second_combine powerench run scoreboard players operation #final_combine powerench = #second_combine powerench\nexecute if score #first_combine powerench = #second_combine powerench run scoreboard players add #final_combine powerench 1\nexecute if score #first_combine powerench > #second_combine powerench run scoreboard players set #final_combine powerench -1\nexecute if score #first_combine powerench >= #${ench_array.ench[0]} powerench run scoreboard players set #final_combine powerench -1\nfunction #powerench:combining/${ench_array.ench[0]}\n\n#set ench level and finish\nexecute if score #final_combine powerench matches 1.. store result entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl short 1 run scoreboard players get #final_combine powerench\nexecute if score #final_combine powerench matches 1.. run tag @e[tag=powerench_combine_second,distance=..1,limit=1] add powerench_combine_remove`);
			}
			else {
				pack_folder.file("functions/combining/enchantments/" + ench_array.ench[0] + ".mcfunction", `#get levels\nexecute store result score #first_combine powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\nexecute store result score #second_combine powerench as @e[tag=powerench_combine_second,distance=..1,limit=1] run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n\n#set level\nexecute if score #first_combine powerench <= #second_combine powerench run scoreboard players operation #final_combine powerench = #second_combine powerench\nexecute if score #first_combine powerench = #second_combine powerench run scoreboard players add #final_combine powerench 1\nexecute if score #first_combine powerench > #second_combine powerench run scoreboard players set #final_combine powerench -1\nexecute if score #first_combine powerench matches ${ench_array.max_lvl}.. run scoreboard players set #final_combine powerench -1\nfunction #powerench:combining/${ench_array.ench[0]}\n\n#set ench level and finish\nexecute if score #final_combine powerench matches 1.. store result entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl short 1 run scoreboard players get #final_combine powerench\nexecute if score #final_combine powerench matches 1.. run tag @e[tag=powerench_combine_second,distance=..1,limit=1] add powerench_combine_remove`);

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
		pack_folder.file("tags/functions/enchanting/adv_enchanting.json", '{"values": ["' + datapack_name + ':enchanting/adv_enchantments"]}');
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

	// COMBINING: Vanilla max Level
	pack_folder.file("functions/combining/max_lvl.mcfunction", maxlvl_load);

	// COMBINING: Lore
	pack_folder.file("tags/functions/lore.json", '{"values": ["' + datapack_name + ':combining/lore"]}');
	pack_folder.file("functions/combining/lore.mcfunction", comb_lore);

	// COMBINING: Detect Items
	pack_folder.file("tags/functions/items/book.json", '{"values": ["' + datapack_name + ':combining/items/book"]}');
	pack_folder.file("functions/combining/items/book.mcfunction", comb_book);
	for (var i = 0; i < comb_detect.length; i++) {
		var comb_detect_tag = "";
		if (comb_detect[i] != "") {
			comb_detect_tag = ',{"id":"' + datapack_name + ':combining/items/' + comp_items_key[i] + '", "required":false}'
			pack_folder.file("functions/combining/items/"+ comp_items_key[i] + ".mcfunction", comb_detect[i]);
		}
		if (i != 0) {
			pack_folder.file("tags/functions/items/" + comp_items_key[i] + ".json", '{"values": [{"id":"#powerench:items/all", "required":false}' + comb_detect_tag + ']}');
		}
		else if (comb_detect[i] != "" && i == 0) {
			pack_folder.file("tags/functions/items/" + comp_items_key[i] + ".json", '{"values": ["' + datapack_name + ':combining/items/all"]}');
		}
	}

	// pack.mcmeta
	var version = document.getElementById("version").value;
	mc_version = version.options[version.selectedIndex].text.slice(0,4)

	zip.file("pack.mcmeta", '{"pack": {"pack_format": ' + version.value + ',"description": "Powered Enchanting Data Pack by CMD-Golem"}}');
	zip.file("Pack ID.txt", pack_id);

	document.getElementById("progress_action").innerHTML = "Creating ZIP file"
	zip.generateAsync({type:"base64"}, function updateCallback(metadata) {
		progress_bar.style.width = metadata.percent + "%";
	}).then(function (content) {
		closeModal();
		enableScroll();

		var link = document.createElement('a');
		link.download = "[" + mc_version + "] Powered Enchanting Datapack v" + pack_version + ".zip";
		link.href = "data:application/zip;base64," + content;
		link.click();

		// Counter
		updateCounter(); //download_counter.js
	});
}

function loadProgressModal() {
	var modal_text = document.createElement("div");
	modal_text.classList.add("modal_text");
	modal_text.classList.add("center");
	modal_text.innerHTML = '<h3 id="progress_action">Downloading Files</h3><div id="progress_bar"><div id="bar"></div></div>';
	modal_box.appendChild(modal_text);
}

// ###########################################################
// Download Modal
function loadDownloadModal() {
	var sel_article = document.getElementsByClassName("selected");
	var check_selected = checkSelected(sel_article);
	if (!check_selected) {return}

	// generatePackId(sel_article);

	var modal_text = document.createElement("div");
	modal_text.classList.add("modal_text");
	modal_text.classList.add("center");
	modal_text.innerHTML = `
	<div class="modal_padding_box">
		<h2>Download</h2>
		<hr>
		<p>It's highly recommended to use the Resource Pack, but not necessary.</p>
		<button onclick="generate()" style="margin-right:10px; border: 2px solid #A10000;">Download Data Pack</button><button onclick="downloadResourcePack()">Download Resource Pack</button><br>
		<button onclick="closeModal()" style="margin-top:50px;">Close</button>
	</div>`;
	modal_box.appendChild(modal_text);

	disableScroll();
}

// check pack id
function generatePackId(sel_article) {	
	pack_id = pack_id_load;

	for (var i = 0; i < sel_article.length; i++) {
		packId(sel_article[i]);
	}
}

function downloadResourcePack() {
	var version = document.getElementById("version").value;

	if (version == "8") {window.open("https://drive.google.com/uc?export=download&id=1QkCMN-TgW8URRuWjxi1gSDCuhmeMfQFP");}
	else if (version == "7") {window.open("https://drive.google.com/uc?export=download&id=1eqDfOCp8Wx3kN_rqZDlpVv-ki4B7UaCI");}
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