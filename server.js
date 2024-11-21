const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const channelRoutes = require("./routes/channelRoutes");

const app = express();
const PORT = 3000;

//Middleware
app.use(cors());
app.use(bodyParser.json());
   
//Routes   
// Routes 
app.use("/api/channels", channelRoutes);

app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).send({error: "Something went wrong!"});
})
  
//start server here          
app.listen(PORT, ()=>{
    console.log("Server is running on port 3000")  
})       