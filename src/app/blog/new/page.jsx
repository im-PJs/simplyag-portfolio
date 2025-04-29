"use client";
import { useState } from "react";
import axios from "axios";

const PASSWORD = "SimplyAGSuperSecret2025"; // set your real one here

export default function NewBlogPostPage() {
  const [inputPassword, setInputPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    if (image) formData.append("image", image);

    try {
      await axios.post("/api/create-post", formData);
      setSubmitted(true);
      setTitle("");
      setBody("");
      setImage(null);
    } catch (err) {
      console.error("Error submitting post:", err);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white px-4">
        <div className="max-w-md w-full bg-[#1e293b] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Enter Password</h2>
          <input
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
            placeholder="Password"
          />
          <button
            onClick={() => {
              if (inputPassword === PASSWORD) {
                setAuthenticated(true);
              } else {
                alert("Incorrect password.");
              }
            }}
            className="bg-[#D4AF37] text-black font-semibold py-2 px-4 rounded hover:opacity-90 transition"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">🎉 Post Submitted!</h2>
        <p className="mb-6 text-gray-300">We'll review and publish it shortly!</p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-[#D4AF37] text-black font-semibold py-2 px-6 rounded hover:opacity-90 transition"
        >
          Submit Another Post
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-20 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-[#1e293b] p-6 rounded-lg shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold mb-4">New Blog Post</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white"
        />

        <textarea
          placeholder="Body"
          value={body}
          required
          onChange={(e) => setBody(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white min-h-[150px]"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#D4AF37] text-black font-semibold py-2 px-6 rounded hover:opacity-90 transition"
        >
          {loading ? "Submitting..." : "Submit Post"}
        </button>
      </form>
    </div>
  );
}
