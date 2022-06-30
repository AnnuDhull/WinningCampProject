const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const newUser = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: [/^\d{10}$/, "Please Enter a Valid Phone Number"]
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    appoinments: [{
        appoinmentId: {
            type: String,
        }
    }],
    cart: [{
        item: {
            type: String,
        }
    }],
    orders: [{
        orderid: {
            type: String,
        }
    }],
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});


newUser.methods.GenerateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, "sfjdgslkhadfjlagh;sldjgkjhfljfljfljfjhfluygjghd;gajd;kfh");
        this.tokens = this.tokens.concat({ token: token });
        await this.save()
        return token;
    } catch (error) {
        res.send(`Error ===>> ${error}`)
    }
}

newUser.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

const User = new mongoose.model("User", newUser);

module.exports = User;