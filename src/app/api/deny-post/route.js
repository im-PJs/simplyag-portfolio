// src/app/api/deny-post/route.js

import { client } from "@/lib/sanity";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // <-- ADD THIS

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ message: "Missing slug" }, { status: 400 });
  }

  try {
    const draftId = `drafts.${slug}`;

    await client.delete(draftId);
    return NextResponse.json({ message: "Draft deleted." });
  } catch (err) {
    console.error("Deny failed:", err);
    return NextResponse.json({ message: "Error deleting draft" }, { status: 500 });
  }
}
