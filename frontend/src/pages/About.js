import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Target,
  Award,
  TreePine,
  GraduationCap,
  Stethoscope,
  Scale,
} from "lucide-react";

import { Link } from "react-router-dom";
import FounderImage from "@/assets/Founder.jpeg";
import betiImage from "@/assets/beti.jpeg";
import goverment from "@/assets/goverment.jpeg";

/**
 * About.jsx
 * Full updated About page for Rakshita / Rakashita sewa sansthantyling
 * - Uses Framer Motion for animations
 * - Animated counters implemented with requestAnimationFrame
 */

const areasOfWork = [
  {
    icon: Users,
    title: "Women Empowerment & Gender Equality",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: GraduationCap,
    title: "Education & Skill Development",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Stethoscope,
    title: "Health, Hygiene & Nutrition",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Heart,
    title: "Child Welfare & Youth Development",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: TreePine,
    title: "Environmental Protection & Plantation",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Target,
    title: "Rural & Urban Development",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Scale,
    title: "Human Rights Awareness & Legal Aid",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Award,
    title: "Disaster Relief & Rehabilitation",
    color: "bg-yellow-100 text-yellow-600",
  },
];

// const teamMembers = [
//   { name: "जीतेश कुमार गुप्ता", role: "Co-Founder", img: जीतेशकुमारगुप्ता },
//   { name: "नरेंद्र कुमार महावर", role: "चेयरमैन", img: NarenderImage },
//   { name: "कृष्ण कुमार", role: "ट्रेजर (कोषाध्यक्ष)", img: कृष्ण },
// ];

const counterTargets = [
  { id: "families", label: "परिवारों की मदद", value: 5000, suffix: "+" },
  { id: "projects", label: "परियोजनाएं पूरी", value: 120, suffix: "+" },
  { id: "volunteers", label: "स्वयंसेवक", value: 300, suffix: "+" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const About = () => {
  useEffect(() => {
    document.title = "About Us | Rakshita Sewa Sansthan";
    const description =
      "Rakshita Sewa Sansthan — education, healthcare, women empowerment, environment & community development work in Rajasthan. Registered: COOP/2025/JHUNJHUNU/500639.";
    let meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    else {
      meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, []);

  // Animated counters (simple requestAnimationFrame)
  const [counts, setCounts] = useState(
    counterTargets.reduce((acc, cur) => ({ ...acc, [cur.id]: 0 }), {}),
  );

  useEffect(() => {
    let rafId;
    const duration = 1200; // ms
    const start = performance.now();

    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease out-ish
      const next = {};
      counterTargets.forEach((c) => {
        next[c.id] = Math.floor(c.value * eased);
      });
      setCounts(next);
      if (t < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className="min-h-screen bg-stone-50 text-stone-900"
      data-testid="about-page"
    >
      {/* HERO */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading font-bold text-4xl sm:text-5xl mb-4"
          >
            हमारे बारे में
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="max-w-3xl mx-auto text-lg leading-relaxed"
          >
            Rakshita Sewa Sansthan — बालोदा, झूंझूनू (Reg. No.
            COOP/2025/JHUNJHUNU/500639). हम शिक्षा, स्वास्थ्य, पोषण, महिला
            सशक्तिकरण और पर्यावरण के ज़रिये कमजोर वर्गों की सहायता करते हैं।
          </motion.p>
        </div>
      </section>

      {/* Intro Card */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 border border-stone-200"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.h2
              variants={fadeUp}
              className="font-heading font-bold text-3xl text-center mb-4"
            >
              Rakshita Sewa Sansthan
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-3"
            >
              <p>
                <strong>Rakshita Sewa Sansthan</strong> is a beacon of hope for
                the underprivileged. Registered under the Rajasthan Societies
                Registration Act (Reg. No. COOP/2025/JHUNJHUNU/500639), our
                organization works in memory of Late Rakshita and is committed
                to uplifting weaker sections via education, healthcare,
                nutrition, women empowerment, and environmental initiatives.
              </p>

              <p>
                Our mission is simple yet powerful —{" "}
                <em>
                  No child should be deprived of education, no family should
                  suffer due to lack of basic support.
                </em>
              </p>

              <p>
                Founded in memory of Late Rakshita, every year we organize
                special welfare activities on her birth and death anniversaries
                to serve the needy and promote social responsibility.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-primary/5 rounded-xl p-8 border-l-4 border-primary"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Target className="text-white" size={20} />
              </div>
              <h3 className="font-heading text-2xl font-bold">हमारी दृष्टि</h3>
            </div>
            <p className="text-stone-700 leading-relaxed">
              एक समावेशी, न्यायसंगत और सशक्त समाज जहाँ प्रत्येक व्यक्ति गरिमा और
              अवसर के साथ जीवन जी सके।
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-secondary/5 rounded-xl p-8 border-l-4 border-secondary"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <h3 className="font-heading text-2xl font-bold">हमारा लक्ष्य</h3>
            </div>
            <ul className="text-stone-700 list-inside space-y-2">
              <li>
                • शिक्षा, स्वास्थ्य और पर्यावरण के माध्यम से सशक्त समाज बनाना
              </li>
              <li>• महिलाओं और बच्चों को आत्मनिर्भर बनाना</li>
              <li>• समुदाय में सहभागिता और जिम्मेदार नागरिकता बढ़ाना</li>
              <li>• पारदर्शिता और दीर्घकालिक प्रभाव सुनिश्चित करना</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Counters / Impact */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-secondary/5 to-primary/5 rounded-2xl p-8 border border-stone-200"
          >
            <h3 className="font-heading text-2xl font-bold mb-6 text-center">
              हमारा प्रभाव
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {counterTargets.map((c) => (
                <div key={c.id} className="bg-white rounded-xl p-6 shadow">
                  <div className="text-3xl font-bold text-primary">
                    {counts[c.id]}
                    {c.suffix}
                  </div>
                  <div className="text-sm text-stone-600 mt-2">{c.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            Founder's Message
          </h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200"
          >
            <div className="grid md:grid-cols-3 gap-0">
              <div className="md:col-span-1 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-8">
                <div className="text-center">
                  <img
                    src={FounderImage}
                    alt="Dhara singh"
                    className="w-44 h-44 object-cover rounded-full border-4 border-white shadow-lg mx-auto"
                  />
                  <h4 className="mt-4 font-heading font-bold text-xl">
                    Dhara singh
                  </h4>
                  <p className="text-primary font-medium">Founder</p>
                </div>
              </div>

              <div className="md:col-span-2 p-8">
                <div className="prose prose-stone max-w-none text-stone-700">
                  <p>
                    <strong>Dhara singh</strong> founded the Foundation with a
                    deep belief that service to humanity is the highest form of
                    worship. Under his guidance, Rakashita sewa sansthan works
                    on sustainable, long-term solutions focused on education,
                    awareness, and capacity building.
                  </p>
                  <p>
                    His leadership follows principles of transparency, community
                    involvement, and measurable impact — aiming to empower
                    people, not create dependence.
                  </p>
                  <p>
                    “Service to humanity is the highest form of worship. We
                    strive to bring smiles to faces that have been forgotten by
                    society.”
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Areas of Work */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Areas of Work</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              हम विभिन्न क्षेत्रों में सामाजिक कल्याण और विकास के लिए काम करते
              हैं
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {areasOfWork.map((area, idx) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg"
                >
                  <div
                    className={`w-12 h-12 ${area.color} rounded-full flex items-center justify-center mb-4`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                    {area.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading text-3xl font-bold mb-4">
              Our Commitment
            </h3>
            <p className="mb-6">
              Rakashita Sewa Sansthan operates on a non-profit, non-political,
              and non-religious basis. We ensure accountability and transparent
              use of resources for social upliftment.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <strong>Non-Profit</strong>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <strong>Non-Political</strong>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <strong>Transparent</strong>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <strong>Community-Led</strong>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Beti Bachao + Government Approval Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Beti Bachao Section */}
              <div className="p-8 flex flex-col justify-center bg-pink-50">
                <div className="flex justify-center md:justify-start mb-4">
                  <img
                    src={betiImage}
                    alt="Beti Bachao Beti Padhao"
                    className="w-40 md:w-52 object-contain drop-shadow-md"
                  />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-pink-700 mb-4 text-center md:text-left">
                  बेटी बचाओ – बेटी पढ़ाओ
                </h3>

                <p className="text-stone-700 leading-relaxed text-center md:text-left">
                  हमारी संस्था "बेटी बचाओ – बेटी पढ़ाओ" अभियान का पूर्ण समर्थन
                  करती है। हम बालिकाओं की शिक्षा, सुरक्षा और सशक्तिकरण के लिए
                  निरंतर कार्यरत हैं। हमारा लक्ष्य है कि हर बेटी को समान अवसर,
                  सम्मान और उज्ज्वल भविष्य मिले।
                </p>
              </div>

              {/* Government Approved Section */}
              <div className="p-8 flex flex-col justify-center bg-blue-50 border-t md:border-t-0 md:border-l border-stone-200">
                <div className="flex justify-center md:justify-start mb-4">
                  <img
                    src={goverment}
                    alt="Approved by Government"
                    className="w-36 md:w-48 object-contain drop-shadow-md"
                  />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 text-center md:text-left">
                  भारत सरकार द्वारा अनुमोदित
                </h3>

                <p className="text-stone-700 leading-relaxed text-center md:text-left">
                  Rakshita Sewa Sansthan एक पंजीकृत एवं सरकारी मान्यता प्राप्त
                  संस्था है। हमारी सभी गतिविधियाँ पारदर्शिता, जवाबदेही और कानूनी
                  नियमों के अंतर्गत संचालित होती हैं। हम समाज सेवा के कार्यों
                  में पूर्ण ईमानदारी और विश्वसनीयता बनाए रखते हैं।
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
            <h3 className="font-heading font-semibold text-2xl text-center mb-4">
              संपर्क जानकारी
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold mb-2">पता</h4>
                <p className="text-stone-600">रक्षिता सेवा संस्थान, बलौदा</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">फोन</h4>
                <p className="text-stone-600">9982815922 , 8619362838</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Email</h4>
                <p className="text-stone-600">Darasingh51896@gamil.com</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link to="/contact">
                <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold shadow hover:scale-105 transition">
                  हमें संपर्क करें
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
