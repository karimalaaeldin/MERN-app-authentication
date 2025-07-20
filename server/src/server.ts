import dotenv from "dotenv";
dotenv.config();
import app from "../app";
import CONNECT_TO_DATABASE from "./database/connection";

CONNECT_TO_DATABASE();

const PORT = process.env.PORT;

const server = app.listen(PORT);

process.on("unhandledRejection", (err: any) => {
  console.log("unhandledRejection");
  console.log("KARIM");
  console.log(err.name);
  console.log(err.message);
  server.close(() => {
    process.exit(1);
  });
});
