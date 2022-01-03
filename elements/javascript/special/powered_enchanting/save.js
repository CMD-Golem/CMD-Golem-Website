// Define variables
var datapack_name = "powerench"; // define data pack namespace
var pack_version = "3"; // define version of data pack
var pack_id_load = "1-"; // define version of pack id
var pack_id;

// all 0
// helmet 1, chestplate 2, leggings 3, boots 4
// sword 5, pickaxe 6, axe 7, shovel 8, hoe 9
// bow 10, carrot_on_a_stick 11, crossbow 12, elytra 13, fishing_rod 14, flint_and_steal 15, shears 16, shield 17, trident 18
// var comb_detect_items = ["all", "armor/helmet", "armor/chestplate", "armor/leggings", "armor/boots", "tools/sword", "tools/pickaxe", "tools/axe", "tools/shovel", "tools/hoe", "others/bow", "others/carrot_on_a_stick", "others/crossbow", "others/elytra", "others/fishing_rod", "others/flint_and_steal", "others/shears", "others/shield", "others/trident"];
var comb_detect_items = ["all", "helmet", "chestplate", "leggings", "boots", "sword", "pickaxe", "axe", "shovel", "hoe", "bow", "carrot_on_a_stick", "crossbow", "elytra", "fishing_rod", "flint_and_steal", "shears", "shield", "trident"];

// ###########################################################
// Generate
async function generate() {
	var sel_article = document.querySelectorAll(".selected,.vanilla");

	var comb_lore = "";
	var enchanting = "";
	var adv_enchanting = "";
	var comb_detect = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

	pack_id = pack_id_load;

	//zip
	var zip = new JSZip();
	// Set folderpaths
	var pack_folder = zip.folder("data/" + datapack_name);
	var tags_folder = zip.folder("data/minecraft/tags/functions/powerench");

	// load main pack
	JSZipUtils.getBinaryContent("../../elements/files/powered_enchanting/main_pack.zip", function(err, data) {
		if (err) { throw err; }
		zip.loadAsync(data);
	});

	// ###########################################################
	// load dynamic content
	for (var i = 0; i < sel_article.length; i++) {
		var ench = sel_article[i];
		var ench_array = article_array[ench.getAttribute("data-arrayId")];
		var is_vanilla = ench.classList.contains("vanilla");

		// generate pack id
		packId(ench);
		console.log("Pack Id: " + pack_id);

		// load files
		// if (!is_vanilla) {
		// 	JSZipUtils.getBinaryContent("../../elements/files/powered_enchanting/" + ench_array.ench[0] + ".zip", function(err, data) {
		// 		if (err) { throw err; }
		// 		pack_folder.loadAsync(data);
		// 	});
		// }

		if (!ench.classList.contains("nooptions")) {
			// ENCHANTING (all ench and all adv ench in one file) !#! vanilla:0b notwendig?
			if (ench.classList.contains("selected")) {
				var ench_chance = ench.getAttribute("data-chance")
				var ench_ench = `execute if predicate powerench:enchanting/chance${ench_chance} run summon item ~ ~ ~ {Item:{id:"minecraft:enchanted_book",Count:1b,tag:{powerench_ench:1b,vanilla:0b,display:{Name:'{"text":"${ench_array.title}","italic":false,"color":"aqua"}',Lore:['{"text":"${ench_array.title}","color":"gray","italic":false}']},powerench:[{id:"minecraft:${ench_array.ench[0]}",lvl:1s}]}}}\n`;

				if (ench.classList.contains("advanced_ench")) {
					adv_enchanting = adv_enchanting + ench_ench;
				}
				else {
					enchanting = enchanting + ench_ench;
				}
			}

			// COMBINING: Detect Items (same tools)
			if (!ench.classList.contains("ignore_incomp")) {
				var incompatible = "";
				for (var j = 0; j < ench_array.ench.length; j++) {
					if (j != 0) {
						incompatible = incompatible + ' if entity @s[nbt=!{Item:{tag:{Enchantments:[{id:"minecraft:' + ench_array.ench[j] + '"}]}}}]';
					} 
				}
			}

			for (var j = 0; j < ench_array.comp_itemsId.length; j++) {
				var pos_id = ench_array.comp_itemsId[j];
				comb_detect[pos_id] = comb_detect[pos_id] + `execute if entity @e[distance=..1,tag=powerench_combine_second,nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}]${incompatible} run function ${datapack_name}:combining/enchantments/${ench_array.ench[0]}\n`;
			}

			if (is_vanilla) {
				// COMBINING: Enchant
				pack_folder.file("functions/combining/enchantments/" + ench_array.ench[0] + ".mcfunction", `#get level and max level of book\nexecute as @e[sort=nearest,limit=1] store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#get level of tool\nexecute store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#test of both have the same ench level and add one level\nexecute if score @e[sort=nearest,limit=1] powerench = @s powerench run tag @s add powerench_combine_same\nexecute if score @e[sort=nearest,limit=1] powerench = @s powerench run scoreboard players add @s powerench 1\n#test if ench level of book is higher than ench level of tool and set ench level of tool to the of book\nexecute if entity @s[tag=!powerench_combine_same] if score @e[sort=nearest,limit=1] powerench > @s powerench run scoreboard players operation @s powerench = @e[sort=nearest,limit=1] powerench\n#test if max ench level is smaller than ench level of tool and set ench level of tool to max level\nexecute if score @e[sort=nearest,limit=1] powerench >= #${ench_array.ench[0]} powerench run scoreboard players operation @s powerench = #${ench_array.ench[0]} powerench\n#test if tool hasn't ench and add ench\nexecute unless entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] run data modify entity @s Item.tag.Enchantments append from entity @e[limit=1,sort=nearest] Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}] \n#set ench level\nexecute store result entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl short 1 run scoreboard players get @s powerench\n#finish book\ntag @e[sort=nearest,limit=1] add powerench_combine_remove`);
			}
			else {
				pack_folder.file("functions/combining/enchantments/" + ench_array.ench[0] + ".mcfunction", `#get level and max level of book\nexecute as @e[sort=nearest,limit=1] store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#get level of tool\nexecute store result score @s powerench run data get entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl\n#test of both have the same ench level and add one level\nexecute if score @e[sort=nearest,limit=1] powerench = @s powerench run tag @s add powerench_combine_same\nexecute if score @e[sort=nearest,limit=1] powerench = @s powerench run scoreboard players add @s powerench 1\n#test if ench level of book is higher than ench level of tool and set ench level of tool to the of book\nexecute if entity @s[tag=!powerench_combine_same] if score @e[sort=nearest,limit=1] powerench > @s powerench run scoreboard players operation @s powerench = @e[sort=nearest,limit=1] powerench\n#test if max ench level is smaller than ench level of tool and set ench level of tool to max level\nexecute if score @e[sort=nearest,limit=1] powerench matches ${ench_array.max_lvl}.. run scoreboard players set @s powerench ${ench_array.max_lvl}\n#test if tool hasn't ench and add ench\nexecute unless entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] run data modify entity @s Item.tag.Enchantments append from entity @e[limit=1,sort=nearest] Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}] \n#set ench level\nexecute store result entity @s Item.tag.Enchantments[{id:"minecraft:${ench_array.ench[0]}"}].lvl short 1 run scoreboard players get @s powerench\n#finish book\ntag @e[sort=nearest,limit=1] add powerench_combine_remove`);
				
				// COMBINING: Lore (all ench in one file)
				var max_lvl = parseInt(ench_array.max_lvl);
				if (max_lvl == 1) {
					comb_lore = comb_lore + `data modify entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_array.title}","color":"gray","italic":false}'\n\n`;
				}
				else {
					for (var j = 0; j < max_lvl; j++) {
						var lvl = convertToRoman(j + 1); // in app.js
						comb_lore = comb_lore + `data modify entity @s[nbt={Item:{tag:{Enchantments:[{id:"minecraft:${ench_array.ench[0]}"}]}}}] Item.tag.display.Lore insert 0 value '{"text":"${ench_array.title} ${lvl}","color":"gray","italic":false}'\n`;
						if (j == max_lvl - 1) {
							comb_lore = comb_lore + "\n";
						}
					}
				}
			}
		}
	}

	//#################################################################################################
	// enchanting files
	if (adv_enchanting != "") {
		tags_folder.file("enchanting/adv_enchanting.json", '{"values": ["#minecraft:powerench/enchanting/enchanting", "' + datapack_name + ':enchanting/adv_enchantments"]}');
		pack_folder.file("functions/enchanting/adv_enchantments.mcfunction", adv_enchanting);
	}
	if (enchanting != "") {
		tags_folder.file("enchanting/enchanting.json", '{"values": ["' + datapack_name + ':enchanting/enchantments"]}');
		pack_folder.file("functions/enchanting/enchantments.mcfunction", enchanting);
	}

	// COMBINING: Lore
	tags_folder.file("lore.json", '{"values": ["' + datapack_name + ':combining/lore"]}');
	pack_folder.file("functions/combining/lore.mcfunction", comb_lore);

	// COMBINING: Detect Items !#! tags aren't combined
	for (var i = 0; i < comb_detect.length; i++) {
		var comb_detect_tag = "";
		if (comb_detect[i] != "") {
			comb_detect_tag = ',{"id":"' + datapack_name + ':combining/items/' + comb_detect_items[i] + '", "required":false}'
			pack_folder.file("functions/combining/items/"+ comb_detect_items[i] + ".mcfunction", comb_detect[i]);
		}
		if (i != 0) {
			tags_folder.file("items/" + comb_detect_items[i] + ".json", '{"values": [{"id":"#minecraft:powerench/items/all", "required":false}' + comb_detect_tag + ']}');
		}
		else if (comb_detect[i] != "" && i == 0) {
			tags_folder.file("items/" + comb_detect_items[i] + ".json", '{"values": ["' + datapack_name + ':combining/items/all"]}');
		}
	}

	// pack.mcmeta
	var version = document.getElementById("version").value;

	zip.file("pack.mcmeta", '{"pack": {"pack_format": ' + version + ',"description": "Powered Enchanting Datapack by CMD-Golem"}}');
	zip.file("Pack ID.txt", pack_id);
	
	// generate zip file
	zip.generateAsync({type:"base64"}).then(function (content) {
		// copy Load bar from nbt crafting
		var link = document.createElement('a');
		link.download = "[1.1" + version + "] Powered Enchanting Datapack v" + pack_version + ".zip";
		link.href = "data:application/zip;base64," + content;
		link.click();
	});
}


// var progress_bar = document.getElementById("progress_bar");
// progress_bar.style.display = "block";
// disableScroll();

// zip.generateAsync({type:"base64"}, function updateCallback(metadata) {
// document.getElementById("bar").style.width = metadata.percent + "%";
// })
// .then(function (content) {
// progress_bar.style.display = "none";
// enableScroll()

// var link = document.createElement('a');
// link.download = "NBT-Crafting";
// link.href = "data:application/zip;base64," + content;
// link.click();

// // Counter
// });



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
function getPackId() {
	pack_id = pack_id_load;
	var sel_article = document.getElementsByClassName("selected");
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