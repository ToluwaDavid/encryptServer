const express = require("express");
const router = express.Router();
const { createChannel , 
    getAllChannels, 
    getKey, 
    deleteChannel , getChannelByID , updateChannel } = require("../controllers/channelController");

// Routes
router.get("/getPublicKey" , getKey)
router.post("/", createChannel); // Create a new channel
router.get("/", getAllChannels );
router.delete("/:id", deleteChannel );
router.get("/:id" , getChannelByID);
router.put("/:id" , updateChannel)


 
module.exports = router;

