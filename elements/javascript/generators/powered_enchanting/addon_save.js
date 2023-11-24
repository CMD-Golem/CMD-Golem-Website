var ench_is_vanilla = 0;
var already_download = false;
var progress_bar = document.getElementById("progress_bar");

async function generate() {
	var article = document.getElementsByTagName("article");
	var datapack_name = document.getElementsByClassName("datapack_name")[0].value;

	if (datapack_name.length == 0) {
		inputError(0);
		return;
	}

	var comb_lore = "";
	var enchanting = "";
	var adv_enchanting = "";
	var comb_book = "";
	var give_function = "";
	var comb_id = []; // comp_items_key
	var comb_detect = [];
	var incomp_id = [];
	var incomp_detect = [];
	var namespace = "minecraft";

	//zip
	var zip = new JSZip();
	// Set folderpaths
	var pack_folder = zip.folder("data/" + datapack_name);
	var powerench_folder = zip.folder("data/powerench");

	// ###########################################################
	// load dynamic content
	for (var i = 0; i < article.length; i++) {
		var ench = article[i];

		// ENCHANTING (all ench and all adv ench in one file)
		var ench_chance = ench.getElementsByClassName("ench_chance")[0].value;
		var is_advanced = ench.getElementsByClassName("ench_adv")[0].checked;
		var ench_maxlvl = ench.getElementsByClassName("ench_maxlvl")[0].value; // ench_array.max_lvl
		var ench_name = ench.getElementsByClassName("ench_name")[0].value; // ench_array.title
		var ench_id = ench.getElementsByClassName("ench_id")[0].value; // ench_array.ench[0]

		if (ench_id.length == 0 || ench_name.length == 0 || ench_maxlvl.length == 0) {
			inputError(1);
			return;
		}

		// GIVE function for custom enchantments
		give_function += `\ngive @s minecraft:enchanted_book{PoweredEnchanting:[{id:"${namespace}:${ench_id}",lvl:1s}],Enchantments:[{id:"${namespace}:${ench_id}",lvl:1s}],display:{Lore:['{"text":"${ench_name}","color":"gray","italic":false}']}}`

		var ench_is_adv = 0;
		if (is_advanced) {var ench_is_adv = 1;}

		var ench_ench = `execute if predicate powerench_main:enchanting/chance${ench_chance} run summon item ~ ~ ~ {Tags:["powerench_enchantment"],Item:{id:"minecraft:enchanted_book",Count:1b,tag:{vanilla:${ench_is_vanilla}b,advanced_ench:${ench_is_adv}b,max_lvl:${ench_maxlvl}b,name:"${ench_name}",powerench:[{id:"${namespace}:${ench_id}",lvl:1s}]}}}\n`

		if (is_advanced) {
			adv_enchanting += ench_ench;
		}
		else {
			enchanting += ench_ench;
		}
			
		// COMBINING: incompatible enchantments !!!!!! Not same as in save.js of download !!!!!!!
		var ench_incomp_el = ench.getElementsByClassName("ench_comp")[0];
		setTagged(ench_incomp_el.getElementsByTagName("input")[0], false); // addon_app.js
		var ench_incomp = ench_incomp_el.getElementsByClassName("tagged_item");
		if (ench_incomp.length != 0) {
			// add new enchantment to incompatible array
			if (incomp_id.indexOf(ench_id) == -1) {
				var pos_new_id = incomp_id.push(ench_id) - 1;
			}
			else {
				var pos_new_id = incomp_id.indexOf(ench_id);
			}

			for (var j = 0; j < ench_incomp.length; j++) {
				// add incompatible for new enchantments
				if (incomp_detect[pos_new_id] == undefined) {incomp_detect[pos_new_id] = "";}
				incomp_detect[pos_new_id] += 'execute unless score #final_combine powerench matches -1 if entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:' + ench_incomp[j].innerHTML + '"}]}}}] run scoreboard players set #final_combine powerench -1\n';

				// create array with all incompatible enchantments
				if (incomp_id.indexOf(ench_incomp[j]) == -1) {
					var pos_id = incomp_id.push(ench_incomp[j].innerHTML) - 1;
				}
				else {
					var pos_id = incomp_id.indexOf(ench_incomp[j].innerHTML);
				}

				if (incomp_detect[pos_id] == undefined) {incomp_detect[pos_id] = "";}
				incomp_detect[pos_id] += 'execute unless score #final_combine powerench matches -1 if entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:' + ench_id + '"}]}}}] run scoreboard players set #final_combine powerench -1\n';

			}
		}

		// COMBINING: Detect Items (same tools)
		var ench_items_el = ench.getElementsByClassName("ench_items")[0];
		setTagged(ench_items_el.getElementsByTagName("input")[0], false); // addon_app.js
		var ench_items_raw = ench_items_el.getElementsByClassName("tagged_item");

		if (ench_items_raw.length == 0) {
			inputError(2);
			return;
		}

		for (var j = 0; j < ench_items_raw.length; j++) {
			if (comb_id.indexOf(ench_items_raw[j]) == -1) {
				var pos_id = comb_id.push(ench_items_raw[j].innerHTML) - 1;
			}
			else {
				var pos_id = comb_id.indexOf(ench_items_raw[j].innerHTML);
			}
			if (comb_detect[pos_id] == undefined) {comb_detect[pos_id] = "";}
			comb_detect[pos_id] += `execute if entity @e[distance=..1,tag=powerench_combine_second,nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_id}"}]}}}] run function ${datapack_name}:combining/enchantments/${ench_id}\n`;
		}
		comb_book += `execute if entity @e[distance=..1,tag=powerench_combine_second,nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_id}"}]}}}] run function ${datapack_name}:combining/enchantments/${ench_id}\n`;

		pack_folder.file("functions/combining/enchantments/" + ench_id + ".mcfunction", `#get levels\nexecute store result score #first_combine powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_id}"}].lvl\nexecute store result score #second_combine powerench as @e[tag=powerench_combine_second,distance=..1,limit=1] run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_id}"}].lvl\n\n#set level\nexecute if score #first_combine powerench <= #second_combine powerench run scoreboard players operation #final_combine powerench = #second_combine powerench\nexecute if score #first_combine powerench = #second_combine powerench run scoreboard players add #final_combine powerench 1\nexecute if score #first_combine powerench > #second_combine powerench run scoreboard players set #final_combine powerench -1\nexecute if score #first_combine powerench matches ${ench_maxlvl}.. run scoreboard players set #final_combine powerench -1\nfunction #powerench:combining/${ench_id}\n\n#set ench level and finish\nexecute if score #final_combine powerench matches 1.. store result entity @s Item.tag.Enchantments[{id:"minecraft:${ench_id}"}].lvl short 1 run scoreboard players get #final_combine powerench\nexecute if score #final_combine powerench matches 1.. run tag @e[tag=powerench_combine_second,distance=..1,limit=1] add powerench_combine_remove`);

		// COMBINING: Lore (all ench in one file)
		var max_lvl = parseInt(ench_maxlvl);
		if (max_lvl == 1) {
			comb_lore += `data modify entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_id}"}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_name}","color":"gray","italic":false}'\n\n`;
		}
		else {
			for (var j = 0; j < max_lvl; j++) {
				var lvl = convertToRoman(j + 1);
				comb_lore += `data modify entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_id}",lvl:${j + 1}s}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_name} ${lvl}","color":"gray","italic":false}'\n`;
				if (j == max_lvl - 1) {
					comb_lore += "\n";
				}
			}
		}
	}
		
	

	//#################################################################################################
	// enchanting files
	if (adv_enchanting != "") {
		powerench_folder.file("tags/functions/enchanting/adv_enchanting.json", '{"values": ["' + datapack_name + ':enchanting/adv_enchantments"]}');
		pack_folder.file("functions/enchanting/adv_enchantments.mcfunction", adv_enchanting);
	}
	if (enchanting != "") {
		powerench_folder.file("tags/functions/enchanting/enchanting.json", '{"values": ["' + datapack_name + ':enchanting/enchantments"]}');
		pack_folder.file("functions/enchanting/enchantments.mcfunction", enchanting);
	}

	// functions
	powerench_folder.file("tags/functions/tick.json", '{"values": ["' + datapack_name + ':tick"]}');
	pack_folder.file("functions/tick.mcfunction", "#This function is executed every tick\n");

	powerench_folder.file("tags/functions/load.json", '{"values": ["' + datapack_name + ':load"]}');
	pack_folder.file("functions/load.mcfunction", "#This function is executed on reload\n");

	// COMBINING: incompatible enchantments !!!!!! Not same as in save.js of download !!!!!!!
	for (var i = 0; i < incomp_id.length; i++) {
		powerench_folder.file("tags/functions/combining/" + incomp_id[i] + ".json", '{"values": ["' + datapack_name + ':combining/incompatible/' + incomp_id[i] + '"]}');
		pack_folder.file("functions/combining/incompatible/" + incomp_id[i] + ".mcfunction", incomp_detect[i]);
	}

	// COMBINING: Lore
	powerench_folder.file("tags/functions/lore.json", '{"values": ["' + datapack_name + ':combining/lore"]}');
	pack_folder.file("functions/combining/lore.mcfunction", comb_lore);

	// COMBINING: Detect Items
	powerench_folder.file("tags/functions/items/book.json", '{"values": ["' + datapack_name + ':combining/items/book"]}');
	pack_folder.file("functions/combining/items/book.mcfunction", comb_book);
	for (var i = 0; i < comb_detect.length; i++) {
		if (comb_detect[i] != "") {
			pack_folder.file("functions/combining/items/" + comb_id[i] + ".mcfunction", comb_detect[i]);
			powerench_folder.file("tags/functions/items/" + comb_id[i] + ".json", '{"values": [{"id":"' + datapack_name + ':combining/items/' + comb_id[i] + '", "required":false}]}');
		}
	}

	// GIVE custom enchantments
	pack_folder.file("functions/give.mcfunction", give_function);
	powerench_folder.file("tags/functions/give.json", '{"values": ["' + datapack_name + ':give"]}');

	// pack.mcmeta
	zip.file("pack.mcmeta", '{"pack": {"pack_format": ' + el_version.value + ',"description": "Custom Enchantments Pack for Powered Enchanting Data Pack by CMD-Golem"}}');

	progress_bar.style.display = "block";
	preventScroll(true); // footer.js
	
	zip.generateAsync({type:"base64"}, function updateCallback(metadata) {
		progress_bar.style.width = metadata.percent + "%";
	}).then(function (content) {
		progress_bar.style.display = "none";
		preventScroll(false); // footer.js

		var link = document.createElement('a');
		link.download = "Custom Enchantments Pack for Powered Enchanting Datapack.zip";
		link.href = "data:application/zip;base64," + content;
		link.click();

		// Count download
		if (already_download != true) {
			already_download = true;
			fetch(`/.netlify/functions/update/special/382300690013225026`);
		}
		else {
			console.log("Already downloaded");
		}
	});
}

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

// show error if inputs empty
function inputError(error_num) {
	if (error_num == 0) {
		alert("Please enter a Data Pack Id");
	}
	else if (error_num == 1) {
		alert("Please fill in all input fields!\nOnly the Incompatible Enchantment Ids input can be left empty.");
	}
	else if (error_num == 2) {
		alert("Please select at least one Tool or Armor, where your Enchantments can be enchanted on.");
	}
}