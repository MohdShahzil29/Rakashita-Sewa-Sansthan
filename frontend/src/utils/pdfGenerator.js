import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateCertificatePDF = (certificate) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add border
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  // Add decorative inner border
  doc.setLineWidth(0.5);
  doc.rect(15, 15, 267, 180);

  // Title
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE", 148.5, 40, { align: "center" });

  // Certificate type
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(`of ${certificate.certificate_type}`, 148.5, 55, {
    align: "center",
  });

  // Divider line
  doc.setLineWidth(0.5);
  doc.line(80, 60, 217, 60);

  // This is to certify that
  doc.setFontSize(14);
  doc.text("This is to certify that", 148.5, 75, { align: "center" });

  // Recipient name
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.recipient_name, 148.5, 90, { align: "center" });

  // Certificate content/description
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const description = `has been awarded this certificate by NVP Welfare Foundation India`;
  doc.text(description, 148.5, 105, { align: "center", maxWidth: 200 });

  // Certificate details
  doc.setFontSize(10);
  doc.text(
    `Certificate Number: ${certificate.certificate_number}`,
    148.5,
    125,
    { align: "center" },
  );
  doc.text(
    `Issue Date: ${new Date(certificate.issue_date).toLocaleDateString()}`,
    148.5,
    135,
    { align: "center" },
  );

  // Organization details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("NVP Welfare Foundation India", 148.5, 160, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "नारायण निवास, बजरंग नगर, मोड़ा बालाजी रोड, दौसा, राजस्थान – 303303",
    148.5,
    167,
    { align: "center" },
  );
  doc.text("Phone: 99828 15922 | Email: Darasingh51896@gamil.com", 148.5, 173, {
    align: "center",
  });

  // Signature line
  doc.line(180, 150, 240, 150);
  doc.setFontSize(10);
  doc.text("Authorized Signature", 210, 155, { align: "center" });

  // Footer note
  doc.setFontSize(8);
  doc.text(
    "This is a computer-generated certificate and does not require a signature.",
    148.5,
    185,
    { align: "center" },
  );

  return doc;
};

export const generateReceiptPDF = (receipt) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  // ===== HEADER =====
  doc.setFillColor(13, 148, 136); // Teal Premium
  doc.rect(0, 0, pageWidth, 45, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Rakashita Sewa Sansthan", pageWidth / 2, 20, {
    align: "center",
  });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Narayan Niwas, Bajrang Nagar, Dausa, Rajasthan - 303303",
    pageWidth / 2,
    30,
    { align: "center" },
  );

  doc.text(
    "Contact: 9982815922 | Email: Darasingh51896@gmail.com",
    pageWidth / 2,
    37,
    { align: "center" },
  );

  doc.setTextColor(0, 0, 0);

  // ===== RECEIPT TITLE =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("OFFICIAL RECEIPT", pageWidth / 2, 60, { align: "center" });

  doc.setLineWidth(0.8);
  doc.line(20, 65, pageWidth - 20, 65);

  // ===== MAIN BOX =====
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 75, pageWidth - 30, 95, 3, 3);

  // ===== Receipt Number Badge =====
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 75, pageWidth - 30, 15, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Receipt No: ${receipt.receipt_number}`, 20, 85);

  // ===== DETAILS =====
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  let y = 105;
  const gap = 10;

  const addRow = (label, value, bold = false) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, 25, y);

    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(value || "-", 80, y);

    y += gap;
  };

  addRow("Receipt Type:", receipt.receipt_type || "General");
  addRow("Recipient Name:", receipt.recipient_name);

  // ===== Amount Highlight =====
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(75, y - 6, 80, 12, 2, 2, "F");

  addRow("Amount:", `₹ ${receipt.amount}`, true);

  addRow("Date:", new Date(receipt.created_at).toLocaleDateString());

  // ===== Description =====
  doc.setFont("helvetica", "normal");
  doc.text("Description:", 25, y);
  const desc = doc.splitTextToSize(receipt.description || "N/A", 110);
  doc.text(desc, 80, y);
  y += desc.length * 6 + 5;

  // ===== Donation Notice =====
  if (receipt.receipt_type === "donation") {
    doc.setFillColor(249, 115, 22);
    doc.roundedRect(20, y + 5, pageWidth - 40, 18, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Eligible for 80G Tax Benefit - Keep this receipt for tax filing.",
      pageWidth / 2,
      y + 17,
      { align: "center" },
    );

    doc.setTextColor(0, 0, 0);
    y += 30;
  }

  // ===== Footer Line =====
  doc.setDrawColor(180);
  doc.line(20, 260, pageWidth - 20, 260);

  doc.setFontSize(9);
  doc.setTextColor(120);

  doc.text(
    "This is a computer-generated receipt and does not require signature.",
    pageWidth / 2,
    268,
    { align: "center" },
  );

  doc.text(
    "For verification visit: www.rakashitasewa.org/verify",
    pageWidth / 2,
    274,
    { align: "center" },
  );

  return doc;
};

export const downloadCertificatePDF = (certificate) => {
  const doc = generateCertificatePDF(certificate);
  doc.save(`Certificate-${certificate.certificate_number}.pdf`);
};

export const downloadReceiptPDF = (receipt) => {
  const doc = generateReceiptPDF(receipt);
  doc.save(`Receipt-${receipt.receipt_number}.pdf`);
};
