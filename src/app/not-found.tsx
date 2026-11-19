import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#090b0b] px-5 py-12 text-[#f5f5f1]">
      <div className="panel w-full max-w-md p-7 text-center">
        <p className="gold text-xs font-medium tracking-[0.2em]">404</p>
        <h1 className="font-display mt-2 text-3xl font-semibold">
          Page not found
        </h1>
        <p className="muted mt-2 text-sm">
          The requested QLUB workspace or restaurant page could not be located.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#c8a66a] px-6 py-2.5 text-xs font-semibold text-[#10110e]"
          >
            Return home
          </Link>
          <Link
            href="/r/the-house"
            className="rounded-full border border-[#39413e] px-5 py-2.5 text-xs font-medium"
          >
            Open demo menu
          </Link>
        </div>
      </div>
    </main>
  );
}
