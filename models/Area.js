import mongoose from "mongoose";

const AreaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    topic: { type: String, trim: true, default: "" },
    controlNodemeshaddress : { type: String, trim: true, default: "" },
    controlNodemacaddress: { type: String, trim: true, default: "" },
    mapUrl: { type: String, default: null }, // stored file path or URL
    mapCloudinaryId:  { type: String, default: null }, 
   
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Area || mongoose.model("Area", AreaSchema);
