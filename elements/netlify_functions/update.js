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

		// update counter
		var data = {
			count: JSON.parse(JSON.stringify(current)).data.count + 1,
			date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + "-" + new Date().getHours() + "-" + new Date().getMinutes() + "-" + new Date().getSeconds()
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