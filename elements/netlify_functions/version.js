var faunadb = require('faunadb')
var q = faunadb.query


exports.handler = (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	});

	// get counter id and type from url
	var version = event.path.match(/([^\/]*)\/*$/)[0];

	if (version == "1.18") {
		var id = "316609019004322377";
	}
	else if (version == "1.17") {
		var id = "316609012338524745";
	}
	else if (version == "1.16") {
		var id = "316609003869176393";
	}
	else if (version == "1.15") {
		var id = "316608994697282121";
	}
	else if (version == "1.14") {
		var id = "316608985993052745";
	}
	else if (version == "1.13") {
		var id = "316608972792529481";
	}
	else if (version == "other_version") {
		var id = "316612235991450185";
	}
	else {
		return;
	}
	

	// get data from db
	return client.query(q.Get(q.Ref(`classes/versions/${id}`))).then((current) => {

		var current_data = JSON.parse(JSON.stringify(current)).data;

		// update counter
		var data = {
			downloads: current_data.downloads + 1
		}
		
		data = JSON.parse(JSON.stringify(data));

		// update data in db
		return client.query(q.Update(q.Ref(`classes/versions/${id}`), {data}))
			.then((response) => {
				return {
					statusCode: 200,
					body: JSON.stringify(response)
				}
			}).catch((error) => {
				return {
					statusCode: 400,
					body: JSON.stringify(error)
				}
			})
		});

	
}