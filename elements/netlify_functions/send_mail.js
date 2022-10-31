const client = require('@sendgrid/mail');

exports.handler = async function (event, context, callback) {
	const { message, receiver, subject } = JSON.parse(event.body);
	client.setApiKey(process.env.SENDGRID_SERVER_SECRET);

	const data = {
		to: receiver,
		from: "info@cmd-golem.com",
		subject: subject,
		html: message,
	};

	try {
		await client.send(data);
		return {
			statusCode: 200,
			body: 'Message sent',
		};
	} catch (err) {
		return {
			statusCode: err.code,
			body: JSON.stringify(err),
		};
	}
};
