/* eslint-env node */
import cors from "cors";
import express, { json } from "express";
import { router as gameRouter } from "./game.js";

export const app = express();
const PORT = 3002;

app.use(cors());
app.use(json());

app.use("/game", gameRouter);

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});


// // Route to get one post
// app.get("/api/getFromId/:id", (req, res) => {
//   const id = req.params.id;
//   query("SELECT * FROM posts WHERE id = ?", id, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     res.send(result);
//   });
// });

// // Route for creating the post
// app.post("/api/create", (req, res) => {
//   const username = req.body.userName;
//   const title = req.body.title;
//   const text = req.body.text;

//   query(
//     "INSERT INTO posts (title, post_text, user_name) VALUES (?,?,?)",
//     [title, text, username],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(result);
//     }
//   );
// });

// // Route to like a post
// app.post("/api/like/:id", (req, res) => {
//   const id = req.params.id;
//   query(
//     "UPDATE posts SET likes = likes + 1 WHERE id = ?",
//     id,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(result);
//     }
//   );
// });

// // Route to delete a post

// app.delete("/api/delete/:id", (req, res) => {
//   const id = req.params.id;

//   query("DELETE FROM posts WHERE id= ?", id, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//   });
// });
