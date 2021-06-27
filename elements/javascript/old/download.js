//add element if hash = download

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