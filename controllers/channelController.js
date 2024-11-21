const fs = require("fs-extra");
const { v4: uuidv4 } = require('uuid');
const filePath = './db/db.json';
const ff = './db/db.json';

//Load the json file
const loadData = async () =>{
    try {
        const  data = await fs.readJSON(filePath);
        return data.channels || [];
    } catch (error) {
        return []
    }
}

// Save JSON Data
const saveData = async (channels) => {
    await fs.writeJson(filePath, { channels });
  };

// Create Channel
exports.createChannel = async (req, res) => {
    try {
      const { name, publicKey } = req.body; // Removed parameters
      if (!name || !publicKey) {
        return res
          .status(400)
          .json({ error: "Channel name and public key are required" });
      }
   
      const channels = await loadData();
      const newChannel = {
        id: uuidv4(),
        name,
        publicKey,  // Public key is now the only required field
        status: true, // Active by default
        createdAt: new Date(),
      };
   
      channels.push(newChannel);
      await saveData(channels);
   
      res.status(201).json(newChannel);
    } catch (error) {
      res.status(500).json({ error: "Failed to create channel" });
    }
  };
   

 // Get All Active Channels
exports.getAllChannels = async (req, res) => {
    try {
      const channels = await loadData();
      const activeChannels = channels.filter((channel) => channel.status);
      res.status(200).json(activeChannels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch channels" });
    }
  };

  exports.deleteChannel= async (req, res) =>{
    try {
        const {id} = req.params;
        const channel = await loadData();
        const channelIndex = channel.findIndex((channel) => channel.id === id)

        if (channelIndex === -1) {
            return res.status(404).json({ error: "Channel not found to delete" });
          }
       
          channel[channelIndex].status = false;
          await saveData(channel);
       
          res.status(200).json({ message: "Channel deleted successfully" });

    } catch (error) {
        res.status(500).json({error : "Failed to delete channel"})
    }

  }


  //Get a channel
  exports.getChannelByID= async (req, res) =>{
    try {

        const {id} = req.params;
        const channels = await loadData();
        const channel = channels.find((channel) => channel.id === id );
        
        if (!channel) {
            return res.status(404).json({ error: "Channel not found to update" });
          }
       
          res.status(200).json(channel);
       
         
    } catch (error) {
        res.status(500).json({error : "Failed to delete channel"})
    }

  }

  // Update a channel

  exports.updateChannel = async (req, res) =>{

   try {
    const {id} = req.params;
    const {name, publicKey} = req.body

    const channels = await loadData();

    const channelIndex = channels.findIndex((channel) => channel.id === id)

    if(channelIndex === -1){
        res.status(400).json({error : "Channel not found"})
    }

    const updatedChannel = {
        ...channels[channelIndex],
        name: name || channels[channelIndex].name,
        publicKey: publicKey || channels[channelIndex].publicKey,
        // updatedAt: new Date(),
      };

      channels[channelIndex] = updatedChannel;
      await saveData(channels)

      res.status(200).json(updatedChannel)
   } catch (error) {
    res.status(500).json({error : "Failed to update channel"})
   }


  }

  exports.getKey = async (req, res) =>{
    try {
        const name = req.query.name;
        const channels = await loadData();
        const channel = channels.find((channel) => channel.name.toLowerCase() === name.toLowerCase())
        if(!channel){
            res.status(404).json({ error: error.message }); 
        }
        res.status(200).json({ publicKey: channel.publicKey })
        
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  }


  




