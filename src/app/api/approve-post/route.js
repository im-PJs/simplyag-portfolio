// src/app/api/approve-post/route.js

import { client } from "@/lib/sanity";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // <--- ADD THIS

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ message: "Missing slug" }, { status: 400 });
  }

  try {
    const draftId = `drafts.${slug}`;
    const draft = await client.getDocument(draftId);
    if (!draft) {
      return NextResponse.json({ message: "Draft not found" }, { status: 404 });
    }

    const publishedPost = { ...draft, _id: slug };
    const result = await client.createOrReplace(publishedPost);

    return NextResponse.json({ message: "Post published!", result });
  } catch (err) {
    console.error("Approval failed:", err);
    return NextResponse.json({ message: "Error approving post" }, { status: 500 });
  }
}
