const faunadb = require('faunadb');
const q = faunadb.query;


exports.handler = (event, context) => {
	// get FaunaDB secret key
	const client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	})

	// get counter id from url
	const id = event.path.match(/([^\/]*)\/*$/)[0];

	// get data from db
	return client.query(q.Get(q.Ref(`classes/todos/${id}`)))
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