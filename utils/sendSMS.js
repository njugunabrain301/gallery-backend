const axios = require("axios");

async function SendSMS(body, to) {
  if (to.charAt(0) == "0") {
    to = to.substring(1);
    to = "+254" + to;
  } else if (to.charAt(0) != "+") {
    to = "+" + to;
  }

  // let res = await axios.post("https://api.mobitechtechnologies.com/sms/sendsms", {
  //         mobile: to,
  //         response_type: "json",
  //         sender_name: process.env.MOBITECH_SENDER_ID,
  //         service_id: 0,
  //         message: body
  //     }, {
  //             headers: {
  //                 'h_api_key': process.env.MOBITECH_API_KEY
  //             }
  //         });

  let res = await axios.post(
    "https://sms.textsms.co.ke/api/services/sendsms/",
    {
      apikey: process.env.TEXTSMS_API_KEY,
      partnerID: process.env.TEXTSMS_PARTNER_ID,
      message: body,
      shortcode: process.env.TEXTSMS_SENDER_ID,
      mobile: to,
    }
  );

  return res;
}

module.exports = SendSMS;
