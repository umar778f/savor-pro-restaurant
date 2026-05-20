import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../lib/utils";

export const generateInvoicePDF = (order: any) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5" // Small receipt format
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("SMART POS", pageWidth / 2, 20, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("123 Food Street, Tech City", pageWidth / 2, 28, { align: "center" });
  doc.text("Phone: +1 234 567 890", pageWidth / 2, 33, { align: "center" });
  
  // Divider
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(10, 40, pageWidth - 10, 40);

  // Order Details
  doc.setFontSize(10);
  doc.text(`Order #: ${order.orderNumber}`, 15, 50);
  doc.text(`Date: ${new Date(order.date).toLocaleString()}`, 15, 56);
  doc.text(`Payment: ${order.paymentMethod.toUpperCase()}`, 15, 62);

  // Table
  const tableData = order.items.map((item: any) => [
    item.name,
    item.quantity.toString(),
    (item.price * item.quantity).toString()
  ]);

  autoTable(doc, {
    startY: 70,
    head: [["Item", "Qty", "Amount"]],
    body: tableData,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fontStyle: "bold", textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 15, halign: "center" },
      2: { cellWidth: 25, halign: "right" }
    },
    margin: { left: 15, right: 15 }
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.line(10, finalY - 5, pageWidth - 10, finalY - 5);
  
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", pageWidth - 45, finalY);
  doc.text(formatCurrency(order.subtotal).replace('PKR', ''), pageWidth - 15, finalY, { align: "right" });

  doc.text("Tax (10%):", pageWidth - 45, finalY + 6);
  doc.text(formatCurrency(order.tax).replace('PKR', ''), pageWidth - 15, finalY + 6, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL:", pageWidth - 45, finalY + 14);
  doc.text(formatCurrency(order.total).replace('PKR', ''), pageWidth - 15, finalY + 14, { align: "right" });

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Thank you for your visit!", pageWidth / 2, finalY + 30, { align: "center" });

  // Save PDF
  doc.save(`Invoice_${order.orderNumber}.pdf`);
};
