import express from "express";
import GameParticipation from "./models/GameParticipation.class";

export const router = express.Router();

/**
 * Récupérer les participations à partir de l'identifiant de la partie
 */
router.get("/game/:id", async (req, res) => {
  const { id } = req.params;
  const participations = await GameParticipation.findFromGame(Number(id));
  res.send(
    await Promise.all(
      participations.map((participation) => participation.toClient())
    )
  );
});
