import connectDB from "@/lib/db";
import Device from "@/models/Device";
import { NextResponse } from "next/server";

// PUT /api/sites/:siteId/areas/:areaId/devices/bulk
// Body: array of devices with updated x, y positions
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const devices = await req.json();

    if (!Array.isArray(devices)) {
      return NextResponse.json({ error: "Expected an array of devices" }, { status: 400 });
    }

    // Update each device's x and y in parallel
    const updates = devices.map((device) =>
      Device.findByIdAndUpdate(
        device._id,
        { x: device.x, y: device.y },
        { new: true }
      )
    );

    const updated = await Promise.all(updates);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}