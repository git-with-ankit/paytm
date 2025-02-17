const express = require("express");
const mainRouter = require ("./routes/index");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1",mainRouter); //so  that all requests coming to /api/v1/... goes to this router which will be transferred to routes/index




app.listen(3000,()=>{
    console.log("BE running on port 3000");
})

