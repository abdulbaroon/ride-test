import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
    title: "Page Not Found",
    description: "Chasing Watts Page Not Found",
    
};
export default function NotFound() {
  return (
    <section className="flex items-center justify-center min-h-screen w-full  p-16 text-gray-800">
      <div className="container flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl text-gray-400">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">
            Sorry, we couldn&apos;t find this page.
          </p>
          <p className="mt-4 mb-8 dark:text-gray-600">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link
            rel="noopener noreferrer"
            href="/"
            className="px-8 py-3 font-semibold rounded bg-secondaryButton text-gray-50"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
