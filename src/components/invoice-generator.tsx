"use client";

import { Invoice, InvoiceSchema } from "@/models/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  useForm,
  useWatch,
  SubmitHandler,
} from "react-hook-form";
import { Input } from "./ui/input";
import React from "react";
import { cn } from "@/utils/cn";
import { Button } from "./ui/button";
import { generateInvoice } from "@/lib/generate";

const defaultItem = {
  description: "",
  quantity: 1,
  rate: 0,
};

const defaultValues: Invoice = {
  invoice_number: 0,
  from: "",
  line_items: [defaultItem],
  currency: "USD",
};

export const InvoiceGenerator = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Invoice>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "line_items",
  });
  const lineItems = useWatch({ control, name: "line_items" });
  const currency = watch("currency", "USD");

  const onSubmit: SubmitHandler<Invoice> = async (data) => {
    console.log(data);
    const blob = await generateInvoice(data);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "invoice.pdf";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    a.remove();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl rounded-sm border p-4 shadow-lg"
    >
      <div className="flex justify-between gap-4">
        <section className="grid auto-rows-min gap-2 md:grid-cols-2">
          <Input
            {...register("from")}
            placeholder="Who is this from?"
            className="md:col-span-2"
          />
          {errors["from"] && (
            <p className="md:col-span-2">{errors["from"].message ?? "Error"}</p>
          )}
          <div className="grid">
            <label>Bill To</label>
            <Input
              {...register("bill_to")}
              className="w-full"
              placeholder="Who is this for?"
            />
          </div>
          <div className="grid">
            <label>Ship To</label>
            <Input
              {...register("ship_to")}
              className="w-full"
              placeholder="(optional)"
            />
          </div>
        </section>
        <section className="grid auto-rows-min grid-cols-2 gap-2">
          <label>Invoice #</label>
          <Input {...register("invoice_number", { valueAsNumber: true })} />
          <label>Date</label>
          <Input {...register("date")} type="date" />
          <label>Due Date</label>
          <Input {...register("due_date")} type="date" />
          <label>PO number</label>
          <Input {...register("po_number")} />
        </section>
      </div>
      <h2>Your Items</h2>
      <div
        className={cn(
          "bg-foreground text-background rounded-sm px-2 py-1",
          "mb-2 grid grid-cols-11 gap-2",
        )}
      >
        <p className="col-span-7">Item</p>
        <p className="pl-2">Quantity</p>
        <p className="pl-2">Rate</p>
        <p className="col-span-2 pr-4 text-right">Amount</p>
      </div>
      <section className="space-y-2">
        {fields.map((f, ind) => (
          <div key={f.id} className="group relative grid grid-cols-11 gap-2">
            <Input
              {...register(`line_items.${ind}.description`)}
              placeholder="Description of item/service..."
              className="col-span-7"
            />
            <Input
              {...register(`line_items.${ind}.quantity`, {
                valueAsNumber: true,
              })}
            />
            <Input
              {...register(`line_items.${ind}.rate`, { valueAsNumber: true })}
            />
            <div className="relative col-span-2 my-auto flex justify-end pr-6 text-right">
              <p>
                {(
                  (lineItems[ind]?.rate ?? 0) * (lineItems[ind]?.quantity ?? 0)
                ).toLocaleString(undefined, { style: "currency", currency })}
              </p>
              <Button
                type="button"
                onClick={() => remove(ind)}
                className={cn(
                  "absolute -right-1 m-auto hidden size-fit",
                  "border-none group-hover:block hover:text-gray-500",
                )}
              >
                X
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          className="border-green-700 text-green-700 hover:bg-gray-100"
          onClick={() => append(defaultItem)}
        >
          + Item
        </Button>
      </section>
      <section className="pr-6 text-right text-xl">
        Subtotal:{" "}
        <b>
          {lineItems
            .reduce(
              (acc, cur) => acc + (cur.rate ?? 0) * (cur.quantity ?? 0),
              0,
            )
            .toLocaleString(undefined, { style: "currency", currency })}
        </b>
      </section>
      <section className={cn("mt-4 flex flex-row-reverse")}>
        <Button
          className={cn("border-green-700 text-green-700", "hover:bg-gray-100")}
        >
          Download
        </Button>
      </section>
    </form>
  );
};
