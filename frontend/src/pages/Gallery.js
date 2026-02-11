
import React, { useState, useEffect, useRef } from "react";

/**
 * NOTE:
 * - If you're using Next.js and want to use next/image, see the note at bottom.
 * - Tailwind should be configured. classes used: columns-*, break-inside-avoid, etc.
 */

const rawImages = [
  { q: "nature", alt: "Nature", title: "Peaceful Nature" },
  { q: "technology", alt: "Technology", title: "Future Tech" },
  { q: "coding", alt: "Coding", title: "Code Life" },
  { q: "travel", alt: "Travel", title: "Wanderlust" },
  { q: "mountains", alt: "Mountains", title: "High Peaks" },
  { q: "city", alt: "City", title: "City Lights" },
  { q: "beach", alt: "Beach", title: "Sunny Beach" },
  { q: "workspace", alt: "Workspace", title: "Workspace Vibes" },
  { q: "computer", alt: "Computer", title: "Setup Goals" },
];

// tiny inline SVG fallback (very small, always available)
const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='28'>Image not available</text></svg>`,
  );

export default function Gallery() {
  // prepare images with signed query param to avoid same-cache redirect issues
  const images = rawImages.map((itm, i) => {
    // Unsplash source supports query strings - add &sig to force unique image
    const src = `https://source.unsplash.com/900x1200/?${itm.q}&sig=${Date.now() % 100000}-${i}`;
    return { ...itm, src };
  });

  const [openIndex, setOpenIndex] = useState(null);
  const modalRef = useRef(null);
  const [loadingSet, setLoadingSet] = useState(new Set()); // track which images are still loading

  useEffect(() => {
    // add keyboard controls
    function onKey(e) {
      if (openIndex === null) return;
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight")
        setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft")
        setOpenIndex((i) =>
          i === null ? null : (i - 1 + images.length) % images.length,
        );
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, images.length]);

  useEffect(() => {
    // click outside to close (modal)
    function onClick(e) {
      if (!modalRef.current) return;
      if (openIndex !== null && !modalRef.current.contains(e.target))
        setOpenIndex(null);
    }
    if (openIndex !== null) window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [openIndex]);

  // image onLoad handler
  function handleLoad(idx) {
    setLoadingSet((s) => {
      const copy = new Set(s);
      copy.delete(idx);
      return copy;
    });
  }

  // image onError handler
  function handleError(e, idx) {
    // set fallback (avoid infinite loop)
    if (e?.target?.src === FALLBACK) return;
    e.target.src = FALLBACK;
    setLoadingSet((s) => {
      const copy = new Set(s);
      copy.delete(idx);
      return copy;
    });
  }

  // start loading - mark all as loading initially (so skeleton shows before imgs load)
  useEffect(() => {
    const all = new Set(images.map((_, i) => i));
    setLoadingSet(all);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-6">
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Stunning Photo Gallery
        </h1>
        <p className="mt-3 text-gray-600">
          Beautiful responsive masonry grid with lightbox — click any image.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Masonry with CSS columns. Remove fixed heights so natural aspect ratio keeps layout nice */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative mb-4 break-inside-avoid rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
              style={{ cursor: "zoom-in" }}
            >
              {/* skeleton while loading */}
              {loadingSet.has(idx) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                  <div className="w-24 h-6 rounded bg-gray-200" />
                </div>
              )}

              <img
                src={img.src}
                alt={img.alt}
                title={img.title}
                loading="lazy"
                onLoad={() => handleLoad(idx)}
                onError={(e) => handleError(e, idx)}
                className="w-full block object-cover rounded-xl"
                onClick={() => setOpenIndex(idx)}
                style={{ display: loadingSet.has(idx) ? "block" : "block" }}
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <h3 className="text-white font-semibold">{img.title}</h3>
                  <p className="text-sm text-white/80">{img.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal / Lightbox */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
          aria-modal="true"
          role="dialog"
        >
          <div ref={modalRef} className="relative max-w-4xl w-full mx-auto">
            <button
              onClick={() => setOpenIndex(null)}
              className="absolute top-3 right-3 z-50 rounded-full bg-white/90 hover:bg-white p-2 shadow"
              aria-label="Close"
            >
              {/* X icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Prev */}
            <button
              onClick={() =>
                setOpenIndex((i) => (i - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/90 hover:bg-white p-2 shadow"
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Next */}
            <button
              onClick={() => setOpenIndex((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/90 hover:bg-white p-2 shadow"
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="rounded-xl overflow-hidden bg-white">
              <img
                src={images[openIndex].src}
                alt={images[openIndex].alt}
                className="w-full max-h-[80vh] object-contain bg-black"
                onError={(e) => handleError(e, openIndex)}
              />
              <div className="p-4 bg-white">
                <h2 className="text-lg font-semibold text-gray-900">
                  {images[openIndex].title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {images[openIndex].alt}
                </p>
                <div className="mt-3 flex gap-3">
                  <a
                    href={images[openIndex].src}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Open source
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(images[openIndex].src);
                      // small feedback
                      try {
                        // use toast / alert if you prefer
                        alert("Image URL copied to clipboard");
                      } catch (err) {}
                    }}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
