let nodemailer = require('nodemailer')


module.exports = {
    home,
    privacy,
    term,
    project,
    checker,
    speedtyper,
    portfolio,
    smore,
    sendEmail,
}

function home(req, res) {
    res.render('home')
}

function privacy(req, res) {
    res.render('privacy')
}

function term(req, res) {
    res.render('term')
}

function project(req, res) {
    res.render('projects/project')
}

function checker(req, res) {
    res.render('projects/checker')
}

function speedtyper(req, res) {
    res.render('projects/speedtyper')
}

function portfolio(req, res) {
    res.render('projects/portfolio')
}

function smore(req, res) {
    res.render('projects/smore')
}

function sendEmail(req, res) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN
        }
    });
    let mailOptions = {
        from: req.body.email,
        cc: `${req.body.email}`,
        to: 'mpphuoc@gmail.com',
        subject: `From ${req.body.name} to JoshNguyenToronto`,
        html: `<h3>From: ${req.body.name}</h3>
            <h3>Email: ${req.body.email}</h3>
            <h3>Subject: ${req.body.subject}</h3>
            <h3>Message: </h3>
            <h3>${req.body.message}</h3>`
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.redirect('/')
}