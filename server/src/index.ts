import express from "express";

const app = express();
const port = 4000; // default port to listen

// define a route handler for the default home page
app.get("/test", (req, res) => {
  // render the index template
  res.json({ test: "hahaha" });
});

// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
