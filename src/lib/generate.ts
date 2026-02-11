"use server";

import { Invoice } from "@/models/invoice";
import PDFDocument from "pdfkit";
import blobStream from "blob-stream";

export async function generateInvoice(invoice: Invoice): Promise<Blob> {
  const doc = new PDFDocument();
  const stream = doc.pipe(blobStream());

  doc.text("Invoice from " + invoice.from);

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      const blob = stream.toBlob();
      resolve(blob);
    });
    stream.on("error", reject);
  });
}
