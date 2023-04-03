// show download window
var select_version_text = document.getElementById("select_version_text");
var pack_id = document.getElementsByName("pack_id")[0].content;
var selected_pack_obj = pack_array.find(e => e.pack_id == pack_id);

var selection_box = document.getElementById("selection_box");
var version_main = document.getElementById("version_main");
var version_sub = document.getElementById("version_sub");
var select_version = document.getElementById("select_version");

var version_id_array_filtered = [];
var html_main_version = "";
var selected_version;


function openDownload() {
	preventScroll(true) //footer.js

	var first_version = selected_pack_obj.dp_version_id[selected_pack_obj.dp_version_id.length - 1];
	var last_version = selected_pack_obj.last_version_id;
	var array_main = [];
	version_id_array_filtered = [];
	html_main_version = "";

	for (var i = 0; i < version_id_array.length; i++) {
		var version_id = version_id_array[i];

		if (version_id.id <= last_version && version_id.id >= first_version) {
			version_id_array_filtered.push(version_id);

			if (!array_main.includes(version_id.main)) {
				html_main_version += `<div onclick="mainVersion(this)">${version_id.main}</div>`;
				array_main.push(version_id.main);
			}
		}
	}
	select_version.innerHTML = version_id_array_filtered[0].main + "." + version_id_array_filtered[0].sub;

	version_main.innerHTML = html_main_version;

	version_main.firstElementChild.id = "version_main_selected";
	mainVersion(version_main.firstElementChild);
	subVersion(last_version, version_sub.firstElementChild);
}

openDownload();

function mainVersion(selected_version_el) {
	document.getElementById("version_main_selected").id = "";
	selected_version_el.id = "version_main_selected";
	var html = "";

	for (var i = 0; i < version_id_array_filtered.length; i++) {
		var version_id = version_id_array_filtered[i];

		if (version_id.main == selected_version_el.innerHTML) {
			html += `<div onclick="subVersion(${version_id.id}, this)">.${version_id.sub}</div>`;
		}
	}
	version_sub.innerHTML = html;
}

function subVersion(selected_version_id, selected_version_el) {
	selected_version = version_id_array.find(e => e.id == selected_version_id);
	if (selected_version.sub != undefined) {
		select_version.innerHTML = selected_version.main + "." + selected_version.sub;
	}
	else {
		select_version.innerHTML = selected_version.main;
	}

	try { document.getElementById("version_sub_selected").id = ""; } catch (e) {}
	selected_version_el.id = "version_sub_selected";

	selection_box.classList.add("hidden");
}



// download
var already_download = false;

async function downloadPack(pack_type, pack_id, version) {
	// logic to get pack format and mc version
	var pack_format = 5;
	var mc_version = "1.19";

	// get file tree (https://github.com/misode/bundler)
	var res_data = await fetch(`https://api.github.com/repos/CMD-Golem/CMD-Golem-Packs/contents/${pack_type}/${pack_id}`);
	var data = await res_data.json();
	var sha = data.find(e => e.name === version).sha;
	var res_tree = await fetch(`https://api.github.com/repos/CMD-Golem/CMD-Golem-Packs/git/trees/${sha}?recursive=1`);
	var tree = (await res_tree.json()).tree;

	// load files into zip
	var zip = new JSZip();

	for (var i = 0; i < tree.length; i++) {
		var file = tree[i];
		if (file.size != undefined) {
			var path = file.path;
			var res_content = await fetch(`https://raw.githubusercontent.com/CMD-Golem/CMD-Golem-Packs/master/${pack_type}/${pack_id}/${version}/${path}`);

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
	link.download = "Test.zip";
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


var download_box = document.getElementById("download_box");

function closeModal() {
	download_box.remove();

	preventScroll(false); //footer.js
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