import { CircleQuestionMark } from "@/components/ui/icons";
import { EmailForm } from "@/components/email-form";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center bg-black">
      <div className="mx-auto w-full max-w-md px-6">
        <h1 className="breakpoint-display mb-3 flex items-center gap-3 text-3xl text-white">
          <CircleQuestionMark className="h-5 w-5 text-[#aa67fb]" />
          Page not found
        </h1>
        <p className="text-p2 mb-6 text-white/50">Enter your email to receive your secure access link</p>
        <EmailForm />
      </div>
    </main>
  );
}
