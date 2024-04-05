const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (userEmail, next, verificationToken) => {
  const msg = {
    // to: `${userEmail}`,
    to: "pawel@brzoza.net",
    from: "pawel@brzoza.net",
    subject: "Confirm your email address",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  try {
    const email = await sgMail.send(msg);
    console.log(email);
    return email;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { sendVerificationEmail };
