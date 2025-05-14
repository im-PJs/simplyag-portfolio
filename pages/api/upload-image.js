import formidable from "formidable";
import { client } from "@/lib/sanity";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

function buildSanityImageUrl(assetId) {
  if (!assetId.startsWith("image-")) return "";
  const parts = assetId.replace("image-", "").split("-");
  const hash = parts[0];
  const dimensions = parts[1];
  const format = parts[2];
  return `https://cdn.sanity.io/images/lkjv2kw5/production/${hash}-${dimensions}.${format}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = formidable({
    multiples: false,
    keepExtensions: true,
    uploadDir: path.join(process.cwd(), "/tmp"), // 🧊 saves files temporarily
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Form parse error:", err);
      return res.status(500).json({ message: "Form parse failed" });
    }

    const imageFile = files.image;
    if (!imageFile || !imageFile.filepath) {
      console.error("❌ No valid file received");
      return res.status(400).json({ message: "Invalid image" });
    }

    try {
      console.log("🧾 Uploading:", imageFile.filepath);
      const buffer = fs.readFileSync(imageFile.filepath);
      const uploaded = await client.assets.upload("image", buffer, {
        filename: imageFile.originalFilename,
        contentType: imageFile.mimetype,
      });

      const url = buildSanityImageUrl(uploaded._id);
      console.log("✅ Sanity upload success:", url);
      return res.status(200).json({ url });
    } catch (uploadErr) {
      console.error("❌ Sanity upload failed:", uploadErr);
      return res.status(500).json({ message: "Sanity upload failed" });
    }
  });
}
