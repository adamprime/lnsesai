import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Lnses</h1>
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="px-4 py-2 text-gray-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </SignedOut>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Expert Knowledge for Your AI Conversations
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Get curated insights from 240+ business books, assembled into custom
          lenses you can paste into ChatGPT, Claude, or any AI assistant.
        </p>
        <SignedOut>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-4 bg-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Free
          </Link>
        </SignedOut>
        <SignedIn>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </SignedIn>
      </section>
    </main>
  );
}
