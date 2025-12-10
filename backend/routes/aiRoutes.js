import express from "express";
import OpenAI from "openai";

const router = express.Router();

function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

// Simple local fallback generator - deterministic and free.
// Takes comma separated skills and returns simple bullet points.
function localFallbackExpand(skills) {
  const items = skills.split(",").map(s => s.trim()).filter(Boolean);
  const bullets = items.map(skill => {
    const lower = skill.toLowerCase();

    if (/html|css|javascript|js|react|node/.test(lower)) {
      return `• ${skill}: Builds and maintains responsive web interfaces and client-side features using ${skill}.`;
    }
    if (/communication|written|verbal/.test(lower)) {
      return `• ${skill}: Communicates clearly with stakeholders to share progress and collaborate effectively.`;
    }
    if (/lead(er|ship)|manage/.test(lower)) {
      return `• ${skill}: Led small teams to deliver projects on time, coordinating tasks and mentoring members.`;
    }
    if (/teamwork|collaborat/.test(lower)) {
      return `• ${skill}: Works well in cross-functional teams to achieve project goals.`;
    }
    if (/sql|mongodb|database/.test(lower)) {
      return `• ${skill}: Designs and queries databases to store and retrieve structured information efficiently.`;
    }
    // generic fallback
    return `• ${skill}: Demonstrates proficiency in ${skill} and applies it to solve real-world problems.`;
  });

  return bullets.join("\n");
}

router.post("/skills", async (req, res) => {
  try {
    const { skills } = req.body || {};
    if (!skills || !skills.trim()) {
      return res.status(400).json({ error: "Please provide skills in request body." });
    }

    const client = getOpenAIClient();
    if (!client) {
      // No API key — use local fallback
      const fallback = localFallbackExpand(skills);
      return res.json({ result: fallback, fallback: true, source: "local" });
    }

    const prompt = `
Elaborate these skills into professional resume bullet points.
Keep them short, impact-oriented, and ready to paste in resume.

Skills: ${skills}
`;

    // call OpenAI
    try {
      const resp = await client.chat.completions.create({
        model: "gpt-4o-mini", // change if needed
        messages: [{ role: "user", content: prompt }],
      });

      const text = resp?.choices?.[0]?.message?.content ?? "";
      return res.json({ result: text.trim(), fallback: false, source: "openai" });
    } catch (openErr) {
      // If OpenAI fails (quota/rate limit), log and return fallback
      console.error("OpenAI call failed:", openErr);

      // If the error contains rate-limit / insufficient_quota, return helpful message + fallback
      const errMsg = openErr?.error?.message || openErr.message || String(openErr);
      const fallback = localFallbackExpand(skills);

      return res.status(200).json({
        error: "OpenAI request failed",
        details: errMsg,
        result: fallback,
        fallback: true,
        source: "local"
      });
    }
  } catch (err) {
    console.error("Unexpected error in /api/ai/skills:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
