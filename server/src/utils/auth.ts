import express from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";
import { createAccessToken } from "../utils/token";

async function auth(req: express.Request, res: express.Response) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken || !refreshToken) {
    res.status(401);
    res.end();
    return;
  }

  let userId;

  try {
    // @ts-ignore jwt.verify needs to have a better type
    const decoded: { userId: string } = jwt.verify(
      accessToken,
      process.env.SECRET
    );
    userId = decoded.userId;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // @ts-ignore jwt.verify needs to have a better type
      const decoded: { userId: string } = jwt.verify(
        refreshToken,
        process.env.SECRET
      );

      // get userId from refreshToken
      const userQuery = await UserModel.findById(decoded.userId);
      if (userQuery.refreshToken === refreshToken) {
        userId = decoded.userId;
        const newAccessToken = createAccessToken(userId);
        res.cookie("accessToken", newAccessToken);
      } else {
        res.status(401);
        res.end();
      }
    } else {
      throw error;
    }
  }

  return userId;
}

export default auth;
