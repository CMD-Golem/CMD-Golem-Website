var faunadb = require('faunadb')
var q = faunadb.query;

var version_id = [
	"316612235991450185", // other versions
	"316608972792529481", // 1.13
	"316608985993052745", // 1.14
	"316608994697282121", // 1.15
	"316609003869176393", // 1.16
	"316609012338524745", // 1.17
	"316609019004322377", // 1.18
	"325220181196407372"  // 1.19
];

var reset_data = {downloads: 0};

exports.handler = async (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	});

	// get counter id and type from url
	var version = event.path.match(/([^\/]*)\/*$/)[0];
	
	if (version == "1.19") { var id = version_id[7]; }
	else if (version == "1.18") { var id = version_id[6]; }
	else if (version == "1.17") { var id = version_id[5]; }
	else if (version == "1.16") { var id = version_id[4]; }
	else if (version == "1.15") { var id = version_id[3]; }
	else if (version == "1.14") { var id = version_id[2]; }
	else if (version == "1.13") { var id = version_id[1]; }
	else if (version == "other_version") { var id = version_id[0]; }
	else { return; }

	// ################################################################################
	// monthly report
	var last_month = await client.query(q.Get(q.Ref("classes/monthly_report/360186043721319002")));
	var current_month = new Date().getUTCMonth() + 1;

	if (current_month != last_month.data.last_recorded_month) {
		var data_array = [];

		// get current data of all versions and reset db
		for (var i = 0; i < version_id.length; i++) {
			var version_data = await client.query(q.Get(q.Ref(`classes/versions/${version_id[i]}`)));
			data_array.push(JSON.parse(JSON.stringify(version_data)).data);
			// await client.query(q.Update(q.Ref(`classes/versions/${version_id[i]}`), {data:reset_data}))
		}

		// array to object
		var version_dates = data_array.reduce((obj, cur) => ({...obj, [cur.key]: cur.downloads}), {}); //https://stackoverflow.com/a/67042616/14225364

		var data = {
			date: new Date(),
			versions: version_dates
		}

		// upload stats
		data = JSON.parse(JSON.stringify(data));
		await client.query(q.Create(q.Collection("monthly_report"), {data:data}));

		// update last month store
		var update_month = {
			last_recorded_month: current_month
		};

		update_month = JSON.parse(JSON.stringify(update_month));
		await client.query(q.Update(q.Ref("classes/monthly_report/360186043721319002"), {data:update_month}));
	}

	// ################################################################################
	// get data from db
	var current = await client.query(q.Get(q.Ref(`classes/versions/${id}`)));
	var current_data = JSON.parse(JSON.stringify(current)).data;

	// update counter
	var data = {
		downloads: current_data.downloads + 1
	}

	data = JSON.parse(JSON.stringify(data));
	await client.query(q.Update(q.Ref(`classes/versions/${id}`), {data:data}))
}