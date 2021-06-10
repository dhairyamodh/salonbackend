const axios = require("axios");
const httpStatus = require("http-status");
const config = require('../config/config')

const SMS_MOBILE = config.sms.SMS_MOBILE;
const SMS_PASSWORD = config.sms.SMS_PASSWORD;
const SMS_SENDER_ID = config.sms.SMS_SENDER_ID;

const smsSend = async (mobile, message) => {

    try {
        let response = await axios.get(
            `http://sms.ktplin.com/smsstatuswithid.aspx?mobile=${SMS_MOBILE}&pass=${SMS_PASSWORD}&senderid=${SMS_SENDER_ID}&to=${mobile}&msg=${message}`
        );
        return ({ status: httpStatus.OK, message: response })
    } catch (e) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: e })
    }
};
module.exports = smsSend;
