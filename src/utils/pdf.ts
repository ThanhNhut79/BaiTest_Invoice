import PDFDocument from "pdfkit";
import fs from "fs";

export async function createInvoicePDF(invoice: any, filePath: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      const dir = filePath.split("/").slice(0, -1).join("/") || "pdfs";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Number: ${invoice.number}`);
      doc.text(`Status: ${invoice.status}`);
      doc.text(`Total: ${(invoice.totalCents / 100).toFixed(2)}`);
      doc.text(`Created: ${invoice.createdAt}`);
      doc.moveDown();
      doc.text('--- End of invoice ---');

      doc.end();
      stream.on('finish', () => resolve());
      stream.on('error', (e) => reject(e));
    } catch (err) {
      reject(err);
    }
  });
}