import express from "express";
import { getViews, addView } from "../controllers/views.js";

const router = express.Router();

router.get("/", getViews);
router.post("/", addView);


export default router;
