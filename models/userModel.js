const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const jwtSecret = process.env.JWT_SECRET;
const saltRounds = process.env.SALT_ROUNDS||10;

const UserSchema = new Schema({
    username:String,
    password:String,
    role:String
});

UserSchema.methods.setHashedPassword = async function(){
    //bcrypt hash fucntion returns a promise so need to use async await
    const hashPassword = await bcrypt.hash(this.password,saltRounds);
    this.password = hashPassword;
};

UserSchema.methods.validatePassword = async function(password){
    //before hashing we can compare like this 
    //but after hashing string and hashvalues are different
    // return this.password === password;
    const passwordMatches = await bcrypt.compare(password,this.password);
    return passwordMatches;
};



UserSchema.methods.generateJwtToken = function(){
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate()+1);
    return jwt.sign({
        id:this._id,
        username:this.username,
        role:this.role,
        exp:parseInt(expirationDate.getTime()/1000,10),
    },
    jwtSecret);
};


UserSchema.methods.toAuthJson = function(){
    return {
        username: this.username,
        _id:this._id,
        _role:this.role,
        token:this.generateJwtToken(),
    }
};
    
module.exports=mongoose.model('User',UserSchema);