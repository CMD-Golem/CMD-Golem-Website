var faunadb = require('faunadb')
var q = faunadb.query;

var current_month = new Date().getUTCMonth();
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

exports.handler = async (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	});

	var storage_document = await client.query(q.Get(q.Ref("classes/version_statistics/382300719583068224")));
	var main_id = event.path.match(/([^\/]*)\/*$/)[0];

	if (current_month + 1 != storage_document.data.last_recorded_month) {
		// generate new document on new months
		var data = {
			date: months[current_month] + " " + new Date().getUTCFullYear(),
			versions: {}
		};
		data.versions[main_id] = 1;

		var new_doc = await client.query(q.Create(q.Collection("version_statistics"), {data:data}));

		// update storage document
		var new_id = new_doc.ref.value.id;

		var update_month = {
			current_doc: new_id,
			last_recorded_month: current_month + 1
		};

		await client.query(q.Update(q.Ref("classes/version_statistics/382300719583068224"), {data:update_month}));
	}
	else {
		// update document
		var doc_id = storage_document.data.current_doc;
		var doc = await client.query(q.Get(q.Ref(`classes/version_statistics/${doc_id}`)));
		var counter = doc.data.versions[main_id];

		if (counter == undefined) { counter = 1; }
		else { counter++; }

		doc.data.versions[main_id] = counter;

		await client.query(q.Update(q.Ref(`classes/version_statistics/${doc_id}`), {data:doc.data}));
	}

	return { statusCode: 200 };
}