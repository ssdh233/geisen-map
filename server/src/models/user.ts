import mongoose from "mongoose";

type User = {
  id: string;
  email: string;
  name: string;
  twitterId: string;
  twitterName: string;
  refreshToken: string;
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
