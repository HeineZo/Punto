import { randomInt } from "crypto";
import express from "express";
import Game from "./models/Game.class.ts";
import GameMove from "./models/GameMove.class.ts";
import GameParticipation from "./models/GameParticipation.class.ts";
import Player from "./models/Player.class.ts";
import { Colors, Range } from "./models/type.ts";
import { enumToArray, getTimestamp } from "../src/lib/utils.ts";

export const router = express.Router();

/**
 * Récupérer toutes les parties
 */
router.get("/", async (req, res) => {
  global.databaseType = req.query.db || "mysql";
  const games = await Game.findAll();
  res.send(await Promise.all(games.map((game) => game.toClient())));
});

router.get("/find/:id", async (req, res) => {
  const { id } = req.params;
  global.databaseType = req.query.db || "mysql";
  const game = await Game.find(Number(id));
  if (!game) {
    return res.status(404).send({ message: "Partie non trouvée" });
  }
  return res.send(await game.toClient());
});

router.post("/", async ({ body }, res) => {
  const { players, nbRound, database, createdAt } = body;
  global.databaseType = database || "mysql";
  const game = new Game({ nbRound, createdAt });
  const success = await game.save();
  if (!success) {
    return res
      .status(500)
      .send({ message: "Erreur lors de la sauvegarde de la partie" });
  }

  // Sauvegarde des joueurs et de leur participation
  for (const player of players) {
    const newPlayer = new Player(player);
    let success = await newPlayer.save();
    if (!success) {
      return res
        .status(500)
        .send({ message: "Erreur lors de la sauvegarde du joueur" });
    }

    const participation = new GameParticipation({
      idGame: game.id,
      idPlayer: newPlayer.id,
    });
    success = await participation.save();
    if (!success) {
      return res
        .status(500)
        .send({ message: "Erreur lors de la sauvegarde de la participation" });
    }
  }

  return res.send(await game.toClient());
});

router.put("/", async ({ body }, res) => {
  const { players, winner, database, ...rest } = body;
  global.databaseType = database || "mysql";
  const game = new Game({ idWinner: winner?.id ?? null, ...rest });
  const success = await game.update();
  if (!success) {
    return res
      .status(500)
      .send({ message: "Erreur lors de la sauvegarde de la partie" });
  }

  // Sauvegarde des joueurs et de leur participation
  for (const player of players) {
    const newPlayer = new Player(player);
    const success = await newPlayer.update();
    if (!success) {
      return res
        .status(500)
        .send({ message: "Erreur lors de la sauvegarde du joueur" });
    }
  }

  return res.send(true);
});

/**
 * Générer des parties aléatoires
 */
router.post("/generate", async ({ body }, res) => {
  const { nbGame, nbPlayer, database } = body;
  global.databaseType = database || "mysql";
  let success = true;
  const newPlayerIds: number[] = [];
  const participations: GameParticipation[] = [];

  for (let i = 0; i < nbPlayer; i++) {
    const player = new Player({
      pseudo: `Player ${i}`,
      nbMove: randomInt(10, 50),
      nbVictory: randomInt(2, 10),
    });
    success = await player.save();
    if (!success) {
      return res
        .status(500)
        .send({ message: "Erreur lors de la sauvegarde du joueur" });
    }

    newPlayerIds.push(player.id);
  }
  for (let i = 0; i < nbGame; i++) {
    const game = new Game({
      idWinner: randomInt(newPlayerIds[0], newPlayerIds.at(-1) ?? -1),
      nbPlayer,
      nbMove: randomInt(10, 50),
      nbRound: randomInt(2, 10),
      duration: randomInt(180, 600),
      createdAt: getTimestamp(),
    });
    success = await game.save();
    if (!success) {
      return res
        .status(500)
        .send({ message: "Erreur lors de la sauvegarde de la partie" });
    }

    for (const newPlayer of newPlayerIds) {
      const gameParticipation = new GameParticipation({
        idGame: game.id,
        idPlayer: newPlayer,
        nbMove: randomInt(10, 50),
        createdAt: getTimestamp(),
      });
      success = await gameParticipation.save();
      if (!success) {
        return res.status(500).send({
          message: "Erreur lors de la sauvegarde de la participation",
        });
      }

      participations.push(gameParticipation);
    }

    for (let i = 0; i < randomInt(0, 100); i++) {
      const colors = enumToArray(Colors);
      const randomParticipation =
        participations[randomInt(0, participations.length)];
      const gameMove = new GameMove({
        idParticipation: randomParticipation?.id,
        color: colors[Math.floor(Math.random() * colors.length)],
        value: randomInt(1, 9) as Range<1, 9>,
        rowPosition: randomInt(1, 7) as Range<1, 7>,
        colPosition: randomInt(1, 7) as Range<1, 7>,
      });
      success = await gameMove.save(randomParticipation);
      if (!success) {
        return res
          .status(500)
          .send({ message: "Erreur lors de la sauvegarde du coup joué" });
      }
    }
  }

  return res.send({
    message: `${nbGame} parties et ${nbPlayer} joueurs ont été créés`,
  });
});
