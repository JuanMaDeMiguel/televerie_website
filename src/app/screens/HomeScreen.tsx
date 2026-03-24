import { Map } from "lucide-react";
import { useState } from "react";
import {
  MachineCard,
  Machine,
} from "../components/MachineCard";
import { ReservationModal } from "../components/ReservationModal";
import { TeleverieIcon } from "../components/TeleverieIcon";
import { userProfileImage } from "../assets/images";

const profileImage = userProfileImage;

const machines: Machine[] = [
  {
    id: "1",
    number: "L1",
    type: "washer",
    status: "available",
  },
  {
    id: "2",
    number: "L2",
    type: "washer",
    status: "in-use",
    timeRemaining: "17m",
    progress: 65,
  },
  { id: "3", number: "L3", type: "washer", status: "reserved" },
  {
    id: "4",
    number: "L4",
    type: "washer",
    status: "in-use",
    timeRemaining: "8m",
    progress: 85,
  },
];

export function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-full bg-[#F2F2F7] flex flex-col relative overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="bg-white pt-16 pb-6 px-6 shadow-sm">
        {/* Greeting */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-[17px] text-gray-600">
            Bonjour, Amina
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-100">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Televerie Logo & Title */}
        <div className="flex justify-left items-center gap-3 mb-6">
          <TeleverieIcon className="w-10 h-10 text-[#0066FF]" />
          <div className="text-[28px] font-bold text-[#0066FF] tracking-tight">
            Televerie.
          </div>
        </div>

        {/* Location Info & Map Button */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center flex-1 gap-2 mr-2">
            <div className="text-[17px] font-semibold text-gray-900 whitespace-nowrap">
              Laverie de Kergoat
            </div>
            <div className="flex items-center gap-1 shrink-0 border-l border-gray-200 pl-4">
              <div className="w-2 h-2 rounded-full bg-[#2ECC71]" />
              <span className="text-[15px] text-gray-600 whitespace-nowrap">
                8h - 22h
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 text-[15px] text-[#0066FF] font-medium shrink-0">
            <Map className="w-4 h-4" />
            Plan
          </button>
        </div>
      </div>

      {/* Machine Grid */}
      <div className="flex-1 px-6 pt-6">
        <div className="grid grid-cols-2 gap-3 pb-6">
          {machines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>

      {/* Floating Reserve Button */}
      <div className="absolute bottom-28 left-0 right-0 flex justify-center px-6 pointer-events-none">
        <button
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto bg-[#0066FF] text-white px-6 py-[13px] rounded-[22px] shadow-[0_8px_24px_rgba(0,102,255,0.3)] text-[14px] font-semibold flex items-center gap-2 transition-all active:scale-95"
        >
          Réserver un créneau
        </button>
      </div>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}