import express from "express";
import UserModel from "../models/user";
import jwt from "jsonwebtoken";
import auth from "../utils/auth";

const userApi = (app: express.Express) => {
  app.get("/user", async (req, res) => {
    const userId = await auth(req, res);

    if (userId) {
      const userQuery = await UserModel.findById(userId);
      res.json(userQuery);
    }
  });

  app.post("/logout", async (req, res) => {
    const { accessToken } = req.cookies;
    // @ts-ignore jwt.verify needs to have a better type
    const { userId } = jwt.verify(accessToken, process.env.SECRET);
    UserModel.updateOne({ _id: userId }, { refreshToken: "" });
  });
};

export default userApi;
