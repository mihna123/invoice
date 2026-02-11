import z from "zod";

export const CurrencyEnum = z.enum(["USD", "EUR", "RSD"]);

export const LineItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  rate: z.number(),
});

const optionalDate = z.preprocess((v) => {
  if (v === "" || v === null) return undefined;
  if (v instanceof Date && isNaN(v.getTime())) return undefined;
  return v;
}, z.coerce.date().optional());

export const InvoiceSchema = z.object({
  invoice_number: z.number(),
  from: z.string(),
  bill_to: z.string().optional(),
  ship_to: z.string().optional(),
  date: optionalDate,
  payment_terms: z.string().optional(),
  due_date: optionalDate,
  po_number: z.string().optional(),
  currency: CurrencyEnum,
  line_items: z.array(LineItemSchema),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

export type Currency = z.infer<typeof CurrencyEnum>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type LineItem = z.infer<typeof LineItemSchema>;
