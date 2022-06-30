const jwt = require('jsonwebtoken');
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.user
        const userVerify = jwt.verify(token, "sfjdgslkhadfjlagh;sldjgkjhfljfljfljfjhfluygjghd;gajd;kfh");
        const user = await User.findOne({ _id: userVerify._id });
        const id = user._id;
        req.user = user;
        req.token = token;
        req.id = id;
        next();
    } catch (error) {
        res.status(401).redirect("/SignIn")
    }
}

module.exports = auth