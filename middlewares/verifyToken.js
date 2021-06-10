const jwt = require("jsonwebtoken");
const { User } = require("../models");
const Salon = require("../models/backEnd/superAdmin/salon.model");

async function auth(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).send({ message: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).send({ message: "Access denied" });
        }
        const userId = verified._id;

        const users = await User.findOne({ _id: userId });

        if (!users) {
            return res.status(404).send({ message: "user not found" });
        }
        req.userId = verified._id;
        if (users.salonId) {
            if (users.branchId) { req.branchId = users.branchId }
            const salon = await Salon.findById(users.salonId)
            if (salon.subscription.endDate != undefined) {
                if (salon.subscription.endDate <= new Date()) {
                    res.status(401).send({ message: "Your subscription is expired" });
                }
            } else {
                res.status(401).send({ message: "Your subscription is expired" });
            }
            req.salondb = users.salonId
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Invalid Token" });
    }
}
module.exports = auth;
