module.exports = {
    home,
    about,
    privacy,
    term,
    project,
    checker,
    speedtyper,
}



function home(req, res) {
    res.render('home')
}

function about(req, res) {
    res.render('about')
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

