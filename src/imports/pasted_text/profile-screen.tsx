import React, { useState } from "react";

// ── Icons (Unified System) ────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#111827" : "#9ca3af"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

function PodiumIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#111827" : "#9ca3af"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="11" width="5" height="10" rx="0.5" />
      <rect x="9.5" y="7" width="5" height="14" rx="0.5" />
      <rect x="17" y="14" width="5" height="7" rx="0.5" />
      <path d="M12 7V4" />
      <circle
        cx="12"
        cy="3"
        r="1"
        fill={active ? "#111827" : "#9ca3af"}
        stroke="none"
      />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#111827" : "#9ca3af"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
      <rect
        x="7"
        y="14"
        width="3"
        height="3"
        rx="0.5"
        fill={active ? "#111827" : "#9ca3af"}
        stroke="none"
      />
    </svg>
  );
}

function AvatarIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#111827" : "#9ca3af"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

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

// ── Shared Components ─────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-700 text-white text-xs">
        1
      </span>
    );
  if (rank === 2)
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-500 text-white text-xs">
        2
      </span>
    );
  if (rank === 3)
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-400 text-white text-xs">
        3
      </span>
    );
  return (
    <span className="flex items-center justify-center w-7 h-7 text-gray-500 text-xs font-medium">
      {rank}
    </span>
  );
}

function AvatarPlaceholder({
  isMe,
  size = "small",
}: {
  isMe: boolean;
  size?: "small" | "large";
}) {
  const dimensions = size === "large" ? "w-20 h-20" : "w-8 h-8";
  return (
    <div
      className={`${dimensions} border-2 ${isMe ? "border-gray-700 bg-gray-200" : "border-gray-300 bg-gray-50"} rounded-full flex items-center justify-center relative overflow-hidden shrink-0`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 32 32"
        className="absolute inset-0"
      >
        <line
          x1="6"
          y1="6"
          x2="26"
          y2="26"
          stroke={isMe ? "#9ca3af" : "#d1d5db"}
          strokeWidth="1.5"
        />
        <line
          x1="26"
          y1="6"
          x2="6"
          y2="26"
          stroke={isMe ? "#9ca3af" : "#d1d5db"}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<
    "home" | "ranking" | "bookings" | "profile"
  >("profile");

  const menuItems = [
    "Données personnelles",
    "Moyens de paiement",
    "Historique des réservations",
    "Notifications",
    "Paramètres de l'application",
    "Aide & Support",
  ];

  const miniLeaderboard = [
    { rank: 4, name: "Précédent", score: "9,120" },
    { rank: 5, name: "Vous", score: "8,450" },
    { rank: 6, name: "Suivant", score: "7,890" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 font-sans select-none">
      {/* Standardized Phone Frame */}
      <div
        className="relative bg-white flex flex-col overflow-hidden"
        style={{
          width: 375,
          height: 812,
          borderRadius: 36,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 shrink-0 bg-white z-20">
          <span className="text-xs text-gray-900 font-medium">
            9:41
          </span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2.5 border border-gray-900 rounded-sm relative">
              <div className="absolute left-0.5 top-0.5 bottom-0.5 w-2 bg-gray-900 rounded-[1px]" />
            </div>
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
            >
              <path d="M6 2L10 6H2L6 2Z" fill="#111827" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-3 border-b border-gray-100 shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                Mon Compte
              </p>
              <h1 className="text-gray-900 text-xl font-bold">
                Profil
              </h1>
            </div>
            {/* Notification/Settings Bell Placeholder */}
            <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="#4b5563"
                strokeWidth="1.5"
              >
                <path d="M4.5 4.5l9 9m0-9l-9 9"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div 
          className="flex-1 overflow-y-auto pb-6 bg-gray-50 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Section 1: Profile Info */}
          <div className="bg-white px-5 py-6 border-b border-gray-200 flex items-center gap-5">
            <AvatarPlaceholder isMe={true} size="large" />
            <div className="flex flex-col gap-2 w-full">
              <div className="bg-gray-50 h-9 w-full flex items-center px-3 border border-gray-200 rounded-lg shadow-sm">
                <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  NOM DE L'UTILISATEUR
                </span>
              </div>
              <div className="bg-gray-50 h-8 w-[90%] flex items-center px-3 border border-gray-200 rounded-lg">
                <span className="text-xs font-medium text-gray-500">
                  Adresse e-mail
                </span>
              </div>
              <div className="bg-gray-50 h-8 w-[80%] flex items-center px-3 border border-gray-200 rounded-lg">
                <span className="text-xs font-medium text-gray-500">
                  Numéro de téléphone
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Gamification / Score Extract */}
          <div className="px-5 py-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Score Total
              </h2>
              <div className="bg-white border border-gray-200 py-1.5 px-4 rounded-xl shadow-sm">
                <span className="text-lg font-black text-gray-900">
                  8,450 pts
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {miniLeaderboard.map((item, index) => {
                const isMe = item.rank === 5;
                const isLast =
                  index === miniLeaderboard.length - 1;
                return (
                  <div
                    key={item.rank}
                    className={`flex items-center gap-3 px-3 py-3 ${isMe ? "bg-gray-100" : "bg-white"} ${!isLast ? "border-b border-gray-100" : ""}`}
                  >
                    <RankBadge rank={item.rank} />
                    <AvatarPlaceholder
                      isMe={isMe}
                      size="small"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${isMe ? "text-gray-900" : "text-gray-600"}`}
                      >
                        {item.name}
                        {isMe}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-mono w-16 text-right ${isMe ? "text-gray-900 font-bold" : "text-gray-400"}`}
                    >
                      {item.score}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Settings Menu */}
          <div className="bg-white pt-2 pb-4">
            <div className="flex flex-col px-4">
              {menuItems.map((item) => (
                <button
                  key={item}
                  className="w-full flex items-center justify-between py-4 px-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {item}
                  </span>
                  <ChevronRightIcon />
                </button>
              ))}

              {/* Log Out Button */}
              <button className="w-full flex items-center gap-3 py-4 px-2 mt-2 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                  <AvatarPlaceholder />
                </div>
                <span className="text-sm font-bold text-gray-900">
                  Se déconnecter
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Standardized Bottom Navigation */}
        <div className="shrink-0 border-t border-gray-200 bg-white z-20">
          <div className="flex items-center justify-around px-2 pt-2 pb-1">
            {[
              {
                key: "home",
                label: "Accueil",
                Icon: AvatarPlaceholder,
              },
              {
                key: "ranking",
                label: "Classement",
                Icon: AvatarPlaceholder,
              },
              {
                key: "bookings",
                label: "Réservations",
                Icon: AvatarPlaceholder,
              },
              {
                key: "profile",
                label: "Profil",
                Icon: AvatarPlaceholder,
              },
            ].map(({ key, label, Icon }) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${active ? "bg-gray-50" : ""}`}
                >
                  <Icon active={active} />
                  <span
                    className={`font-medium ${active ? "text-gray-900" : "text-gray-500"}`}
                    style={{ fontSize: 10 }}
                  >
                    {label}
                  </span>
                  {active && (
                    <div className="w-1 h-1 rounded-full bg-gray-900 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex justify-center pb-2 pt-1">
            <div className="w-32 h-1 bg-gray-900 rounded-full opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}
