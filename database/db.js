const mongoose = require('mongoose');

function connectToDatabase(dbUrl){
    
    //connecting to mongo db
    mongoose.connect(dbUrl, {useUnifiedTopology:true,useNewUrlParser:true});

    //check the connection to db

    const connection = mongoose.connection;

    connection.on('error',()=>{
        console.log('error occured while connecting to mongo db');

    });
}

module.exports={
    connectToDatabase
};