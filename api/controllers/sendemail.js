const nodemailer = require('nodemailer');

export const sendEmail = (req, res) => {
let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
       user: 'put_your_username_here',
       pass: 'put_your_password_here'
    }
});

const message = {
    from: 'user@social.com', // Sender address
    to: 'to@email.com',         // List of recipients
    subject: 'your comment update', // Subject line
    text: 'your comment is update !' // Plain text body
};
transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
});

}