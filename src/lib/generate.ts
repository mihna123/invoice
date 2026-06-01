'use server';

import { Invoice } from '@/models/invoice';
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import path from 'path';

const MARGIN = 30;
const T_CELL_PADDING = 30;
const T_PADDING = 4;
const T_ROW_HEIGHT = 20;

const GRAY_COLOR = '#5e5e5e';

const FONT_NORMAL = path.join(
  process.cwd(),
  'public/fonts/DejaVuSerifCondensed.ttf',
);
const FONT_BOLD = path.join(
  process.cwd(),
  'public/fonts/DejaVuSerifCondensed-Bold.ttf',
);

const createTableHeader = (
  doc: PDFKit.PDFDocument,
  params: {
    itemText: string;
    quantityText: string;
    rateText: string;
    amountText: string;
  },
) => {
  doc.font(FONT_BOLD);
  doc.rect(doc.x, doc.y, doc.page.width - MARGIN * 2, T_ROW_HEIGHT).fill();
  doc.fontSize(10).fillColor('white');
  doc.text(
    params.itemText,
    MARGIN + T_PADDING,
    doc.y + doc.heightOfString(params.itemText) / 3,
  );
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
  doc.fontSize(10).fillColor('black');
  doc.text('', MARGIN + T_PADDING, doc.y + T_ROW_HEIGHT / 2);
  doc.font(FONT_NORMAL);
};

export async function generateInvoice(invoice: Invoice): Promise<Blob> {
  const doc = new PDFDocument({ size: 'A4', margin: MARGIN });
  const stream = doc.pipe(blobStream());

  doc.font(FONT_NORMAL);

  // Invoice from
  doc.fontSize(10);
  doc.text(invoice.from);

  // Invlice number and date
  doc.moveUp();
  doc.fontSize(12);

  const invNumber = '# ' + invoice.invoice_number;
  doc.text(invNumber, doc.page.width - MARGIN - doc.widthOfString(invNumber));

  if (invoice.date) {
    doc.fontSize(10);
    const invDate = invoice.date.toLocaleDateString();
    doc.text(invDate, doc.page.width - MARGIN - doc.widthOfString(invDate));
  }

  // Separator
  doc.lineWidth(4);
  doc.strokeColor(GRAY_COLOR);
  doc.moveTo(MARGIN, doc.y + 5);
  doc.lineTo(doc.page.width - MARGIN, doc.y + 5).stroke();
  doc.strokeColor('black');
  doc.moveDown(2);

  // Invoice title
  doc.fontSize(24);
  doc.text('INVOICE', MARGIN, doc.y + 3);
  doc.moveDown();

  // Bill to and details
  if (invoice.bill_to) {
    doc.fontSize(8);
    doc.text('BILL TO');
    doc.text(invoice.bill_to);
    doc.moveUp(2);
    doc.text('', MARGIN + doc.widthOfString('BILL TO') * 3, doc.y);
  }

  if (invoice.po_number) {
    doc.fontSize(8);
    doc.text('DETAILS');
    doc.text('Po number: ' + invoice.po_number);
    doc.text('', MARGIN, doc.y + 10);
  } else {
    doc.moveDown(2);
    doc.text('', MARGIN, doc.y + 10);
  }

  const params = {
    itemText: 'ITEM',
    quantityText: 'QUANTITY',
    rateText: 'RATE',
    amountText: 'AMOUNT',
  };

  createTableHeader(doc, params);

  const amountX = doc.page.width - MARGIN - T_PADDING;
  const rateX =
    amountX -
    doc.widthOfString(params.amountText) -
    T_CELL_PADDING -
    doc.widthOfString(params.rateText) / 2;
  const quantityX =
    rateX -
    doc.widthOfString(params.rateText) / 2 -
    T_CELL_PADDING -
    doc.widthOfString(params.quantityText) / 2;

  invoice.line_items.forEach((item) => {
    const amount = (item.quantity * item.rate).toLocaleString(undefined, {
      style: 'currency',
      currency: invoice.currency,
    });
    const quantity = item.quantity.toString();
    const rate = item.rate.toLocaleString(undefined, {
      style: 'currency',
      currency: invoice.currency,
    });
    if (item.description) {
      doc.font(FONT_BOLD);
      doc.text(item.description);
      doc.moveUp();
      doc.font(FONT_NORMAL);
    }
    doc.text(amount, amountX - doc.widthOfString(amount), doc.y);
    doc.moveUp();
    doc.text(rate, rateX - doc.widthOfString(rate) / 2, doc.y);
    doc.moveUp();
    doc.text(quantity, quantityX - doc.widthOfString(quantity) / 2, doc.y);
    doc.text('', MARGIN + T_PADDING, doc.y + T_ROW_HEIGHT / 2);
  });

  /** Total */
  doc.moveDown(2);
  doc.fontSize(12);

  // separator
  doc.lineWidth(2);
  doc.strokeColor(GRAY_COLOR);
  doc.moveTo(MARGIN, doc.y + 5);
  doc.lineTo(doc.page.width - MARGIN, doc.y + 5).stroke();
  doc.strokeColor('black');
  doc.moveDown();

  const total = invoice.line_items.reduce(
    (acc, cur) => acc + (cur.quantity ?? 0) * (cur.rate ?? 0),
    0,
  );
  const totalCurrency = total.toLocaleString(undefined, {
    style: 'currency',
    currency: invoice.currency,
  });
  doc.font(FONT_BOLD);
  doc.text('Total:', MARGIN + T_PADDING);
  doc.moveUp();

  doc.text(
    totalCurrency,
    doc.page.width - MARGIN - T_PADDING - doc.widthOfString(totalCurrency),
  );
  doc.font(FONT_NORMAL);

  // Notes
  if (invoice.notes) {
    doc.fillColor(GRAY_COLOR);
    doc.font(FONT_BOLD);
    doc.fontSize(10);
    doc.moveDown();
    doc.text('Notes:', MARGIN, doc.y + 10);
    doc.font(FONT_NORMAL);
    doc.text(invoice.notes, MARGIN, doc.y);
    doc.fillColor('black');
  }

  // Terms
  if (invoice.terms) {
    doc.fillColor(GRAY_COLOR);
    doc.font(FONT_BOLD);
    doc.fontSize(10);
    doc.moveDown();
    doc.text('Terms:', MARGIN, doc.y + 10);
    doc.font(FONT_NORMAL);
    doc.text(invoice.terms, MARGIN, doc.y);
    doc.fillColor('black');
  }

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      const blob = stream.toBlob();
      resolve(blob);
    });
    stream.on('error', reject);
  });
}
