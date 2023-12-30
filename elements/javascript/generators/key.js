var already_download;

// Download Resource Pack
async function downloadResourcePack() {
	var zip = new JSZip();
	download_box.classList.add("loading_cursor");

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

	var pack = await fetch(`https://raw.githubusercontent.com/CMD-Golem/CMD-Golem-Packs/main/${selected_pack_obj.pack_id}/${pack_git_folder}.zip`);
	await zip.loadasync(pack.blob());

	// pack.mcmeta
	var mcmeta_string = await zip.file("pack.mcmeta").async("string");
	var mcmeta_json = JSON.parse(mcmeta_string);
	mcmeta_json.pack.pack_format = selected_version.rp;
	zip.file("pack.mcmeta", JSON.stringify(mcmeta_json));

	// download zip
	var pack = await zip.generateasync({type:"base64"});
	var link = document.createElement('a');
	link.download = `[${selected_version.name}] ${selected_pack_obj.name} ${pack_description}by CMD-Golem v${code_version}.zip`;
	link.href = "data:application/zip;base64," + pack;
	link.click();

	download_box.classList.remove("loading_cursor");
}


// ###########################################################
// Download Data Pack
var containers_spoiler = document.getElementById("containers_spoiler");
var doors_spoiler = document.getElementById("doors_spoiler");
var trapgate_spoiler = document.getElementById("trapgate_spoiler");

async function downloadDataPack() {
	var zip = new JSZip();
	download_box.classList.add("loading_cursor");

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
	var pack = await fetch(`https://raw.githubusercontent.com/CMD-Golem/CMD-Golem-Packs/main/key/${pack_git_folder}.zip`);
	await zip.loadasync(pack.blob());

	// store settings

	
	// add selected blocks to block tag
	var containers_tag = generateBlockTags(containers_spoiler.getElementsByClassName(".selected"));
	var doors_tag = generateBlockTags(doors_spoiler.getElementsByClassName(".selected"));
	var trapgate_tag = generateBlockTags(trapgate_spoiler.getElementsByClassName(".selected"));

	zip.file("data/keylock/tags/blocks/containers.json", containers_tag);
	zip.file("data/keylock/tags/blocks/doors.json", doors_tag);
	zip.file("data/keylock/tags/blocks/trapgate.json", trapgate_tag);

	// get matching non_solid block tag when needed
	for (var i = 0; i < non_solid_versions.length; i++) {
		if (non_solid_versions[i] <= selected_version.id) {
			var pack_git_path = non_solid_versions[i];

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

	var response = await fetch(`https://raw.githubusercontent.com/CMD-Golem/CMD-Golem-Packs/main/_non_solid/tag_${pack_git_path}.json`);
	var non_solid = await response.text();
	zip.file("data/keylock/tags/blocks/non_solid.json", non_solid);

	// pack.mcmeta
	var mcmeta_string = await zip.file("pack.mcmeta").async("string");
	var mcmeta_json = JSON.parse(mcmeta_string);
	mcmeta_json.pack.pack_format = selected_version.rp;
	zip.file("pack.mcmeta", JSON.stringify(mcmeta_json));

	var content = await zip.generateasync({type:"base64"});
	var link = document.createElement('a');
	link.download = "[" + selected_version.name + "] Key DP v" + code_version + ".zip";
	link.href = "data:application/zip;base64," + content;
	link.click();
	download_box.classList.remove("loading_cursor");

	// Counter
	if (already_download != true && user_role != "hidden") {
		already_download = true;

		fetch("/.netlify/functions/update/packs/385283010901049410"); // normal counter
		fetch(`/.netlify/functions/version/${selected_version.main_id}`); // version statistic
	}
}


function generateBlockTags(selected_elements) {

}

// ###########################################################
// Download
var download_box = document.getElementById("download_box");
var download_box_open = false;

function loadDownloadModal() {
	download_box.style.display = "block";
	download_box_open = true;
	preventScroll(true); // footer.js
}

function closeDownload() {
	download_box.style.display = "none";
	download_box_open = false;
	preventScroll(false); //footer.js
}


// ###########################################################
// add custom lockable blocks // also in powerench/addon_app.js
function setTagged(input_el, input_check) {
	if ((input_el.value.includes(" ") || input_el.value.includes(",") || input_check == false) && input_el.value != "") {
		if (!input_el.value.includes(":")) {
			alert("You should define the full namespace of your block!\nTutorial: https://cmd-golem.com/help/get_namespaced_id.html")
		}
		var item_el = document.createElement("span");
		item_el.innerHTML = input_el.value.replace(/[^a-zA-Z_:]/g, "");
		item_el.classList.add("tagged_item");
		item_el.addEventListener("click", removeTagged);

		input_el.parentNode.insertBefore(item_el, input_el);

		input_el.value = "";
		input_el.blur();
		input_el.focus();
	}
}

function removeTagged(remove_tag) {
	remove_tag.target.remove();
}

// tooltips
var el_mark = document.getElementsByTagName("mark");
var tooltip = document.getElementById("tooltip");

function showToolTip(e) {
	var pos = e.target.getBoundingClientRect();

	tooltip.style.display = "block";
	tooltip.style.top = pos.top + window.scrollY - 0.5 + "px";
	tooltip.style.left = pos.left + window.scrollX + 20 + "px";
	tooltip.innerHTML = e.target.getAttribute("data-title");
}


function hideToolTip() {
	tooltip.style.display = "none";
}

// ###########################################################
// Version Selection // nearly the same funtcion as in pack.js
var selection_box = document.getElementById("selection_box");
var version_main = document.getElementById("version_main");
var version_sub = document.getElementById("version_sub");
var select_version = document.getElementById("select_version");
var preview_warning = document.getElementById("preview_warning");

var version_id_array_filtered = [];
var html_main_version = "";
var selected_pack_obj = pack_array.find(e => e.pack_id == "key");
var selected_version;

function loadVersions() {
	// get first and last version compatible with datapack
	var first_version = selected_pack_obj.pack_version_id[selected_pack_obj.pack_version_id.length - 1]; // oldest comp version
	var last_version = selected_pack_obj.last_version_id; // newest comp version
	var incomp_version_id = selected_pack_obj.incomp_version_id ?? []; // check for incompatible versions

	if (last_version == false) {
		last_version = version_id_array[0].id;
	}
	while (incomp_version_id.includes(last_version)) {
		last_version--;
	}

	// create a html list with all compatible main versions // nearly the same funtcion as in article.js
	var array_main = [];
	version_id_array_filtered = [];
	html_main_version = "";

	for (var i = 0; i < version_id_array.length; i++) {
		var version_id = version_id_array[i];

		if (version_id.id <= last_version && version_id.id >= first_version && !incomp_version_id.includes(version_id.id)) {
			version_id_array_filtered.push(version_id);

			if (!array_main.includes(version_id.main)) {
				html_main_version += `<div onclick="mainVersion(this)" id="${version_id.main_id}">${version_id.main}</div>`;
				array_main.push(version_id.main);
			}
		}
	}

	version_main.innerHTML = html_main_version;

	// check if last selected version is compatible with this pack
	var selected_version_id = parseInt(window.sessionStorage.getItem("selected_version_id"));
	if (!isNaN(selected_version_id) && selected_version_id <= last_version && selected_version_id >= first_version && !incomp_version_id.includes(selected_version_id)) {
		// select last selected version
		selected_version = version_id_array.find(e => e.id == selected_version_id);
	}
	else {
		// select newest version stable version
		var i = 0;
		while (version_id_array_filtered[i].preview) { i++; }
		selected_version = version_id_array_filtered[i];
	}

	select_version.innerHTML = selected_version.main + "." + selected_version.sub;

	var selected_main = document.getElementById(selected_version.main_id);
	selected_main.classList.add("version_main_selected");

	mainVersion(selected_main);
	subVersion(document.getElementById("subid" + selected_version.id));
}

function mainVersion(selected_version_el) {
	document.getElementsByClassName("version_main_selected")[0].classList.remove("version_main_selected")
	selected_version_el.classList.add("version_main_selected");
	var html = "";

	// show sub versions
	for (var i = 0; i < version_id_array_filtered.length; i++) {
		var version_id = version_id_array_filtered[i];

		if (version_id.main == selected_version_el.innerHTML) {

			html += `<div onclick="subVersion(this)", id="subid${version_id.id}">.${version_id.sub}</div>`;
		}
	}
	version_sub.innerHTML = html;

	// auto select sub version if only one is aviable
	if (version_sub.childElementCount == 1) {
		subVersion(version_sub.firstElementChild);
	}
}

function subVersion(selected_version_el) {
	try { document.getElementsByClassName("version_sub_selected")[0].classList.remove("version_sub_selected"); } catch (e) {}
	selected_version_el.classList.add("version_sub_selected");

	selected_version = version_id_array.find(e => "subid" + e.id == selected_version_el.id);
	window.sessionStorage.setItem("selected_version_id", selected_version.id);

	select_version.innerHTML = selected_version.name;
	selection_box.classList.add("hidden");

	// show unstable version link
	if (selected_version.preview) {
		preview_warning.style.display = "block";
	}
	else {
		preview_warning.style.display = "none";
	}

	// Only show compatible Enchantments
	// for (var i = 0; i < article_elements.length; i++) {
	// 	if (parseInt(article_elements[i].getAttribute("data-version")) > selected_version.id) {
	// 		article_elements[i].classList.add("incomp_version");
	// 	}
	// 	else {
	// 		article_elements[i].classList.remove("incomp_version");
	// 	}
	// }
	// incomp_packs = document.getElementsByClassName("incomp_version").length;
}

// on load
window.onload = function() {
	loadVersions();
	toggleDetail(containers_spoiler, true);

	for (var i = 0; i < el_mark.length; i++) {
		el_mark[i].addEventListener("mouseover", showToolTip);
		el_mark[i].addEventListener("mouseout", hideToolTip);
	}
};



// ###########################################################
// Selection by dragging // https://codepen.io/lancebush/pen/GqoGjd
var drag_area = document.getElementById("drag_area");
var lockable_blocks = document.getElementsByClassName("lockable_block");
var drag_sx;
var drag_sy;
var drag_started = false;


document.addEventListener("mousemove", function (event) {
	if (drag_started) {
		var flipX = "";
		var flipY = "";
		var top = drag_sy;
		var left = drag_sx;
		var height = event.pageY - drag_sy;
		var width = event.pageX - drag_sx;

		if (event.pageX - drag_sx < 0) {
			flipX = "scaleX(-1)";
			width = drag_sx - event.pageX;
			left = event.pageX;
		}

		if (event.pageY - drag_sy < 0) {
			flipY = "scaleY(-1)";
			height = drag_sy - event.pageY;
			top = event.pageY;
		}

		drag_area.style.cssText = `display:block; top:${top}px;	left:${left}px; width:${width}px; height:${height}px; transform:${flipX} ${flipY};`;
	}
});

document.addEventListener("mousedown", function (event) {
	if (!download_box_open) {
		drag_started = true;
		drag_sx = event.pageX;
		drag_sy = event.pageY;
	}
	else {
		drag_started = false;
	}
});

document.addEventListener("mouseup", function (event) {
	if (drag_started) {
		drag_started = false;
		drag_area.style.cssText = "display:none;";

		var ex = event.pageX;
		var ey = event.pageY;
		var got_methode = false;

		if (ex < drag_sx) {
			var ta = ex;
			ex = drag_sx;
			drag_sx = ta;
		}

		if (ey < drag_sy) {
			var ta = ey;
			ey = drag_sy;
			drag_sy = ta;
		}

		for (var i = 0; i < lockable_blocks.length; i++) {
			var lockable_block = lockable_blocks[i];

			if (!lockable_block.parentElement.parentElement.parentElement.classList.contains("active")) {
				continue;
			}
		
			var pos = lockable_block.getBoundingClientRect();

			var cxLow = pos.left + window.scrollX;
			var cxHi = cxLow + lockable_block.offsetWidth;
			var cyLow = pos.top + window.scrollY;
			var cyHi = cyLow + lockable_block.offsetHeight;

			if ((cxLow <= drag_sx && drag_sx <= cxHi && cxLow <= ex && ex <= cxHi) || (drag_sx <= cxHi && ex >= cxLow)) {
				if ((cyLow <= drag_sy && drag_sy <= cyHi && cyLow <= ey && ey <= cyHi) || (drag_sy <= cyHi && ey >= cyLow)) {
					if (!got_methode) {
						got_methode = true;
						var methode = lockable_block.classList.contains('selected');
					}
					if (methode) { lockable_block.classList.remove('selected'); }
					else { lockable_block.classList.add('selected'); }
				}
			}
		}
	}
});
