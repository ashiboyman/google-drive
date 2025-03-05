import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Cloud, Lock, Zap } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    // <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">

    // <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
    <>
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-4xl font-bold tracking-tighter text-transparent md:text-6xl">
          Storage. But Worse.
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-400 md:text-2xl">
          All the features you love about cloud storage, just slightly worse in
          every way.
        </p>
        <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
          <form
            action={async () => {
              "use server";
              const session = await auth();
              if (!session.userId) {
                return redirect("/sign-in");
              }
              return redirect("/drive");
            }}
          >
            <Button
              type="submit"
              className="rounded-md bg-gradient-to-r from-gray-700 to-gray-600 px-8 py-6 text-lg font-medium text-white hover:from-gray-600 hover:to-gray-500"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
        <div className="flex flex-col items-center rounded-xl border border-gray-700 bg-gray-800/50 p-6 text-center backdrop-blur-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 p-3">
            <Cloud className="h-6 w-6 text-gray-300" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Cloud Storage</h3>
          <p className="text-gray-400">
            Store your files in the cloud. They might be there when you need
            them.
          </p>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-gray-700 bg-gray-800/50 p-6 text-center backdrop-blur-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 p-3">
            <Zap className="h-6 w-6 text-gray-300" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Almost Fast</h3>
          <p className="text-gray-400">
            Upload and download at speeds that are just slow enough to be
            annoying.
          </p>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-gray-700 bg-gray-800/50 p-6 text-center backdrop-blur-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 p-3">
            <Lock className="h-6 w-6 text-gray-300" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Questionable Security</h3>
          <p className="text-gray-400">
            We try our best to keep your files safe. No promises though.
          </p>
        </div>
      </div>
    </>
    // </main>

    // {/* </div> */}
  );
}
