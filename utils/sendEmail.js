const nodemailer = require('nodemailer');

module.exports = async (email, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      secure: false,
      port: 25,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text
    });

    console.log("email sent successfully");

  } catch (err) {
    console.log(err, "email not sent");
  }
};