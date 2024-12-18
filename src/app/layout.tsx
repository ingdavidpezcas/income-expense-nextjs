"use client";
import * as React from "react";
import localFont from "next/font/local";
import "./globals.css";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";

import { SiteHeader } from "@/components/site-header";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((item) => item !== "");

  const capitalize = (str: string) =>
    str ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : "";

  const pageTitle = segments.length > 0 ? capitalize(segments[0]) : "Inicio";

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`bg-white dark:bg-black ${geistSans.variable} ${geistMono.variable}`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full px-5">
                <SiteHeader />
                <header className="flex py-2 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block text-xs">
                          <BreadcrumbLink className="text-xs" href="/">
                            Dashboard
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        {segments.length > 0 && (
                          <>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem className="text-xs">
                              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                            </BreadcrumbItem>
                          </>
                        )}
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </header>

                {children}
              </main>
              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}

/*
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      
            <div className="flex-1">
              <main className="p-4">{children}</main>
            </div>
      </body>
    </html>
  );
}
  */
