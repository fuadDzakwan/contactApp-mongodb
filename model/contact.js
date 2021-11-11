const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
// create schema 
const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true
    },
    nohp : {
        type: String,
        required: true
    },
    email: {
        type: String,

    },
});

// modul-exports
module.exports = {Contact}