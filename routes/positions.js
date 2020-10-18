const express = require('express');
const router = express.Router();


var io = require('socket.io-client')
var socket = io.connect('http://localhost:3000', {reconnect: true});


const Positions = require('../models/positionsModel');

const UserRequestedPosition = require('../models/userRequestedPosition');

const User = require('../models/userModel');

const auth = require('../middlewares/auth');

router.get('/',auth.authenticateEmployeeJWT,(req,res,next)=>{
    Positions.find({
      status:'open'
    },{ projectname:1,technologies:1,role:1}, function(err, positions) {
      if(err){
        res.render('error',{message:err.message,error:{status:err.status,stack:err.stack}})
      }
        res.render('positions/positionList',{positions: positions});
     });
});

router.get('/positionDetail/:projectname',auth.authenticateEmployeeJWT,(req,res,next)=>{
  Positions.findOne({
    projectname: req.params.projectname.replace("%20"," ")
  }, function(err, positions) {
    if(err){
      res.render('error',{message:err.message,error:{status:err.status,stack:err.stack}})
    }
      res.render('positions/positionDetail',{position: positions});
   });
});


//add a new position in db
router.get('/addposition',auth.authenticateManagerJWT,(req,res,next)=>{
  res.render('positions/addposition',{title:"ADD POSITION"});
 });

//add a new position in db
router.post('/addposition',auth.authenticateManagerJWT,(req,res,next)=>{
 const position = new Positions(req.body);
 position.save((err,savedPosition)=>{
  if(err){
    console.log('Error occured while saving position')
  }
  res.json(savedPosition);
 });
});

//add a new position in db
router.get('/updatestatusofposition',auth.authenticateManagerJWT,(req,res,next)=>{
  Positions.find({},{projectname:1}, function(err, positions) {
    if(err){
      res.render('error',{message:err.message,error:{status:err.status,stack:err.stack}})
    }
      res.render('positions/updateposition',{title:"UPDATE POSITION",positions: positions});
   });
});


//add a new position in db
router.post('/updatestatusofposition',auth.authenticateManagerJWT,(req,res,next)=>{
  Positions.findOneAndUpdate(
    {
       projectname:req.body.projectname
    },
    {
      status: req.body.status
    },
    {new:true,useFindAndModify:false},
    (err,position)=>{
        if(err){
            res.send(err.message);
        }else{
          if(position.status == 'closed'){
             UserRequestedPosition.findOne(
            {
               positionId: position.id
             },(err,positionuserfound)=>{
                if(positionuserfound !=null){
                  User.findOne({
                    _id: positionuserfound.userId
                  },(err,userfound)=>{
                    if(userfound !=null){
                      socket.emit("statusofPositionAsClosed",{username:userfound.username,projectname:position.projectname});
                      res.json(position);
                    }
                  });
                }
             });
          }else{
           res.json(position);
          }
          
        }

    })
 });

 router.get('/userrequestedposition/:positionId',auth.authenticateEmployeeJWT,(req,res,next)=>{

  UserRequestedPosition.findOne(
    {
      userId:req.session.userId,
      positionId:req.params.positionId
    },(err,positionUser)=>{
      if(positionUser ==null){
        const userposition = new UserRequestedPosition();
        userposition.positionId = req.params.positionId;
        userposition.userId = req.session.userId;
        userposition.save((err,positionUserSaved)=>{
            if(err){
              res.json({status:err.status,message:err.message})
            }else{
              Positions.findOne({
                _id:req.params.positionId
              },(err,positionRecruiter)=>{
                if(positionRecruiter){
                  User.findOne({
                    _id:req.session.userId
                  },(err,requestedbyUser)=>{
                    if(requestedbyUser){
                      socket.emit("notifyRecruiter",{employee:requestedbyUser.username, recruiter: positionRecruiter.createdby, projectname:positionRecruiter.projectname})
                    }
                  })
                }
              });
            res.json(positionUserSaved);
            }
        })
      }else{
        res.json({message:'You have already applied for the same'});
      }

    });
 });

 module.exports = router;