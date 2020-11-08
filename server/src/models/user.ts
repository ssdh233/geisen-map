import mongoose from "mongoose";

type Checkout = {
  date: string; //stringで大丈夫かな mongoのdateタイプを使いたい。できなかったら日付と時間を分ける　分か秒まで
  gamecenterId: string; //　店名、地理情報とか大丈夫かな
  games: string[]; // 絞り込みフィルターほしい
};

type User = {
  id: string;
  email: string;
  name: string;
  twitterId: string;
  twitterName: string;
  refreshToken: string;
  checkouts: Checkout[]
};

const UserSchema = new mongoose.Schema({
  id: String,
  email: String,
  name: String,
  twitterId: String,
  refreshToken: String,
});

const UserModel = mongoose.model<User & mongoose.Document>("user", UserSchema);

export default UserModel;
