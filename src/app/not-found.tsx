import { CircleQuestionMark } from "lucide-react";
import { EmailForm } from "@/components/email-form";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center bg-black">
      <div className="w-full">
        <div className="mx-auto max-w-md px-6">
          <h1 className="font-space-grotesk mb-3 flex items-center gap-3 text-3xl font-light text-white">
            <CircleQuestionMark className="h-5 w-5 text-[#9945ff]" />
            Page not found
          </h1>
          <p className="text-p2 mb-6 text-white/50">Enter your email to receive your secure access link</p>
        </div>
        <EmailForm />
      </div>
    </main>
  );
}
