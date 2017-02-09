var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signUp', { title: 'NewWorld' });
});

router.get("/login", function(req,res,next) {
  res.render('login',{title: 'new world'});
});

router.get("/dashboard", function(req,res,next){
  res.render('dashboard',{title: req.body.fullName});
});
module.exports = router;
