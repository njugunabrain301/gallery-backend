const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

async function sendPassResetEmail(
  to,
  recipientName,
  resetLink,
  serviceName = "Bunika Messenger",
  servicelink = "https://www.bunika.co.ke"
) {
  let config = {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: serviceName,
      link: servicelink,
    },
  });

  let response = {
    body: {
      name: recipientName,
      intro: "Password Reset",
      action: {
        instructions: "Follow the following link to reset your password:",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: resetLink,
        },
      },
      outro: "Please ignore the request if it wasn't made by you .",
    },
  };

  let mail = MailGenerator.generate(response);
  let sender = "Bunika <contact@bunikasolutions.com>";
  //aways send from go-duka
  if (serviceName === "Go-Duka" || true) {
    sender = "Go-Duka <contact@go-duka.com>";
  }
  let messag = {
    from: sender,
    to: to,
    subject: "Password Reset",
    html: mail,
  };

  let res = await transporter.sendMail(messag);
  return res;
}

async function sendEmail(
  to,
  recipientName,
  body,
  serviceName = "Bunika Messenger",
  servicelink = "https://www.bunika.co.ke",
  subject = "Customer Message",
  showButton = false
) {
  let config = {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: serviceName,
      link: servicelink,
    },
  });

  let response = {
    body: {
      name: recipientName,
      intro: body,
    },
  };
  if (showButton) {
    response.body.action = {
      instructions: "Click the button below to access your dashboard",
      button: {
        color: "#22BC66",
        text: "Go to Dashboard",
        link: "https://admin.go-duka.com",
      },
    };
  }

  let mail = MailGenerator.generate(response);
  let sender = "Bunika <contact@bunikasolutions.com>";
  if (serviceName === "Go-Duka" || true) {
    sender = "Go-Duka <contact@go-duka.com>";
  }
  let messag = {
    from: sender,
    to: to,
    subject: subject,
    html: mail,
  };

  let res = await transporter.sendMail(messag);
  return res;
}

async function forwardMessage(to, name, contact, mess) {
  let config = {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Bunika",
      link: "https://www.bunika.co.ke",
    },
  });

  let response = {
    body: {
      name: "Bunika Messenger",
      intro: "A customer has sent you a message",
      table: {
        data: [
          {
            Name: name,
            contact: contact,
          },
        ],
      },
      outro: [
        "Message:",
        "" + mess,
        "Feel free to use the above information to respond",
      ],
    },
  };

  let mail = MailGenerator.generate(response);
  let messag = {
    from: "Bunika <contact@bunikasolutions.com>",
    to: to,
    subject: "Customer Message",
    html: mail,
  };

  let res = await transporter.sendMail(messag);
  return res;
}

async function sendOrderReceivedEmail(
  to,
  recipientName,
  businessName,
  serviceName = "Bunika Messenger",
  servicelink = "https://www.bunika.co.ke"
) {
  let config = {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: serviceName,
      link: servicelink,
    },
  });

  let response = {
    body: {
      name: businessName,
      intro: "Password Reset",
      table: {
        data: [
          {
            Name: recipientName,
            contact: contact,
          },
        ],
      },
      action: {
        instructions: "You have received a new order:",
        button: {
          color: "#22BC66",
          text: "Go To Orders Page",
          link: servicelink,
        },
      },
      outro: "Kindly get back to the customer as soon as possible",
    },
  };

  let mail = MailGenerator.generate(response);
  let messag = {
    from: process.env.SENDER_EMAIL,
    to: to,
    subject: "Customer Message",
    html: mail,
  };

  let res = await transporter.sendMail(messag);
  return res;
}

async function sendGoDukaWelcomeEmail(
  to,
  recipientName,
  { url, password },
  serviceName = "Bunika Messenger",
  servicelink = "https://www.bunika.co.ke"
) {
  let config = {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: "bunikasolutions@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: serviceName,
      link: servicelink,
    },
  });

  let response = {
    body: {
      name: recipientName,
      intro: [
        "Welcome to Go-Duka",
        "Please use the following credentials to log in to your dashboard",
      ],
      table: {
        data: [
          {
            Username: url,
            Password: password,
          },
        ],
      },
      action: {
        instructions: "Click the button below to access your dashboard",
        button: {
          color: "#22BC66",
          text: "Go to Dashboard",
          link: "https://admin.go-duka.com",
        },
      },
      outro: [
        "Feel free to contact us through the dashboard live chat for any arising issues",
      ],
    },
  };

  let mail = MailGenerator.generate(response);
  let messag = {
    from: "Go-Duka <contact@go-duka.com>",
    to: to,
    subject: "Welcome to Go-Duka",
    html: mail,
  };

  let res = await transporter.sendMail(messag);
  return res;
}

async function sendGoDukaVerificationEmail(
  to,
  recipientName,
  token,
  serviceName = "Bunika Messenger",
  servicelink = "https://www.bunika.co.ke"
) {
  let config = {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: "bunikasolutions@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: serviceName,
      link: servicelink,
    },
  });

  let response = {
    body: {
      name: recipientName,
      intro: [
        "Welcome to Go-Duka",
        "Thank you for joining the Go-Duka community. Together we will scale our businesses to greater heights! 🫡",
      ],

      action: {
        instructions: "Click on the button below to verify your email address",
        button: {
          color: "#22BC66",
          text: "Verify Email",
          link: "https://www.go-duka.com/verify.html?token=" + token,
        },
      },
      outro: [
        "If the above button doesn't work, follow this link: https://www.go-duka.com/verify.html?token=" +
          token,
      ],
    },
  };

  let mail = MailGenerator.generate(response);
  let messag = {
    from: "Go-Duka <contact@go-duka.com>",
    to: to,
    subject: "Welcome to Go-Duka",
    html: mail,
  };

  let res = await transporter.sendMail(messag);
  return res;
}

async function sendQuoteRequest(
  to,
  recipientName,
  { name, contact, cmessage, item },
  serviceName = "Bunika Messenger",
  servicelink = "https://www.bunika.co.ke"
) {
  let config = {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: "bunikasolutions@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: serviceName,
      link: servicelink,
    },
  });

  let response = {
    body: {
      name: recipientName,
      intro: ["You have received a quote request from a client"],
      table: {
        data: [
          {
            name: name,
            contact: contact,
            message: cmessage,
            item: item,
          },
        ],
      },
      outro: ["Kindly get back to the client as soon as you can"],
    },
  };

  let mail = MailGenerator.generate(response);
  let messag = {
    from: "Bunika <contact@bunikasolutions.com>",
    to: to,
    subject: "Quote Request",
    html: mail,
  };

  let res = await transporter.sendMail(messag);
  return res;
}

async function forwardMessage2(
  to,
  recipientName,
  { name, contact, cmessage },
  serviceName = "Bunika Messenger",
  servicelink = "https://www.bunika.co.ke"
) {
  let config = {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: "bunikasolutions@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: serviceName,
      link: servicelink,
    },
  });

  let response = {
    body: {
      name: recipientName,
      intro: ["You have received a message from a client"],
      table: {
        data: [
          {
            name: name,
            contact: contact,
            message: cmessage,
          },
        ],
      },
      outro: ["Kindly get back to the client as soon as you can"],
    },
  };

  let mail = MailGenerator.generate(response);
  let messag = {
    from: "Bunika <contact@bunikasolutions.com>",
    to: to,
    subject: "Customer Message",
    html: mail,
  };

  let res = await transporter.sendMail(messag);
  return res;
}

module.exports = {
  sendEmail,
  forwardMessage,
  sendPassResetEmail,
  sendGoDukaWelcomeEmail,
  sendQuoteRequest,
  sendGoDukaVerificationEmail,
  forwardMessage2,
};
