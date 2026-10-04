import { Instagram, Facebook, Mail, ExternalLink } from "lucide-react";

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
    url: "https://facebook.com/sushant kapoor",
    icon: Facebook,
    color: "from-blue-700 to-blue-500",
    hoverColor: "hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]",
    borderColor: "hover:border-blue-500/50",
  },
];

export default function SocialSection() {
  return (
    <section id="contact" className="py-32 px-6 bg-zinc-950">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
          <Mail className="w-5 h-5" />
          Get Connected
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Follow the Journey</h2>
        <p className="text-zinc-400 text-lg mb-16 max-w-xl mx-auto">
          Stay connected with Sushant for live updates, behind-the-scenes content, 
          and the latest music drops.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center gap-5 p-6 bg-zinc-900 rounded-2xl border border-zinc-800 ${social.borderColor} transition-all duration-500 hover:-translate-y-1 ${social.hoverColor} text-left`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-lg">{social.name}</div>
                  <div className="text-zinc-400 text-sm">{social.handle}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
              </a>
            );
          })}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-zinc-950 px-6 text-zinc-600 text-sm tracking-wider uppercase">
              or reach out directly
            </span>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-zinc-400 mb-2 text-sm tracking-wider uppercase">For bookings & collaborations</p>
          <a
            href="mailto:contact@sushantkapoor.com"
            className="text-amber-400 text-xl font-semibold hover:text-amber-300 transition-colors duration-300 underline-offset-4 hover:underline"
          >
            contact@sushantkapoor.com
          </a>
        </div>
      </div>
    </section>
  );
}
