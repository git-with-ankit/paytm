const express = require("express");
const cors = require("cors")
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User,Account } = require("../db")
const {authMiddleware} = require("../middleware")


const router = express.Router();

const signupSchema = zod.object({
    username : zod.string(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string(),


})

router.post("/signup", async (req, res) => {
    const { success } = signupSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })
    const userId = user._id;


    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })


    const token = jwt.sign({
        userId
    },process.env.JWT_SECRET );

    res.json({
        message: "User created successfully",
        token: token
    })
})

const signinSchema = zod.object({
    username : zod.string(),
    password : zod.string()
})

router.post("/signin",async (req,res)=>{
    const {success} = signinSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message : "Incorrect Inputs"
        })
    }
    const user = await User.findOne({
        username : req.body.username,
        password : req.body.password
    })
    if(user){
        const token = jwt.sign({
            userId : user._id
        },process.env.JWT_SECRET)
        res.json({
            token : token
        })
        return ;
    }
    res.status(411).json({
        message : "User not found"
    })

    
})

const updatedBody = zod.object({
    password : zod.string().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional()
})

router.put("/",authMiddleware,async (req,res)=>{
    const {success} = updatedBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message : "Error while uploading information"
        })
    }
    await User.updateOne({
        _id: req.userId
    },req.body);
    res.json({
        message : "User updated successfully"
    })
})

router.get("/bulk",async(req,res)=>{
    const filter = req.query.filter || "";   
    const users = await User.find({
        $or : [{firstName : {"$regex" : filter}},{lastName : {"$regex" : filter}}]
    })
    res.json({
        user : users.map(user=>({
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id
        }))
    })
})


module.exports=router;