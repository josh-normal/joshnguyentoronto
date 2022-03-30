var express = require('express');
var router = express.Router();
const homeCtrl = require('../controllers/home')

router.get('/', homeCtrl.home);
router.get('/privacy', homeCtrl.privacy);
router.get('/term', homeCtrl.term);
router.get('/project', homeCtrl.project);


router.get('/project/checker', homeCtrl.checker);
router.get('/project/speedtyper', homeCtrl.speedtyper);
router.get('/project/portfolio', homeCtrl.portfolio);
router.get('/project/smore-recipes', homeCtrl.smore);
router.get('/project/the-exhibit', homeCtrl.exhibit);
router.get('/project/wander-wallet', homeCtrl.wander);
router.get('/project/zoom-clone', homeCtrl.zoom);


module.exports = router;