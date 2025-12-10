import express from "express";

const router = express.Router();

// Testing route
router.get("/", (req, res) => {
  res.send("✅ Resume route working!");
});

export default router;
