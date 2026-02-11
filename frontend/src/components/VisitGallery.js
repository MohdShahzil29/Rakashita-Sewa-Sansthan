import React from "react";

const VisitGallery = () => {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-br from-emerald-50 via-white to-green-100">
      {/* Background decorative blur circles */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-emerald-200 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-green-300 opacity-30 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {/* Small top badge */}
        <div className="inline-block px-4 py-1 mb-6 text-sm font-semibold tracking-wide text-emerald-700 bg-emerald-100 rounded-full shadow-sm">
          ✨ Explore Our Moments
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          देखें हमारी{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
            गैलरी
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          <span className="font-semibold text-emerald-700">
            रक्षिता सेवा संस्थान
          </span>{" "}
          द्वारा आयोजित प्रेरणादायक क्षणों, प्रभावशाली कार्यक्रमों और अर्थपूर्ण
          गतिविधियों को खोजें। हर एक तस्वीर सेवा और आशा की एक अनोखी कहानी बयान
          करती है।
        </p>

        {/* Premium Button */}
        <div className="mt-10 flex justify-center">
          <a
            href="/gellery"
            className="relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            देखें हमारी गैलरी
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default VisitGallery;
