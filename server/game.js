import db from "./config/db.js";
import { randomInt } from "crypto";
import express from "express";

export const router = express.Router();

/**
 * Récupérer toutes les parties
 */
router.get("/getAll", (req, res) => {
  // query("SELECT * FROM Game", (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.send(result);
  // });
  res.json("Hello world");
});

/**
 * Générer des parties aléatoires
 */
router.post("/generate", async ({ body }, res) => {
  const { nbGame, nbPlayer } = body;
  const newPlayerIds = [];

  for (let i = 0; i < nbPlayer; i++) {
    const result = await db.query(
      "INSERT INTO Player (pseudo) VALUES (?)",
      [`Player ${i}`],
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    newPlayerIds.push(result[0].insertId);
  }

  for (let i = 0; i < nbGame; i++) {
    await db.query(
      "INSERT INTO Game (idWinner, nbPlayer) VALUES (?, ?)",
      [randomInt(newPlayerIds[0], newPlayerIds.at(-1)), nbPlayer],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        res.send(result);
      }
    );
  }

  // query("INSERT INTO Game () VALUES (?)", [], (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.send(result);
  // });
});
