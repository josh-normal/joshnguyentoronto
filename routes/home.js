var express = require('express');
var router = express.Router();

const homeCtrl = require('../controllers/home')


router.get('/', homeCtrl.home);
router.get('/about', homeCtrl.about);
router.get('/privacy', homeCtrl.privacy);
router.get('/term', homeCtrl.term);
router.get('/project', homeCtrl.project);


router.get('/project/checker', homeCtrl.checker);
router.get('/project/speedtyper', homeCtrl.speedtyper);






module.exports = router;