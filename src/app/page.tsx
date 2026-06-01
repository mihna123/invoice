import { Footer } from '@/components/footer';
import { InvoiceGenerator } from '@/components/invoice-generator';

export default function Home() {
  return (
    <main className="pt-2">
      <section className="flex h-[100vh] flex-col items-center justify-between">
        <div className="space-y-10">
          <h1 className="text-center text-2xl font-bold">
            🧾 Free Invoice Generator
          </h1>
          <InvoiceGenerator />
        </div>
        <Footer />
      </section>
    </main>
  );
}
