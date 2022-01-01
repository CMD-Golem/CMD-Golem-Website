var zip = new JSZip();

// JSZipUtils.getBinaryContent("test.zip", function(err, data) {
// 	if (err) { throw err; }
// 	zip.loadAsync(data).then(function (zip) {
		
// 	});
// });

// Define variables
var datapack_name = "test"; // !#! define
var comb_lore = "";
var enchanting = "";
var adv_enchanting = "";

// all 0
// helmet 1, chestplate 2, leggings 3, boots 4
// sword 5, pickaxe 6, axe 7, shovel 8, hoe 9
// bow 10, carrot_on_a_stick 11, crossbow 12, elytra 13, fishing_rod 14, flint_and_steal 15, shears 16, shield 17, trident 18
var comb_detect = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
var comb_detect_items = ["all", "armor/helmet", "armor/chestplate", "armor/leggings", "armor/boots", "tools/sword", "tools/pickaxe", "tools/axe", "tools/shovel", "tools/hoe", "others/bow", "others/carrot_on_a_stick", "others/crossbow", "others/elytra", "others/fishing_rod", "others/flint_and_steal", "others/shears", "others/shield", "others/trident"];


// Set folderpaths
var functions_folder = zip.folder("data/" + datapack_name + "/functions");
var tags_folder = zip.folder("data/minecraft/tags/functions/powerench");


// ###########################################################
// Generate
function generate() {
	var sel_article = document.getElementsByClassName("selected");

	for (var i = 0; i < sel_article.length; i++) {
		var ench = sel_article[i];
		var ench_array = article_array[ench.getAttribute("data-arrayId")];

		// ENCHANTING (all ench and all adv ench in one file) !#! vanilla:0b notwendig? and incompatible ench
		var ench_chance = ench.getAttribute("data-chance")
		var ench_ench = `execute if predicate powerench:enchanting/chance${ench_chance} run summon item ~ ~ ~ {Item:{id:"minecraft:enchanted_book",Count:1b,tag:{powerench_ench:1b,vanilla:0b,display:{Name:'{"text":"${ench_array.title}","italic":false,"color":"aqua"}',Lore:['{"text":"${ench_array.title}","color":"gray","italic":false}']},powerench:[{id:"minecraft:${ench_array.ench[0]}",lvl:1s}]}}}\n`;

		if (ench.classList.contains("advanced_ench")) {
			adv_enchanting = adv_enchanting + ench_ench;
		}
		else {
			enchanting = enchanting + ench_ench;
		}

		// COMBINING: Lore (all ench in one file)
		if (!ench.classList.contains("vanilla")) {
			var max_lvl = parseInt(ench_array.max_lvl);
			if (max_lvl == 1) {
				comb_lore = comb_lore + `data modify entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_array.title}","color":"gray","italic":false}'\n\n`;
			}
			else {
				for (var j = 0; j < max_lvl; j++) {
					console.log(max_lvl)
					var lvl = convertToRoman(j + 1); // in app.js
					comb_lore = comb_lore + `data modify entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_array.title} ${lvl}","color":"gray","italic":false}'\n`;
					if (j == max_lvl - 1) {
						comb_lore = comb_lore + "\n";
					}
				}
			}
		}

		// COMBINING: Detect Items (same tools)
		for (var j = 0; j < ench_array.comp_itemsId.length; j++) {
			var pos_id = ench_array.comp_itemsId[j];
			comb_detect[pos_id] = comb_detect[pos_id] + `execute at @e[type=item,distance=..1,limit=1,tag=!powerench_combine_detect,nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] if entity @s[tag=powerench_combine_detect] run function ${datapack_name}:combining/enchantments/${ench_array.ench[0]}\n`;
		}

		// COMBINING: Enchant
		functions_folder.file("combining/enchantments/" + ench_array.ench[0] + ".mcfunction", `#get level and max level of book\nexecute as @e[sort=nearest,limit=1] store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#get level of tool\nexecute store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#test of both have the same ench level and add one level\nexecute if score @e[sort=nearest,limit=1] powerench = @s powerench run tag @s add powerench_combine_same\nexecute if score @e[sort=nearest,limit=1] powerench = @s powerench run scoreboard players add @s powerench 1\n#test if ench level of book is higher than ench level of tool and set ench level of tool to the of book\nexecute if entity @s[tag=!powerench_combine_same] if score @e[sort=nearest,limit=1] powerench > @s powerench run scoreboard players operation @s powerench = @e[sort=nearest,limit=1] powerench\n#test if max ench level is smaller than ench level of tool and set ench level of tool to max level\nexecute if score @e[sort=nearest,limit=1] powerench matches ${ench_array.max_lvl}.. run scoreboard players set @s powerench ${ench_array.max_lvl}\n#test if tool hasn't ench and add ench\nexecute unless entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] run data modify entity @s Item.tag.Enchantments append from entity @e[limit=1,sort=nearest] Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}] \n#set ench level\nexecute store result entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl short 1 run scoreboard players get @s powerench\n#finish book\ntag @e[sort=nearest,limit=1] add powerench_combine_remove`);
	}

	//#################################################################################################
	// console.log(enchanting);
	// console.log(comb_lore);
	// console.log(comb_detect);


	// enchanting files
	if (adv_enchanting != "") {
		tags_folder.file("enchanting/adv_enchanting.json", '{"values": ["#minecraft:powerench/enchanting/enchanting", "' + datapack_name + ':enchanting/adv_enchantments"]}');
		functions_folder.file("enchanting/adv_enchantments.mcfunction", adv_enchanting);
	}
	if (enchanting != "") {
		tags_folder.file("enchanting/enchanting.json", '{"values": ["' + datapack_name + ':enchanting/enchantments"]}');
		functions_folder.file("enchanting/enchantments.mcfunction", enchanting);
	}

	// COMBINING: Lore
	tags_folder.file("lore.json", '{"values": ["' + datapack_name + ':combining/lore"]}');
	functions_folder.file("combining/lore.mcfunction", comb_lore);

	// COMBINING: Detect Items
	tags_folder.file("book.json", '{"values": [{"id":"#minecraft:powerench/armor/boots", "required":false},{"id":"#minecraft:powerench/armor/leggings", "required":false},{"id":"#minecraft:powerench/armor/chestplate", "required":false},{"id":"#minecraft:powerench/armor/helmet", "required":false},{"id":"#minecraft:powerench/others/bow", "required":false},{"id":"#minecraft:powerench/others/carrot_on_a_stick", "required":false},{"id":"#minecraft:powerench/others/crossbow", "required":false},{"id":"#minecraft:powerench/others/elytra", "required":false},{"id":"#minecraft:powerench/others/flint_and_steal", "required":false},{"id":"#minecraft:powerench/others/shears", "required":false},{"id":"#minecraft:powerench/others/shield", "required":false},{"id":"#minecraft:powerench/others/trident", "required":false},{"id":"#minecraft:powerench/others/fishing_rod", "required":false},{"id":"#minecraft:powerench/tools/axe", "required":false},{"id":"#minecraft:powerench/tools/sword", "required":false},{"id":"#minecraft:powerench/tools/hoe", "required":false},{"id":"#minecraft:powerench/tools/pickaxe", "required":false},{"id":"#minecraft:powerench/tools/shovel", "required":false}]}');

	for (var i = 0; i < comb_detect.length; i++) {
		if (comb_detect[i] != "") {
			console.log("executed for: " + comb_detect_items[i])
			tags_folder.file(comb_detect_items[i] + ".json", '{"values": ["' + datapack_name + ':combining/' + comb_detect_items[i] + '"]}');
			functions_folder.file("combining/"+ comb_detect_items[i] + ".mcfunction", comb_detect[i]);
		}
	}

	// pack.mcmeta
	var version = document.getElementById("version").value;

	zip.file("pack.mcmeta", '{"pack": {"pack_format": ' + version + ',"description": "Powered Enchanting Datapack by CMD-Golem"}}');
	
	zip.generateAsync({type:"base64"}).then(function (content) {
		// copy Load bar from nbt crafting
		var link = document.createElement('a');
		link.download = "[1.1" + version + "] Powered Enchanting Datapack v3.zip";
		link.href = "data:application/zip;base64," + content;
		link.click();
	});
}


// https://github.com/mikethedj4/WebDGap

function download_test() {
	JSZipUtils.getBinaryContent("test.zip", function(err, data) {
		if(err) {
			throw err;
		}
		
		var zip = new JSZip();
		zip.loadAsync(data).then(function (zip) {
			var data_folder = zip.folder("data");
			data_folder.file("max/test.txt", "Test\nTest");
			
			zip.generateAsync({type:"base64"}).then(function (content) {
				// copy Load bar from nbt crafting
				var link = document.createElement('a');
				link.download = "NBT-Crafting";
				link.href = "data:application/zip;base64," + content;
				link.click();
			});
		});
	});
}

