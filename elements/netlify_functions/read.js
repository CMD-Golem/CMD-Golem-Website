var faunadb = require("faunadb");
var q = faunadb.query;

exports.handler = async (event, context) => {
	// get FaunaDB secret key
	try {
		var client = new faunadb.Client({
			secret: process.env.FAUNADB_SERVER_SECRET
		});
	}
	catch (e) {
		return {
			statusCode: 200,
			body: JSON.stringify("secret key can't be read")
		}
	}
	
	// get counter id from url
	var { id = "Anonymous" } = event.queryStringParameters;

	// get data from db
	return client.query(q.Ref(q.Collection("todos"), id))
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