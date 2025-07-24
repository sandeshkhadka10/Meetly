import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set("port", process.env.PORT || 8000);

app.get("/home", (req, res) => {
  return res.json({ hello: "world" });
});

const start = async () => {
  try {
    app.set("mongo_user");
    const connectionDb = await mongoose.connect(
      "mongodb+srv://attkhadka551:sTnWP32YKkBNoFxW@cluster0.bmhjx04.mongodb.net/"
    );
    server.listen(app.get("port"), () => {
      console.log("Listening on port 8000");
    });
  } catch (err) {
    console.log("Error connecting to MongoDB or starting server: ", err);
  }
};
start();
