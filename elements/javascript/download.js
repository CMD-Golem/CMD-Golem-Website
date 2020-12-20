//add element if hash = download

if (window.location.hash.substr(1) == "download") {
	document.getElementsByTagName("section")[0].style.display = "block";
}

function openDownload () {
	var sectionload = document.getElementsByTagName("section")[0];
	var download_button = document.getElementById("download_button");

	if (sectionload.style.display == "none") {
		sectionload.style.display = "block";
		download_button.href = "#download";
	}
	else {
		history.pushState("", document.title, window.location.pathname);
		sectionload.style.display = "none";
		download_button.href = "#";
	}
}