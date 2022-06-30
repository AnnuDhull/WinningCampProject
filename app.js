require("dotenv").config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CP = require('cookie-parser');
const hbs = require('hbs');
const port = process.env.PORT || 8000;
const app = express();


// FOR EXPRESS SPECIFIC STUFF
app.use("/static", express.static("static")); // for serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Middleware
app.use(CP());
const auth = require('./src/middleware/auth')


// FOR hbs SPECIFIC STUFF
app.set("view engine", "hbs"); // set the template engine
app.set("views", "./templates/views/"); // set path for templates directory

hbs.registerPartials("./templates/partials/");


// DataBase
require("./src/db/conn");
const User = require("./src/models/user");
const Contact = require("./src/models/contact");
const Appoinment = require("./src/models/appoinments");

app.get("/", (req, res) => {
    res.render("home.hbs");
})
app.get("/Products", (req, res) => {
    res.render("products");
})
app.get("/Facility", (req, res) => {
    res.render("facility");
})
app.get("/Review", (req, res) => {
    res.render("review");
})
app.get("/Contact", (req, res) => {
    res.render("contactus");
})
app.get("/User", auth, (req, res) => {
    res.render("user");
})
app.get("/SignUp", (req, res) => {
    res.render("signup");
})
app.get("/SignIn", (req, res) => {
    res.render("signin");
})
app.get("/ForgotPassword", (req, res) => {
    res.render("forgotpassword");
})
app.get("/*", (req, res) => {
    res.render("404");
})


// Post Requests

// User Register
app.post("/Register", async (req, res) => {
    try {
        const { PhoneNumber, Email, Password, CPassword } = req.body
        const AddUser = new User({
            name: req.body.Name,
            phone: req.body.PhoneNumber,
            email: req.body.Email,
            password: req.body.Password
        });
        if (Password !== CPassword) {
            throw ('Passwords Not Match')
        }
        const token = await AddUser.GenerateAuthToken();
        res.cookie("user", token, {
            expires: new Date(Date.now() + 99999999),
            httpOnly: true
        })
        await AddUser.save();
        res.status(201).redirect("/");
    } catch (error) {
        res.status(400).send(error);
    }
})

// User LogIn
app.post("/Login", async (req, res) => {
    try {
        const { Email, Password } = req.body
        const userEmail = await User.findOne({ email: Email });
        const isMatch = await bcrypt.compare(Password, userEmail.password);
        if (isMatch) {
            const token = await userEmail.GenerateAuthToken();
            res.cookie("user", token, {
                expires: new Date(Date.now() + 99999999),
                httpOnly: true
            })
            res.status(201).redirect("/");
        } else {
            res.status(404).redirect("/SignIn");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

// Contact Us 
app.post("/Contact", async (req, res) => {
    try {
        const addContact = new Contact({
            name: req.body.Name,
            email: req.body.Email,
            subject: req.body.Subject,
            message: req.body.Message
        })
        await addContact.save()
        res.status(200).redirect("/")
    } catch (error) {
        res.status(400).send(error);
    }
})






app.listen(port, () => {
    console.log(`server started at port ${port}`);
})