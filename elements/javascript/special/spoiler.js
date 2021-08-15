function spoiler(el) {
	el.classList.toggle("active");
	var panel = el.nextElementSibling;
	if (panel.style.maxHeight) {
		panel.style.maxHeight = null;
	}
	else {
		panel.style.maxHeight = panel.scrollHeight + "px";
	}
}

function closeSpoiler(el) {
	var other_el = document.getElementsByClassName("spoiler_title");
	if (el.classList.contains("active") == true) {
		var active_el = true;
	}

	for (var i = 0; i < other_el.length; i++) {
		other_el[i].classList.remove("active");
		other_el[i].nextElementSibling.style.maxHeight = null;
	}

	if (el.classList.contains("spoiler_title") == true) {
		var panel = el.nextElementSibling;
		if (active_el != true) {
			el.classList.add("active");
			panel.style.maxHeight = panel.scrollHeight + "px";
		}
	}
}