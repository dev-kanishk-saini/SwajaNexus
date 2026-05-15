import connectDB from "@/lib/db";
import Site from "@/models/Site";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const site = await Site.findById(params.siteId).select("networkConfig");
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ networkConfig: site.networkConfig });
}

export async function PUT(req, { params }) {
  await connectDB();
  const { networkConfig } = await req.json();
  if (networkConfig === undefined)
    return NextResponse.json({ error: "networkConfig required" }, { status: 400 });
  const site = await Site.findByIdAndUpdate(
    params.siteId, { networkConfig }, { new: true }
  );
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ networkConfig: site.networkConfig });
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Site.findByIdAndUpdate(params.siteId, { networkConfig: null });
  return NextResponse.json({ message: "Network config removed" });
}
