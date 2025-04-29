import { client } from "@/lib/sanity";
import { NextResponse } from "next/server";
import { sendPostApprovalEmail } from "@/lib/email";

/**
 * Builds a public Sanity URL for an uploaded image.
 * @param {string} assetId - Sanity asset id
 * @returns {string} Public URL for the image
 */
function buildSanityImageUrl(assetId) {
  if (!assetId.startsWith("image-")) return "";
  const parts = assetId.replace("image-", "").split("-");
  const hash = parts[0];
  const dimensions = parts[1];
  const format = parts[2];
  return `https://cdn.sanity.io/images/lkjv2kw5/production/${hash}-${dimensions}.${format}`;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const body = formData.get("body");
    const image = formData.get("image");

    if (!title || !body) {
      return NextResponse.json({ message: "Title and body are required" }, { status: 400 });
    }

    const rawSlug = title.toLowerCase().replace(/\s+/g, "-");
    const safeSlug = rawSlug.replace(/[^a-z0-9-_]/g, "").slice(0, 50);

    let uploadedImage = null;
    let uploadedImageUrl = "";

    if (image && typeof image === "object" && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const asset = await client.assets.upload("image", buffer, {
        filename: image.name,
        contentType: image.type,
      });

      uploadedImage = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      };

      uploadedImageUrl = buildSanityImageUrl(asset._id);
      console.log("🖼️ Uploaded Image URL:", uploadedImageUrl);
    }

    const newPost = {
      _id: `drafts.${safeSlug}`,
      _type: "post",
      title,
      slug: { current: safeSlug },
      publishedAt: new Date().toISOString(),
      image: uploadedImage,
      body: [
        {
          _type: "block",
          _key: crypto.randomUUID(),
          style: "normal",
          children: [
            {
              _type: "span",
              _key: crypto.randomUUID(),
              text: body,
            },
          ],
        },
      ],
    };

    const created = await client.createIfNotExists(newPost);

    console.log("📤 Attempting to send approval email...");

    try {
      await sendPostApprovalEmail({
        title,
        slug: safeSlug,
        body,
        imageUrl: uploadedImageUrl,
      });
      console.log("✅ Email sent successfully!");
    } catch (emailErr) {
      console.error("❌ Failed to send approval email:", emailErr);
    }

    console.log("Draft post created:", created);

    return NextResponse.json({ message: "Draft created!" }, { status: 200 });
  } catch (err) {
    console.error("❌ Error creating draft:", err);
    return NextResponse.json({ message: "Server error creating draft" }, { status: 500 });
  }
}
