var faunadb = require('faunadb')
var q = faunadb.query


exports.handler = (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	});

	// get counter id and type from url
	var id = event.path.match(/([^\/]*)\/*$/)[0];
	var type = event.path.replace("/" + id, "").match(/([^\/]*)\/*$/)[0];

	// get data from db
	return client.query(q.Get(q.Ref(`classes/${type}/${id}`))).then((current) => {

		var current_data = JSON.parse(JSON.stringify(current)).data

		// set count yesterday / yyesterday
		if (current_data.date.getDate() != new Date().getDate()) {
			var yyesterday = current_data.count_yesterday;
			var yesterday = current_data.count;
		}
		else {
			var yyesterday = current_data.count_yyesterday;
			var yesterday = current_data.count_yesterday;
		}

		// set count last month
		if (current_data.date.getMonth() != new Date().getMonth()) {
			var last_month = current_data.count;
		}
		else {
			var last_month = current_data.count_last_month;
		}

		// update counter
		var data = {
			count: current_data.data.count + 1,
			count_yesterday: yesterday,
			count_yyesterday: yyesterday,
			count_last_month: last_month,
			date: new Date()
		}
		
		data = JSON.parse(JSON.stringify(data));

		// update data in db
		return client.query(q.Update(q.Ref(`classes/${type}/${id}`), {data}))
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