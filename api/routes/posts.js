import express from "express";
import { getPosts, addPost, updatePost, historicPost, deletePost } from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPost);
router.post("/historic", historicPost);
router.put("/", updatePost)
router.delete("/:id", deletePost);

export default router;
