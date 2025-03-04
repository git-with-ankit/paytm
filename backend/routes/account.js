const express = require("express");
const {mongoose} = require("mongoose")
const { authMiddleware } = require("../middleware");
const router = express.Router();
const {Account}   = require("../db");
const { startSession } = require("mongoose");


router.get("/balance",authMiddleware,async (req,res)=>{
    
    const account = await Account.findOne({
        userId : req.userId
    });
    res.json({
        balance : account.balance
    })

});

router.post("/transfer",authMiddleware,async (req,res)=>{
    const session = await mongoose.startSession();
    await session.startTransaction();
    const {amount,to} = req.body;
    const account = await Account.findOne({
        userId : req.userId
    })
    if(!account || account.balance < amount ){
        await session.abortTransaction();
        return res.status(400).json({
            message : "Insufficient balance"
        })
    }

    const toAccount = Account.findOne({
        userId : to
    }).session(session)
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message : "Invalid Account"
        })
    }
    await Account.updateOne({
        userId : req.userId
    },{
        $inc : {balance : - amount}
    }).session(session)
    await Account.updateOne({
        userId : to
    },{$inc : {balance : amount}}).session(session)

    await session.commitTransaction();
    res.json({
        message : "Transfer successful"
    })

})








module.exports = router;