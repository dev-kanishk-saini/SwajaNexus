
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Area from "@/models/Area";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file     = formData.get("file");
    const areaId   = formData.get("areaId");

    if (!file)   return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!areaId) return NextResponse.json({ error: "areaId is required" }, { status: 400 });

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPG, JPEG and WEBP images are allowed" },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use areaId as the Cloudinary public_id so replacing the map
    // overwrites the old image rather than creating a new one each time.
    // The folder keeps your Cloudinary media library organised.
    const { url, publicId } = await uploadImage(
      buffer,
      "nexahome/maps",   // folder in Cloudinary
      `map_${areaId}`    // stable public_id per area
    );

    // Save the Cloudinary URL and publicId to the area document in MongoDB
    await connectDB();
    await Area.findByIdAndUpdate(areaId, {
      mapUrl:         url,
      mapCloudinaryId: publicId,   // store so we can delete it later
    });

    return NextResponse.json({ mapUrl: url, publicId });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}