import { useState } from "react";
import { Instagram, Facebook, Linkedin, Mail, ExternalLink, MapPin, MessageCircle, Star } from "lucide-react";
import backend from "~backend/client";

const socials = [
  {
    name: "Instagram",
    handle: "@sushantkapoor76",
    url: "https://instagram.com/sushantkapoor76",
    icon: Instagram,
    color: "from-purple-600 to-pink-500",
    hoverColor: "hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]",
    borderColor: "hover:border-purple-500/50",
  },
  {
    name: "Facebook",
    handle: "Sushant Kapoor",
    url: "https://facebook.com/sushantkapoor76",
    icon: Facebook,
    color: "from-blue-700 to-blue-500",
    hoverColor: "hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]",
    borderColor: "hover:border-blue-500/50",
  },
  {
    name: "LinkedIn",
    handle: "Sushant Kapoor",
    url: "https://linkedin.com/in/sushantkapoor",
    icon: Linkedin,
    color: "from-blue-600 to-blue-400",
    hoverColor: "hover:shadow-[0_0_40px_rgba(96,165,250,0.25)]",
    borderColor: "hover:border-blue-400/50",
  },
];

const emptyForm = { name: "", email: "", subject: "", message: "" };

export default function ContactSection() {
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof typeof emptyForm, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await backend.contact.submitContact(form);
      setSent(true);
      setForm(emptyForm);
    } catch (err: unknown) {
      console.error(err);
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };

  const inputCls = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all duration-300 text-sm";

  return (
    <section id="contact" className="py-32 px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            <Mail className="w-5 h-5" />
            Get Connected
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Follow the Journey</h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Stay connected with Sushant for live updates, behind-the-scenes content, and the latest music drops.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="grid gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative flex items-center gap-5 p-5 bg-zinc-900 rounded-2xl border border-zinc-800 ${social.borderColor} transition-all duration-500 hover:-translate-y-1 ${social.hoverColor} text-left`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold">{social.name}</div>
                      <div className="text-zinc-400 text-sm">{social.handle}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
                  </a>
                );
              })}
            </div>

            <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <div className="flex-1">
                <div className="text-white font-bold">WhatsApp</div>
                <div className="text-zinc-400 text-sm">Quick booking inquiries</div>
              </div>
              <a
                href="https://wa.me/358449558358"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366] text-black text-sm font-bold rounded-xl hover:brightness-110 transition-all duration-300"
              >
                Chat
              </a>
            </div>

            <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-white font-bold">Google Reviews</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-zinc-300 text-sm ml-2 font-semibold">5.0</span>
              </div>
              <a
                href="https://g.page/r/sushantkapoor/review"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 text-sm hover:text-amber-300 transition-colors underline-offset-4 hover:underline"
              >
                Read our Google Reviews ↗
              </a>
            </div>

            <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span className="text-white font-bold">Location</span>
              </div>
              <p className="text-zinc-400 text-sm mb-3">Helsinki, Finland</p>
              <div className="rounded-xl overflow-hidden">
                <iframe
                  title="Location map"
                  width="100%"
                  height="180"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7942.028!2d24.9518!3d60.1817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bc9!2sHelsinki!5e0!3m2!1sen!2sfi!4v1"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
            <h3 className="text-white text-2xl font-black mb-2">Send a Message</h3>
            <p className="text-zinc-400 text-sm mb-6">For bookings, collaborations & inquiries</p>

            {sent ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🎵</div>
                <h4 className="text-white text-xl font-bold mb-2">Message Sent!</h4>
                <p className="text-zinc-400">Thank you for reaching out. We'll get back to you soon.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 px-6 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Name *</label>
                    <input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Subject *</label>
                  <input required value={form.subject} onChange={(e) => update("subject", e.target.value)} className={inputCls} placeholder="Booking inquiry, collaboration, etc." />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={`${inputCls} resize-none h-32`}
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 px-4 py-3 rounded-xl">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 bg-amber-400 text-zinc-950 font-bold rounded-xl hover:bg-amber-300 transition-colors duration-300 disabled:opacity-60 tracking-wide"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
                <p className="text-zinc-600 text-xs text-center">
                  Or email directly:{" "}
                  <a href="mailto:contact@sushantkapoor.com" className="text-amber-400 hover:text-amber-300 transition-colors">
                    contact@sushantkapoor.com
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
