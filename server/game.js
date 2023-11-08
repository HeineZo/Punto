import db from "./config/db.js";
import express from "express";

export const router = express.Router();
const query = { db };

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
router.post("/generate", ({ body }, res) => {
  const { nbGame, nbPlayer } = body;

  for (let i = 0; i < nbPlayer; i++) {
    db.query(
      "INSERT INTO Player (pseudo) VALUES (?)",
      [`Player ${i}`],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result)
        // res.send(result);
      }
    );
  }

  // for (let i = 0; i < nbGame; i++) {
  //   query(
  //     "INSERT INTO Game (idWinner, nbPlayer) VALUES (?)",
  //     [null, nbPlayer],
  //     (err, result) => {
  //       if (err) {
  //         console.log(err);
  //       }
  //       res.send(result);
  //     }
  //   );
  // }

  // query("INSERT INTO Game () VALUES (?)", [], (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.send(result);
  // });
});
