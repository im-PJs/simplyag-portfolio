import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Fetches an image from a public Sanity CDN URL and converts it into a Buffer
 * to attach as an email file.
 * @param {string} imageUrl - Public URL to the image hosted on Sanity
 * @returns {Promise<{ content: string, filename: string } | null>}
 */
async function fetchImageAsAttachment(imageUrl) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      console.error("❌ Failed to fetch image for attachment:", res.statusText);
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = "blog-image.jpg"; // Static filename for now
    return {
      content: buffer.toString("base64"), // MUST base64 encode for Resend attachments
      filename,
    };
  } catch (err) {
    console.error("❌ Error fetching image for attachment:", err);
    return null;
  }
}

/**
 * Sends an email with approval/deny buttons and optional image attachment.
 * @param {Object} param0
 * @param {string} param0.title - Blog post title
 * @param {string} param0.slug - Slug to identify the post
 * @param {string} [param0.body] - Optional preview text
 * @param {string} [param0.imageUrl] - Optional Sanity public image URL
 */
export async function sendPostApprovalEmail({ title, slug, body = "", imageUrl = "" }) {
  const approveUrl = `https://simplyag.channel/api/approve-post?slug=${slug}`;
  const denyUrl = `https://simplyag.channel/api/deny-post?slug=${slug}`;

  const previewText = body.length > 0 ? body.slice(0, 150) + "..." : "New blog post submitted!";

  const imagePreviewHtml = imageUrl
    ? `
      <p style="margin-top: 16px; font-size: 14px;">(Attached image below)</p>
      <p><a href="${imageUrl}" style="font-size: 14px; color: #888;">View Image Online</a></p>
    `
    : "";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #D4AF37;">📝 New Blog Post Submission</h2>
      <h3 style="margin-bottom: 8px;">${title}</h3>
      <p style="color: #555; margin-bottom: 20px;">${previewText}</p>
      ${imagePreviewHtml}
      <p style="margin-top: 24px;">Do you want to approve or deny it?</p>
      <div style="margin-top: 16px;">
        <a href="${approveUrl}" style="padding: 10px 20px; background: #16a34a; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">✅ Approve</a>
        <a href="${denyUrl}" style="padding: 10px 20px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">❌ Deny</a>
      </div>
    </div>
  `;

  const attachment = imageUrl ? await fetchImageAsAttachment(imageUrl) : null;

  console.log("🖼️ Uploaded Image URL:", imageUrl);
  console.log("📤 Attempting to send email...");

  const { data, error } = await resend.emails.send({
    from: "SimplyAG Bot <approve@simplyag.channel>",
    to: "aolive777@gmail.com", // Change to ItsSimplyAG@gmail.com when live
    subject: `📝 New Blog Post: ${title}`,
    html,
    attachments: attachment ? [attachment] : undefined,
  });

  if (error) {
    console.error("❌ Email sending failed:", error);
  } else {
    console.log("✅ Email sent successfully:", data);
  }
}
