const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userModel');

passport.use(
    new LocalStrategy((username,password,done)=>{
        User.findOne(
        {
            username
        },
        async (err,user)=>{
            if(err){
                //make passport understand that some error occured
                return done(err);
            }
            if(!user || !(await user.validatePassword(password))){
                return done(null,false)
            }
            return done(null,user);
        })
    })
);