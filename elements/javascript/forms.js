// Textarea
var el_textarea = document.getElementsByTagName("textarea");
for (var i = 0; i < el_textarea.length; i++) {
	el_textarea[i].addEventListener("input", (e) => {
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + 12 + "px";
	});
}


// validate Form
var el_mains = document.getElementsByTagName("main");
var el_description = document.getElementById("description");

async function validateForm() {
	event.preventDefault();

	if (el_description.value == "") alert("Add your comment first");
	else {
		await fetch("/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams(new FormData(event.target)).toString(),
		})

		el_mains[0].style.display = "none";
		el_mains[1].style.display = "block";
		return true;
	}
}

function goBack() {
	var history_length = history.length;
	if (history_length >= 3) window.history.go(-2);
	else window.location.href = "https://cmd-golem.com/";
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
var planetminecraft = document.getElementById("planetminecraft");
document.getElementById("pack_type").value = hashfilter;

// Github
document.getElementById("github").href = "https://github.com/CMD-Golem/CMD-Golem-Packs/issues/new?template=support_request.md&labels=question," + hashfilter;

// Planet Minecraft
if (hashfilter == "nbt_crafting") planetminecraft.href = "https://www.planetminecraft.com/blog/nbt-crafting/";

else if (hashfilter == "petbag") planetminecraft.href = "https://www.planetminecraft.com/data-pack/petbag/";
else if (hashfilter == "short_commands") planetminecraft.href = "https://www.planetminecraft.com/data-pack/testworld-datapack/";
else if (hashfilter == "fried_eggs") planetminecraft.href = "https://www.planetminecraft.com/data-pack/fried-eggs/";
else if (hashfilter == "dark_theme") planetminecraft.href = "https://www.planetminecraft.com/texture-pack/dark-theme-4405476/";
else if (hashfilter == "murder") planetminecraft.href = "https://www.planetminecraft.com/data-pack/murder-mini-game/";
else if (hashfilter == "jump_and_run") planetminecraft.href = "https://www.planetminecraft.com/data-pack/jump-and-run-1-13-x-1-14-x/";
else if (hashfilter == "more_arrows") planetminecraft.href = "https://www.planetminecraft.com/data-pack/more-arrows/";
else if (hashfilter == "gateway") planetminecraft.href = "https://www.planetminecraft.com/data-pack/tp-base/";
else if (hashfilter == "useful_golden_tools") planetminecraft.href = "https://www.planetminecraft.com/data-pack/useful-golden-tools/";
else if (hashfilter == "wither_soldier") planetminecraft.href = "https://www.planetminecraft.com/data-pack/wither-soldier-4502139/";
else if (hashfilter == "invisible_item_frame") planetminecraft.href = "https://www.planetminecraft.com/data-pack/invisible-item-frame-4506693/";
else if (hashfilter == "better_wandering_trader") planetminecraft.href = "https://www.planetminecraft.com/data-pack/better-wandering-trader/";
else if (hashfilter == "key") planetminecraft.href = "https://www.planetminecraft.com/data-pack/key-lock-chests/";
else if (hashfilter == "redstone_dot") planetminecraft.href = "https://www.planetminecraft.com/data-pack/restone-dut/";
else if (hashfilter == "recipe_unlocker") planetminecraft.href = "https://www.planetminecraft.com/data-pack/recipe-unlocker/";

else if (hashfilter == "powered_enchanting") planetminecraft.href = "https://www.planetminecraft.com/data-pack/powered-enchanting/";
else if (hashfilter == "powered_enchanting_addon") planetminecraft.href = "https://www.planetminecraft.com/data-pack/powered-enchanting/";
else if (hashfilter == "powered_enchanting_translate") planetminecraft.href = "https://www.planetminecraft.com/data-pack/powered-enchanting/";


// Not Minecraft
else if (hashfilter == "fauna_counter") document.getElementById("hide").style.display = "none";