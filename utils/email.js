const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.E_HOST,
    port: process.env.E_PORT,
    auth: {
      user: process.env.E_USERNAME,
      pass: process.env.E_PASSWORD
    }
  });
  // 2) define the email options
  const mailOptions = {
    from: 'Ahmed Taha <instabug@gm.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    //html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
