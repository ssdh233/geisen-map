import mongoose from "mongoose";

export type Info = {
  infoType: string; // Enum?
  text: string;
  sourceId?: string;
  url?: string;
  updateTime?: Date;
}

const Info = {
  infoType: String, // Enum?
  text: String,
  sourceId: String,
  url: String,
  updateTime: Date
};

export type GameCenter = {
  id: string;
  geo: { lat: number; lng: number };
  infos: Info[];
  games: {
    name: string; // Enum?
    infos: Info[];
  }[];
}

const GameCenterSchema = new mongoose.Schema({
  id: String,
  geo: { lat: Number, lng: Number },
  infos: [Info],
  games: [
    {
      name: String, // Enum?
      infos: [Info]
    }
  ]
});

const GameCenterModel = mongoose.model<GameCenter & mongoose.Document>("gameCenter", GameCenterSchema);
export default GameCenterModel;
