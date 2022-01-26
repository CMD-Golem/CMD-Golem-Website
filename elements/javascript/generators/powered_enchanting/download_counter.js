// update db
var update = (pack_id, pack_type) => {
	return fetch(`/.netlify/functions/update/${pack_type}/${pack_id}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

// version statistic
var version = (mc_version) => {
	return fetch(`/.netlify/functions/version/${mc_version}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

// update counter
var already_download = false;
var selected_edition = "none";
var mc_version;

function updateCounter() {
	if (already_download != true) {
		already_download = true;

		update("320699416718606924", "datapacks"); // normal counter
		version(mc_version); // version statistic

		// edition counter
		if (selected_edition == "golem") {var edition = "320699550069162572"}
		else if (selected_edition == "all") {var edition = "320699603872645708"}
		else if (selected_edition == "vanilla") {var edition = "320699566604157516"}
		else if (selected_edition == "pack_id") {var edition = "320699587095429708"}
		else {var edition = "320699649726874188"}
		update(edition, "powered_enchanting");

	}
	else {
		console.log("Already downloaded");
	}
}


// Download older versions
function downloadOld(edition, version) {
	selected_edition = edition;
	mc_version = version;
	updateCounter();
}