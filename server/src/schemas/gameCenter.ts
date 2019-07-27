import mongoose from "mongoose";

const Info = {
  infoType: String, // Enum?
  text: String,
  sourceId: String,
  url: String,
  updateTime: Date
};

const gameCenterSchema = new mongoose.Schema({
  id: String,
  geo: { lat: Number, long: Number },
  infos: [Info],
  games: [{
    name: String, // Enum?
    infos: [Info],
  }]
});

export default gameCenterSchema;