import { useState } from "react";
import { Music, Video, Calendar, LogOut, LayoutDashboard, ImageIcon, Disc3, Mail } from "lucide-react";
import TracksAdmin from "./TracksAdmin";
import VideosAdmin from "./VideosAdmin";
import EventsAdmin from "./EventsAdmin";
import PhotosAdmin from "./PhotosAdmin";
import ReleasesAdmin from "./ReleasesAdmin";
import InquiriesAdmin from "./InquiriesAdmin";

type Tab = "tracks" | "videos" | "events" | "gallery" | "releases" | "inquiries";

const tabs = [
  { id: "tracks" as Tab, label: "Tracks", icon: Music },
  { id: "videos" as Tab, label: "Videos", icon: Video },
  { id: "events" as Tab, label: "Events", icon: Calendar },
  { id: "gallery" as Tab, label: "Gallery", icon: ImageIcon },
  { id: "releases" as Tab, label: "Releases", icon: Disc3 },
  { id: "inquiries" as Tab, label: "Inquiries", icon: Mail },
];

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("tracks");

  return (
    <div className="dark min-h-screen bg-zinc-950 text-white">
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-amber-400" />
            <span className="font-bold tracking-wider text-white">
              SUSHANT<span className="text-amber-400">.</span> Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-400 text-sm hover:text-zinc-200 transition-colors">
              View Site ↗
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 transition-colors duration-300"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-amber-400 text-zinc-950"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "tracks" && <TracksAdmin />}
        {activeTab === "videos" && <VideosAdmin />}
        {activeTab === "events" && <EventsAdmin />}
        {activeTab === "gallery" && <PhotosAdmin />}
        {activeTab === "releases" && <ReleasesAdmin />}
        {activeTab === "inquiries" && <InquiriesAdmin />}
      </div>
    </div>
  );
}
