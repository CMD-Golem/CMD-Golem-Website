const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = (event, context) => {
	/* configure faunaDB Client with our secret */
	const client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	}) 
	const data = JSON.parse(event.body)
	const id = getId(event.path)
	return client.query(q.Update(q.Ref(`classes/todos#${id}`), {data}))
		.then((response) => {
			console.log('success', response)
			return {
				statusCode: 200,
				body: JSON.stringify(response)
			}
		}).catch((error) => {
			console.log('error', error)
			return {
				statusCode: 400,
				body: JSON.stringify(error)
			}
		})
}


function getId(urlPath) {
	return urlPath.match(/([^\/]*)\/*$/)[0];
}