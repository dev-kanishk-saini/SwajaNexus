import mongoose from "mongoose";

const SiteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    networkConfig: { type: mongoose.Schema.Types.Mixed, default: "" }, 
  },
  { timestamps: true }
);

export default mongoose.models.Site || mongoose.model("Site", SiteSchema);
