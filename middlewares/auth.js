const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const authenticateEmployeeJWT = (req, res, next) => {
    const authHeader = req.headers.authorization ;
    //|| window.localStorage.getItem('token');
    //let token = req.cookies['x-access-token'];
    let token ="";
    if(authHeader){
       token = authHeader.split(' ')[1];
    }else{
        token = req.session.token;
    }
    if (token) {
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.json({statusCode:err.message, message:err.message});
            }
            const {role} = user;
            if(role == "employee"){
                next();
            }else{
                res.render('unauthorized',{actual:role,expected:"employee"});
            }
        });
    } else {
        res.render("LoginRequired");
    }
};

const authenticateManagerJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token ="";
    if(authHeader){
       token = authHeader.split(' ')[1];
    }else{
        token = req.session.token;
    }
    if (token) {
        //const token = authHeader.split(' ')[1];

        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.json({statusCode:err.message, message:err.message});
            }
            const {role} = user;
            if(role == "manager"){
                next();
            }else{
                res.render('unauthorized',{actual:role,expected:"manager"});
            }
        });
    } else {
        res.render("LoginRequired");
    }
};
module.exports= {
    authenticateEmployeeJWT,
    authenticateManagerJWT
};