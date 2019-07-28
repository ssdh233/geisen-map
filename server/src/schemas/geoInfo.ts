import mongoose from "mongoose";

const geoInfoSchema = new mongoose.Schema({
  geo: { lat: Number, lng: Number },
  text: String,
  alts: [String],
  type: String // TODO Enum
});

export default geoInfoSchema;
