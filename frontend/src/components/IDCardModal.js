// import { useState } from "react";
// import { downloadIDCardPDF } from "../utils/pdfGenerator";

// export default function IDCardModal({ open, onClose }) {
//   const [form, setForm] = useState({
//     name: "",
//     designation_name: "",
//     date_of_joining: "",
//   });

//   if (!open) return null;

//   const handleDownload = () => {
//     downloadIDCardPDF(form);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-96 space-y-4">
//         <h2 className="text-lg font-bold">Download ID Card</h2>

//         <input
//           type="text"
//           placeholder="Name"
//           className="w-full border p-2"
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />

//         <input
//           type="text"
//           placeholder="Designation"
//           className="w-full border p-2"
//           onChange={(e) =>
//             setForm({ ...form, designation_name: e.target.value })
//           }
//         />

//         <input
//           type="date"
//           className="w-full border p-2"
//           onChange={(e) =>
//             setForm({ ...form, date_of_joining: e.target.value })
//           }
//         />

//         <div className="flex justify-between">
//           <button onClick={onClose} className="px-4 py-2 border rounded">
//             Cancel
//           </button>

//           <button
//             onClick={handleDownload}
//             className="px-4 py-2 bg-green-600 text-white rounded"
//           >
//             Download
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { downloadIDCardPDF } from "../utils/pdfGenerator";

export default function IDCardModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    designation_name: "",
    email: "",
    city: "",
    date_of_joining: "",
  });

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDownload = () => {
    if (!form.name || !form.designation_name || !form.date_of_joining) {
      alert("Please fill required fields");
      return;
    }

    downloadIDCardPDF(form);
    onClose();
  };

  const validTill = form.date_of_joining
    ? new Date(
        new Date(form.date_of_joining).setFullYear(
          new Date(form.date_of_joining).getFullYear() + 1,
        ),
      ).toLocaleDateString("en-GB")
    : "";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-green-700">Download ID Card</h2>

        <input
          type="text"
          placeholder="Full Name *"
          className="w-full border p-2 rounded"
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <input
          type="text"
          placeholder="Designation *"
          className="w-full border p-2 rounded"
          onChange={(e) => handleChange("designation_name", e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          className="w-full border p-2 rounded"
          onChange={(e) => handleChange("city", e.target.value)}
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          onChange={(e) => handleChange("date_of_joining", e.target.value)}
        />

        {form.date_of_joining && (
          <p className="text-sm text-gray-600">
            Valid Till: <span className="font-semibold">{validTill}</span>
          </p>
        )}

        <div className="flex justify-between pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
