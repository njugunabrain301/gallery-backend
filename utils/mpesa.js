const axios = require("axios");
const mongoose = require("mongoose");

// Helper function to generate timestamp
function generateTimestamp() {
  function pad2(n) {
    return n < 10 ? "0" + n : n;
  }
  let date = new Date();
  return (
    date.getFullYear().toString() +
    pad2(date.getMonth() + 1) +
    pad2(date.getDate()) +
    pad2(date.getHours()) +
    pad2(date.getMinutes()) +
    pad2(date.getSeconds())
  );
}

// Helper function to format phone number
function formatPhoneNumber(phone) {
  if (phone[0] === "0") return "254" + phone.slice(1);
  if (phone[0] === "+") return phone.slice(1);
  return phone;
}

// Helper function to generate password
function generatePassword(shortcode, passkey, timestamp) {
  return new Buffer.from(shortcode + passkey + timestamp).toString("base64");
}

class MPESAService {
  constructor() {
    this.shortcode = process.env.MPESA_SHORTCODE || 4123793;
    this.passkey = process.env.MPESA_PASS_KEY;
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    this.secret = process.env.MPESA_SECRET_KEY;
    this.key = process.env.MPESA_CONSUMER_KEY;
  }

  async getAccessToken() {
    try {
      let auth = new Buffer.from(`${this.key}:${this.secret}`).toString(
        "base64"
      );

      let response = await axios.get(
        "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            authorization: `Basic ${auth}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error(`Error getting access token: ${error.message}`);
    }
  }

  async initiateSTKPush({ phone, amount, reference, description }) {
    try {
      amount = 1;
      const token = await this.getAccessToken();
      const timestamp = generateTimestamp();
      const password = generatePassword(
        this.shortcode,
        this.passkey,
        timestamp
      );
      const formattedPhone = formatPhoneNumber(phone);

      const { data } = await axios.post(
        "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: this.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: this.shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: this.callbackUrl,
          AccountReference: reference,
          TransactionDesc: description || "Payment",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        success: true,
        data: { ...data, timestamp },
      };
    } catch (error) {
      console.error("STK Push Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async querySTKStatus(checkoutRequestId) {
    try {
      const token = await this.getAccessToken();
      const timestamp = generateTimestamp();
      const password = generatePassword(
        this.shortcode,
        this.passkey,
        timestamp
      );

      const { data } = await axios.post(
        "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query",
        {
          BusinessShortCode: this.shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        success: true,
        paid: data.ResultCode === "0",
        data,
      };
    } catch (error) {
      console.error("Query STK Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async b2cPayment(phoneNumber, amount, remarks = "Refund") {
    try {
      const token = await this.getAccessToken();
      const timestamp = generateTimestamp();

      // B2C specific parameters
      const commandID = "BusinessPayment"; // For business payments/refunds
      const securityCredential = process.env.MPESA_SECURITY_CREDENTIAL; // Encrypted credential
      const resultURL = `${process.env.BASE_URL}/api/mpesa/b2c-result`; // Callback URL for results
      const queueTimeOutURL = `${process.env.BASE_URL}/api/mpesa/b2c-timeout`; // Timeout URL
      const initiatorName = process.env.MPESA_INITIATOR_NAME;
      const occassion = "Refund";

      const { data } = await axios.post(
        "https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
        {
          InitiatorName: initiatorName,
          SecurityCredential: securityCredential,
          CommandID: commandID,
          Amount: amount,
          PartyA: this.shortcode,
          PartyB: phoneNumber.replace("+", ""),
          Remarks: remarks,
          QueueTimeOutURL: queueTimeOutURL,
          ResultURL: resultURL,
          Occassion: occassion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("B2C Payment Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new MPESAService();
