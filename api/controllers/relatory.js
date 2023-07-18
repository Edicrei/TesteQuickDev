import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getRelatory = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log('usuario' + req.query.userId);

    const q = `SELECT p.*, u.id AS userId, title, count(id), count(like), count(dislike),FROM posts AS p JOIN comment AS u ON (p.id = p.postId) JOIN AS l like AS u ON (l.id = l.postId) JOIN AS v view AS u ON (v.id = v.postId) WHERE p.postId = ? ORDER BY p.createdAt DESC`
     

    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
