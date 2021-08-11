exports.handler = async (event, context) => {
  var { id = "Anonymous" } = event.queryStringParameters;


  return {
    statusCode: 200,
    body: JSON.stringify(`Hello, ${id}`)
  };
};