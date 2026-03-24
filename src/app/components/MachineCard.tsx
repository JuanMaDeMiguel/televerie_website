export type MachineStatus = 'available' | 'in-use' | 'reserved' | 'offline';

export interface Machine {
  id: string;
  number: string;
  type: 'washer' | 'dryer';
  status: MachineStatus;
  timeRemaining?: string;
  progress?: number;
}

interface MachineCardProps {
  machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps) {
  const statusColors: { [key in MachineStatus]: string } = {
    available: 'bg-[#2ECC71]',
    'in-use': 'bg-[#F39C12]',
    reserved: 'bg-[#3498DB]',
    offline: 'bg-gray-400/50',
  };

  const statusLabels: { [key in MachineStatus]: string } = {
    available: 'Libre',
    'in-use': 'En cours',
    reserved: 'Réservée',
    offline: 'Hors-ligne',
  };

  const isInUse = machine.status === 'in-use';
  const progress = machine.progress || 0;
  const drumR = 9;
  const circumference = 2 * Math.PI * drumR;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <div className="bg-white rounded-[16px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all active:scale-95">
      {/* Status Indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2.5 h-2.5 rounded-full ${statusColors[machine.status]}`} />
        <span className="text-[13px] font-medium text-gray-600">{statusLabels[machine.status]}</span>
      </div>

      {/* Machine Icon — drum IS the timer ring when in-use */}
      <div className="mb-3 flex justify-center">
        {machine.type === 'washer' ? (
          <svg width="72" height="72" viewBox="0 0 48 48" fill="none">
            {/* Washer body */}
            <rect x="6" y="6" width="36" height="36" rx="4" stroke="#0066FF" strokeWidth="2" fill="none"/>
            {/* Top control dots */}
            <circle cx="13" cy="13" r="1.5" fill="#0066FF"/>
            <circle cx="18" cy="13" r="1.5" fill="#0066FF"/>

            {isInUse ? (
              <>
                {/* Background drum ring */}
                <circle cx="24" cy="26" r={drumR} stroke="#F2F2F7" strokeWidth="2.5" fill="none"/>
                {/* Orange progress ring */}
                <circle
                  cx="24"
                  cy="26"
                  r={drumR}
                  stroke="#F39C12"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 24 26)"
                />
                {/* Time remaining text centred in drum */}
                <text
                  x="24"
                  y="28.5"
                  textAnchor="middle"
                  fontSize="5.5"
                  fontWeight="700"
                  fill="#F39C12"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {machine.timeRemaining}
                </text>
              </>
            ) : (
              <>
                {/* Normal drum circle */}
                <circle cx="24" cy="26" r={drumR} stroke="#0066FF" strokeWidth="2" fill="none"/>
                <path d="M20 26 Q24 22 28 26 Q24 30 20 26" fill="#0066FF" opacity="0.3"/>
              </>
            )}
          </svg>
        ) : (
          <svg width="72" height="72" viewBox="0 0 48 48" fill="none">
            {/* Dryer body */}
            <rect x="6" y="6" width="36" height="36" rx="4" stroke="#0066FF" strokeWidth="2" fill="none"/>
            <circle cx="13" cy="13" r="1.5" fill="#0066FF"/>
            <circle cx="18" cy="13" r="1.5" fill="#0066FF"/>

            {isInUse ? (
              <>
                <circle cx="24" cy="26" r={drumR} stroke="#F2F2F7" strokeWidth="2.5" fill="none"/>
                <circle
                  cx="24"
                  cy="26"
                  r={drumR}
                  stroke="#F39C12"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 24 26)"
                />
                <text
                  x="24"
                  y="28.5"
                  textAnchor="middle"
                  fontSize="5.5"
                  fontWeight="700"
                  fill="#F39C12"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {machine.timeRemaining}
                </text>
              </>
            ) : (
              <>
                <circle cx="24" cy="26" r={drumR} stroke="#0066FF" strokeWidth="2" fill="none"/>
                <path d="M18 26 L20 28 M24 22 L24 30 M28 26 L30 28" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}
          </svg>
        )}
      </div>

      {/* Machine Number */}
      <div className="font-semibold text-[17px] text-gray-900">{machine.number}</div>
    </div>
  );
}
