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

  // Outer border
  doc.setLineWidth(2);
  doc.setDrawColor(40, 45, 52);
  doc.rect(8, 8, W - 16, H - 16);

  // Inner thin border (dashed effect)
  doc.setLineWidth(0.6);
  doc.setDrawColor(120);
  // dashed: draw short segments manually
  const dash = (x1, y1, x2, y2, seg = 3, gap = 2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const segments = Math.floor(dist / (seg + gap));
    for (let i = 0; i < segments; i++) {
      const t1 = (i * (seg + gap)) / dist;
      const t2 = (i * (seg + gap) + seg) / dist;
      const sx = x1 + dx * t1;
      const sy = y1 + dy * t1;
      const ex = x1 + dx * t2;
      const ey = y1 + dy * t2;
      doc.line(sx, sy, ex, ey);
    }
  };
  // top
  dash(15, 15, W - 15, 15);
  // right
  dash(W - 15, 15, W - 15, H - 15);
  // bottom
  dash(W - 15, H - 15, 15, H - 15);
  // left
  dash(15, H - 15, 15, 15);

  // Light watermark diagonal (organization name)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(42);
  doc.setTextColor(220); // light gray
  // rotate text by -35 degrees around center-ish
  doc.text("Rakashita Sewa Sansthan", CX, H / 2 + 10, {
    align: "center",
    angle: -35,
  });

  // doc.setDrawColor(80);
  // doc.setLineWidth(0.8);
  // doc.roundedRect(18, 18, 30, 30, 3, 3); // logo box
  // doc.setFontSize(7);
  // doc.setTextColor(80);
  // doc.text("Logo", 18 + 15, 18 + 17, { align: "center" });

  // Add Logo Image
  doc.addImage(logo, "JPEG", 18, 18, 30, 30);

  // Header: company name + ribbon
  // gold ribbon background
  doc.setFillColor(245, 221, 160);
  doc.setDrawColor(200);
  doc.rect(CX - 110, 22, 220, 18, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(30);
  doc.text("CERTIFICATE OF ACHIEVEMENT", CX, 36, { align: "center" });

  // small subtitle / certificate type
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`${certificate.certificate_type || "Participation"}`, CX, 44, {
    align: "center",
  });

  // Divider decorative
  doc.setLineWidth(0.6);
  doc.setDrawColor(180);
  doc.line(60, 52, W - 60, 52);

  // "This is to certify that"
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60);
  doc.text("This is to certify that", CX, 70, { align: "center" });

  // Recipient name - prominent
  doc.setFont("times", "italic"); // slightly formal script-ish
  doc.setFontSize(30);
  doc.setTextColor(10);
  doc.text(certificate.recipient_name || "Recipient Name", CX, 88, {
    align: "center",
    maxWidth: 220,
  });

  // Description line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const desc =
    certificate.description ||
    "has successfully completed the program and is hereby recognized for outstanding performance.";
  doc.text(desc, CX, 102, { align: "center", maxWidth: 230 });

  // Details (number + date) - centered, small
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(
    `Certificate No: ${certificate.certificate_number || "----"}`,
    CX,
    118,
    { align: "center" },
  );
  const issueDateText = certificate.issue_date
    ? new Date(certificate.issue_date).toLocaleDateString()
    : "-";
  doc.text(`Issue Date: ${issueDateText}`, CX, 124, { align: "center" });

  // Left block: Organization details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30);
  doc.text("Rakashita Sewa Sansthan", 40, 150);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    certificate.organization_address || "Rakashita Sewa Sansthan, Baloda",
    40,
    156,
    { maxWidth: 120 },
  );
  if (certificate.organization_contact) {
    doc.text(`Phone: ${certificate.organization_contact}`, 40, 162);
  }

  // Right block: Seal and signature
  // Seal circle
  const sealX = W - 60;
  const sealY = 150;
  doc.setFillColor(240, 210, 100);
  doc.circle(sealX, sealY, 22, "F");
  doc.setDrawColor(120);
  doc.circle(sealX, sealY, 22);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.text("R.S.S", sealX, sealY - 1, { align: "center" });
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("Rakashita Sewa Sansthan", sealX, sealY + 6, { align: "center" });

  // Signature line below seal
  doc.setLineWidth(0.6);
  doc.line(sealX - 32, sealY + 30, sealX + 32, sealY + 30);
  doc.setFontSize(10);
  doc.text("Authorized Signatory", sealX, sealY + 38, { align: "center" });

  // Small footer note centered
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    "This is a computer-generated certificate and does not require a physical signature.",
    CX,
    H - 16,
    { align: "center" },
  );

  // Optional: add small QR code or validation link placeholder bottom-left
  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.text(
    "Validate: https://wingstarnarketing.com/verify/" +
      (certificate.certificate_number || ""),
    40,
    H - 16,
  );

  // Reset font color (good practice)
  doc.setTextColor(0);

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
