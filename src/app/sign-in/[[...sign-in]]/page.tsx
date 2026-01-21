import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center">
      <SignIn />
    </main>
  );
}
