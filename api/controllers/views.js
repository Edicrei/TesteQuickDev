import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getViews = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log('usuario' + req.query.userId);

    const q =  `SELECT * FROM view  WHERE postId = ? ` /*`SELECT * FROM post` //+ userId  WHERE userId =*/
      
    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addView = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q =
      "INSERT INTO view(`postId`) VALUES (?)";
    const values = [
      req.body.postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err), console.log(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

