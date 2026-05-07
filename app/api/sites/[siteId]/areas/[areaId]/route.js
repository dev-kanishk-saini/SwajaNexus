import connectDB from "@/lib/db";
import Area from "@/models/Area";
import Device from "@/models/Device";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const area = await Area.findById(params.areaId);
    console.log("Area found:", area);
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
    const area = await Area.findByIdAndUpdate(params.areaId, body, { new: true, runValidators: true });
    if (!area) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(area);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Device.deleteMany({ areaId: params.areaId });
    await Area.findByIdAndDelete(params.areaId);
    return NextResponse.json({ message: "Area deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
