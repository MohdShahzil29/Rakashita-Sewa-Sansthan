import React, { useState, useEffect, useRef } from "react";

const BACKEND_URL = "https://rakashita-sewa-sansthan.onrender.com"; // change in production

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <rect width='100%' height='100%' fill='#e5e7eb'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      fill='#9ca3af' font-family='Arial' font-size='28'>
      Image not available
      </text>
    </svg>`,
  );

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loadingSet, setLoadingSet] = useState(new Set());
  const modalRef = useRef(null);

  // Fetch gallery from backend
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/gallery`);
      const data = await res.json();
      setImages(data);

      // Mark all loading initially
      const all = new Set(data.map((_, i) => i));
      setLoadingSet(all);
    } catch (err) {
      console.error("Failed to fetch gallery", err);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return FALLBACK;
    if (url.startsWith("http")) return url;
    return `${BACKEND_URL}${url}`;
  };

  function handleLoad(idx) {
    setLoadingSet((prev) => {
      const copy = new Set(prev);
      copy.delete(idx);
      return copy;
    });
  }

  function handleError(e, idx) {
    e.target.src = FALLBACK;
    setLoadingSet((prev) => {
      const copy = new Set(prev);
      copy.delete(idx);
      return copy;
    });
  }

  useEffect(() => {
    function onKey(e) {
      if (openIndex === null) return;
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setOpenIndex((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, images.length]);

  useEffect(() => {
    function onClick(e) {
      if (!modalRef.current) return;
      if (openIndex !== null && !modalRef.current.contains(e.target))
        setOpenIndex(null);
    }
    if (openIndex !== null) window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [openIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-6">
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Rakashita Sewa Sansthan Gallery
        </h1>
        <p className="mt-3 text-gray-600">
          Moments captured from our activities and events.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md text-center border border-gray-100">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7a2 2 0 012-2h3l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Images Found
              </h2>

              <p className="text-gray-500 mb-6">
                The gallery is currently empty. Once images are uploaded, they
                will appear here beautifully.
              </p>

              <button
                onClick={fetchGallery}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition duration-300"
              >
                Refresh Gallery
              </button>
            </div>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="relative mb-4 break-inside-avoid rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
                style={{ cursor: "zoom-in" }}
              >
                {loadingSet.has(idx) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                    <div className="w-24 h-6 rounded bg-gray-200" />
                  </div>
                )}

                <img
                  src={getImageUrl(img.image_url)}
                  loading="lazy"
                  onLoad={() => handleLoad(idx)}
                  onError={(e) => handleError(e, idx)}
                  className="w-full block object-cover rounded-xl"
                  onClick={() => setOpenIndex(idx)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {openIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
          <div ref={modalRef} className="relative max-w-4xl w-full">
            <button
              onClick={() => setOpenIndex(null)}
              className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
            >
              ✕
            </button>

            <img
              src={getImageUrl(images[openIndex]?.image_url)}
              className="w-full max-h-[80vh] object-contain bg-black rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
