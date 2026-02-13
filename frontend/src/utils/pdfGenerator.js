import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "@/assets/logo.jpeg";

export const generateCertificatePDF = (certificate) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const W = 297;
  const H = 210;
  const CX = W / 2;

  // Ensure defaults
  const certificateNumber =
    certificate.certificate_number ||
    "CERT-" + Math.floor(100000 + Math.random() * 900000);

  const issueDate = certificate.issue_date
    ? new Date(certificate.issue_date)
    : new Date();

  const issueDateText = issueDate.toLocaleDateString("en-GB");

  /* ================= BORDER ================= */

  doc.setLineWidth(2);
  doc.setDrawColor(40, 45, 52);
  doc.rect(8, 8, W - 16, H - 16);

  doc.setLineWidth(0.6);
  doc.setDrawColor(120);

  const dash = (x1, y1, x2, y2, seg = 3, gap = 2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const segments = Math.floor(dist / (seg + gap));

    for (let i = 0; i < segments; i++) {
      const t1 = (i * (seg + gap)) / dist;
      const t2 = (i * (seg + gap) + seg) / dist;
      doc.line(x1 + dx * t1, y1 + dy * t1, x1 + dx * t2, y1 + dy * t2);
    }
  };

  dash(15, 15, W - 15, 15);
  dash(W - 15, 15, W - 15, H - 15);
  dash(W - 15, H - 15, 15, H - 15);
  dash(15, H - 15, 15, 15);

  /* ================= HEADER ================= */

  // Ribbon
  doc.setFillColor(245, 221, 160);
  doc.rect(CX - 110, 22, 220, 18, "F");

  // Logo (after ribbon so it stays visible)
  doc.addImage(logo, "PNG", 18, 18, 28, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(30);
  doc.text("CERTIFICATE OF ACHIEVEMENT", CX, 36, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(
    certificate.certificate_type?.toUpperCase() || "PARTICIPATION",
    CX,
    44,
    { align: "center" },
  );

  doc.setDrawColor(180);
  doc.line(60, 52, W - 60, 52);

  /* ================= BODY ================= */

  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.text("This is to certify that", CX, 70, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(30);
  doc.setTextColor(10);
  doc.text(certificate.recipient_name || "Recipient Name", CX, 88, {
    align: "center",
    maxWidth: 220,
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  const desc =
    certificate.description ||
    "has successfully completed the program and is hereby recognized for outstanding performance.";

  doc.text(desc, CX, 102, { align: "center", maxWidth: 230 });

  /* ================= DETAILS ================= */

  doc.setFontSize(10);
  doc.setTextColor(80);

  doc.text(`Certificate No: ${certificateNumber}`, CX, 118, {
    align: "center",
  });

  doc.text(`Issue Date: ${issueDateText}`, CX, 124, {
    align: "center",
  });

  /* ================= ORGANIZATION ================= */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30);
  doc.text("Rakashita Sewa Sansthan", 40, 150);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(
    certificate.organization_address || "Rakashita Sewa Sansthan",
    40,
    156,
    { maxWidth: 120 },
  );

  if (certificate.organization_contact) {
    doc.text(`Phone: ${certificate.organization_contact}`, 40, 162);
  }

  /* ================= SEAL ================= */

  const sealX = W - 60;
  const sealY = 150;

  // doc.setFillColor(240, 210, 100);
  // doc.circle(sealX, sealY, 22, "F");
  // doc.setDrawColor(120);
  // doc.circle(sealX, sealY, 22);

  // doc.setFontSize(8);
  // doc.setFont("helvetica", "bold");
  // doc.text("R.S.S", sealX, sealY - 1, { align: "center" });

  // doc.setFontSize(6);
  // doc.setFont("helvetica", "normal");
  // doc.text("Rakashita Sewa Sansthan", sealX, sealY + 6, {
  //   align: "center",
  // });

  // doc.line(sealX - 32, sealY + 30, sealX + 32, sealY + 30);
  // doc.setFontSize(10);
  doc.text("Authorized Signatory", sealX, sealY + 38, {
    align: "center",
  });

  /* ================= FOOTER ================= */

  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    "This is a computer-generated certificate and does not require a physical signature.",
    CX,
    H - 16,
    { align: "center" },
  );

  // doc.setFontSize(7);
  // doc.setTextColor(100);
  // doc.text(
  //   "Validate: https://wingstarnarketing.com/verify/" + certificateNumber,
  //   40,
  //   H - 16,
  // );

  return doc;
};

export const generateReceiptPDF = (receipt) => {
  const doc = new jsPDF();

  const W = doc.internal.pageSize.getWidth();

  const receiptNumber = receipt.receipt_number || "REC-" + Date.now();

  const amount = receipt.amount
    ? Number(receipt.amount).toLocaleString("en-IN")
    : "0";

  const date = receipt.created_at
    ? new Date(receipt.created_at).toLocaleDateString("en-GB")
    : new Date().toLocaleDateString("en-GB");

  /* ================= HEADER STRIP ================= */

  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, W, 35, "F");

  // Logo
  doc.addImage(logo, "PNG", 15, 6, 22, 22);

  // Organization Name
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Rakashita Sewa Sansthan", 45, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Rakshita Sewa Sansthan | 9982815922 | Darasingh51896@gmail.com",
    45,
    25,
  );

  /* ================= RECEIPT BADGE ================= */

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(W - 65, 8, 50, 18, 3, 3, "F");

  doc.setTextColor(15, 118, 110);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("OFFICIAL RECEIPT", W - 40, 18, { align: "center" });

  /* ================= MAIN CONTAINER ================= */

  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(230);
  doc.roundedRect(15, 50, W - 30, 200, 4, 4);

  /* ================= RECEIPT INFO ================= */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Receipt No: ${receiptNumber}`, 25, 65);

  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${date}`, W - 25, 65, { align: "right" });

  doc.line(25, 70, W - 25, 70);

  /* ================= DETAILS SECTION ================= */

  let y = 85;
  const gap = 12;

  const row = (label, value) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, 30, y);

    doc.setFont("helvetica", "bold");
    doc.text(value || "-", 90, y);

    y += gap;
  };

  row("Receipt Type:", receipt.receipt_type || "General");
  row("Recipient Name:", receipt.recipient_name);

  /* ================= AMOUNT HERO SECTION ================= */

  doc.setFillColor(240, 253, 250);
  doc.roundedRect(25, y + 5, W - 50, 40, 6, 6, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(80);
  doc.text("Total Amount Paid", W / 2, y + 20, {
    align: "center",
  });

  // doc.setFont("helvetica", "bold");
  // doc.setFontSize(32);
  // doc.setTextColor(16, 185, 129);
  // doc.text(`₹ ${amount}`, W / 2, y + 35, {
  //   align: "center",
  // });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(16, 185, 129);

  // Print amount centered first
  doc.text(amount, W / 2 + 5, y + 35, {
    align: "center",
  });

  // Print ₹ separately slightly left
  doc.setFontSize(24);
  doc.text("Rs.", W / 2 - 25, y + 35);

  doc.setTextColor(0, 0, 0);

  y += 55;

  /* ================= DESCRIPTION ================= */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Description", 30, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const desc = doc.splitTextToSize(receipt.description || "N/A", W - 60);

  doc.text(desc, 30, y + 8);

  y += desc.length * 6 + 20;

  /* ================= DONATION NOTICE ================= */

  if (receipt.receipt_type === "donation") {
    doc.setFillColor(249, 115, 22);
    doc.roundedRect(25, y, W - 50, 18, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Eligible for 80G Tax Benefit", W / 2, y + 12, {
      align: "center",
    });

    doc.setTextColor(0, 0, 0);
  }

  /* ================= FOOTER ================= */

  doc.setDrawColor(220);
  doc.line(25, 270, W - 25, 270);

  doc.setFontSize(9);
  doc.setTextColor(130);

  doc.text(
    "This is a computer-generated receipt and does not require signature.",
    W / 2,
    278,
    { align: "center" },
  );

  return doc;
};

export const downloadCertificatePDF = (certificate) => {
  const doc = generateCertificatePDF(certificate);

  const fileNumber = certificate.certificate_number || "CERT-" + Date.now();

  doc.save(`Certificate-${fileNumber}.pdf`);
};

export const downloadReceiptPDF = (receipt) => {
  const doc = generateReceiptPDF(receipt);
  doc.save(`Receipt-${receipt.receipt_number}.pdf`);
};

// export const generateDesignationPDF = (data) => {
//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: "a4",
//   });

//   const W = 210;
//   const H = 297;
//   const CX = W / 2;

//   /* ================= HEADER ================= */

//   doc.setFillColor(15, 118, 110);
//   doc.rect(0, 0, W, 35, "F");

//   doc.addImage(logo, "PNG", 15, 6, 22, 22);

//   doc.setTextColor(255, 255, 255);
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(18);
//   doc.text("APPOINTMENT LETTER", CX, 20, { align: "center" });

//   doc.setFontSize(10);
//   doc.text("Rakashita Sewa Sansthan", CX, 28, { align: "center" });

//   /* ================= BODY ================= */

//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(12);

//   let y = 60;

//   doc.text(`Name: ${data.name}`, 25, y);
//   y += 12;

//   doc.text(`Designation: ${data.designation_name}`, 25, y);
//   y += 12;

//   doc.text(
//     `Date of Joining: ${
//       data.date_of_joining
//         ? new Date(data.date_of_joining).toLocaleDateString("en-GB")
//         : ""
//     }`,
//     25,
//     y,
//   );

//   y += 20;

//   doc.setFont("helvetica", "normal");
//   const paragraph =
//     "We are pleased to appoint you to the above designation in our organization. Your skills and dedication will contribute greatly to our mission and vision.";

//   const splitText = doc.splitTextToSize(paragraph, W - 50);
//   doc.text(splitText, 25, y);

//   y += splitText.length * 7 + 30;

//   /* ================= SIGNATURE ================= */

//   if (data.signature) {
//     doc.text("Authorized Signature:", W - 80, y);
//     doc.addImage(data.signature, "PNG", W - 80, y + 5, 40, 20);
//   }

//   /* ================= FOOTER ================= */

//   doc.setFontSize(9);
//   doc.setTextColor(120);
//   doc.text("This is a computer-generated appointment letter.", CX, H - 20, {
//     align: "center",
//   });

//   return doc;
// };

// export const generateDesignationPDF = (data) => {
//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: "a4",
//   });

//   const W = 210;
//   const H = 297;
//   const M = 20; // margin

//   const letterNo = "APP-" + Math.floor(100000 + Math.random() * 900000);

//   const joiningDate = data.date_of_joining
//     ? new Date(data.date_of_joining).toLocaleDateString("en-GB")
//     : "-";

//   const today = new Date().toLocaleDateString("en-GB");

//   /* ================= HEADER ================= */

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(18);
//   doc.text("RAKASHITA SEWA SANSTHAN", W / 2, 25, { align: "center" });

//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(
//     "Baloda | Phone: 9982815922 | Email: Darasingh51896@gmail.com",
//     W / 2,
//     32,
//     { align: "center" },
//   );

//   doc.setDrawColor(0);
//   doc.line(M, 38, W - M, 38);

//   /* ================= REF + DATE ================= */

//   doc.setFontSize(11);
//   doc.text(`Ref No: ${letterNo}`, M, 50);
//   doc.text(`Date: ${today}`, W - M, 50, { align: "right" });

//   /* ================= SUBJECT ================= */

//   doc.setFont("helvetica", "bold");
//   doc.text("Subject: Appointment Letter", M, 65);

//   /* ================= BODY ================= */

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(12);

//   let y = 80;

//   doc.text(`To,`, M, y);
//   y += 8;

//   doc.text(`${data.name || "Employee Name"}`, M, y);
//   y += 12;

//   const paragraph = `
// We are pleased to inform you that you have been appointed as
// ${data.designation_name || "Designation"} in Rakashita Sewa Sansthan
// with effect from ${joiningDate}.

// Your employment will be governed by the rules and regulations of the organization.
// You are expected to perform your duties with sincerity, dedication, and professionalism.

// We welcome you to the organization and wish you a successful tenure with us.
// `;

//   const splitText = doc.splitTextToSize(paragraph, W - 2 * M);
//   doc.text(splitText, M, y);

//   y += splitText.length * 7 + 20;

//   /* ================= SIGNATURE SECTION ================= */

//   doc.line(M, y, M + 50, y);
//   doc.text("Authorized Signatory", M, y + 6);

//   if (data.signature) {
//     doc.addImage(data.signature, "PNG", M, y - 25, 40, 20);
//   }

//   /* ================= FOOTER ================= */

//   doc.setFontSize(9);
//   doc.setTextColor(120);
//   doc.text(
//     "This is a computer-generated document and does not require physical signature.",
//     W / 2,
//     H - 15,
//     { align: "center" },
//   );

//   return doc;
// };

export const generateDesignationPDF = (data) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const W = 210;
  const H = 297;
  const M = 20;
  const CX = W / 2;

  const GREEN = [15, 118, 110]; // website green

  const letterNo = "APP-" + Math.floor(100000 + Math.random() * 900000);

  const joiningDate = data.date_of_joining
    ? new Date(data.date_of_joining).toLocaleDateString("en-GB")
    : "-";

  const today = new Date().toLocaleDateString("en-GB");

  /* ================= HEADER STRIP ================= */

  doc.setFillColor(...GREEN);
  doc.rect(0, 0, W, 40, "F");

  // Logo
  doc.addImage(logo, "PNG", 15, 8, 24, 24);

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Rakashita Sewa Sansthan", 45, 20);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Baloda | 9982815922 | Darasingh51896@gmail.com", 45, 27);

  /* ================= TITLE ================= */

  doc.setTextColor(...GREEN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("APPOINTMENT LETTER", CX, 55, { align: "center" });

  doc.setDrawColor(...GREEN);
  doc.line(60, 60, W - 60, 60);

  /* ================= REF & DATE ================= */

  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");

  doc.text(`Ref No: ${letterNo}`, M, 75);
  doc.text(`Date: ${today}`, W - M, 75, { align: "right" });

  /* ================= BODY ================= */

  let y = 90;

  doc.text("To,", M, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.text(data.name || "Employee Name", M, y);
  y += 12;

  doc.setFont("helvetica", "normal");

  const paragraph = `
We are pleased to inform you that you have been appointed as ${
    data.designation_name || "Designation"
  } in Rakashita Sewa Sansthan with effect from ${joiningDate}.

Your employment will be governed by the rules and regulations of the organization.
You are expected to perform your assigned responsibilities with sincerity, discipline, and professionalism.

We welcome you to the organization and wish you a successful and rewarding tenure with us.
`;

  const splitText = doc.splitTextToSize(paragraph, W - 2 * M);
  doc.text(splitText, M, y);

  y += splitText.length * 7 + 25;

  /* ================= SIGNATURE SECTION ================= */

  if (data.signature) {
    doc.addImage(data.signature, "PNG", M, y - 20, 40, 18);
  }

  doc.line(M, y + 5, M + 60, y + 5);
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatory", M, y + 12);

  /* ================= FOOTER ================= */

  doc.setDrawColor(...GREEN);
  doc.line(0, H - 20, W, H - 20);

  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.setFont("helvetica", "normal");

  doc.text(
    "This is a system-generated appointment letter and does not require physical signature.",
    CX,
    H - 12,
    { align: "center" },
  );

  return doc;
};

export const downloadDesignationPDF = (data) => {
  const doc = generateDesignationPDF(data);
  doc.save(`Designation-${data.name}.pdf`);
};

// export const generateIDCardPDF = (data) => {
//   const doc = new jsPDF({
//     orientation: "landscape",
//     unit: "mm",
//     format: [85, 54], // ID card size (credit card size)
//   });

//   const W = 85;
//   const H = 54;

//   const RED = [220, 38, 38];
//   const GREEN = [22, 101, 52];
//   const DARK = [30, 41, 59];

//   /* ================= FRONT SIDE ================= */

//   // Top Red Strip
//   doc.setFillColor(...RED);
//   doc.rect(0, 0, W, 8, "F");

//   doc.setFontSize(6);
//   doc.setTextColor(255, 255, 255);
//   doc.text("Reg No: SRM123    Niti Aayog: RJ/2025/0772565", W / 2, 5, {
//     align: "center",
//   });

//   // Logo
//   doc.addImage(logo, "PNG", W / 2 - 8, 10, 16, 16);

//   // Organization Name
//   doc.setTextColor(0);
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(8);
//   doc.text("Rakashita Sewa Sansthan", W / 2, 30, { align: "center" });

//   doc.setFontSize(6);
//   doc.setFont("helvetica", "normal");

//   // Member Name
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(8);
//   doc.setTextColor(200, 0, 0);
//   doc.text(data.name || "Member Name", W / 2, 42, {
//     align: "center",
//   });

//   doc.setFontSize(7);
//   doc.setTextColor(0);
//   doc.text(data.designation_name || "General Member", W / 2, 46, {
//     align: "center",
//   });

//   /* ================= BACK SIDE ================= */

//   doc.addPage([85, 54], "landscape");

//   // Header
//   doc.setFillColor(...RED);
//   doc.rect(0, 0, W, 8, "F");

//   doc.setFontSize(6);
//   doc.setTextColor(255, 255, 255);
//   doc.text("Reg No: SRM123    Niti Aayog: RJ/2025/0772565", W / 2, 5, {
//     align: "center",
//   });

//   doc.setTextColor(...GREEN);
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(8);
//   doc.text("TERMS & CONDITIONS", W / 2, 16, { align: "center" });

//   doc.setTextColor(0);
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(6);

//   const terms = [
//     "1. This card confirms your online membership.",
//     "2. For NGO identification only.",
//     "3. Not a government ID.",
//     "4. Misuse is strictly prohibited.",
//   ];

//   let y = 22;
//   terms.forEach((line) => {
//     doc.text(line, 5, y);
//     y += 5;
//   });

//   doc.setFontSize(6);
//   doc.text(
//     `Joining: ${
//       data.date_of_joining
//         ? new Date(data.date_of_joining).toLocaleDateString("en-GB")
//         : "-"
//     }`,
//     5,
//     44,
//   );

//   doc.text(
//     `Valid Till: ${
//       data.date_of_joining
//         ? new Date(
//             new Date(data.date_of_joining).setFullYear(
//               new Date(data.date_of_joining).getFullYear() + 1,
//             ),
//           ).toLocaleDateString("en-GB")
//         : "-"
//     }`,
//     5,
//     48,
//   );

//   return doc;
// };

// export const generateIDCardPDF = (data) => {
//   const doc = new jsPDF({
//     orientation: "landscape",
//     unit: "mm",
//     format: [85, 54],
//   });

//   const W = 85;
//   const H = 54;

//   const GREEN = [15, 118, 110]; // website green
//   const DARK = [30, 41, 59];
//   const LIGHT = [240, 253, 250];

//   const joiningDate = data.date_of_joining
//     ? new Date(data.date_of_joining).toLocaleDateString("en-GB")
//     : "-";

//   const validTill = data.date_of_joining
//     ? new Date(
//         new Date(data.date_of_joining).setFullYear(
//           new Date(data.date_of_joining).getFullYear() + 1,
//         ),
//       ).toLocaleDateString("en-GB")
//     : "-";

//   const memberId = "RSS-" + Math.floor(1000 + Math.random() * 9000);

//   /* ================= FRONT SIDE ================= */

//   // Background
//   doc.setFillColor(...LIGHT);
//   doc.rect(0, 0, W, H, "F");

//   // Top Green Header
//   doc.setFillColor(...GREEN);
//   doc.rect(0, 0, W, 10, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(7);
//   doc.text("RAKASHITA SEWA SANSTHAN", W / 2, 6.5, {
//     align: "center",
//   });

//   // Logo
//   doc.addImage(logo, "PNG", 5, 14, 14, 14);

//   // Member Details Section
//   doc.setTextColor(...DARK);

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(9);
//   doc.text(data.name || "Member Name", 25, 18);

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(7);
//   doc.text(data.designation_name || "Designation", 25, 23);

//   if (data.email) {
//     doc.text(`Email: ${data.email}`, 25, 28);
//   }

//   if (data.city) {
//     doc.text(`City: ${data.city}`, 25, 32);
//   }

//   // ID Badge Box
//   doc.setFillColor(255, 255, 255);
//   doc.roundedRect(5, 34, W - 10, 14, 3, 3, "F");

//   doc.setDrawColor(...GREEN);
//   doc.roundedRect(5, 34, W - 10, 14, 3, 3);

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(7);
//   doc.setTextColor(...GREEN);
//   doc.text(`Member ID: ${memberId}`, 8, 39);

//   doc.setFont("helvetica", "normal");
//   doc.setTextColor(0);
//   doc.text(`Joining: ${joiningDate}`, 8, 43);
//   doc.text(`Valid Till: ${validTill}`, 8, 47);

//   /* ================= BACK SIDE ================= */

//   doc.addPage([85, 54], "landscape");

//   // Background
//   doc.setFillColor(255, 255, 255);
//   doc.rect(0, 0, W, H, "F");

//   // Top Green Bar
//   doc.setFillColor(...GREEN);
//   doc.rect(0, 0, W, 10, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(7);
//   doc.setFont("helvetica", "bold");
//   doc.text("TERMS & CONDITIONS", W / 2, 6.5, {
//     align: "center",
//   });

//   doc.setTextColor(0);
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(6);

//   const terms = [
//     "1. This card confirms active NGO membership.",
//     "2. Valid for organizational identification only.",
//     "3. Not a government issued ID.",
//     "4. Misuse will lead to cancellation.",
//   ];

//   let y = 18;
//   terms.forEach((line) => {
//     doc.text(line, 5, y);
//     y += 6;
//   });

//   // Footer strip
//   doc.setFillColor(...GREEN);
//   doc.rect(0, H - 6, W, 6, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(6);
//   doc.text("Rakashita Sewa Sansthan | www.yourngo.org", W / 2, H - 2, {
//     align: "center",
//   });

//   return doc;
// };

export const generateIDCardPDF = (data) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [85, 54],
  });

  const W = 85;
  const H = 54;

  const GREEN = [15, 118, 110];
  const DARK = [30, 41, 59];
  const LIGHT = [245, 255, 252];

  const joiningDate = data.date_of_joining
    ? new Date(data.date_of_joining).toLocaleDateString("en-GB")
    : "-";

  const validTill = data.date_of_joining
    ? new Date(
        new Date(data.date_of_joining).setFullYear(
          new Date(data.date_of_joining).getFullYear() + 1,
        ),
      ).toLocaleDateString("en-GB")
    : "-";

  const memberId = "RSS-" + Math.floor(10000 + Math.random() * 90000);

  /* ================= BACKGROUND ================= */

  doc.setFillColor(...LIGHT);
  doc.rect(0, 0, W, H, "F");

  /* ================= HEADER ================= */

  doc.setFillColor(...GREEN);
  doc.rect(0, 0, W, 9, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("RAKASHITA SEWA SANSTHAN", W / 2, 6, { align: "center" });

  /* ================= LOGO ================= */

  doc.addImage(logo, "PNG", 5, 12, 14, 14);

  /* ================= MEMBER INFO ================= */

  doc.setTextColor(...DARK);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(data.name || "Member Name", 22, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(data.designation_name || "Designation", 22, 22);

  if (data.email) {
    doc.text(data.email, 22, 26);
  }

  if (data.city) {
    doc.text(data.city, 22, 30);
  }

  /* ================= ID BOX ================= */

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(5, 32, W - 10, 10, 2, 2, "F");

  doc.setDrawColor(...GREEN);
  doc.roundedRect(5, 32, W - 10, 10, 2, 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...GREEN);
  doc.text(`ID: ${memberId}`, 8, 37);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0);
  doc.text(`Join: ${joiningDate}`, 8, 40);
  doc.text(`Valid: ${validTill}`, 45, 40);

  /* ================= TERMS (BOTTOM SECTION) ================= */

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(5, 43, W - 10, 8, 2, 2, "F");

  doc.setDrawColor(200);
  doc.roundedRect(5, 43, W - 10, 8, 2, 2);

  doc.setFontSize(5.5);
  doc.setTextColor(60);

  const termsText = [
    "• Valid NGO Membership Identification Card.",
    "• Non-transferable & property of organization.",
    "• Not a Government issued identity proof.",
  ];

  let y = 46;
  termsText.forEach((line) => {
    doc.text(line, 7, y);
    y += 2.8;
  });

  /* ================= FOOTER STRIP ================= */

  doc.setFillColor(...GREEN);
  doc.rect(0, H - 4, W, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(5.5);
  doc.text("Official NGO Membership ID Card", W / 2, H - 1.5, {
    align: "center",
  });

  return doc;
};

export const downloadIDCardPDF = (data) => {
  const doc = generateIDCardPDF(data);
  doc.save(`ID-Card-${data.name}.pdf`);
};
