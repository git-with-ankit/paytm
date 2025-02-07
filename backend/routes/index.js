const express = require("express");
const cors = require("cors");
const userRouter = require("./user");
const jwt = require("jsonwebtoken");

const router = express.Router();



router.use(cors());
router.use(express.json());

router.use("/user",userRouter);






module.exports= router;
