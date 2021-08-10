// set Id of Pack
var pack_id = "306377119249728068";

// get counter from db
var counter = read(pack_id).data.count;

// get element to show counter
try {
	document.getElementById("download_counter").innerHTML = counter;
}
catch (e) {
	console.log("Cocunter isn't shown on page");
}


// update counter
function updateCounter() {
	update(pack_id, {
		count: counter + 1;
		date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getHours() + "-" + new Date().getMinutes() + "-" + new Date().getSeconds();
	});
}


// update db
const update = (pack_id, data) => {
	return fetch(`/.netlify/functions/update/${pack_id}`, {
		body: JSON.stringify(data),
		method: 'POST'
	}).then(response => {
		return response.json()
	})
}


// read db
const read = (pack_id) => {
	return fetch(`/.netlify/functions/read/${pack_id}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}