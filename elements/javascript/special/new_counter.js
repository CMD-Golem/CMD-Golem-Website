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
	return fetch(`/.netlify/functions/new_update/${pack_type}/${pack_id}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}


// ###########################################################

var counter_el = document.getElementById("download_counter")

// get id and type of pack
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


// ###########################################################
// Detect Button click
try {
	var buttons = document.getElementsByClassName("dl_counter");
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener("click", updateCounter);
	}
}
catch (e) {
	console.log("Doesn't have download counter");
}

// Detect copying
try {
	var buttons = document.getElementsByClassName("copy_counter");
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener("copy", updateCounter);
	}
}
catch (e) {
	console.log("Doesn't have copy counter");
}