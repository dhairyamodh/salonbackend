const httpStatus = require('http-status');
const { User } = require('../models')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getUserBranchCode = require('../middlewares/userBranchCode');
const smsSend = require('./sms.service');
// const dbswitch = async (user) => {

//     switch (user.role) {
//         case 'salonadmin':
//             await setrestaurantdb(user.restaurantId)
//             break;

//         default:
//             break;
//     }
// }
const generateOtp = () => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

const login = async (data) => {
    try {
        const user = await User.findOne({ mobile: data.mobile });
        if (user.salonId) {
            console.log(global.salons);

            let salonUser = await global.salons[user.salonId].SalonUser.findOne({ status: true, userMobile: data.mobile })
            if (!salonUser) {
                return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Inactive User" });
            }
        }
        if (!user) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "User does not exist" });
        }

        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword)
            return ({ status: httpStatus.NOT_FOUND, message: "Incorrect password" });
        const token = jwt.sign({ _id: user._id, salon: user.salonId }, process.env.JWT_SECRET);

        const newuser = await getUserBranchCode(user)

        return ({ status: httpStatus.OK, user: newuser, token: token, message: "Login Successs" });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to login" });

    }

}

const details = async (data) => {
    let user = await User.findOne({ _id: data });
    if (!user) {
        return ({ status: httpStatus.NOT_FOUND, message: "user does not exist" });
    }
    const newuser = await getUserBranchCode(user)
    return ({ status: httpStatus.OK, user: newuser, message: "User details found successfully" });
}

const forgotpassword = async (data) => {
    try {
        const user = await User.findOne({ mobile: data.mobile })
        if (!user) {
            return ({ status: httpStatus.NOT_FOUND, message: "user does not exist" });
        }
        const otp = generateOtp();
        const message = `${otp} OTP for forgot password`
        // console.log("SMS SEND", sendSmsService);
        // const sendSms = await smsSend(data.mobile, message);
        // console.log(sendSms);
        // if (sendSms) {
        await User.findByIdAndUpdate(user._id, { otp: otp })
        // }
        return ({ status: httpStatus.OK, message: `OTP sent successfully, OTP is ${otp}` });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Fail to send OTP" });
    }
}

const changeForgotPassword = async (data) => {
    try {
        const user = await User.findOne({ email: data.email, otp: data.otp })
        if (!user) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Invalid OTP" });
        }
        await User.findByIdAndUpdate(user._id, { otp: null })
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.newPassword, salt);
        await User.findByIdAndUpdate(user._id, { password: hashPassword })
        return ({ status: httpStatus.OK, message: 'Password Changed Successfully' });

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to change password" });

    }

}

module.exports = {
    login, details, forgotpassword, changeForgotPassword
}
