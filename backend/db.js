const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config();


const dbConection = async()=>{
   try{
    await mongoose.connect(process.env.MONGO_URL);
   } 
   catch(error)
   {
        console.log("There was a problem connecting to the databse : "+ error);
   }
}

dbConection();

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        minLength : 3,
        maxLength : 30
    },
    password : {
        type : String,
        required : true,
        minLength : 6
    },
    firstName : {
        type : String,
        required: true,
        trim : true,
        maxLength : 30
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
        maxLength : 30
    }
})

const User = mongoose.model('User',userSchema);


const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
})

const Account = mongoose.model('Account',accountSchema);


module.exports={
    User,
    dbConection,
    Account,
}