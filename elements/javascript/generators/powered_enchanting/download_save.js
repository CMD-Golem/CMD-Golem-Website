// Define variables
var datapack_name = "powerench"; // define data pack namespace
var pack_id_load = "1-"; // define version of pack id
var url = "https://raw.githubusercontent.com/CMD-Golem/CMD-Golem-Packs/main";
var pack_id, already_download;

// Missing Enchantments
// {"id":"xx", "title":"Swarm", "description":"Low life will spawn a swarm of bees", "max_lvl":"2", "chance":"1", "comp_items":[2], "ench":["swarm"], "incomp_ench":"false", "style":""},
// Chopping

// Download Resource Pack
async function downloadResourcePack() {
	var zip = new JSZip();
	modal_box.classList.add("loading_cursor");

	var pack_version_ids = selected_pack_obj.rp_version_id;
	var pack_string = "resource_";
	var pack_description = "RP ";

	// get matching pack version for selected version
	for (var i = 0; i < pack_version_ids.length; i++) {
		if (pack_version_ids[i] <= selected_version.id) {
			var pack_git_folder = pack_string + pack_version_ids[i];

			// code version
			if (typeof selected_pack_obj.code_version == 'string') {
				var code_version = selected_pack_obj.code_version;
			}
			else {
				var code_version = selected_pack_obj.code_version[i];
			}
			break;
		}
	}

	var pack = await fetch(`${url}/${selected_pack_obj.pack_id}/${pack_git_folder}.zip`);
	await zip.loadAsync(pack.blob());

	// pack.mcmeta
	var mcmeta_string = await zip.file("pack.mcmeta").async("string");
	var mcmeta_json = JSON.parse(mcmeta_string);
	mcmeta_json.pack.pack_format = selected_version.rp;
	zip.file("pack.mcmeta", JSON.stringify(mcmeta_json));

	// download zip
	var pack = await zip.generateAsync({type:"base64"});
	var link = document.createElement('a');
	link.download = `[${selected_version.name}] ${selected_pack_obj.name} ${pack_description}by CMD-Golem v${code_version}.zip`;
	link.href = "data:application/zip;base64," + pack;
	link.click();

	modal_box.classList.remove("loading_cursor");
}

// ###########################################################
// Generate
async function generate(beta) {
	var sel_article = document.querySelectorAll(".selected,.vanilla");
	if (show_info == true) { openInfo() }

	var comb_lore = "";
	var enchanting = "";
	var adv_enchanting = "";
	var tick_function = "";
	var load_function = "";
	var maxlvl_load = "";
	var comb_book = "";
	var giveall_function = "function #powerench:give\n"
	var comb_detect = Array(comp_items_key.length).fill("");

	pack_id = pack_id_load;

	// user display
	closeModal();
	loadProgressModal();

	var progress_bar = document.getElementById("bar");
	var article_length = sel_article.length;
	var progress_width_per_ench = document.getElementById("progress_bar").offsetWidth / article_length;
	var progress_width = 0;

	//zip
	var zip = new JSZip();
	var pack_folder = zip.folder("data/" + datapack_name);

	// load main pack
	var pack_version_ids = selected_pack_obj.pack_version_id;

	for (var i = 0; i < pack_version_ids.length; i++) {
		if (pack_version_ids[i] <= selected_version.id) {
			var pack_git_folder = "pack_" + pack_version_ids[i];

			// code version
			if (typeof selected_pack_obj.code_version == 'string') {
				var code_version = selected_pack_obj.code_version;
			}
			else {
				var code_version = selected_pack_obj.code_version[i];
			}
			break;
		}
	}
	// if (beta) {
	// 	ench_pack = await fetch(`https://raw.githubusercontent.com/CMD-Golem/CMD-Golem-Packs/main/powered_enchanting/0_main/beta5_138.zip`);
	// 	fetch("/.netlify/functions/update/powered_enchanting/365982931582190161");
	// 	selected_version = version_id_array.find(e => e.id == 138);
	// 	code_version = "beta5.2";
	// }
	// else {
		ench_pack = await fetch(`${url}/powered_enchanting/0_main/${pack_git_folder}.zip`);
	// }
	
	await zip.loadAsync(ench_pack.blob());

	// translation of main pack 0 = EN, 1 = DE, 2 = KO
	var tr_code = document.getElementById("lang").value;

	if (tr_code != 0) {
		var tr_array = tr_code - 1;

		var tr_combining = await zip.file("data/powerench_main/functions/combining/fail.mcfunction").async("string");
		var tr_table = await zip.file("data/powerench_main/functions/table/enchanting/set_false.mcfunction").async("string");
		var tr_charge = await zip.file("data/powerench_main/functions/table/enchanting/charge.mcfunction").async("string");
		var tr_craft = await zip.file("data/powerench_main/functions/lapis_slice/craft.mcfunction").async("string");
		var tr_mass_craft = await zip.file("data/powerench_main/functions/lapis_slice/mass_craft.mcfunction").async("string");
		var tr_transform = await zip.file("data/powerench_main/functions/lapis_slice/transform.mcfunction").async("string");
		var tr_enchanting = await zip.file("data/powerench_main/functions/enchanting/error.mcfunction").async("string");
		var tr_item_cost = await zip.file("data/powerench_main/loot_tables/powercount.json").async("string");
		var tr_enchanting_cost = await zip.file("data/powerench_main/item_modifiers/cost.json").async("string");

		tr_combining = tr_combining.replace('[{"text":"You need to be Level ","color":"dark_red"},{"score":{"name":"#enchanting_cost","objective":"powerench"},"color":"dark_red"}]', translation_array[tr_array].mis_level_comb);
		tr_table = tr_table.replace("Enchanting Tables need 20 blocks space to each other.", translation_array[tr_array].table_dis);
		tr_charge = tr_charge.replace("The Enchanting Table is fully charged", translation_array[tr_array].full_charge);
		tr_craft = tr_craft.replace("Lapis Lazuli Slice", translation_array[tr_array].lapis_slice);
		tr_mass_craft = tr_mass_craft.replace("Lapis Lazuli Slice", translation_array[tr_array].lapis_slice);
		tr_transform = tr_transform.replace("Lapis Lazuli Slice", translation_array[tr_array].lapis_slice);
		tr_enchanting = tr_enchanting.replace("Drop the book back on the table", translation_array[tr_array].book_back);
		tr_enchanting = tr_enchanting.replace('[{"text":"You need to be Level ","color":"dark_red"},{"score":{"name":"@s","objective":"powerench_slot"},"color":"dark_red"}]', translation_array[tr_array].mis_level_ench);
		tr_item_cost = tr_item_cost.replace("Enchanting Cost:", translation_array[tr_array].enchanting_cost);
		tr_enchanting_cost = tr_enchanting_cost.replace("Levels", translation_array[tr_array].levels);

		zip.file("data/powerench_main/functions/combining/fail.mcfunction", tr_combining);
		zip.file("data/powerench_main/functions/table/enchanting/set_false.mcfunction", tr_table);
		zip.file("data/powerench_main/functions/table/enchanting/charge.mcfunction", tr_charge);
		zip.file("data/powerench_main/functions/lapis_slice/craft.mcfunction", tr_craft);
		zip.file("data/powerench_main/functions/lapis_slice/mass_craft.mcfunction", tr_mass_craft);
		zip.file("data/powerench_main/functions/lapis_slice/transform.mcfunction", tr_transform);
		zip.file("data/powerench_main/functions/enchanting/error.mcfunction", tr_enchanting);
		zip.file("data/powerench_main/loot_tables/powercount.json", tr_item_cost);
		zip.file("data/powerench_main/item_modifiers/cost.json", tr_enchanting_cost);
	}

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
			if (!ench.classList.contains("no_files")) {
				// load files
				var ench_version_ids = ench_array.version_id;

				for (var j = 0; j < ench_version_ids.length; j++) {
					if (ench_version_ids[j] <= selected_version.id) {
						var ench_git_folder = "pack_" + ench_version_ids[j];
						break;
					}
				}

				ench_pack = await fetch(`${url}/powered_enchanting/${ench_array.ench[0]}/${ench_git_folder}.zip`);
				await pack_folder.loadAsync(ench_pack.blob());

				// GIVE function for custom enchantments
				var give_function = `\ngive @s minecraft:enchanted_book{PoweredEnchantments:[{id:"minecraft:${ench_array.ench[0]}",lvl:1s}],Enchantments:[{id:"minecraft:${ench_array.ench[0]}",lvl:1s}],display:{Lore:['{"text":"${ench_array.title[tr_code]}","color":"gray","italic":false}']}}`
				giveall_function += give_function;
				pack_folder.file("functions/give/" + ench_array.ench[0] + ".mcfunction", give_function);

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

				var ench_ench = `execute if predicate powerench_main:enchanting/chance${ench_chance} run summon item ~ ~ ~ {Tags:["powerench_enchantment"],Item:{id:"minecraft:enchanted_book",Count:1b,tag:{vanilla:${ench_is_vanilla}b,advanced_ench:${ench_is_adv}b,max_lvl:${ench_array.max_lvl}b,name:"${ench_array.title[tr_code]}",powerench:[{id:"minecraft:${ench_array.ench[0]}",lvl:1s}]}}}\n`

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
					incompatible += 'execute unless score #final_combine powerench matches -1 if entity @s[nbt={Item:{tag:{PoweredEnchantments:[{id:"minecraft:' + ench_array.ench[j] + '"}]}}}] run scoreboard players set #final_combine powerench -1\n';

				}
				pack_folder.file("functions/combining/incompatible/" + ench_array.ench[0] + ".mcfunction", incompatible);
				pack_folder.file("tags/functions/combining/" + ench_array.ench[0] + ".json", '{"values": ["' + datapack_name + ':combining/incompatible/' + ench_array.ench[0] + '"]}');
			}

			// COMBINING: Detect Items (same tools)
			for (var j = 0; j < ench_array.comp_items.length; j++) {
				var pos_id = ench_array.comp_items[j];
				comb_detect[pos_id] += `execute if entity @e[distance=..1,tag=powerench_combine_second,nbt={Item:{tag:{PoweredEnchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] run function ${datapack_name}:combining/enchantments/${ench_array.ench[0]}\n`;
			}

			comb_book += `execute if entity @e[distance=..1,tag=powerench_combine_second,nbt={Item:{tag:{PoweredEnchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] run function ${datapack_name}:combining/enchantments/${ench_array.ench[0]}\n`;

			if (is_vanilla) {
				// COMBINING: load vanilla max level (all ench in one file)
				maxlvl_load += "scoreboard players set #" + ench_array.ench[0] + " powerench " + ench_array.max_lvl + "\n"

				// COMBINING: Enchant
				pack_folder.file("functions/combining/enchantments/" + ench_array.ench[0] + ".mcfunction", `#get levels\nexecute store result score #first_combine powerench run data get entity @s Item.tag.PoweredEnchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\nexecute store result score #second_combine powerench as @e[tag=powerench_combine_second,distance=..1,limit=1] run data get entity @s Item.tag.PoweredEnchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n\n#set level\nexecute if score #first_combine powerench <= #second_combine powerench run scoreboard players operation #final_combine powerench = #second_combine powerench\nexecute if score #first_combine powerench = #second_combine powerench run scoreboard players add #final_combine powerench 1\nexecute if score #first_combine powerench > #second_combine powerench run scoreboard players set #final_combine powerench -1\nexecute if score #first_combine powerench >= #${ench_array.ench[0]} powerench run scoreboard players set #final_combine powerench -1\nfunction #powerench:combining/${ench_array.ench[0]}\n\n#set ench level and finish\nexecute if score #final_combine powerench matches 1.. store result entity @s Item.tag.PoweredEnchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl short 1 run scoreboard players get #final_combine powerench\nexecute if score #final_combine powerench matches 1.. run tag @e[tag=powerench_combine_second,distance=..1,limit=1] add powerench_combine_remove`);
			}
			else {
				pack_folder.file("functions/combining/enchantments/" + ench_array.ench[0] + ".mcfunction", `#get levels\nexecute store result score #first_combine powerench run data get entity @s Item.tag.PoweredEnchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\nexecute store result score #second_combine powerench as @e[tag=powerench_combine_second,distance=..1,limit=1] run data get entity @s Item.tag.PoweredEnchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n\n#set level\nexecute if score #first_combine powerench <= #second_combine powerench run scoreboard players operation #final_combine powerench = #second_combine powerench\nexecute if score #first_combine powerench = #second_combine powerench run scoreboard players add #final_combine powerench 1\nexecute if score #first_combine powerench > #second_combine powerench run scoreboard players set #final_combine powerench -1\nexecute if score #first_combine powerench matches ${ench_array.max_lvl}.. run scoreboard players set #final_combine powerench -1\nfunction #powerench:combining/${ench_array.ench[0]}\n\n#set ench level and finish\nexecute if score #final_combine powerench matches 1.. store result entity @s Item.tag.PoweredEnchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl short 1 run scoreboard players get #final_combine powerench\nexecute if score #final_combine powerench matches 1.. run tag @e[tag=powerench_combine_second,distance=..1,limit=1] add powerench_combine_remove`);

				// COMBINING: Lore (all ench in one file)
				var max_lvl = parseInt(ench_array.max_lvl);
				if (max_lvl == 1) {
					comb_lore += `data modify entity @s[nbt={Item:{tag:{PoweredEnchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_array.title[tr_code]}","color":"gray","italic":false}'\n\n`;
				}
				else {
					for (var j = 0; j < max_lvl; j++) {
						var lvl = convertToRoman(j + 1); // in app.js
						comb_lore += `data modify entity @s[nbt={Item:{tag:{PoweredEnchantments:[{id:"minecraft:${ench_array.ench[0]}",lvl:${j + 1}s}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_array.title[tr_code]} ${lvl}","color":"gray","italic":false}'\n`;
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

	// GIVE custom enchantments
	pack_folder.file("functions/give/all.mcfunction", giveall_function);

	// pack.mcmeta
	zip.file("pack.mcmeta", '{"pack": {"pack_format": ' + selected_version.dp + ',"description": "Powered Enchanting Data Pack by CMD-Golem"}}');
	zip.file("Pack ID.txt", pack_id);

	document.getElementById("progress_action").innerHTML = "Creating ZIP file"
	zip.generateAsync({type:"base64"}, function updateCallback(metadata) {
		progress_bar.style.width = metadata.percent + "%";
	}).then(function (content) {
		closeModal();
		preventScroll(false); // footer.js

		var link = document.createElement('a');
		link.download = "[" + selected_version.name + "] Powered Enchanting Datapack v" + code_version + ".zip";
		link.href = "data:application/zip;base64," + content;
		link.click();

		// Counter
		if (already_download != true) {
			already_download = true;
	
			fetch(`/.netlify/functions/update/datapacks/320699416718606924`); // normal counter
			fetch(`/.netlify/functions/version/${select_version.db}`); // version statistic
			fetch(`/.netlify/functions/update/powered_enchanting/${selected_edition_db}`); // edition statistic
		}
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

	var inserted_content = "";
	// if (selected_version.id == ) {
	// 	inserted_content = "<button onclick='generate(true)' style='margin-right:10px; margin-bottom:20px; border: 2px solid #cccccc;'>Download Preview Version of this Data Pack with improved Book Enchanting</button><br>";
	// }

	var modal_text = document.createElement("div");
	modal_text.classList.add("modal_text");
	modal_text.classList.add("center");
	modal_text.innerHTML = `
	<div class="modal_padding_box">
		<h2>Download</h2>
		<hr>
		<p>It's highly recommended to use the Resource Pack, but not necessary.</p>
		${inserted_content}
		<button onclick="generate()" style="margin-right:10px; border: 2px solid #A10000;">Download Data Pack</button><button onclick="downloadResourcePack()">Download Resource Pack</button><br>
		<!--<button onclick="loadUpdateInfo()">Click here if you want to update the pack</button><br>-->
		<button onclick="closeModal()" style="margin-top:50px;">Close</button>
	</div>`;
	modal_box.appendChild(modal_text);

	preventScroll(true); // footer.js
}

// check pack id
function generatePackId(sel_article) {	
	pack_id = pack_id_load;

	for (var i = 0; i < sel_article.length; i++) {
		packId(sel_article[i]);
	}
}

// update info
function loadUpdateInfo() {
	closeModal();

	var modal_text = document.createElement("div");
	modal_text.classList.add("modal_text");
	modal_text.classList.add("center");
	modal_text.innerHTML = `
	<div class="modal_padding_box">
		<h2>Update Info</h2>
		<hr>
		<p>If you are currently using an old version of the Data Pack and want to update to the new one, you need to install the Compatibility Data Pack.<br>
		This data pack updates all your tools to be compatible with the new system.</p>
		<p>The update of the tool is done when it is in the inventory of a player. When you are sure that all items with custom enchantments have been updated, you can remove the pack.</p>
		<a class="button disable_link" rel="nofollow" href="https://drive.google.com/uc?export=download&id=1Zc9NPfF6Eh4SEGdwrU5XA335R3kQQa-w">Download Updater Data Pack</a><br>
		<button onclick="closeModal(); loadDownloadModal();" style="margin-top:50px;">Back</button>
	</div>`;
	modal_box.appendChild(modal_text);

	preventScroll(true); // footer.js
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