
import connectDB from "@/lib/db";
import Area from "@/models/Area";
import Device from "@/models/Device";
import { deleteImage } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const area = await Area.findById(params.areaId);
    if (!area) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(area);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    // If the client is clearing the map (mapUrl: null),
    // delete the old image from Cloudinary first
    if (body.mapUrl === null) {
      const existing = await Area.findById(params.areaId).select("mapCloudinaryId");
      if (existing?.mapCloudinaryId) {
        await deleteImage(existing.mapCloudinaryId);
        body.mapCloudinaryId = null;   // clear the stored ID too
      }
    }

    const area = await Area.findByIdAndUpdate(params.areaId, body, {
      new: true,
      runValidators: true,
    });
    if (!area) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(area);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // Delete the Cloudinary image before removing the area from DB
    const area = await Area.findById(params.areaId).select("mapCloudinaryId");
    if (area?.mapCloudinaryId) {
      await deleteImage(area.mapCloudinaryId);
    }

    await Device.deleteMany({ areaId: params.areaId });
    await Area.findByIdAndDelete(params.areaId);

    return NextResponse.json({ message: "Area deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}