import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;
  const showAdminLink = isAdminEmail(userEmail);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold">
          Lnses
        </Link>
        <div className="flex items-center gap-4">
          {showAdminLink && (
            <Link
              href="/admin"
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition"
            >
              Admin
            </Link>
          )}
          <span className="text-gray-400">
            {user.firstName || user.emailAddresses[0]?.emailAddress}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Browse Lenses</h2>
            <p className="text-gray-400 mb-4">
              Explore pre-built lenses on leadership, coaching, feedback, and
              more.
            </p>
            <Link
              href="/lenses"
              className="inline-block px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              View Lenses
            </Link>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Create Custom Lens</h2>
            <p className="text-gray-400 mb-4">
              Describe your situation and get a tailored lens compiled from our
              knowledge base.
            </p>
            <Link
              href="/create"
              className="inline-block px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Create Lens
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
