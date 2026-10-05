import { MessageCircle } from "lucide-react";

export default function FloatingActions() {
  return (
    <>
      <a
        href="https://wa.me/358449558358"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-24 right-5 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-black/40 hover:scale-110 hover:brightness-110 transition-all duration-300 md:bottom-8"
      >
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </a>

      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 px-5 py-3 flex gap-3">
        <a
          href="#contact"
          className="flex-1 py-3 bg-amber-400 text-zinc-950 font-bold text-sm text-center rounded-xl tracking-wide hover:bg-amber-300 transition-colors"
        >
          Book Now
        </a>
        <a
          href="https://wa.me/358449558358"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 bg-[#25D366] rounded-xl flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5 text-white fill-white" />
        </a>
      </div>
    </>
  );
}
