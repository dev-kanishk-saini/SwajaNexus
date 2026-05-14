import { v2 as cloudinary } from "cloudinary";

// ── Configure once — reused across all API calls ──────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary.
 *
 * @param {Buffer} buffer     - The raw file bytes
 * @param {string} folder     - Cloudinary folder to organise uploads (e.g. "nexahome/maps")
 * @param {string} publicId   - Optional stable ID (e.g. the areaId) so replacing
 *                              the image overwrites the old one instead of creating a new file
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadImage(buffer, folder = "nexahome/maps", publicId = null) {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: "image",
      // If publicId is provided, Cloudinary replaces the existing image at that ID.
      // This prevents orphaned files piling up when a user replaces a map.
      ...(publicId && { public_id: publicId, overwrite: true }),
    };

    // Cloudinary's Node SDK doesn't accept Buffer directly in upload(),
    // so we use upload_stream which accepts a stream of bytes.
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve({
        url:      result.secure_url,  // always HTTPS
        publicId: result.public_id,   // save this to DB so you can delete later
      });
    });

    // Write the buffer into the stream
    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by its public_id.
 * Call this when the user removes a map.
 *
 * @param {string} publicId - The public_id returned from uploadImage
 * @returns {Promise<void>}
 */
export async function deleteImage(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    // Don't crash the app if Cloudinary delete fails — just log it
    console.error("Cloudinary delete failed:", err.message);
  }
}

export default cloudinary;