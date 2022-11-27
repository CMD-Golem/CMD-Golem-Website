// Add class to html to:
//		disable download page: no_download
//		disable show counter on page: no_counter
//		disable slides: no_slides
var html = document.getElementsByTagName("body")[0];

// Gallery
var slides = document.getElementsByClassName("slideshow");
var slideIndex = 1;
if (!html.classList.contains("no_slides")) {showSlides(slideIndex);}


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


// #################################################################################################
// Download
var section = document.getElementsByTagName("section")[0];
var main = document.getElementsByTagName("main")[0];
var download_button = document.getElementById("download_button");
var title = document.getElementsByTagName("title")[0];
var pack_title = document.getElementsByTagName("h1")[0].innerHTML;
var show_download = false;

function changeDownload() {
	if (show_download == false && window.location.hash.substr(1) == "download") {
		section.style.display = "block";
		main.style.display = "none";
		download_button.title = "Go back to Pack Page";
		show_download = true;

		title.innerHTML = "CMD-Golem - " + pack_title + " Download";
	}

	else {
		section.style.display = "none";
		main.style.display = "block";
		download_button.title = "";
		show_download = false;

		title.innerHTML = "CMD-Golem - " + pack_title;
	}
}

if (!html.classList.contains("no_download")) {
	changeDownload();
	window.onhashchange = function() { changeDownload(); }
}


function openDownload() {
	if (show_download == false) { window.location.hash = "download"; }
	else { window.location.hash = ""; }
}

// Close Window on scroll
//window.onscroll = function (e) {
//	var sectionload = document.getElementsByTagName("section")[0];
//	
//	if (sectionload.style.display == "block") {
//		sectionload.style.display = "none";
//	}
//}

// set newest version
try {
	document.getElementById("newest").innerHTML = "1.19.2";
}
catch (e) {}


// ###########################################################
// Counter --> Has also his own file

// read db
var read = (pack_id, pack_type) => {
	return fetch(`/.netlify/functions/read/${pack_type}/${pack_id}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

// update db
var update = (pack_id, pack_type) => {
	return fetch(`/.netlify/functions/update/${pack_type}/${pack_id}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

// version statistic
var version = (pack_version) => {
	return fetch(`/.netlify/functions/version/${pack_version}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}


// get id and type of pack
var counter_el = document.getElementById("download_counter");
var pack_id = counter_el.dataset.ref;
var pack_type = counter_el.dataset.type;


// show counter in html
if (!html.classList.contains("no_counter")) {
	Promise.resolve( read(pack_id, pack_type) ).then( function(value) {
		counter_el.innerHTML = value.data.count.toLocaleString('de-CH');
		var show_el = counter_el.parentNode.parentNode.getElementsByTagName("div");
		show_el[0].style.display = "block";
		show_el[1].style.display = "block";
	});
}

// update counter
var already_download = false;

function updateCounter() {
	if (already_download != true) {
		already_download = true;
		update(pack_id, pack_type)//.then((value) => { console.log(value); });

		// version statistic
		var pack_version = event.target.parentNode.parentNode.firstElementChild.id;
		if (pack_version != "") {
			version(pack_version);
		}
	}
	else {
		console.log("Already downloaded");
	}
}

// Detect Button click
var buttons = document.getElementsByClassName("dl_counter");
for (var i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener("click", updateCounter);
}