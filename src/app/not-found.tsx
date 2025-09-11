import { CircleQuestionMark } from "lucide-react";
import { EmailForm } from "@/components/email-form";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center">
      <div className="w-full">
        <div className="mx-auto max-w-md px-6">
          <h1 className="mb-2 flex items-center gap-2 text-2xl">
            <CircleQuestionMark className="h-5 w-5" />
            Page not found
          </h1>
          <p className="text-p2 mb-6">Enter your email to receive your secure access link</p>
        </div>
        <EmailForm />
      </div>
    </main>
  );
}
