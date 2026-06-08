import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <section className="mt-10 flex justify-center">
      <div className="w-5xl space-y-4">
        <h1 className="text-4xl font-bold">Help</h1>
        <p className="text-lg">
          Free Invoice Generator provides a simple to use interface for
          generating pdf incoices that look professional. Perfect for small to
          medium freelancers and entrepreneurs.
        </p>
        <h2 className="mt-10 text-2xl font-bold">How to create an invoice?</h2>
        <p className="text-lg">
          In order to create an invoice fill out the{' '}
          <Link href="/" className="link">
            inovice form
          </Link>
          :
        </p>
        <ol className="space-y-6 text-lg">
          <li>
            1. Enter your <b>full name </b> into &quot;Who is this from?&quot;
            field.
          </li>
          <li>
            2. Enter the <b>entity </b> you are billing in the &quot;Who is this
            for?&quot; field.
          </li>
          <li>
            3. Pick todays <b>date </b> in the &quot;Date&quot; field.
          </li>
          <li>
            4. Start filling out your invoice items. Enter the{' '}
            <b>description</b> of the paid service, <b>quantity</b> and the{' '}
            <b>rate</b>. Amount will be calculated automatically.
          </li>
          <li>
            5. When you want to add another item, press the{' '}
            <Button
              type="button"
              disabled
              className="border-green-700 text-green-700"
            >
              + Item
            </Button>{' '}
            button. New line item will be added to the list.
          </li>
          <li>
            6. If you want to remove a line item, hover over it to reveal the
            <b>&quot;X&quot;</b> button on the right, after the amount value.
            Clicking on it will remove the line item.
          </li>
          <li>
            7. If you are satisfied with line items, you can head over to
            <b>&quot;Notes&quot;</b> and <b>&quot;Terms&quot;</b> fields.
            Content from these fields will be printed after line items in the
            final pdf.
          </li>
          <li>
            8. Press the{' '}
            <Button className="border-green-700 text-green-700" disabled>
              Download
            </Button>{' '}
            button to generate and download the invoice pdf. If you are not
            satisfied with the result you can go back and change any values you
            want, then download again.
          </li>
        </ol>
        <h2 className="text-2xl font-bold">Contact</h2>
        <p className="text-lg">
          If you have any problems or questions make sure to contact the main
          developer at{' '}
          <a href="mailto:mihailonvojinovic@gmail.com" className="link">
            mihailonvojinovic@gmail.com
          </a>
          . We usually respond in a day.
        </p>
      </div>
    </section>
  );
}
