import connectDB from "@/lib/db";
import Area from "@/models/Area";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const areas = await Area.find({ siteId: params.siteId }).sort({ createdAt: -1 });
    return NextResponse.json(areas);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const area = await Area.create({ ...body, siteId: params.siteId });
    return NextResponse.json(area, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
