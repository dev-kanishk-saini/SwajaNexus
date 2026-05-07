import connectDB from "@/lib/db";
import Device from "@/models/Device";
import { NextResponse } from "next/server";

const MAX_DEVICES_PER_AREA = 40;

export async function GET(req, { params }) {
  try {
    await connectDB();
    const devices = await Device.find({ areaId: params.areaId }).sort({ firstInstalledAt: -1 });
   
    return NextResponse.json(devices);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();
    const count = await Device.countDocuments({ areaId: params.areaId });
    if (count >= MAX_DEVICES_PER_AREA) {
      return NextResponse.json(
        { error: `Maximum ${MAX_DEVICES_PER_AREA} devices per area reached` },
        { status: 400 }
      );
    }
    const body = await req.json();
    const device = await Device.create({ ...body, areaId: params.areaId });
    return NextResponse.json(device, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
