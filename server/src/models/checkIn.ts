import mongoose from "mongoose";

export type CheckIn = {
  user: string;
  date: Date;
  gamecenterId: string;
  games: string[];
};

const CheckInSchema = new mongoose.Schema({
  user: mongoose.Types.ObjectId,
  date: Date,
  gamecenterId: mongoose.Types.ObjectId,
  games: [String],
});

const CheckInModel = mongoose.model<CheckIn & mongoose.Document>(
  "checkIn",
  CheckInSchema
);
export default CheckInModel;
