"use client";

import TypewriterComponent from "typewriter-effect";

export const LandingHero = () => {
    return (
        <div className="text-white font-bold py-36 text-center space-y-5">
            <div className="text-4xl space-y-5 font-extrabold">
              <h1>The Best Site Tool for</h1>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                <TypewriterComponent
                  options={{
                    strings: [
                        "Tracking.",
                        "Reviewing.",
                        "Analyzing.",
                        "Examining.",
                        "Managing."
                    ],
                    autoStart: true,
                    loop: true
                  }}
                />
              </div>
            </div>
            <div className="text-sm md:text-xl font-light text-zinc-400">
                Financial report 10x faster.
            </div>
            <div className="text-zinc-400 text-xs md:text-sm font-normal">
                No credit card required.
            </div>
            <div className="px-20 pb-10">
            <h2 className="text-center text-xl text-[#db9f9f] font-extrabold mb-10">
                Tindifin bings all this in your palm
            </h2>
            <p className="text-center text-xl text-[#db9f9f] font-extrabold mb-10">
               👋
            </p>
            </div>
        </div>
    )
}