import mongoose from "mongoose";

export type GeoInfo = {
  geo: { lat: number, lng: number },
  text: string,
  alts: string[],
  stype: string
}

const GeoInfoSchema = new mongoose.Schema({
  geo: { lat: Number, lng: Number },
  text: String,
  alts: [String],
  type: String // TODO Enum
});


const GeoInfoModel = mongoose.model<GeoInfo & mongoose.Document>("geoInfo", GeoInfoSchema);
export default GeoInfoModel;
