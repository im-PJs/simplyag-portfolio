"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

// Load TinyMCE Editor dynamically for client-side only
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then(mod => mod.Editor),
  { ssr: false }
);

const PASSWORD = "SimplyAGSuperSecret2025";

export default function NewBlogPostPage() {
  const [inputPassword, setInputPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!image) {
      alert("Please choose a cover image before submitting.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", content);
    formData.append("image", image);

    try {
      await axios.post("/api/create-post", formData);
      setSubmitted(true);
      setTitle("");
      setContent("");
      if (image?.preview) URL.revokeObjectURL(image.preview);
      setImage(null);
    } catch (err) {
      console.error("❌ Blog submission failed:", err);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  // Simple password gate
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white px-4">
        <div className="max-w-md w-full bg-[#1e293b] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">🔐 Admin Login</h2>
          <input
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white mb-4"
            placeholder="Enter password"
          />
          <button
            onClick={() => {
              if (inputPassword === PASSWORD) {
                setAuthenticated(true);
              } else {
                alert("Incorrect password.");
              }
            }}
            className="bg-[#D4AF37] text-black font-bold py-2 px-4 w-full rounded hover:opacity-90 transition"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Success message
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">🎉 Blog Submitted!</h2>
        <p className="mb-6 text-gray-300">We'll take a look and publish it soon.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-[#D4AF37] text-black font-semibold py-2 px-6 rounded hover:opacity-90 transition"
        >
          Write Another Post
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-20 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-[#1e293b] p-6 rounded-lg shadow-xl flex flex-col gap-6"
      >
        <h2 className="text-4xl font-extrabold text-center mb-4">📝 Create a New Blog Post</h2>

        {/* Step 1: Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Step 1: Blog Title <span title="This is the big heading that shows at the top of the post.">🛈</span>
          </label>
          <input
            type="text"
            placeholder="Example: Our Weekend at Dorney Park"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 text-white"
          />
        </div>

        {/* Step 2: Blog Content */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Step 2: Blog Body <span title="This is the main content readers will see.">🛈</span>
          </label>
          <p className="text-xs text-gray-400 mb-2 leading-snug">
            Write your story here. You can format your text with bold, italics, bullet points, or links. To include an image, paste a direct image link (e.g. from Imgur or Sanity).
            <br />
            <span className="text-[10px] italic text-gray-500">Example: https://i.imgur.com/example.jpg</span>
          </p>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={content}
            onEditorChange={setContent}
            init={{
              height: 300,
              menubar: false,
              skin: "oxide-dark",
              content_css: "dark",
              plugins: [
                "autolink", "lists", "link", "image", "charmap",
                "preview", "anchor", "code", "fullscreen", "help", "wordcount"
              ],
              toolbar:
                "undo redo | blocks | bold italic underline | bullist numlist | link image | code fullscreen",
              automatic_uploads: false,
              file_picker_types: "",
              images_upload_handler: null,
            }}
          />
        </div>

        {/* Step 3: Cover Image */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Step 3: Cover Image <span title="Used as the blog thumbnail. Required.">🛈</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            This image shows on the main blog page as the thumbnail preview.
          </p>
          <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition text-white px-4 py-2 rounded text-sm w-fit">
            {image ? `✅ ${image.name}` : "📁 Click to Upload"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (image?.preview) URL.revokeObjectURL(image.preview);
                  file.preview = URL.createObjectURL(file);
                  setImage(file);
                }
              }}
              className="hidden"
            />
          </label>
          {image && (
            <img
              src={image.preview}
              alt="Cover Preview"
              className="mt-3 w-full max-w-xs rounded-lg shadow-lg border border-gray-700"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#D4AF37] text-black font-bold py-2 px-6 rounded hover:opacity-90 transition"
        >
          {loading ? "Uploading..." : "🚀 Submit Blog Post"}
        </button>
      </form>
    </div>
  );
}
