import db from "./config/db.js";
import { randomInt } from "crypto";
import express from "express";

export const router = express.Router();

/**
 * Récupérer toutes les parties
 */
router.get("/findAll", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Game");
  console.log('hello');
  res.send(rows ?? []);
});

/**
 * Générer des parties aléatoires
 */
router.post("/generate", async ({ body }, res) => {
  const { nbGame, nbPlayer } = body;
  const newPlayerIds = [];
  const participations = [];

  for (let i = 0; i < nbPlayer; i++) {
    const insertedPlayer = await db.query(
      "INSERT INTO Player (pseudo) VALUES (?)",
      [`Player ${i}`],
      (err) => {
        if (err) {
          return res.send(500, { message: `Une erreur est survenue` });
        }
      }
    );
    newPlayerIds.push(insertedPlayer[0].insertId);
  }

  for (let i = 0; i < nbGame; i++) {
    const insertedGame = await db.query(
      "INSERT INTO Game (idWinner, nbPlayer) VALUES (?, ?)",
      [randomInt(newPlayerIds[0], newPlayerIds.at(-1)), nbPlayer],
      (err) => {
        if (err) {
          return res.send(500, { message: `Une erreur est survenue` });
        }
      }
    );

    for (let newPlayer of newPlayerIds) {
      const insertedParticipation = await db.query(
        "INSERT INTO GameParticipation (idGame, idPlayer) VALUES (?, ?)",
        [insertedGame[0].insertId, newPlayer],
        (err) => {
          if (err) {
            return res.send(500, { message: `Une erreur est survenue` });
          }
        }
      );
      participations.push(insertedParticipation[0].insertId);
    }

    for (let i = 0; i < randomInt(0, 100); i++) {
      const idParticipation = randomInt(
        participations[0],
        participations.at(-1)
      );

      const colors = ["red", "green", "blue", "yellow"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const value = randomInt(1, 9);
      const rowPosition = randomInt(1, 6);
      const colPosition = randomInt(1, 6);
      await db.query(
        "INSERT INTO GameMove (idParticipation, color, value, rowPosition, colPosition) VALUES (?, ?, ?, ?, ?)",
        [idParticipation, color, value, rowPosition, colPosition],
        (err) => {
          if (err) {
            return res.send(500, { message: `Une erreur est survenue` });
          }
        }
      );
    }
  }

  return res.send(200, {
    message: `${nbGame} parties et ${nbPlayer} joueurs ont été créés`,
  });
});
