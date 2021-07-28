const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Salon } = require("../models/backEnd/superAdmin/");

async function auth(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).send({ message: "Access denied" });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).send({ message: "Access denied" });
        }
        const userId = verified._id;
        const users = await User.findById(userId);
        if (!users) {
            console.log('sdjhsjdhjshdjh sjdh jashjkdhjshdj');
            // return res.status(404).send({ message: "user not found" });
        }
        req.userId = verified._id;
        const checkrole = users.role != 'customer'
        if (users.salonId && checkrole) {
            if (users.branchId) { req.branchId = users.branchId }
            const salon = await Salon.findById(users.salonId)
            if (salon.subscription.endDate != undefined) {
                if (salon.subscription.endDate <= new Date()) {
                    return res.status(401).send({ message: "Your subscription is expired" });
                }
            } else {
                return res.status(401).send({ message: "Your subscription is expired" });
            }
            req.salondb = await users.salonId

        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Invalid Token" });
    }
}
module.exports = auth;
