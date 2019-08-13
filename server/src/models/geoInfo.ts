import mongoose from "mongoose";

export type GeoInfo = {
  geo: { lat: number; lng: number; zoom: number };
  text: string;
  alts?: string[];
  description: string,
  type: string;
};

const GeoInfoSchema = new mongoose.Schema({
  geo: { lat: Number, lng: Number, zoom: Number },
  text: String,
  alts: [String],
  description: String,
  type: String // TODO Enum
});

const GeoInfoModel = mongoose.model<GeoInfo & mongoose.Document>("geoInfo", GeoInfoSchema);
export default GeoInfoModel;
