import { Heart } from "lucide-react";

export default function DonationHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.25),transparent_35%)]" />
      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-md mb-5">
          <Heart className="w-8 h-8 text-pink-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Make a Difference Today
        </h1>
        <p className="mt-4 text-slate-300 text-lg max-w-2xl mx-auto">
          Your donation directly supports our mission. Every dollar helps fund programs, outreach, and tools that change lives.
        </p>
      </div>
    </section>
  );
}
