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
	document.getElementsByTagName("section")[0].style.display = "block";
}

function openDownload () {
	var sectionload = document.getElementsByTagName("section")[0];
	var download_button = document.getElementById("download_button");

	if (sectionload.style.display == "none") {
		sectionload.style.display = "block";
	}

	else {
		sectionload.style.display = "none";
	}
}

//window.onscroll = function (e) {
//	var sectionload = document.getElementsByTagName("section")[0];
//	
//	if (sectionload.style.display == "block") {
//		sectionload.style.display = "none";
//	}
//}

// set newest version
document.getElementById("newest").innerHTML = "1.17";


// #################################################################################################
// Spoiler
function spoiler(el) {
	el.classList.toggle("active");
	var panel = el.nextElementSibling;
	if (panel.style.maxHeight){
		panel.style.maxHeight = null;
	} else {
		panel.style.maxHeight = panel.scrollHeight + "px";
	}
}