import mongoose from "mongoose";
import { DEVICE_TYPES } from "@/lib/constants";

const DeviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: DEVICE_TYPES },
    installationLocation: { type: String, trim: true, default: "" },
    elementId: { type: String, trim: true, default: "" },
    meshAddress: { type: String, trim: true, default: "" },
    macAddress: { type: String, trim: true, default: "" },
    firstInstalledAt: { type: Date, default: Date.now },
    firmwareVersion: { type: String, trim: true, default: "" },
    x: { type: Number, default: 50 },
    y: { type: Number, default: 50 },
    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
  },
  { timestamps: true } // updatedAt comes from here
);

export default mongoose.models.Device ||
  mongoose.model("Device", DeviceSchema);
