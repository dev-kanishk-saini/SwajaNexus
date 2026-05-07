import connectDB from "@/lib/db";
import Site from "@/models/Site";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const sites = await Site.find({}).sort({ createdAt: -1 });
    console.log("Fetched sites:", sites);
    return NextResponse.json(sites);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const site = await Site.create(body);
    return NextResponse.json(site, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
