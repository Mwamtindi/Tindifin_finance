import { Loader2 } from "lucide-react";
import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { LandingNavbar } from "@/components/landing-navbar";
import { LandingHero } from "@/components/landing-hero";

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-700 via-purple-500 to-pink-500 grid grid-cols-1 lg:grid-cols-2">
            <div className="h-full hidden lg:flex  px-4">
                <LandingNavbar />
                <LandingHero />
            </div>
            <div className="h-full lg:flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-4 pt-8">
                    <h1 className="font-bold text-3xl text-[#2E2A47]">
                        Welcome Back!
                    </h1>
                    <p className="text-base text-[#13062c]">
                        Log in or Create account to get back to your dashboard!
                    </p>
                </div>
                <div className="flex items-center justify-center mt-8">
                <ClerkLoaded>
                    <SignUp path="/sign-up" />
                </ClerkLoaded>
                <ClerkLoading>
                    <Loader2 className="animate-spin text-muted-foreground" />
                </ClerkLoading>
                </div>
            </div>
        </div>
    );
}