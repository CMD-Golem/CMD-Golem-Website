// show download window
if (window.location.hash.substr(1) == "download") {
	window.location.hash = "";
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