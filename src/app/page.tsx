import { InvoiceGenerator } from '@/components/invoice-generator';

export default function Home() {
  return (
    <main className="pt-10">
      <section className="mb-20 flex flex-col items-center">
        <InvoiceGenerator />
      </section>
    </main>
  );
}
