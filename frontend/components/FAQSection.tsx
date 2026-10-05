import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What genres does Sushant perform?",
    a: "Sushant performs across a wide range of genres including Bollywood, pop, soul, jazz, and fusion. He blends classical influences with contemporary sounds for a unique live experience.",
  },
  {
    q: "Do you perform at private events and weddings?",
    a: "Yes! Private events, weddings, corporate gatherings, and intimate concerts are all welcome. Each performance is tailored to suit the occasion and your preferences.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 4–6 weeks in advance for private events, and 2–3 months for large productions. However, last-minute bookings can sometimes be accommodated — just reach out!",
  },
  {
    q: "Do you offer online/virtual performances?",
    a: "Yes, virtual and hybrid performances are available. We have experience with live-streamed events and can coordinate professional audio-visual setups.",
  },
  {
    q: "Can I request specific songs?",
    a: "Absolutely. Sushant works closely with clients to curate a setlist that matches their vision. Custom song requests and covers are welcomed with sufficient notice.",
  },
  {
    q: "What equipment is needed for a live performance?",
    a: "For smaller venues, Sushant can bring his own setup. For larger events, we can coordinate with your venue's AV team or recommend trusted sound engineers in Helsinki.",
  },
  {
    q: "Do you collaborate with other artists or bands?",
    a: "Yes — collaborations, featured artist slots on tracks, and ensemble performances are all possible. Reach out via the contact form to discuss your project.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 px-6 bg-zinc-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            <HelpCircle className="w-5 h-5" />
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Frequently Asked Questions</h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-6" />
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 ${
                open === i ? "border-amber-400/30 bg-zinc-900" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
              }`}
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`font-semibold text-sm md:text-base transition-colors ${open === i ? "text-amber-400" : "text-white"}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-zinc-500 transition-transform duration-300 ${open === i ? "rotate-180 text-amber-400" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
