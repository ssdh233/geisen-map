import express from "express";
import mongoose, { mongo } from "mongoose";
import GeoInfoSchema from "../schemas/geoInfo";

const geoInfoApi = (app: express.Express) => {
  app.get("/geoinfo", async (req, res) => {
    if (req.query.q) {
      const GeoInfo = mongoose.model("geoInfo", GeoInfoSchema);
      let result = await GeoInfo.find({ text: { $regex: new RegExp(`.*${req.query.q}.*`) } }, { _id: 0 });

      result = result.sort((a: any, b: any) => {
        if (a.text.startsWith(req.query.q)) {
          return -1;
        }
        return a.text.localeCompare(b.text);
      });

      if (result.length > 0) {
        res.json(result.slice(0, 5));
      } else {
        res.status(204);
        res.json();
      }
    } else {
      res.status(400);
      res.json();
    }
  });
};

export default geoInfoApi;
