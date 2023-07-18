import express from "express";
import { getRelatory } from "../controllers/relatory.js";

const router = express.Router();

router.get("/", getRelatory);

export default router;
