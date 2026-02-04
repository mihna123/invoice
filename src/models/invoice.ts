import z from "zod";

export const Currency = z.enum(["USD", "EUR", "RSD"]);

export const LineItem = z.object({
  description: z.string(),
  quantity: z.number(),
  rate: z.number(),
});

export const Invoice = z.object({
  invoice_number: z.number(),
  from: z.string(),
  bill_to: z.string().optional(),
  ship_to: z.string().optional(),
  date: z.coerce.date().optional(),
  payment_terms: z.string().optional(),
  due_date: z.coerce.date().optional(),
  po_number: z.string().optional(),
  currency: Currency,
  line_items: z.array(LineItem),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

export type Currency = z.infer<typeof Currency>;
export type Invice = z.infer<typeof Invoice>;
export type LineItem = z.infer<typeof LineItem>;
