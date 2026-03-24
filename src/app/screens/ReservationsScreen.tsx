import {
  Clock,
  CreditCard,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const historyData = [
  {
    id: 1,
    date: "15 Mars 2026",
    time: "14:30",
    machine: "L2",
    duration: "45 min",
    amount: "3.50€",
    paymentMethod: "card",
    status: "completed",
  },
  {
    id: 2,
    date: "12 Mars 2026",
    time: "10:15",
    machine: "S1",
    duration: "60 min",
    amount: "4.00€",
    paymentMethod: "apple-pay",
    status: "completed",
  },
  {
    id: 3,
    date: "8 Mars 2026",
    time: "16:45",
    machine: "L1",
    duration: "45 min",
    amount: "3.50€",
    paymentMethod: "card",
    status: "completed",
  },
  {
    id: 4,
    date: "5 Mars 2026",
    time: "09:00",
    machine: "L3",
    duration: "45 min",
    amount: "3.50€",
    paymentMethod: "apple-pay",
    status: "canceled",
  },
];

const daysInMarch = Array.from({ length: 31 }, (_, i) => i + 1);
const startDay = 1;
const recommendedDay = 20;
const unavailableDays = [ 30, 21, 27]; // ejemplo
const demandData = [
  { day: "14", value: 4 },
  { day: "15", value: 6 },
  { day: "16", value: 5 },
  { day: "17", value: 5 },
  { day: "18", value: 9 },
  { day: "19", value: 4 },
  { day: "20", value: 3 },
  { day: "21", value: 12 },
];

export function ReservationsScreen() {
  const [selectedDay, setSelectedDay] = useState(20);

  const totalMinutes = 10 * 60 + 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="h-full bg-[#F2F2F7] flex flex-col overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="bg-white pt-16 pb-6 px-6 shadow-sm">
        <h1 className="text-[28px] font-bold text-gray-900">
          Mes Réservations
        </h1>
      </div>

      {/* Countdown Timer Card */}
      <div className="px-6 pt-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.15)] mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#0066FF]" />
            <span className="text-[15px] text-gray-400">
              Ton prochain tour dans
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-2">
            <div className="text-[48px] font-bold text-white leading-none">
              {hours}:{minutes.toString().padStart(2, "0")}
            </div>
            <div className="text-[17px] text-gray-400 mb-2">
              heures
            </div>
          </div>
          <div className="text-[15px] text-gray-400">
            Jeudi 20 Mars, 14:00 - Machine L1
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-bold text-gray-900">
              Réserver un tour
            </h2>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["D", "L", "M", "M", "J", "V", "S"].map(
              (day, i) => (
                <div
                  key={i}
                  className="text-center text-[13px] font-medium text-gray-500 py-1"
                >
                  {day}
                </div>
              ),
            )}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {daysInMarch.map((day) => {
              const isSelected = day === selectedDay;
              const isToday = day === 16;
              const isRecommended = day === recommendedDay;
              const isUnavailable =
                unavailableDays.includes(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-[15px] font-medium transition-all ${
                    isRecommended
                      ? "bg-[#0066FF] text-white shadow-md"
                      : isUnavailable
                        ? "bg-[#FF3B30] text-white shadow-md"
                        : isSelected
                          ? "bg-gray-900 text-white"
                          : isToday
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3 text-[13px]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#0066FF]" />
              <span className="text-gray-600">
                Créneau recommandé
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#FF3B30]" />
              <span className="text-gray-600">
                Pas de créneaux disponibles
              </span>
            </div>
          </div>
        </div>

        {/* Demand Chart */}
        <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[17px] font-semibold text-gray-900">
              Demande par jour
            </h3>
            <span className="text-[13px] text-gray-500">
              14–21 Mars
            </span>
          </div>

          <div className="h-[220px] flex items-end justify-between gap-2 border-b border-l border-gray-100 px-2 pb-2">
            {demandData.map((item) => {
              const maxValue = 12;
              const height = (item.value / maxValue) * 160;
              const isHighlighted = item.day === "21";

              return (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center justify-end gap-2"
                >
                  <span className="text-[11px] text-gray-400">
                    {item.value}
                  </span>

                  <div
                    className={`w-full max-w-[28px] rounded-t-[10px] transition-all ${
                      isHighlighted
                        ? "bg-[#0066FF] shadow-[0_4px_12px_rgba(0,102,255,0.25)]"
                        : "bg-[#DCE8FF]"
                    }`}
                    style={{ height: `${height}px` }}
                  />

                  <span
                    className={`text-[12px] font-medium ${
                      isHighlighted
                        ? "text-[#0066FF]"
                        : "text-gray-500"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 text-[13px] text-gray-500">
            <div className="w-3 h-3 rounded bg-[#0066FF]" />
            <span>Jour de plus forte demande</span>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
          <h3 className="text-[17px] font-semibold text-gray-900 mb-4">
            Historique
          </h3>
          <div className="space-y-3">
            {historyData.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center">
                  {item.paymentMethod === "apple-pay" ? (
                    <div className="text-[20px]">􀣏</div>
                  ) : (
                    <CreditCard className="w-5 h-5 text-gray-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[15px] text-gray-900">
                      {item.machine}
                    </span>
                    <span className="text-[13px] text-gray-500">
                      • {item.duration}
                    </span>
                  </div>
                  <div className="text-[13px] text-gray-500">
                    {item.date} à {item.time}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="font-semibold text-[15px] text-gray-900">
                    {item.amount}
                  </div>
                  {item.status === "completed" ? (
                    <div className="flex items-center gap-1 text-[#2ECC71]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[12px] font-medium">
                        Terminé
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[#FF3B30]">
                      <XCircle className="w-4 h-4" />
                      <span className="text-[12px] font-medium">
                        Annulé
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}