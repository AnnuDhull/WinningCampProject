const mongoose = require('mongoose');

const addAppoinment = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    datetime: {
        type: String,
        required: true,
    },
    specility: {
        type: String,
        required: true,
    },
    problem: {
        type: String,
        required: true,
    },
    doctorname: {
        type: String,
        required: true,
    },
    doctorid: {
        type: String,
        required: true,
    }
})

const Appoinment = new mongoose.model("Appoinment", addAppoinment);

module.exports = Appoinment;