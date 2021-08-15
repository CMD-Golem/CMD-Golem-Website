// Gallery
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("slideshow");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
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
// add element if hash = download
if (window.location.hash.substr(1) == "download") {
	changeDownload();
}

function openDownload() {
	if (document.getElementsByTagName("section")[0].style.display == "none") {
		window.location.hash = "download";
	}

	else {
		window.location.hash = "";
	}
}

window.onhashchange = function() {
	changeDownload();
}

function changeDownload() {
	var section = document.getElementsByTagName("section")[0];
	var main = document.getElementsByTagName("main")[0];
	var download_button = document.getElementById("download_button");
	var title = document.getElementsByTagName("title")[0];

	if (section.style.display == "none") {
		section.style.display = "block";
		main.style.display = "none";
		download_button.title = "Go back to Pack Page";

		title.innerHTML = "CMD-Golem - " + document.getElementsByTagName("h1")[0].innerHTML + " Download";
	}

	else {
		section.style.display = "none";
		main.style.display = "block";
		download_button.title = "";

		title.innerHTML = "CMD-Golem - " + document.getElementsByTagName("h1")[0].innerHTML;
	}
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
document.getElementById("newest").innerHTML = "1.17 - 1.17.1";


// #################################################################################################
// Spoiler --> Has also his own file
function spoiler(el) {
	el.classList.toggle("active");
	var panel = el.nextElementSibling;
	if (panel.style.maxHeight){
		panel.style.maxHeight = null;
	} else {
		panel.style.maxHeight = panel.scrollHeight + "px";
	}
}


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


// get id and type of pack
var counter_el = document.getElementById("download_counter");
var pack_id = counter_el.dataset.ref;
var pack_type = counter_el.dataset.type;


// show counter in html
Promise.resolve( read(pack_id, pack_type) ).then( function(value) {
	counter_el.innerHTML = value.data.count;
	var show_el = counter_el.parentNode.parentNode.getElementsByTagName("div");
	show_el[0].style.display = "block";
	show_el[1].style.display = "block";
});

// update counter
var already_download = false;

function updateCounter() {
	if (already_download != true) {
		already_download = true;
		update(pack_id, pack_type)//.then((value) => { console.log(value); });
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