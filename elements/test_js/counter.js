// update db
var update = (pack_id, pack_type, data) => {
	return fetch(`/.netlify/functions/update/${pack_type}/${pack_id}`, {
		body: JSON.stringify(data),
		method: 'POST'
	}).then(response => {
		return response.json()
	})
}

var update2 = (pack_id, pack_type) => {
	return fetch(`/.netlify/functions/update2/${pack_type}/${pack_id}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

// read db
var read = (pack_id, pack_type) => {
	return fetch(`/.netlify/functions/read/${pack_type}/${pack_id}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}


// ###########################################################
var counter_el = document.getElementById("download_counter")

// get Id and type of Pack
var pack_id = counter_el.dataset.ref;
var pack_type = counter_el.dataset.type;


// get counter from db
var counter

Promise.resolve( read(pack_id, pack_type) ).then( function(value) {
	counter = value.data.count;

	// show counter in html
	try {
		counter_el.innerHTML = counter;
	}
	catch (e) {
		console.log("Counter isn't shown on page");
	}
});


// update counter
var already_download = false;

function updateCounter2() {
	if (already_download != true) {
		already_download = true;
		update2(pack_id, pack_type);
	}
	
}

function updateCounter() {
	if (already_download != true) {
		already_download = true;

		update(pack_id, pack_type, {
			count: counter + 1,
			date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDay() + "-" + new Date().getHours() + "-" + new Date().getMinutes() + "-" + new Date().getSeconds()
		});
	}
}


function updateCounter3() {
	if (already_download != true) {
		already_download = true;
		
		var json_counter = counter + 1;
		var json_date = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDay() + "-" + new Date().getHours() + "-" + new Date().getMinutes() + "-" + new Date().getSeconds();
		update(pack_id, {
			count: json_counter,
			date: json_date
		});
	}
}