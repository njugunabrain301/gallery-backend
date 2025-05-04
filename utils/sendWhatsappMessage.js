const https = require("follow-redirects").https;

function formatPhoneNumber(phoneNumber) {
  // Remove any non-digit characters except the first character
  phoneNumber = phoneNumber.replace(/\D(?!^)/, "");

  // Check the first character
  if (phoneNumber.startsWith("0")) {
    // Replace '0' with '254'
    phoneNumber = "254" + phoneNumber.slice(1);
  } else if (phoneNumber.startsWith("+254")) {
    // Remove the '+' character
    phoneNumber = phoneNumber.slice(1);
  }

  return phoneNumber;
}

function sendWhatsAppOrderMessageToStore(recipientPhoneNumber, businessName) {
  recipientPhoneNumber = formatPhoneNumber(recipientPhoneNumber);
  const options = {
    method: "POST",
    hostname: "pep2me.api.infobip.com",
    path: "/whatsapp/1/message/template",
    headers: {
      Authorization:
        "App c801aa01e01e29184c20d9194f859930-d9651395-701f-49ff-8cfb-e8ac53f45dd9",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    maxRedirects: 20,
  };

  const req = https.request(options, (res) => {
    let chunks = [];

    res.on("data", (chunk) => {
      chunks.push(chunk);
    });

    res.on("end", () => {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });

    res.on("error", (error) => {
      console.error(error);
    });
  });

  const postData = JSON.stringify({
    messages: [
      {
        from: "12094359621", // Your WhatsApp sender number
        to: recipientPhoneNumber,
        messageId: "70827a58-c507-4680-a5b7-b8431ac8a15e",
        content: {
          templateName: "order_received_seller",
          templateData: {
            body: {
              placeholders: [businessName],
            },
          },
          language: "en",
        },
      },
    ],
  });

  req.write(postData);
  req.end();
}

function sendWhatsAppOrderMessageToCustomer(
  recipientPhoneNumber,
  businessName,
  customerName,
  businessPhone
) {
  recipientPhoneNumber = formatPhoneNumber(recipientPhoneNumber);
  const options = {
    method: "POST",
    hostname: "pep2me.api.infobip.com",
    path: "/whatsapp/1/message/template",
    headers: {
      Authorization:
        "App c801aa01e01e29184c20d9194f859930-d9651395-701f-49ff-8cfb-e8ac53f45dd9",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    maxRedirects: 20,
  };

  const req = https.request(options, (res) => {
    let chunks = [];

    res.on("data", (chunk) => {
      chunks.push(chunk);
    });

    res.on("end", () => {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });

    res.on("error", (error) => {
      console.error(error);
    });
  });

  const postData = JSON.stringify({
    messages: [
      {
        from: "12094359621", // Your WhatsApp sender number
        to: recipientPhoneNumber,
        messageId: "70827a58-c507-4680-a5b7-b8431ac8a15e",
        content: {
          templateName: "order_received_customer_2",
          templateData: {
            body: {
              placeholders: [businessName, customerName, businessPhone],
            },
          },
          language: "en",
        },
      },
    ],
  });

  req.write(postData);
  req.end();
}

module.exports = {
  sendWhatsAppOrderMessageToStore,
  sendWhatsAppOrderMessageToCustomer,
};
