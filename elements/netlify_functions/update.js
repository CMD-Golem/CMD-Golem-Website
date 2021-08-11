var faunadb = require('faunadb')
var q = faunadb.query


exports.handler = (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	});

	// get counter id and count from url
	var data = JSON.parse(event.body);
	var id = event.path.match(/([^\/]*)\/*$/)[0];

	// update data from db
	return client.query(q.Update(q.Ref(`classes/todos/${id}`), {data}))
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
}