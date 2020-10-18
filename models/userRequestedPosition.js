const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserRequestedPosition= new Schema({
    userId:String,
    positionId:String
});


module.exports=mongoose.model('UserRequestedPosition',UserRequestedPosition);