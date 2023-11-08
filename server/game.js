import { app } from './index.js';
import { query } from "./config/db";

/**
 * Récupérer toutes les parties
 */
app.get("/api/game/getAll", (req, res) => {
    query("SELECT * FROM Game", (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    });
  });