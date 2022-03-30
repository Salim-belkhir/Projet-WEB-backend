const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

router.post('/signup/client', function(req, res){
    return userCtrl.signup(req,res);
});
router.post('/login/client', userCtrl.loginClient);


router.post('/login/society', userCtrl.loginSociety);

router.post('/signup/society', userCtrl.signupSociety);



module.exports = router;