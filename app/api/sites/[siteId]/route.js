import connectDB from "@/lib/db";
import Site from "@/models/Site";
import Area from "@/models/Area";
import Device from "@/models/Device";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const site = await Site.findById(params.siteId);
    if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(site);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const site = await Site.findByIdAndUpdate(params.siteId, body, { new: true, runValidators: true });
    if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(site);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    // Cascade delete areas and devices
    const areas = await Area.find({ siteId: params.siteId });
    const areaIds = areas.map((a) => a._id);
    await Device.deleteMany({ areaId: { $in: areaIds } });
    await Area.deleteMany({ siteId: params.siteId });
    await Site.findByIdAndDelete(params.siteId);
    return NextResponse.json({ message: "Site deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
