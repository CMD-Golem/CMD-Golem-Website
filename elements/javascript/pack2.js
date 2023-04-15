// show and hide download window
var select_version_text = document.getElementById("select_version_text");
var pack_id = document.getElementsByName("pack_id")[0].content;
var selected_pack_obj = pack_array.find(e => e.pack_id == pack_id);

var download_box = document.getElementById("download_box");
var selection_box = document.getElementById("selection_box");
var version_main = document.getElementById("version_main");
var version_sub = document.getElementById("version_sub");
var select_version = document.getElementById("select_version");

var version_id_array_filtered = [];
var html_main_version = "";
var selected_version;

function closeDownload() {
	preventScroll(false) //footer.js
	download_box.style.display = "none";
}

function openDownload() {
	preventScroll(true) //footer.js
	download_box.style.display = "block";

	// get first and last version compatible with datapack
	var first_version = selected_pack_obj.pack_version_id[selected_pack_obj.pack_version_id.length - 1]; // oldest comp version
	var last_version = selected_pack_obj.last_version_id; // newest comp version
	var array_main = [];
	version_id_array_filtered = [];
	html_main_version = "";

	// create a html list with all compatible main versions
	for (var i = 0; i < version_id_array.length; i++) {
		var version_id = version_id_array[i];

		if (version_id.id <= last_version && version_id.id >= first_version) {
			version_id_array_filtered.push(version_id);

			if (!array_main.includes(version_id.main)) {
				html_main_version += `<div onclick="mainVersion(this)" id="${version_id.main_id}">${version_id.main}</div>`;
				array_main.push(version_id.main);
			}
		}
	}

	version_main.innerHTML = html_main_version;

	// check if last selected version is compatible with this pack
	var selected_version_id = parseInt(window.localStorage.getItem("selected_version_id"));
	if (selected_version_id != NaN && selected_version_id <= last_version && selected_version_id >= first_version) {
		// select last selected version
		selected_version = version_id_array.find(e => e.id == selected_version_id);

		select_version.innerHTML = selected_version.main + "." + selected_version.sub;

		var selected_main = document.getElementById(selected_version.main_id);
		selected_main.classList.add("version_main_selected");

		mainVersion(selected_main);
		subVersion(document.getElementById("subid" + selected_version.id));
	}
	else {
		// select newest version
		select_version.innerHTML = version_id_array_filtered[0].main + "." + version_id_array_filtered[0].sub;

		version_main.firstElementChild.classList.add("version_main_selected");
		mainVersion(version_main.firstElementChild);
		subVersion(version_sub.firstElementChild);
	}
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
}

function subVersion(selected_version_el) {
	try { document.getElementsByClassName("version_sub_selected")[0].classList.remove("version_sub_selected"); } catch (e) {}
	selected_version_el.classList.add("version_sub_selected");

	selected_version = version_id_array.find(e => "subid" + e.id == selected_version_el.id);
	window.localStorage.setItem("selected_version_id", selected_version.id);

	select_version.innerHTML = selected_version.name;
	selection_box.classList.add("hidden");
}


// ###########################################################
// download
var already_download = false;

async function downloadPack(is_ressource_pack) {
	// get correct files for version
	if (is_ressource_pack == true) {
		var pack_version_ids = selected_pack_obj.rp_version_id;
		var pack_string = "resource_";
		var pack_description = "TP "
	}
	else {
		var pack_version_ids = selected_pack_obj.pack_version_id;
		var pack_string = "pack_";
		if (is_ressource_pack == false) {
			var pack_description = "DP ";
		}
		else {
			var pack_description = "";
		}
	}

	var pack_git_folder = pack_string + pack_version_ids.find(e => e <= selected_version.id);

	// get file tree (https://github.com/misode/bundler)
	var res_data = await fetch(`https://api.github.com/repos/CMD-Golem/CMD-Golem-Packs/contents/${selected_pack_obj.pack_type}/${selected_pack_obj.pack_id}`);
	var data = await res_data.json();
	var sha = data.find(e => e.name === pack_git_folder).sha;
	var res_tree = await fetch(`https://api.github.com/repos/CMD-Golem/CMD-Golem-Packs/git/trees/${sha}?recursive=1`);
	var tree = (await res_tree.json()).tree;

	// load files into zip
	var zip = new JSZip();

	for (var i = 0; i < tree.length; i++) {
		var file = tree[i];
		if (file.size != undefined) {
			var path = file.path;
			var res_content = await fetch(`https://raw.githubusercontent.com/CMD-Golem/CMD-Golem-Packs/master/${selected_pack_obj.pack_type}/${selected_pack_obj.pack_id}/${pack_git_folder}/${path}`);

			if (path == "pack.mcmeta") {
				var pack_mcmeta = await res_content.json();
				pack_mcmeta.pack.pack_format = pack_format;
				var content = JSON.stringify(pack_mcmeta);
			}
			else { var content = await res_content.blob(); }
			
			zip.file(path, content)
		}
	}

	// download zip
	var pack = await zip.generateAsync({type:"base64"});
	var link = document.createElement('a');
	link.download = `[${selected_version.name}] ${selected_pack_obj.name} ${pack_description}by CMD-Golem v${selected_pack_obj.code_version}`;
	link.href = "data:application/zip;base64," + pack;
	link.click();

	// download counter
	if (already_download != true) {
		already_download = true;
		fetch(`/.netlify/functions/update/${pack_type}/${pack_id}`);
		fetch(`/.netlify/functions/version/${mc_version}`);
	}
	else {
		console.log("Already downloaded");
	}
}

if (window.location.hash.substr(1) == "download") {
	window.location.hash = "";
	openDownload();
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