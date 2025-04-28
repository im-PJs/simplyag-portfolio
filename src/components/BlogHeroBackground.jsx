// src/components/BlogHeroBackground.jsx
"use client";

import { useState, useEffect, useRef } from "react";

export default function BlogHeroBackground() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const isFirst = useRef(true);

  useEffect(() => {
    fetch('/api/hero-images')
      .then((r) => r.json())
      .then((imgs) => {
        setImages(imgs);
        const start = Math.floor(Math.random() * imgs.length);
        setCurrent(start);
        setPrev(start);
      });
  }, []);

  useEffect(() => {
    if (!images.length) return;
    const iv = setInterval(() => {
      setPrev(current);
      let next;
      do {
        next = Math.floor(Math.random() * images.length);
      } while (next === current);
      setCurrent(next);
      isFirst.current = false;
    }, 20000);
    return () => clearInterval(iv);
  }, [current, images]);

  useEffect(() => {
    if (isFirst.current) return;
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [current]);

  if (!images.length) return null;

  const currImg = images[current];
  const prevImg = images[prev];

  const layerStyle = (url, opacity = 1) => ({
    backgroundImage: `url('${url}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(4px)',
    transform: 'scale(1.03)',
    opacity,
  });

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Previous background */}
      <div
        key={`prev-${prev}`}
        className="absolute inset-0"
        style={layerStyle(prevImg, 1)}
      />
      {/* Current background */}
      <div
        key={`curr-${current}`}
        className="absolute inset-0 transition-opacity ease-in-out duration-[6000ms]"
        style={layerStyle(currImg, fadeIn ? 1 : 0)}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
