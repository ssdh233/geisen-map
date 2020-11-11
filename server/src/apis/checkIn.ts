import express from "express";
import mongoose from "mongoose";

import auth from "../utils/auth";
import CheckInModel, { CheckIn } from "../models/checkIn";
import GameCenterModel from "../models/gameCenter";
import distance from "../utils/distance";

const checkInApi = (app: express.Express) => {
  app.get("/checkIns", async (req: express.Request<{}, CheckIn[]>, res) => {
    const userId = await auth(req, res);

    const results = await CheckInModel.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "gamecenters",
          localField: "gamecenterId",
          foreignField: "_id",
          as: "gamecenter",
        },
      },
      {
        $project: {
          _id: 1,
          games: 1,
          user: 1,
          date: 1,
          gamecenterId: 1,
          gamecenterName: {
            $arrayElemAt: ["$gamecenter.name", 0],
          },
        },
      },
    ]);
    res.json(results);
  });

  app.post(
    "/checkIns",
    async (
      req: express.Request<
        {},
        { error: string } | CheckIn,
        {
          gamecenterId: string;
          games: string[];
          userLocation: [number, number];
        }
      >,
      res
    ) => {
      const userId = await auth(req, res);

      if (
        !req.body.gamecenterId ||
        !req.body.userLocation ||
        !req.body.games?.length
      )
        res.status(401).json({ error: "invalid params" });

      const gameCenter = await GameCenterModel.findOne({
        _id: req.body.gamecenterId,
      });

      const isCloseEnough =
        distance(
          gameCenter.geo.lat,
          gameCenter.geo.lng,
          req.body.userLocation[0],
          req.body.userLocation[1],
          "K"
        ) *
          1000 <
        100;

      if (!isCloseEnough) {
        res
          .status(401)
          .json({ error: "too far away from this game center" })
          .end();
      }

      const newCheckInQuery = new CheckInModel({
        user: userId,
        date: new Date(),
        gamecenterId: req.body.gamecenterId,
        games: req.body.games,
      });

      const newCheckIn = await newCheckInQuery.save();
      res.json(newCheckIn);
    }
  );
};

export default checkInApi;
