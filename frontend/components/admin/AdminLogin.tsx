import { useState } from "react";
import { Music, Lock, User, Eye, EyeOff } from "lucide-react";

export default function AdminLogin({ onLogin }: { onLogin: (username: string, password: string) => Promise<boolean> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await onLogin(username, password);
    setLoading(false);
    if (!ok) {
      setError("Invalid credentials. Please try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div className="dark min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className={`w-full max-w-md ${shaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 mb-6">
            <Music className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Access</h1>
          <p className="text-zinc-500">Sushant Kapoor — Content Management</p>
        </div>

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-zinc-400 text-sm font-medium mb-2 tracking-wider uppercase">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all duration-300"
                  placeholder="Admin username"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-sm font-medium mb-2 tracking-wider uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-11 pr-11 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all duration-300"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-400 text-zinc-950 font-bold tracking-wider uppercase rounded-xl hover:bg-amber-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="#" className="text-zinc-600 text-sm hover:text-zinc-400 transition-colors">
            ← Back to website
          </a>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
