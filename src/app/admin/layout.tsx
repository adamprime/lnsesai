import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user email is in admin allowlist
  const userEmail = user.emailAddresses[0]?.emailAddress;
  if (!isAdminEmail(userEmail)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="text-xl font-bold">
            Lnses Admin
          </Link>
          <div className="flex gap-4">
            <Link
              href="/admin/content"
              className="text-gray-400 hover:text-white transition"
            >
              Content
            </Link>
            <Link
              href="/admin/tags"
              className="text-gray-400 hover:text-white transition"
            >
              Tags
            </Link>
            <Link
              href="/admin/docs"
              className="text-gray-400 hover:text-white transition"
            >
              Docs
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
          >
            Back to App
          </Link>
          <span className="text-gray-400 text-sm">
            {user.firstName || user.emailAddresses[0]?.emailAddress}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
