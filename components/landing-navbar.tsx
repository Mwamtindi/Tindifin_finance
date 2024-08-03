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
              <div className="relative h-8 w-8 mr-4 gap-10">
                <Image
                  fill
                  alt="Logo"
                  src="/logo.svg"
                />
              </div>
              <h1 className={cn("text-2xl font-bold text-white", font.className)}>
                Tindifin
              </h1>
           </Link>
        </nav>
    )
}