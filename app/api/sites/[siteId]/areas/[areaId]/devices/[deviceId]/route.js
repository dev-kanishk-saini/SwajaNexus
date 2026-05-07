import connectDB from "@/lib/db";
import Device from "@/models/Device";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const device = await Device.findById(params.deviceId);
    if (!device) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(device);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const device = await Device.findByIdAndUpdate(params.deviceId, body, {
      new: true,
      runValidators: true,
    });
    if (!device) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(device);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Device.findByIdAndDelete(params.deviceId);
    return NextResponse.json({ message: "Device deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
