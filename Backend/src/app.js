import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import {connectToSocket} from "./controllers/socketManager.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
dotenv.config();

const app = express();
const server = createServer(app);

// attaching the socket.io to the httpserver
// const io = new Server(server);
const io = connectToSocket(server);

const mongo_url = process.env.MONGO_URL;
async function main() {
  await mongoose.connect(mongo_url);
  console.log("Connected to MongoDB successfully");
}

main().catch((err) => console.log(err));

app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}));

app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));
app.use(cookieParser());

const store = MongoStore.create({
  mongoUrl: mongo_url,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in mongo session store: ", err);
});

const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));

app.use("/api/v1/users",userRoutes);

// app.get("/home", (req, res) => {
//   return res.json({ hello: "world" });
// });

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({ error: message });
});

app.listen(8000, () => {
  console.log(`Server running on Port 8000`);
});



