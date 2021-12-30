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


// Set functions folderpaths
var functions_folder = zip.folder("data/" + datapack_name + "/functions");

var combining_folder = functions_folder.folder("combining");
var comb_items_folder = combining_folder.folder("items");
var comb_enchant_folder = combining_folder.folder("enchantments");

var enchanting_folder = functions_folder.folder("enchanting");
var enchantments_folder = functions_folder.folder("enchantments");

// Set tags folderpaths
var tags_folder = zip.folder("data/minecraft/tags/functions/powerench");


// ###########################################################
// Generate
function generate() {
	var sel_article = document.getElementsByClassName("selected");

	//for (var i = 0; i < sel_article.length; i++) {
		var i = 0;
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
		if (ench_array.max_lvl == 1) {
			comb_lore = comb_lore + `data modify entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_array.title}","color":"gray","italic":false}'\n\n`;
		}
		else {
			for (var j = 1; j <= ench_array.max_lvl; j++) {
				var lvl = convertToRoman(j); // in app.js
				comb_lore = comb_lore + `data modify entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_array.title} ${lvl}","color":"gray","italic":false}'\n`;
				if (j = ench_array.max_lvl) {
					comb_lore = comb_lore + "\n";
				}
			}
		}

		// COMBINING: Detect Items (same tools)
		for (var j = 0; j < ench_array.comp_itemsId.length; j++) {
			var pos_id = ench_array.comp_itemsId[j];
			comb_detect[pos_id] = comb_detect[pos_id] + `execute at @e[type=item,distance=..1,limit=1,tag=!powerench_combine_detect,nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] if entity @s[tag=powerench_combine_detect] run function ${datapack_name}:combining/enchantments${ench_array.ench[0]}\n`;
		}

		// COMBINING: Enchant
		var ench_enchant = `#get level and max level of book\nexecute as @e[sort=nearest,limit=1] store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#get level of tool\nexecute store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#test of both have the same ench level and add one level\nexecute if score @e[sort=nearest,limit=1] powerench = @s powerench run tag @s add powerench_combine_same\nexecute if score @e[sort=nearest,limit=1] powerench = @s powerench run scoreboard players add @s powerench 1\n#test if ench level of book is higher than ench level of tool and set ench level of tool to the of book\nexecute if entity @s[tag=!powerench_combine_same] if score @e[sort=nearest,limit=1] powerench > @s powerench run scoreboard players operation @s powerench = @e[sort=nearest,limit=1] powerench\n#test if max ench level is smaller than ench level of tool and set ench level of tool to max level\nexecute if score @e[sort=nearest,limit=1] powerench matches ${ench_array.max_lvl}.. run scoreboard players set @s powerench ${ench_array.max_lvl}\n#test if tool hasn't ench and add ench\nexecute unless entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] run data modify entity @s Item.tag.Enchantments append from entity @e[limit=1,sort=nearest] Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}] \n#set ench level\nexecute store result entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl short 1 run scoreboard players get @s powerench\n#finish book\ntag @e[sort=nearest,limit=1] add powerench_combine_remove`;

		// 
		//}
	console.log(ench_lore)
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
			data_folder.file("test.txt", "Test");
			
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

