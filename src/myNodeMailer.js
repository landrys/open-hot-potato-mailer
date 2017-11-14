/*jslint node: true */
"use strict";
var nodemailer = require('nodemailer');
var privateStuff = require('./private');

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: privateStuff.auth
});

module.exports.mailIt = function (to, subject, body) {
    var mailOptions = {
        from: "landryseleven@gmail.com",
        to: to,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent to: " + to);
        }
    });
};
