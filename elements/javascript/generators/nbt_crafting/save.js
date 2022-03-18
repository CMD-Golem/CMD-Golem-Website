var zip;

function downloadCheck() {
  zip = undefined;
  zip = new JSZip();

  var article = document.getElementsByTagName("article");
  var execute = false;

  var arr_recipe = [];
  var arr_advancement = [];
  var arr_function = [];
  var arr_tag = [];

  datapack_name = document.getElementsByClassName("datapack_name")[0].value;

  el_score = document.getElementsByClassName("score")[0];
  if (el_score.value == "") {score = el_score.placeholder;}
  else {score = el_score.value;}

  version = document.getElementsByClassName("version")[0].value

  for (var i = 0; i < article.length; i++) {
    var recipe_id = article[i].getElementsByClassName("recipe_id")[0].value;

    // Recipe
    el_recipe_folder = article[i].getElementsByClassName("recipe_folder")[0];
    if (el_recipe_folder.value == "") {recipe_folder = el_recipe_folder.placeholder;}
    else {recipe_folder = el_recipe_folder.value;}
    if (recipe_folder.includes("$") == true) {recipe_folder = recipe_folder.replace(/\u0024/g, recipe_id);}

    el_recipe_name = article[i].getElementsByClassName("recipe_name")[0];
    if (el_recipe_name.value == "") {recipe_name = el_recipe_name.placeholder;}
    else {recipe_name = el_recipe_name.value;}
    if (recipe_name.includes("$") == true) {recipe_name = recipe_name.replace(/\u0024/g, "");}

    // Advancement
    el_advancement_folder = article[i].getElementsByClassName("advancement_folder")[0];
    if (el_advancement_folder.value == "") {advancement_folder = el_advancement_folder.placeholder;}
    else {advancement_folder = el_advancement_folder.value;}
    if (advancement_folder.includes("$") == true) {advancement_folder = advancement_folder.replace(/\u0024/g, recipe_id);}

    el_advancement_name = article[i].getElementsByClassName("advancement_name")[0];
    if (el_advancement_name.value == "") {advancement_name = el_advancement_name.placeholder;}
    else {advancement_name = el_advancement_name.value;}
    if (advancement_name.includes("$") == true) {advancement_name = advancement_name.replace(/\u0024/g, "");}

    // Function Detect
    el_function_detect_folder = article[i].getElementsByClassName("function_detect_folder")[0];
    if (el_function_detect_folder.value == "") {function_detect_folder = el_function_detect_folder.placeholder;}
    else {function_detect_folder = el_function_detect_folder.value;}
    if (function_detect_folder.includes("$") == true) {function_detect_folder = function_detect_folder.replace(/\u0024/g, recipe_id);}

    el_function_detect_name = article[i].getElementsByClassName("function_detect_name")[0];
    if (el_function_detect_name.value == "") {function_detect_name = el_function_detect_name.placeholder;}
    else {function_detect_name = el_function_detect_name.value;}
    if (function_detect_name.includes("$") == true) {function_detect_name = function_detect_name.replace(/\u0024/g, "");}

    // Function Craft
    el_function_craft_folder = article[i].getElementsByClassName("function_craft_folder")[0];
    if (el_function_craft_folder.value == "") {function_craft_folder = el_function_craft_folder.placeholder;}
    else {function_craft_folder = el_function_craft_folder.value;}
    if (function_craft_folder.includes("$") == true) {function_craft_folder = function_craft_folder.replace(/\u0024/g, recipe_id);}

    el_function_craft_name = article[i].getElementsByClassName("function_craft_name")[0];
    if (el_function_craft_name.value == "") {function_craft_name = el_function_craft_name.placeholder;}
    else {function_craft_name = el_function_craft_name.value;}
    if (function_craft_name.includes("$") == true) {function_craft_name = function_craft_name.replace(/\u0024/g, "");}

    // Function Mass
    el_function_mass_folder = article[i].getElementsByClassName("function_mass_folder")[0];
    if (el_function_mass_folder.value == "") {function_mass_folder = el_function_mass_folder.placeholder;}
    else {function_mass_folder = el_function_mass_folder.value;}
    if (function_mass_folder.includes("$") == true) {function_mass_folder = function_mass_folder.replace(/\u0024/g, recipe_id);}

    el_function_mass_name = article[i].getElementsByClassName("function_mass_name")[0];
    if (el_function_mass_name.value == "") {function_mass_name = el_function_mass_name.placeholder;}
    else {function_mass_name = el_function_mass_name.value;}
    if (function_mass_name.includes("$") == true) {function_mass_name = function_mass_name.replace(/\u0024/g, "");}

    // Tag
    el_tag = article[i].getElementsByClassName("tag")[0];
    if (el_tag.value == "") {tag = el_tag.placeholder;}
    else {tag = el_tag.value;}

    // Item and Recipe
    nbt_item = article[i].getElementsByClassName("nbt_item")[0].value;
    recipe_text = article[i].getElementsByClassName("recipe_text")[0].value;
    
    try {
      // test json
      placeholder = JSON.parse(recipe_text).result.item;
      count = JSON.parse(recipe_text).result.count;
      execute = true;

      // Fill in needed Fields
      if (nbt_item == "" || recipe_text == "" || datapack_name == "") {
        confirm("You need to fill out all Fields which are marked with (needed)!");
        return;
      }

      folderPath();

      // test that each namespaces exists only once 1.
      arr_recipe.push(recipe_folder + recipe_name);
      arr_advancement.push(advancement_folder + advancement_name);
      arr_function.push(function_detect_folder + function_detect_name);
      arr_function.push(function_craft_folder + function_craft_name);
      arr_function.push(function_mass_folder + function_mass_name);
      arr_tag.push(tag);

      generateFile();
    }
    catch (e) {
      confirm("Your Recipe isn't correct!");
    }
  }

  // test that each namespaces exists only once 2.
  for (var j = 0; j < arr_tag.length; j++) {
    if (arr_tag.includes(arr_tag[j], j + 1) == true) {nameDuplicateTag(arr_tag[j]);}
  }

  for (var j = 0; j < arr_recipe.length; j++) {
    if (arr_recipe.includes(arr_recipe[j], j + 1) == true) {nameDuplicate(arr_recipe[j], "recipes/", ".json");}
  }

  for (var j = 0; j < arr_advancement.length; j++) {
    if (arr_advancement.includes(arr_advancement[j], j + 1) == true) {nameDuplicate(arr_advancement[j], "advancements/", ".json");}
  }

  for (var j = 0; j < arr_function.length; j++) {
    if (arr_function.includes(arr_function[j], j + 1) == true) {nameDuplicate(arr_function[j], "functions/", ".mcfunction");}
  }

  // Load Function
  var function_load_path = "data/" + datapack_name + "/functions/load.mcfunction";
  var function_load_text = "scoreboard objectives add " + score + " dummy";

  zip.file(function_load_path, function_load_text);

  // Minecraft Load Tag
  var function_tag_load = '{"values": ["' + datapack_name + ':load"]}';
  zip.file("data/minecraft/tags/functions/load.json", function_tag_load);

  // Minecraft pack.mcmeta
  var pack_mcmeta = '{"pack": {"pack_format": ' + version + ',"description": "Made with the NBT-Crafting Generator by CMD-Golem\ncmd-golem.netlify.app/help/nbt_crafting"}}';
  zip.file("pack.mcmeta", pack_mcmeta);

  //Download
  if (execute == true) {
    var progress_bar = document.getElementById("progress_bar");
    progress_bar.style.display = "block";
    disableScroll();

    zip.generateAsync({type:"base64"}, function updateCallback(metadata) {
      document.getElementById("bar").style.width = metadata.percent + "%";
    })
    .then(function (content) {
      progress_bar.style.display = "none";
      enableScroll()
      
      var link = document.createElement('a');
      link.download = "NBT-Crafting";
      link.href = "data:application/zip;base64," + content;
      link.click();

      updateCounter();
    });
  }
}


// Stop generating file if dublicated name
function nameDuplicate(duplicated_string, duplicated_array, duplicated_end) {
  confirm("You have used the path " + duplicated_array + duplicated_string + duplicated_end + " more than once.");
  execute == false;
  return;
}
function nameDuplicateTag(duplicated_string) {
  confirm("You have used the Tag " + duplicated_string + " more than once.");
  execute == false;
  return;
}


function folderPath() {
  // Add / at the end
  if (recipe_folder.slice(-1) != "/") {recipe_folder = recipe_folder + "/";}
  if (advancement_folder.slice(-1) != "/") {advancement_folder = advancement_folder + "/";}
  if (function_detect_folder.slice(-1) != "/") {function_detect_folder = function_detect_folder + "/";}
  if (function_craft_folder.slice(-1) != "/") {function_craft_folder = function_craft_folder + "/";}
  if (function_mass_folder.slice(-1) != "/") {function_mass_folder = function_mass_folder + "/";}

  // Remove / at the beginning
  if (recipe_folder.charAt(0) == "/") {recipe_folder = recipe_folder.substring(1);}
  if (advancement_folder.charAt(0) == "/") {advancement_folder = advancement_folder.substring(1);}
  if (function_detect_folder.charAt(0) == "/") {function_detect_folder = function_detect_folder.substring(1);}
  if (function_craft_folder.charAt(0) == "/") {function_craft_folder = function_craft_folder.substring(1);}
  if (function_mass_folder.charAt(0) == "/") {function_mass_folder = function_mass_folder.substring(1);}
}


function generateFile() {
// Advancement
var advancement_path = "data/" + datapack_name + "/advancements/" + advancement_folder + advancement_name + ".json";
var advancement_text = `{
  "criteria": {
    "unlock": {
      "trigger": "minecraft:recipe_unlocked",
      "conditions": {
        "recipe": "${datapack_name}:${recipe_folder}${recipe_name}"
      }
    }
  },
  "rewards": {
    "function": "${datapack_name}:${function_detect_folder}${function_detect_name}"
  }
}
`;

zip.file(advancement_path, advancement_text);


// Recipe
var recipe_path = "data/" + datapack_name + "/recipes/" + recipe_folder + recipe_name + ".json";

zip.file(recipe_path, recipe_text);


// Function Detect
var function_detect_path = "data/" + datapack_name + "/functions/" + function_detect_folder + function_detect_name + ".mcfunction";
var function_detect_text = `advancement revoke @s only ${datapack_name}:${advancement_folder}${advancement_name}
recipe take @a ${datapack_name}:${recipe_folder}${recipe_name}

execute unless entity @s[tag=${tag}] run scoreboard players reset @s ${score}
scoreboard players add @s ${score} 1
tag @s add ${tag}


schedule function ${datapack_name}:${function_craft_folder}${function_craft_name} 2t
`;

zip.file(function_detect_path, function_detect_text);


// Function craft
var function_craft_path = "data/" + datapack_name + "/functions/" + function_craft_folder + function_craft_name + ".mcfunction";
var function_craft_text = `execute as @a[tag=${tag}] at @s unless entity @e[type=item,nbt={Item:{id:"${placeholder}",Count:${count}b},Age:1s},distance=..3] run clear @s ${placeholder} ${count}
execute at @a[tag=${tag}] run kill @e[type=item,nbt={Item:{id:"${placeholder}",Count:${count}b},Age:1s},distance=..3]

give @a[tag=${tag}] ${nbt_item} ${count}
scoreboard players remove @a[tag=${tag}] ${score} 1

execute as @a[tag=${tag},scores={${score}=1..}] run function ${datapack_name}:${function_mass_folder}${function_mass_name}

tag @a[tag=${tag}] remove ${tag}
`;

zip.file(function_craft_path, function_craft_text);


// Function Detect
var function_mass_path = "data/" + datapack_name + "/functions/" + function_mass_folder + function_mass_name + ".mcfunction";
var function_mass_text = `execute as @s run kill @e[type=item,nbt={Item:{id:"minecraft:${placeholder}",Count:${count}b},Age:1},distance=..3]

clear @s ${placeholder} ${count}
give @s ${nbt_item} ${count}
scoreboard players remove @s ${score} 1

execute if entity @s[scores={${score}=1..}] run function ${datapack_name}:${function_mass_folder}${function_mass_name}
`;

zip.file(function_mass_path, function_mass_text);
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