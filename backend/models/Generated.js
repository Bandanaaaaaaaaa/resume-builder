import mongoose from "mongoose";

const GeneratedSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  source: { type: String, default: "local" } // or "openai"
});

export default mongoose.model("Generated", GeneratedSchema);
