import { prop, Typegoose } from 'typegoose';

class GeoInfo extends Typegoose {
  @prop() geo: { lat: number, lng: number };
  @prop() text: string;
  @prop() alts: string[];
  @prop() type: string;
}

const GeoInfoModel = new GeoInfo().getModelForClass(GeoInfo);

export default GeoInfoModel;

