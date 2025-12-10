import express from "express";
import Generated from "../models/Generated.js";

const router = express.Router();

// Save generated text
router.post("/save", async (req, res) => {
  try {
    const { text, source } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const doc = new Generated({ text, source: source || "local" });
    await doc.save();
    return res.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("Save error:", err);
    return res.status(500).json({ error: "Save failed" });
  }
});

export default router;
