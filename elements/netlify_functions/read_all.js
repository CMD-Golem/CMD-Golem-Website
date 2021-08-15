var faunadb = require('faunadb');
var q = faunadb.query;


exports.handler = (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	});

	// get counter type from url
	var type = event.path.match(/([^\/]*)\/*$/)[0];

	// get data from db
	return client.query(q.Paginate(q.Match(q.Ref(`indexes/${type}`))))
		.then((response) => {
			var todoRefs = response.data;
			var getAllTodoDataQuery = todoRefs.map((ref) => {
				return q.Get(ref);
			})

			return client.query(getAllTodoDataQuery).then((ret) => {
				return {
					statusCode: 200,
					body: JSON.stringify(ret)
				}
			});
		}).catch((error) => {
			return {
				statusCode: 400,
				body: JSON.stringify(error)
			}
		});
}