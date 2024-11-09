"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const font = Montserrat({
    weight: "600",
    subsets: ["latin"]
});

export const LandingNavbar = () => {
    return (
        <nav className="p-4 bg-transparent flex justify-between">
           <Link href="/">
              <div className="relative h-8 w-auto mr-4 flex items-center gap-2">
                <Image
                  width={32}
                  height={32}
                  alt="Logo"
                  src="/logo.svg"
                />
                <h1 className={cn("text-2xl font-bold text-white", font.className)}>
                Tindifin
                </h1>
              </div>
           </Link>
        </nav>
    )
}