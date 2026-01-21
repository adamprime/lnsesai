import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center">
      <SignUp />
    </main>
  );
}
