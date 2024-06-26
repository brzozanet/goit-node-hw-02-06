const sendgridMail = require("@sendgrid/mail");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (userEmail, next, verificationToken) => {
  const verificationMessage = {
    to: `${userEmail}`,
    // to: `pawel@brzoza.net`, // NOTE: uncomment it for tests
    from: `pawel@brzoza.net`,
    subject: `Confirm your email address`,
    text: `Click on the link to confirm your account: http://localhost:3000/api/users/verify/${verificationToken}`,
    html: `<strong>Click on the link</strong> to confirm your account: http://localhost:3000/api/users/verify/${verificationToken}`,
  };

  try {
    const email = await sendgridMail.send(verificationMessage);
    return email;
  } catch (error) {
    console.error("Something went wrong: ", error);
    next(error);
  }
};

module.exports = { sendVerificationEmail };
