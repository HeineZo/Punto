import express from "express";
import GameMove from "./models/GameMove.class";

export const router = express.Router();

router.post("/", async ({ body }, res) => {
    const { participation, ...rest } = body;
    const move = new GameMove({ ...rest, idParticipation: participation.id });
    const success = await move.save();
    if (!success) {
      return res
        .status(500)
        .send({ message: "Erreur lors de la sauvegarde de la partie" });
    }
  
    return res.send(await move.toClient());
  });