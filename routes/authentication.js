const express = require('express');
const passport = require('passport');

const router = express.Router();

const User = require('../models/userModel');

router.get('/login',(req,res,next)=>{
    res.render('loginRegister/login',{title:'LOGIN PAGE'});
});

router.get('/logout',(req,res,next)=>{
    if(!req.session.token){
        res.render("LoginRequired");
    }else{
    req.session.userId=null;
    req.session.token=null;
    res.render('dashboard/index',{title:'Sucessfully logout',image:"logout.png"});
    }
});

router.get('/register',(req,res,next)=>{
    res.render('loginRegister/register',{title:'REGISTER PAGE'});
});

/* Registering a new User into mongoDB. */
router.post('/register',async function(req, res, next) {
    const user = new User(req.body);
    await user.setHashedPassword();
    user.save((err,savedUser)=>{
        if(err){
            console.log('Error occured while saving user',err);
            res.render('dashboard/index', { title: 'User not registered',image:"failure.png" });
        }
        console.log(" User is succesfully saved..!!!",savedUser);
        res.render('dashboard/index', { title: 'User registered succesfully',image:"success.png"});
    });
});

//login
router.post('/login', passport.authenticate("local",{session:false}),
 function(req, res, next) {
     const userdata = req.user.toAuthJson();
     req.session.token=userdata.token;
     req.session.userId= userdata._id;
     res.render('dashboard/index',{ title: 'Succesfully Logged In',image:"login.png" });
});
module.exports=router;