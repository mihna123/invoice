"use server";

import { Invoice } from "@/models/invoice";
import PDFDocument from "pdfkit";
import blobStream from "blob-stream";

const MARGIN = 30;
const T_CELL_PADDING = 20;
const T_PADDING = 4;
const T_ROW_HEIGHT = 20;

const createTableHeader = (
  doc: PDFKit.PDFDocument,
  params: {
    itemText: string;
    quantityText: string;
    rateText: string;
    amountText: string;
  },
) => {
  doc.rect(doc.x, doc.y, doc.page.width - MARGIN * 2, T_ROW_HEIGHT).fill();
  doc.fontSize(10).fillColor("white");
  doc.text(params.itemText, MARGIN + T_PADDING, doc.y + 6);
  doc.moveUp();
  doc.text(
    params.quantityText,
    doc.page.width -
      MARGIN -
      doc.widthOfString(params.quantityText) -
      (doc.widthOfString(params.amountText) + T_CELL_PADDING) -
      (doc.widthOfString(params.rateText) + T_CELL_PADDING) -
      T_PADDING,
    doc.y,
  );
  doc.moveUp();
  doc.text(
    params.rateText,
    doc.page.width -
      MARGIN -
      (doc.widthOfString(params.amountText) + T_CELL_PADDING) -
      doc.widthOfString(params.rateText) -
      T_PADDING,
    doc.y,
  );
  doc.moveUp();
  doc.text(
    params.amountText,
    doc.page.width - MARGIN - doc.widthOfString(params.amountText) - T_PADDING,
    doc.y,
  );
  doc.fontSize(10).fillColor("black");
  doc.text("", MARGIN + T_PADDING, doc.y + T_ROW_HEIGHT / 2);
};

export async function generateInvoice(invoice: Invoice): Promise<Blob> {
  const doc = new PDFDocument({ size: "A4", margin: MARGIN });
  const stream = doc.pipe(blobStream());

  // Invoice from
  doc.fontSize(10);
  doc.text(invoice.from);

  // Invlice number and date
  doc.moveUp();
  doc.fontSize(12);

  const invNumber = "# " + invoice.invoice_number;
  doc.text(invNumber, doc.page.width - MARGIN - doc.widthOfString(invNumber));

  if (invoice.date) {
    doc.fontSize(10);
    const invDate = invoice.date.toLocaleDateString();
    doc.text(invDate, doc.page.width - MARGIN - doc.widthOfString(invDate));
  }

  // Separator
  doc.moveTo(MARGIN, doc.y + 5);
  doc.lineTo(doc.page.width - MARGIN, doc.y + 5).stroke();
  doc.moveDown();

  // Invoice title
  doc.fontSize(24);
  doc.text("INVOICE", MARGIN, doc.y + 3);
  doc.moveDown();

  // Bill to and details
  if (invoice.bill_to) {
    doc.fontSize(8);
    doc.text("BILL TO");
    doc.text(invoice.bill_to);
    doc.moveUp(2);
    doc.text("", MARGIN + doc.widthOfString("BILL TO") * 3, doc.y);
  }

  if (invoice.po_number) {
    doc.fontSize(8);
    doc.text("DETAILS");
    doc.text("Po number: " + invoice.po_number);
    doc.text("", MARGIN, doc.y + 10);
  }

  const params = {
    itemText: "ITEM",
    quantityText: "QUANTITY",
    rateText: "RATE",
    amountText: "AMOUNT",
  };

  createTableHeader(doc, params);

  invoice.line_items.forEach((item) => {
    const amount = (item.quantity * item.rate).toString();
    doc.text(item.description);
    doc.moveUp();
    doc.text(
      amount,
      doc.page.width - MARGIN - doc.widthOfString(amount) - T_PADDING,
      doc.y,
    );
    doc.moveUp();
    doc.text(
      item.rate.toString(),
      doc.x -
        doc.widthOfString(params.amountText) -
        doc.widthOfString(item.rate.toString()) / 2 -
        T_CELL_PADDING,
      doc.y,
    );
    doc.moveUp();
    doc.text(
      item.quantity.toString(),
      doc.x -
        (doc.widthOfString(params.quantityText + item.quantity) / 2 +
          T_CELL_PADDING),
      doc.y,
    );
    doc.text("", MARGIN + T_PADDING, doc.y + T_ROW_HEIGHT / 2);
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      const blob = stream.toBlob();
      resolve(blob);
    });
    stream.on("error", reject);
  });
}
