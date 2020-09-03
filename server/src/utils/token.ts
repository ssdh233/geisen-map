import jwt from "jsonwebtoken";

function createTempToken(twitterId: string) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 30,
      twitterId,
    },
    process.env.SECRET
  );
}

function createAccessToken(userId: string) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 30,
      userId: userId,
    },
    process.env.SECRET
  );
}

function createRefreshToken(userId: string) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      userId: userId,
    },
    process.env.SECRET
  );
}

export { createTempToken, createAccessToken, createRefreshToken };
