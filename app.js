const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dashboardRouter = require('./routes/dashboard');
const authenticationRouter = require('./routes/authentication');
const positionsRouter = require('./routes/positions');
const session = require('express-session');
// const socket = require('socket.io');



//auth middlware
const auth = require('./middlewares/auth');
const db = require('./database/db');

 //to use passport
require('./config/passport');


const app = express();

const server = app.listen(3000,function(){
 console.log("app is running on port 3000...!!!");
});


// const io =socket.listen(server);
var io = require('socket.io').listen(server);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//session data
app.use(session(
  {
    secret:'secret',
    key:'session-key',
    cookie:{
      httpOnly:false
    },
    resave:true,
    saveUninitialized:true
  }
));


io.on('connection',(socket)=>{
 console.log('connection to socket has been succesfully made. Socket ID',socket.id);

 socket.on('statusofPositionAsClosed',function(data){
   console.log(`Status of Position requested by ${data.username} for ${data.projectname} has been set as closed`);
 });

 socket.on('notifyRecruiter',function(data){
  console.log(`Position was requested by ${data.employee} for ${data.projectname} which was created by ${data.recruiter}.`);
});

});


db.connectToDatabase(process.env.DB_URL);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', dashboardRouter);
app.use('/auth',authenticationRouter);
// app.use('/positions',auth.authenticateJWT,positionsRouter);
app.use('/positions',positionsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
