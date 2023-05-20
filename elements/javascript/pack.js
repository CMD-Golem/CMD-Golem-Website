// show and hide download window
var select_version_text = document.getElementById("select_version_text");
var download_box = document.getElementById("download_box");
var selection_box = document.getElementById("selection_box");
var version_main = document.getElementById("version_main");
var version_sub = document.getElementById("version_sub");
var select_version = document.getElementById("select_version");
var hide_on_addon = document.getElementsByClassName("hide_on_addon");
var show_on_addon = document.getElementsByClassName("show_on_addon");
var preview_warning = document.getElementById("preview_warning");

var pack_id = document.getElementsByName("pack_id")[0].content;
var pack_obj = pack_array.find(e => e.pack_id == pack_id);

var version_id_array_filtered = [];
var html_main_version = "";
var selected_version, selected_pack_obj;

function closeDownload() {
	preventScroll(false) //footer.js
	download_box.style.display = "none";
	selected_pack_obj = undefined;

	// hide/ unhide addon elements
	for (var i = 0; i < hide_on_addon.length; i++) {
		hide_on_addon[i].style.removeProperty("display");
	}
	for (var i = 0; i < show_on_addon.length; i++) {
		show_on_addon[i].style.display = "none";
	}
}

function openDownload(addon_id) {
	preventScroll(true) //footer.js
	download_box.style.display = "block";

	// set selected pack id
	if (addon_id == undefined) {
		selected_pack_obj = pack_obj;
	}
	else {
		selected_pack_obj = pack_array.find(e => e.pack_id == addon_id);
		
		// hide/ unhide addon elements
		for (var i = 0; i < hide_on_addon.length; i++) {
			hide_on_addon[i].style.display = "none";
		}
		for (var i = 0; i < show_on_addon.length; i++) {
			show_on_addon[i].style.removeProperty("display");
		}
	}

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

	// create a html list with all compatible main versions  // nearly the same funtcion as in article.js
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
}


// ###########################################################
// download
// 1: datapack with resource pack
// 2: standalone datapack
// 3: ressource pack of datapack
// 4: standalone resource pack
// 5: map
var already_download = false;

async function downloadPack(pack_type) {
	var zip = new JSZip();
	download_box.classList.add("loading_cursor");

	var pack_version_ids = selected_pack_obj.pack_version_id;
	var pack_string = "pack_";
	var pack_description = "";

	if (pack_type == 1) {
		var pack_description = "DP ";
	}
	else if (pack_type == 3) {
		var pack_version_ids = selected_pack_obj.rp_version_id;
		var pack_string = "resource_";
		var pack_description = "RP ";
	}

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
	await zip.loadAsync(pack.blob());

	// pack.mcmeta
	if (pack_type != 5) {
		var mcmeta_string = await zip.file("pack.mcmeta").async("string");
		var mcmeta_json = JSON.parse(mcmeta_string);

		if (pack_type <= 2) { mcmeta_json.pack.pack_format = selected_version.dp; }
		else { mcmeta_json.pack.pack_format = selected_version.rp; }

		zip.file("pack.mcmeta", JSON.stringify(mcmeta_json));
	}
	
	// download zip
	var pack = await zip.generateAsync({type:"base64"});
	var link = document.createElement('a');
	link.download = `[${selected_version.name}] ${selected_pack_obj.name} ${pack_description}by CMD-Golem v${code_version}.zip`;
	link.href = "data:application/zip;base64," + pack;
	link.click();

	download_box.classList.remove("loading_cursor");

	// download counter
	if (already_download != true && pack_type != 3) {
		already_download = true;
		fetch(`/.netlify/functions/update/${selected_pack_obj.pack_type}/${selected_pack_obj.db_id}`);
		fetch(`/.netlify/functions/version/${selected_version.db}`);
	}
	else {
		console.log("Already downloaded or resource pack of data pack");
	}
}

var hash = window.location.hash.substr(1)

if (hash != "") {
	window.location.hash = "";
	if (hash == "download") {
		openDownload();
	}
	else if (pack_array.some(e => e.pack_id == hash)) {
		openDownload(hash);
	}
	else {
		console.log("Hash is no Pack");
	}
}



// ###########################################################
// Gallery
var slides = document.getElementsByClassName("slideshow");
if (slides.length != 0) {
	var slideIndex = 1;
	showSlides(slideIndex);
}

function showSlides(n) {
	if (n > slides.length) {slideIndex = 1}    
	if (n < 1) {slideIndex = slides.length}
	for (var i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";  
	}
	slides[slideIndex-1].style.display = "block";  
}

// Big Image
function bigImg(element) {
	document.getElementById("img").src = element;
	document.getElementById("bigImg").style.display = "block";
}