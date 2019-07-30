import { prop, Typegoose } from 'typegoose';

export class Info {
  @prop() infoType: string; // Enum?
  @prop() text: string;
  @prop() sourceId: string;
  @prop() url: string;
  @prop() updateTime: Date
}

export class GameCenter extends Typegoose {
  @prop() id: string;
  @prop() geo: { lat: number, lng: number };
  @prop() infos: Info[];
  @prop() games: {
    name: String, // Enum?
    infos: Info[],
  }[];
}

const GameCenterModel = new GameCenter().getModelForClass(GameCenter);

export default GameCenterModel;