const httpStatus = require('http-status');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require('../../models');

const generateOtp = () => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

const register = async (data) => {
    try {
        const users = await User.findOne({ email: data.email });
        if (users) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "User already exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.password, salt);
        const createUser = await User.create({ ...data, password: hashPassword, mobile: 'null' })
        if (createUser) {
            await global.salons[data.salonId].Customer.create({ ...data, password: hashPassword, })
            const token = jwt.sign({ _id: createUser._id }, process.env.JWT_SECRET);
            return ({ status: httpStatus.OK, user: createUser, message: "User registered successfully", token: token });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to register user" });

    }


}

const login = async (data) => {
    try {
        const user = await User.findOne({ email: data.email });

        if (!user) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "User does not exist" });
        }

        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword)
            return ({ status: httpStatus.NOT_FOUND, message: "Incorrect password" });
        const token = jwt.sign({ _id: user._id, salon: user.salonId }, process.env.JWT_SECRET);


        return ({ status: httpStatus.OK, user: user, token: token, message: "Login Success" });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to login" });

    }

}

const details = async (data) => {
    try {
        console.log(data);
        const user = await User.findById(data);

        // const bookings = await global.salons[user.salonId].Order.find().sort({ _id: -1 });
        return ({ status: httpStatus.OK, user: user, message: "User details found successfully" });

    } catch (error) {
        return ({ status: httpStatus.NOT_FOUND, message: "user does not exist" });

    }
}

const forgotpassword = async (data) => {
    try {
        const user = await global.salons[data.salonId].Customer.findOne({ mobile: data.mobile })
        if (!user) {
            return ({ status: httpStatus.NOT_FOUND, message: "user does not exist" });
        }
        const otp = generateOtp();
        const message = `${otp} OTP for forgot password`
        // console.log("SMS SEND", sendSmsService);
        // const sendSms = await smsSend(data.mobile, message);
        // console.log(sendSms);
        // if (sendSms) {
        await global.salons[data.salonId].Customer.findByIdAndUpdate(user._id, { otp: otp })
        // }
        return ({ status: httpStatus.OK, message: `OTP sent successfully, OTP is ${otp}` });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Fail to send OTP" });
    }
}

const changeForgotPassword = async (data) => {
    try {
        const user = await global.salons[data.salonId].Customer.findOne({ email: data.email, otp: data.otp })
        if (!user) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Invalid OTP" });
        }
        await global.salons[data.salonId].Customer.findByIdAndUpdate(user._id, { otp: null })
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.newPassword, salt);
        await global.salons[data.salonId].Customer.findByIdAndUpdate(user._id, { password: hashPassword })
        return ({ status: httpStatus.OK, message: 'Password Changed Successfully' });

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to change password" });

    }

}

const updateDetails = async (data) => {
    try {
        await User.findByIdAndUpdate(data.id, { ...data });
        const user = await User.findById(data.id)
        return ({ status: httpStatus.OK, user: user, message: "Profile updated successfully" });

    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to update profile" });

    }
}


const getBookings = async (userId, data) => {
    try {
        console.log(userId, data);
        const booking = await global.salons[data.salonId].Order.find({ userId: userId });
        return ({ status: httpStatus.OK, data: booking, message: "Profile updated successfully" });

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to update profile" });

    }
}


module.exports = {
    register, login, details, forgotpassword, changeForgotPassword, updateDetails, getBookings
}
