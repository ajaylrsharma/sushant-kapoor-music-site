import { useEffect, useState } from "react";
import backend from "~backend/client";
import { authedBackend } from "../../lib/auth";
import { Mail, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { LoadingState, EmptyState } from "./shared";

type Inquiry = Awaited<ReturnType<typeof backend.contact.listInquiries>>["inquiries"][number];

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await backend.contact.listInquiries();
    setInquiries(res.inquiries);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleMarkRead = async (inquiry: Inquiry) => {
    try {
      await authedBackend().contact.markRead({ id: inquiry.id, read: !inquiry.read });
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this inquiry?")) return;
    setDeleting(id);
    try {
      await authedBackend().contact.deleteInquiry({ id });
      await load();
    } finally {
      setDeleting(null);
    }
  };

  const unread = inquiries.filter((i) => !i.read).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-black text-white">Inquiries</h2>
        {unread > 0 && (
          <span className="bg-amber-400 text-zinc-950 text-xs font-bold px-2.5 py-1 rounded-full">
            {unread} unread
          </span>
        )}
      </div>

      {loading && <LoadingState />}

      {!loading && inquiries.length === 0 && (
        <EmptyState icon={<Mail className="w-10 h-10 opacity-40" />} message="No inquiries yet." />
      )}

      {!loading && inquiries.length > 0 && (
        <div className="space-y-3">
          {inquiries.map((inquiry) => {
            const isExpanded = expanded === inquiry.id;
            const date = new Date(inquiry.createdAt);
            return (
              <div
                key={inquiry.id}
                className={`bg-zinc-900 rounded-xl border transition-colors ${
                  inquiry.read ? "border-zinc-800" : "border-amber-400/30"
                }`}
              >
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : inquiry.id)}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${inquiry.read ? "bg-zinc-700" : "bg-amber-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`font-semibold ${inquiry.read ? "text-zinc-300" : "text-white"}`}>{inquiry.name}</span>
                      <span className="text-zinc-500 text-sm">{inquiry.email}</span>
                      <span className="text-zinc-600 text-xs ml-auto flex-shrink-0">
                        {date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className={`text-sm truncate mt-0.5 ${inquiry.read ? "text-zinc-500" : "text-zinc-300"}`}>
                      {inquiry.subject}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-zinc-800 pt-4">
                    <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">{inquiry.message}</p>
                    <div className="flex items-center gap-3">
                      <a
                        href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-zinc-950 text-sm font-bold rounded-lg hover:bg-amber-300 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Reply
                      </a>
                      <button
                        onClick={() => handleMarkRead(inquiry)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 text-sm font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
                      >
                        {inquiry.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {inquiry.read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        disabled={deleting === inquiry.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 text-sm font-semibold rounded-lg hover:bg-red-500/20 transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
