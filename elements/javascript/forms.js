// Textarea
var el_textarea = document.getElementsByTagName("textarea");
for (var i = 0; i < el_textarea.length; i++) {
	el_textarea[i].addEventListener("input", (e) => {
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + 12 + "px";
	});
}


// send Form
var el_mains = document.getElementsByTagName("main");
var el_description = document.getElementById("description");

async function sendForm() {
	if (el_description.value == "") return alert("Add your comment first");

	var selected_pack_name = pack_array.find(e => e.pack_id == hashfilter)?.name || hashfilter;
	var form_body = {
		subject: `CMD-Golem ${selected_pack_name}`,
		body: `
			<p>Email: ${document.getElementById("email").value}</p>
			<p>Pack: ${hashfilter}</p>
			<p>${el_description.value}</p>`
	};

	var response = await fetch("https://api.tabq.ch/forms-fg/mail", {
		method: "POST",
		body: JSON.stringify(form_body),
	});

	if (response.ok) {
		el_mains[0].style.display = "none";
		el_mains[1].style.display = "block";
	}
	else {
		var error = await response.text();
		console.error(error);
		alert("An error has occurred: " + error);
	}
}

function goBack() {
	var history_length = history.length;
	if (history_length >= 2) window.history.go(-1);
	else window.location.href = "/";
}

// Read hash
var hashfilter = window.location.hash.substr(1);
var planetminecraft = document.getElementById("planetminecraft");

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
else if (hashfilter == "key" || hashfilter == "key_gen1") planetminecraft.href = "https://www.planetminecraft.com/data-pack/key-lock-chests/";
else if (hashfilter == "redstone_dot") planetminecraft.href = "https://www.planetminecraft.com/data-pack/restone-dut/";
else if (hashfilter == "recipe_unlocker") planetminecraft.href = "https://www.planetminecraft.com/data-pack/recipe-unlocker/";

else if (hashfilter == "powered_enchanting") planetminecraft.href = "https://www.planetminecraft.com/data-pack/powered-enchanting/";
else if (hashfilter == "powered_enchanting_addon") planetminecraft.href = "https://www.planetminecraft.com/data-pack/powered-enchanting/";
else if (hashfilter == "powered_enchanting_translate") planetminecraft.href = "https://www.planetminecraft.com/data-pack/powered-enchanting/";