import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Award, Minimize2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-20 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex flex-col gap-0">
          <h4 className="font-medium">
            Welcome Back, Income and Expense summary
          </h4>
          <p className="text-gray-400 text-xs">
            Let&apos;s see a summary of your income and expenses...
          </p>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href="" target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Award />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link href="" target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Minimize2 />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
          <div className="flex">
            <a
              className="inline-block button_inc_exp_secondary rounded-2xl borde button-inc-exp px-12 py-3 text-sm font-medium
               text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
              href="#"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
