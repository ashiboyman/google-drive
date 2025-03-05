import { ArrowRight, Cloud, Lock, Zap } from "lucide-react";


export default function Home(props:{children: React.ReactNode}) { 
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <header className="container mx-auto flex items-center px-4 py-6">
        <div className="flex items-center gap-2">
          <Cloud className="h-8 w-8 text-gray-100" />
          <span className="text-xl font-bold tracking-tight">
            drive but worse
          </span>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        {props.children}
      </main>
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
    </div>
  );
}
