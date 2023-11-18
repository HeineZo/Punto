import db from "./config/db.js";
import { randomInt } from "crypto";
import express from "express";
import Game from "./models/Game.class.ts";
import { ResultSetHeader } from "mysql2";

export const router = express.Router();

/**
 * Récupérer toutes les parties
 */
router.get("/findAll", async (req, res) => {
  const games = Game.findAll();
  console.log('hello',games)
  res.send(games);
});

/**
 * Générer des parties aléatoires
 */
router.post("/generate", async ({ body }, res) => {
  const { nbGame, nbPlayer } = body;
  const newPlayerIds: number[] = [];
  const participations: number[] = [];

  for (let i = 0; i < nbPlayer; i++) {
    const [insertedPlayer] = await db.query(
      "INSERT INTO Player (pseudo) VALUES (?)",
      [`Player ${i}`]
    );
    newPlayerIds.push((insertedPlayer as ResultSetHeader).insertId);
  }

  for (let i = 0; i < nbGame; i++) {
    const [insertedGame] = await db.query(
      "INSERT INTO Game (idWinner, nbPlayer) VALUES (?, ?)",
      [randomInt(newPlayerIds[0], newPlayerIds.at(-1) ?? -1), nbPlayer]
    );

    for (const newPlayer of newPlayerIds) {
      const [insertedParticipation] = await db.query(
        "INSERT INTO GameParticipation (idGame, idPlayer) VALUES (?, ?)",
        [(insertedGame as ResultSetHeader).insertId, newPlayer]
      );
      participations.push((insertedParticipation as ResultSetHeader).insertId);
    }

    for (let i = 0; i < randomInt(0, 100); i++) {
      const idParticipation = randomInt(
        participations[0],
        participations.at(-1) ?? -1
      );

      const colors = ["red", "green", "blue", "yellow"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const value = randomInt(1, 9);
      const rowPosition = randomInt(1, 6);
      const colPosition = randomInt(1, 6);
      await db.query(
        "INSERT INTO GameMove (idParticipation, color, value, rowPosition, colPosition) VALUES (?, ?, ?, ?, ?)",
        [idParticipation, color, value, rowPosition, colPosition]
      );
    }
  }

  return res.send({
    message: `${nbGame} parties et ${nbPlayer} joueurs ont été créés`,
  });
});
