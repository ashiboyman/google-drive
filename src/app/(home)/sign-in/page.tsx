import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Cloud, Lock, Zap } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <>
      <SignInButton forceRedirectUrl={"/drive"} />
      <footer className="container mx-auto mt-24 border-t border-gray-800 px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">
              drive but worse
            </span>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} drive but worse. All rights reserved,
          kind of.
        </p>
      </footer>
    </>
  );
}
