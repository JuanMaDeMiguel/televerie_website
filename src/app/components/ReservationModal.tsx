import { X, Check } from 'lucide-react';
import { useState } from 'react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const daysInMarch = Array.from({ length: 31 }, (_, i) => i + 1);
const startDay = 1; // March 2026 starts on Sunday

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00'
];

export function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [selectedDay, setSelectedDay] = useState(20);
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleCheckAvailability = () => {
    setIsChecking(true);
    setIsAvailable(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsChecking(false);
      setIsAvailable(Math.random() > 0.3); // 70% chance of being available
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal */}
      <div className="bg-white rounded-[28px] w-full max-w-[390px] max-h-[60vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-gray-900">Réserver un créneau</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Calendar */}
          <div>
            <h3 className="text-[17px] font-semibold text-gray-900 mb-3">Choisir une date</h3>
            <div className="bg-[#F2F2F7] rounded-[16px] p-4">
              {/* Month Header */}
              <div className="text-center mb-3">
                <div className="text-[15px] font-semibold text-gray-900">Mars 2026</div>
              </div>

              {/* Day labels */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-[11px] font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                
                {/* Days of the month */}
                {daysInMarch.map((day) => {
                  const isSelected = day === selectedDay;
                  const isToday = day === 16;
                  const isPast = day < 16;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => !isPast && setSelectedDay(day)}
                      disabled={isPast}
                      className={`aspect-square rounded-lg flex items-center justify-center text-[13px] font-medium transition-all ${
                        isPast
                          ? 'text-gray-300 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#0066FF] text-white shadow-md scale-105'
                          : isToday
                          ? 'bg-gray-900/10 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-900/5'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="text-[17px] font-semibold text-gray-900 mb-3">Choisir une heure</h3>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2.5 rounded-[12px] text-[14px] font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-[#0066FF] text-white shadow-md scale-105'
                      : 'bg-[#F2F2F7] text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Check Availability */}
          <div>
            <button
              onClick={handleCheckAvailability}
              disabled={isChecking}
              className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-[14px] transition-all disabled:opacity-50"
            >
              {isChecking ? 'Vérification...' : 'Vérifier la disponibilité'}
            </button>

            {/* Availability Result */}
            {isAvailable !== null && (
              <div
                className={`mt-3 p-4 rounded-[14px] flex items-center gap-3 ${
                  isAvailable
                    ? 'bg-[#2ECC71]/10 text-[#2ECC71]'
                    : 'bg-[#FF3B30]/10 text-[#FF3B30]'
                }`}
              >
                {isAvailable ? (
                  <>
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <div className="text-[15px] font-medium">
                      Créneau disponible ! Machine L3 réservée pour le {selectedDay} Mars à {selectedTime}.
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 flex-shrink-0" />
                    <div className="text-[15px] font-medium">
                      Créneau non disponible. Essayez une autre heure.
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-8 pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-[14px] transition-all"
          >
            Fermer
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[14px] shadow-[0_4px_16px_rgba(0,102,255,0.3)] transition-all active:scale-95"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}