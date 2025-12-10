import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("🟢 Received login data:", req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  res.json({ message: "Login successful", user: { email } });
});

export default router;
