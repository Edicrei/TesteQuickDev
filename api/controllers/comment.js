import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId FROM comment AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? 
    `;//, profilePic  c.createdAt , name ORDER BY  DESC SELECT c.*, u.id AS userId FROM comment AS c JOIN users AS u ON (u.id = c.userId)

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO comment(`description`, `userId`, `postId`,status) VALUES (?)";//`createdAt`
    const values = [
      req.body.description,
      req.body.status,
      userInfo.id,
      req.body.postId
    ];

    console.log(values)

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created.");
    });
  });
};

export const updateComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    console.log(  'data', req.body.id)
    if (err) return res.status(403).json("Token is not valid!");
    const q =`UPDATE post SET description = ? , status = ?WHERE id = `+ req.body.id 

    const values = [
      req.body.description,
      req.body.status,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err), console.log(err);
      return res.status(200).json("Post has been created.");
    });
  });
};


export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    console.log(commentId)
    const q = "DELETE FROM comment WHERE `id` = ? AND `userId` = ?";

    db.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Comment has been deleted!");
      return res.status(403).json("You can delete only your comment!");
    });
  });
};
