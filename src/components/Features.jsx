import React from 'react';
import { Badge } from "./ui/Badge";
import { Marquee } from "./ui/Marquee";
import { Compass, Zap, Target, ShieldCheck } from "lucide-react";

const marqueeData = [
  "What's the best strategy for my finals?",
  "How do I manage my study time efficiently?",
  "What resources should I prioritize?",
  "How do I balance projects and exams?",
  "How do I write better research papers?",
  "How do I stand out in internships?",
  "Who is my ideal study partner?",
  "How do I know if my thesis is viable?",
  "What learning style fits me best?",
  "How much sleep do I actually need?",
  "What citations or references do I need?",
  "How do I build a strong academic portfolio?",
];

const features = [
  {
    description:
      "No jargon, no overcomplication — just clear workflows you can follow to study and perform confidently.",
    icon: Compass,
    title: "We make things simple",
  },
  {
    description:
      "Every module we provide is designed to help you learn faster, study smarter, and increase your grades.",
    icon: Zap,
    title: "We focus on real results",
  },
  {
    description:
      "With years of hands-on academic experience, we bring proven strategies and practical resources to the table.",
    icon: Target,
    title: "We know what works",
  },
  {
    description:
      "From your first semester to scaling your thesis, we provide ongoing support, not just a one-time guide.",
    icon: ShieldCheck,
    title: "With you all the way",
  },
];

export default function Features() {
  const m1 = marqueeData.slice(0, marqueeData.length / 3);
  const m2 = marqueeData.slice(
    marqueeData.length / 3,
    (marqueeData.length / 3) * 2,
  );
  const m3 = marqueeData.slice((marqueeData.length / 3) * 2);

  return (
    <section id="features" className="relative bg-neutral-950 text-white pt-20 sm:pt-32 pb-24 border-t border-neutral-900/50">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="mx-auto max-w-full relative z-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-6 px-5 text-center md:px-10 mb-16">
          <h2 className="max-w-3xl font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Removing the roadblocks to your <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500">success</span>
          </h2>
          <p className="max-w-2xl text-base md:text-lg text-neutral-400">
            It's easy to get lost in a sea of advice, conflicting opinions, and
            endless "must-dos." We filter out the noise, focus on what truly
            matters, and give you the kind of clarity that lets your academic journey
            shine.
          </p>
          <div className="relative mx-auto max-w-3xl overflow-hidden mt-8">
            <div className="absolute left-0 z-20 h-full w-20 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none" />
            <div className="absolute right-0 z-20 h-full w-20 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />

            <div className="-mx-6 flex w-screen max-w-full flex-col md:-mx-10 lg:-mx-16">
              <Marquee className="[--duration:45s] [--gap:0.75rem]" repeat={4}>
                {m1.map((q) => (
                  <Badge
                    className="rounded-full border-neutral-800 bg-neutral-900 text-neutral-300 px-4 py-2"
                    key={q}
                    size="lg"
                  >
                    {q}
                  </Badge>
                ))}
              </Marquee>

              <Marquee
                className="[--duration:50s] [--gap:0.75rem] mt-2"
                repeat={4}
                reverse
              >
                {m2.map((q) => (
                  <Badge
                    className="rounded-full border-neutral-800 bg-neutral-900 text-neutral-300 px-4 py-2"
                    key={q}
                    size="lg"
                  >
                    {q}
                  </Badge>
                ))}
              </Marquee>

              <Marquee className="[--duration:42s] [--gap:0.75rem] mt-2" repeat={4}>
                {m3.map((q) => (
                  <Badge
                    className="rounded-full border-neutral-800 bg-neutral-900 text-neutral-300 px-4 py-2"
                    key={q}
                    size="lg"
                  >
                    {q}
                  </Badge>
                ))}
              </Marquee>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 divide-y divide-dashed divide-neutral-800 border-neutral-800 border-t border-dashed sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 max-w-7xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                className="flex flex-col gap-5 px-5 py-8 last:border-b-0 lg:border-b-0 lg:px-6 lg:py-10"
                key={feature.title}
              >
                <div className="w-12 h-12 rounded-lg bg-neutral-900 flex items-center justify-center border border-neutral-800">
                    <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <h3 className="font-semibold text-xl tracking-tight text-white">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-sm text-neutral-400">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
