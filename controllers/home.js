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
    exhibit,
}

function home(req, res) {
    setTimeout(() => {
        res.render('home')
    }, 500)
}

function privacy(req, res) {
    res.render('privacy')
}

function term(req, res) {
    res.render('term')
}

function project(req, res) {
    setTimeout(() => {
        res.render('projects/project')
    }, 500)
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

function exhibit(req, res) {
    res.render('projects/exhibit')
}
