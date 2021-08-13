var faunadb = require('faunadb');
var q = faunadb.query;


exports.handler = (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	})

	// get counter id from url
	var id = event.path.match(/([^\/]*)\/*$/)[0];
	var type = event.path.replace("/" + id, "").match(/([^\/]*)\/*$/)[0];

	// get data from db
	return client.query(q.Get(q.Ref(`classes/${type}/${id}`)))
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