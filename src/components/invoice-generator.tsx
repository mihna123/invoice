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

  const onSubmit: SubmitHandler<Invoice> = (data) => {
    console.log(data);
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
        <p className="text-center">Amount</p>
        <p className="pr-2 text-right">Actions</p>
      </div>
      <section className="grid grid-cols-11 gap-2">
        {fields.map((f, ind) => (
          <React.Fragment key={f.id}>
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
            <p className="m-auto text-center">
              {(lineItems[ind]?.rate ?? 0) * (lineItems[ind]?.quantity ?? 0)}{" "}
              {currency}
            </p>
            <Button
              type="button"
              onClick={() => remove(ind)}
              className="m-auto size-fit"
            >
              x
            </Button>
          </React.Fragment>
        ))}
        <Button type="button" onClick={() => append(defaultItem)}>
          + Item
        </Button>
      </section>
      <section className="text-right text-xl">
        Subtotal:{" "}
        {lineItems.reduce(
          (acc, cur) => acc + (cur.rate ?? 0) * (cur.quantity ?? 0),
          0,
        )}{" "}
        {currency}
      </section>
      <section className="mt-4 flex flex-row-reverse">
        <Button>Download</Button>
      </section>
    </form>
  );
};
