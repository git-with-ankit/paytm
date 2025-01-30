import mongoose, { Model } from "mongoose";
import dotenv from "dotenv";
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


const userShema = new mongoose.Schema({
    userName : {
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

const User = new Model('User',userShema);

module.exports={
    User,
    dbConection
}