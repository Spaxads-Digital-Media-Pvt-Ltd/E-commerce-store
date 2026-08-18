import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Shared shell + readable typography for the Terms and Privacy pages.
// Child <h2>/<h3>/<p>/<ul>/<a>/<strong> are styled via arbitrary variants so
// the page bodies stay clean semantic HTML.
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1 text-xs text-gray-500">
          <li>
            <Link href="/" className="hover:text-marigold-deep">
              Home
            </Link>
          </li>
          <ChevronRight aria-hidden className="size-3" />
          <li aria-current="page" className="text-ink">
            {title}
          </li>
        </ol>
      </nav>

      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: {updated}</p>
      {intro ? (
        <p className="mt-4 text-sm leading-7 text-ink/80">{intro}</p>
      ) : null}

      <div
        className={[
          "mt-8 space-y-4 text-sm leading-7 text-ink/80",
          "[&_h2]:mt-9 [&_h2]:scroll-mt-24 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink",
          "[&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-ink",
          "[&_p]:leading-7",
          "[&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:marker:text-marigold-deep",
          "[&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5",
          "[&_a]:font-medium [&_a]:text-marigold-deep [&_a]:underline [&_a]:underline-offset-2",
          "[&_strong]:font-semibold [&_strong]:text-ink",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
