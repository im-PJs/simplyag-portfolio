// src/lib/sanity.js

import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "lkjv2kw5",
  dataset: "production",
  apiVersion: "2024-04-27", // today's date
  useCdn: false,
});
