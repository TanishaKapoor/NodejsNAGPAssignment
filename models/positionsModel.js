const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
// const jwtSecret = process.env.JWT_SECRET;
// const saltRounds = process.env.SALT_ROUNDS||10;


const PositionsSchema= new Schema({
    projectname:String,
    clientname:String,
    technologies:String,
    role:String,
    jobDescription:String,
    status:String,
    createdby:String
});


module.exports=mongoose.model('Positions',PositionsSchema);
