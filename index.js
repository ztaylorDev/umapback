const express = require("express");
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const app = express();
const pinRoute = require("./routes/pins")

dotenv.config();

app.use(express.json())

mongoose
.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected")
})
.catch((err) => console.log(err));

app.use("/api/pins", pinRoute);

app.listen(9000,()=>{
    console.log("Your Server is online")
});