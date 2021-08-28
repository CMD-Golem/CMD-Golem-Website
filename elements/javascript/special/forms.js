// Textarea
var el_textarea = document.getElementsByTagName("textarea");
for (var i = 0; i < el_textarea.length; i++) {
	el_textarea[i].addEventListener("input", textarea);
}

function textarea(edited_textarea) {
	edited_textarea.target.style.height = "auto";
	edited_textarea.target.style.height = edited_textarea.target.scrollHeight + 12 + "px";
}


// validate Form
function validateForm() {
	var check = document.getElementById("description")
	if (check.value == "") {
		alert("Add your comment first");
		return false;
	}
}


// Prevent sending when pressing enter in input elements
var el_input = document.getElementsByTagName("input");
for (var i = 0; i < el_input.length; i++) {
	el_input[i].addEventListener("keydown", e => {
		if ((e.which == 13 || e.keyCode == 13) ) {
			e.preventDefault();
		}
	});
}

// Read hash
var hashfilter = window.location.hash.substr(1);
var link = document.getElementById("link");
var hide = document.getElementById("hide");
document.getElementById("pack_type").value = hashfilter;

if (hashfilter == "nbt_crafting") {link.href = "https://www.planetminecraft.com/blog/nbt-crafting/";}

else if (hashfilter == "petbag") {link.href = "https://www.planetminecraft.com/data-pack/petbag/";}
else if (hashfilter == "short_commands") {link.href = "https://www.planetminecraft.com/data-pack/testworld-datapack/";}
else if (hashfilter == "fried_eggs") {link.href = "https://www.planetminecraft.com/data-pack/fried-eggs/";}
else if (hashfilter == "dark_theme") {link.href = "https://www.planetminecraft.com/texture-pack/dark-theme-4405476/";}
else if (hashfilter == "murder") {link.href = "https://www.planetminecraft.com/data-pack/murder-mini-game/";}
else if (hashfilter == "powered_enchanting") {link.href = "https://www.planetminecraft.com/data-pack/powered-enchanting/";}
else if (hashfilter == "jump_and_run") {link.href = "https://www.planetminecraft.com/data-pack/jump-and-run-1-13-x-1-14-x/";}
else if (hashfilter == "more_arrows") {link.href = "https://www.planetminecraft.com/data-pack/more-arrows/";}
else if (hashfilter == "gateway") {link.href = "https://www.planetminecraft.com/data-pack/tp-base/";}
else if (hashfilter == "useful_golden_tools") {link.href = "https://www.planetminecraft.com/data-pack/useful-golden-tools/";}
else if (hashfilter == "wither_soldier") {link.href = "https://www.planetminecraft.com/data-pack/wither-soldier-4502139/";}
else if (hashfilter == "invisible_item_frame") {link.href = "https://www.planetminecraft.com/data-pack/invisible-item-frame-4506693/";}
else if (hashfilter == "better_wandering_trader") {link.href = "https://www.planetminecraft.com/data-pack/better-wandering-trader/";}
else if (hashfilter == "key") {link.href = "https://www.planetminecraft.com/data-pack/key-lock-chests/";}
else if (hashfilter == "redstone_dot") {link.href = "https://www.planetminecraft.com/data-pack/restone-dut/";}
else if (hashfilter == "recipe_unlocker") {link.href = "https://www.planetminecraft.com/data-pack/recipe-unlocker/";}


// Not Minecraft
else if (hashfilter == "fauna_counter") {hide.style.display = "none";}