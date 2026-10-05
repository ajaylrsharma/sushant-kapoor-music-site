import { Check, Music } from "lucide-react";

const plans = [
  {
    name: "Single Track Session",
    price: "From €150",
    description: "Perfect for a single recording or live performance at private events.",
    features: [
      "Up to 2 hours session",
      "1 original or cover track",
      "Professional live performance",
      "Suitable for private gatherings",
    ],
    highlighted: false,
    cta: "Get in Touch",
  },
  {
    name: "Full Event Package",
    price: "From €400",
    description: "Ideal for corporate events, weddings, and larger private celebrations.",
    features: [
      "2–4 hour live performance",
      "Custom setlist planning",
      "Full PA / sound setup coordination",
      "Covers & originals",
      "Post-event follow-up",
    ],
    highlighted: true,
    cta: "Book Now",
  },
  {
    name: "Studio Collaboration",
    price: "Custom",
    description: "Co-writing, featured artist slots, and full studio production collaborations.",
    features: [
      "Co-writing sessions",
      "Featured artist credits",
      "Production consultation",
      "Flexible scheduling",
    ],
    highlighted: false,
    cta: "Let's Talk",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-32 px-6 bg-zinc-900/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            <Music className="w-5 h-5" />
            Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Transparent Rates</h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Starting prices to help you plan. All packages are customisable — reach out for a tailored quote.
          </p>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "bg-amber-400 text-zinc-950 shadow-[0_0_60px_rgba(251,191,36,0.2)]"
                  : "bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-950 text-amber-400 text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className={`text-lg font-black mb-1 ${plan.highlighted ? "text-zinc-950" : "text-white"}`}>{plan.name}</h3>
                <div className={`text-3xl font-black mb-3 ${plan.highlighted ? "text-zinc-950" : "text-amber-400"}`}>{plan.price}</div>
                <p className={`text-sm leading-relaxed ${plan.highlighted ? "text-zinc-800" : "text-zinc-400"}`}>{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-zinc-800" : "text-amber-400"}`} />
                    <span className={plan.highlighted ? "text-zinc-800" : "text-zinc-300"}>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`block text-center py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-zinc-950 text-amber-400 hover:bg-zinc-900"
                    : "bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400/20"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-zinc-600 text-sm mt-8">
          All prices excl. VAT. Travel fees may apply outside Helsinki. Custom packages available on request.
        </p>
      </div>
    </section>
  );
}
