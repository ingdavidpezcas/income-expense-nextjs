import React, { Suspense } from "react";
import LoginForm from "@/app/login/page";

export const description = "A simple login form.";
export const iframeHeight = "870px";
export const containerClassName = "w-full h-full";

function HomePage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row"></div>
        <div className="flex w-full items-center justify-center px-4">
          <LoginForm />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <HomePage />
    </Suspense>
  );
}
