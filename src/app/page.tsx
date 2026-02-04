import { InvoiceGenerator } from "@/components/invoice-generator";

export default function Home() {
  return (
    <main className="space-y-4 p-2">
      <h1 className="text-xl">Free Invoice Generator</h1>
      <InvoiceGenerator />
    </main>
  );
}
