import { Bell } from "lucide-react";
import { userProfileImage } from "../assets/images";

// ── Icons from wireframe ────────────────────────────────────────────

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 12L10 8L6 4" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="#111827"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75" />
      <path d="M12 12.75L15.75 9L12 5.25" />
      <path d="M15.75 9H6.75" />
    </svg>
  );
}

// ── Main Screen ───────────────────────────────────────────────────

const miniLeaderboard = [
  {
    rank: 6,
    name: "Pierre Leroy",
    score: "8,760",
    avatar:
      "https://images.unsplash.com/photo-1656857783579-bc7cd0d61a06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBzdHVkZW50JTIwY2FzdWFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczNjgzNDU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    rank: 7,
    name: "Amina Rahmani",
    score: "8,450",
    isMe: true,
    avatar: userProfileImage,
  },
  {
    rank: 8,
    name: "Julie Rousseau",
    score: "8,120",
    avatar:
      "https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczNjA2Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const menuItems = [
  "Données personnelles",
  "Moyens de paiement",
  "Historique des réservations",
  "Notifications",
  "Paramètres de l'application",
  "Aide & Support",
];

export function ProfileScreen() {
  return (
    <div className="h-full bg-[#F2F2F7] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-16 pb-3 border-b border-gray-100 shrink-0 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Mon Compte
            </p>
            <h1 className="text-gray-900 text-[28px] font-bold leading-tight">
              Profil
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">
            <Bell className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Section 1: Profile Info */}
        <div className="bg-white px-5 py-6 border-b border-gray-200 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-[3px] border-[#0066FF] shadow-sm">
            <img
              src={userProfileImage}
              alt="Amina Rahmani"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {/* Name field */}
            <div className="bg-gray-50 h-9 w-full flex items-center px-3 border border-gray-200 rounded-lg shadow-sm">
              <span className="text-[13px] font-bold text-gray-900 uppercase tracking-wide">
                Amina Rahmani
              </span>
            </div>
            {/* Email field */}
            <div className="bg-gray-50 h-8 w-full flex items-center px-3 border border-gray-200 rounded-lg">
              <span className="text-[12px] text-gray-500">
                amina.rahmani@univ.fr
              </span>
            </div>
            {/* Phone field */}
            <div className="bg-gray-50 h-8 w-[85%] flex items-center px-3 border border-gray-200 rounded-lg">
              <span className="text-[12px] text-gray-500">
                +33 6 12 34 56 78
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Score & Mini Leaderboard */}
        <div className="px-5 py-6 border-b border-[#DCE8FF] bg-[#F0F7FF]">
          {/* Score header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-bold text-[#0066FF]/70 uppercase tracking-widest">
              Score Total
            </h2>
            <div className="bg-white border border-[#DCE8FF] py-1.5 px-4 rounded-xl shadow-sm">
              <span className="text-[17px] font-black text-[#0066FF]">
                8,450 pts
              </span>
            </div>
          </div>

          {/* Mini leaderboard card */}
          <div className="bg-white border border-[#DCE8FF] rounded-2xl overflow-hidden shadow-sm">
            {miniLeaderboard.map((item, index) => {
              const isLast =
                index === miniLeaderboard.length - 1;
              return (
                <div
                  key={item.rank}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    item.isMe ? "bg-gray-900" : "bg-white"
                  } ${!isLast ? "border-b border-gray-100" : ""}`}
                >
                  {/* Rank number */}
                  <span
                    className={`text-[13px] font-medium w-4 text-center ${
                      item.isMe
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {item.rank}
                  </span>

                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full overflow-hidden shrink-0 border-2 ${
                      item.isMe
                        ? "border-white/20"
                        : "border-white shadow-sm"
                    }`}
                  >
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name + MOI badge */}
                  <div className="flex-1 flex items-center gap-2">
                    <p
                      className={`text-[14px] font-medium ${
                        item.isMe
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {item.name}
                    </p>
                    {item.isMe}
                  </div>

                  {/* Score */}
                  <span
                    className={`text-[13px] font-mono ${
                      item.isMe
                        ? "text-white font-bold"
                        : "text-[#0066FF] font-medium"
                    }`}
                  >
                    {item.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Settings Menu */}
        <div className="bg-white pt-2 pb-2">
          <div className="flex flex-col px-4">
            {menuItems.map((item) => (
              <button
                key={item}
                className="w-full flex items-center justify-between py-4 px-2 border-b border-gray-100 last:border-0 active:bg-gray-50 transition-colors"
              >
                <span className="text-[14px] font-medium text-gray-700">
                  {item}
                </span>
                <ChevronRightIcon />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white mt-3 px-4 pb-4">
          <button className="w-full flex items-center gap-3 py-4 px-2 active:bg-gray-50 transition-colors border-t border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
              <LogOutIcon />
            </div>
            <span className="text-[14px] font-bold text-gray-900">
              Se déconnecter
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}