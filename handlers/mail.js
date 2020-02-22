const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const OAuth2Client = new OAuth2(
	process.env.MAIL_CLIENT_ID, // ClientID
	process.env.MAIL_CLIENT_SECRET, // Client Secret
	"https://developers.google.com/oauthplayground" // Redirect URL
);

// setting up oauth credential
OAuth2Client.setCredentials({
	refresh_token: process.env.MAIL_REFRESH_TOKEN
});

// generating access token
const accessToken = OAuth2Client.getAccessToken()
	.then(res => {
        return res.token;
    })
	.catch(err => console.log(err));

const transport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: process.env.MAIL_USER,
		clientId: process.env.MAIL_CLIENT_ID,
		clientSecret: process.env.MAIL_CLIENT_SECRET,
		refreshToken: process.env.MAIL_REFRESH_TOKEN,
		accessToken: accessToken
	},
	tls: {
		rejectUnauthorized: false
	}
});

exports.sendMail = (receiver, subject, message, link=``) => {
	const mailOptions = {
		from: `POMP - Pizza on my Plate <${process.env.MAIL_USER}>`,
		to: receiver,
		subject: subject,
		html: generateHTMLTemplate(message, link)
	};
	return transport.sendMail(mailOptions);
};


// generating html email template
function generateHTMLTemplate(message, link=``){
	return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width" initial-scale="1">
			<!--[if !mso]>
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<![endif]-->
			<meta name="x-apple-disable-message-reformatting">
			<!--[if mso]>
				<style>
					* { font-family: sans-serif !important; }
				</style>
			<![endif]-->
		</head>
		<body>
			<div style="width: 90%; margin: 0 5%;">
				<h1 style="font-size: 1.5em; font-weight: bold; margin-bottom: 15px;">Hello!</h1>
				<p style="font-size: 1.15em; margin-bottom: 10px;">${message}</p>
				
				<a href='${link}' target='_blank'>${link}</a>

				<p style="font-size: 1.15em;margin-bottom: 10px;">You can write back to us regarding any queries, suggestions or issues. We're all ears!</p>
				<p style="font-size: 1.15em;margin-bottom: 10px;">Have a nice day.</p>
				<p style="font-size: 1.15em;margin-bottom: 3px;">Regards. Pizza on my Plate.</p>
			</div>
		</body>
		</html>`;
}