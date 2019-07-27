import express from "express";
import mongoose from "mongoose";
import GameCenterSchema from "../schemas/gameCenter";

const gameCenterApi = (app: express.Express) => {
  app.get("/gamecenter/:id", async (req, res) => {
    const { id } = req.params;

    const GameCenter = mongoose.model("gameCenter", GameCenterSchema);
    const result = await GameCenter.findOne({ id });

    if (result) {
      res.json(result);
    } else {
      res.status(204);
      res.json();
    }
  });

  app.get("/gamecenters", async (req, res) => {
    const GameCenter = mongoose.model("gameCenter", GameCenterSchema);
    const result = await GameCenter.aggregate([
      { $match: {} },
      {
        $project: {
          "_id": 0, 
          id: 1,
          geo: 1,
          infos: { $filter: { input: "$infos", as: "info", cond: { $eq: ["$$info.infoType", "name"] } } }
        }
      },
      { $project: { id: 1, geo: 1, "infos.infoType": 1, "infos.text": 1 } }
    ]);
    res.json(result);
  });
};

export default gameCenterApi;
