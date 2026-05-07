import connectDB from "@/lib/db";
import Area from "@/models/Area";
import { NextResponse } from "next/server";

// GET — fetch the stored network config for an area
export async function GET(req, { params }) {
  try {
    await connectDB();
    const area = await Area.findById(params.areaId).select("networkConfig");
    if (!area) return NextResponse.json({ error: "Area not found" }, { status: 404 });
    return NextResponse.json({ networkConfig: area.networkConfig });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — save parsed JSON as the network config
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    // body.networkConfig is the parsed JSON object from the uploaded file
    if (body.networkConfig === undefined) {
      return NextResponse.json({ error: "networkConfig field is required" }, { status: 400 });
    }

    const area = await Area.findByIdAndUpdate(
      params.areaId,
      { networkConfig: body.networkConfig },
      { new: true }
    );

    if (!area) return NextResponse.json({ error: "Area not found" }, { status: 404 });
    return NextResponse.json({ networkConfig: area.networkConfig });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — clear the network config
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Area.findByIdAndUpdate(params.areaId, { networkConfig: null });
    return NextResponse.json({ message: "Network config removed" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}