/* eslint-env node */
import cors from "cors";
import express, { json } from "express";
import { router as gameRouter } from "./game.ts";
import { router as moveRouter } from "./move.ts";
import { router as participationRouter } from "./participation.ts";

export const app = express();
export const router = express.Router();
const PORT = 3002;

app.use(cors());
app.use(json());

app.use("/game", gameRouter);
app.use("/move", moveRouter);
app.use("/participation", participationRouter);

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});

export function error(res, err) {
  res.status(409).json(err)
}

