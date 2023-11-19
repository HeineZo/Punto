import db from "./config/db.js";
import { randomInt } from "crypto";
import express from "express";
import Game from "./models/Game.class.ts";
import { ResultSetHeader } from "mysql2";
import Player from "./models/Player.class.ts";
import GameParticipation from "./models/GameParticipation.class.ts";

export const router = express.Router();

/**
 * Récupérer toutes les parties
 */
router.get("/findAll", async (req, res) => {
  const games = await Game.findAll();
  res.send(await Promise.all(games.map((game) => game.toClient())));
});

router.get("/find/:id", async (req, res) => {
  const { id } = req.params;
  const game = await Game.find(Number(id));
  if (!game) {
    return res.status(404).send({ message: "Partie non trouvée" });
  }
  return res.send(await game.toClient());
});

router.post("/new", async ({ body }, res) => {
  const { players, nbRound, createdAt } = body;
  const game = new Game({ nbRound, createdAt });
  await game.save();

  // Sauvegarde des joueurs et de leur participation
  for (const player of players) {
    const newPlayer = new Player(player);
    await newPlayer.save();

    const participation = new GameParticipation({
      idGame: game.id,
      idPlayer: newPlayer.id,
    });
    await participation.save();
  }

  return res.send(await game.toClient());
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
      "INSERT INTO Game (idWinner, nbPlayer, nbmove, duration) VALUES (?, ?, ?, ?)",
      [
        randomInt(newPlayerIds[0], newPlayerIds.at(-1) ?? -1),
        nbPlayer,
        randomInt(10, 50),
        randomInt(180, 600),
      ]
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
