import Link from 'next/link';

export const Header = () => {
  return (
    <header className="flex w-full justify-center border-b p-2">
      <div className="flex w-5xl items-center gap-4">
        <Link href="/" className="text-xl">
          🧾 Free Invoice Generator
        </Link>
        <ul className="flex gap-2">
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href="/help">Help</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};
