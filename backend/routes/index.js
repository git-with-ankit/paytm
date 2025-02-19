const express = require("express");
const cors = require("cors");
const userRouter = require("./user");
const accountRouter = require("./account")


const router = express.Router();

router.use("/user",userRouter);
router.use("/account",accountRouter);





module.exports= router;
