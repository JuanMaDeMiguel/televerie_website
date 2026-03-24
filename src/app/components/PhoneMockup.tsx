import { ReactNode } from 'react';

interface PhoneMockupProps {
  children: ReactNode;
}

export function PhoneMockup({ children }: PhoneMockupProps) {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#E8F4F8] via-[#F0E8F4] to-[#FAE8E8] py-12 px-4">
      {/* 3D Phone Frame */}
      <div className="relative" style={{ 
        perspective: '1000px',
        transform: 'rotateY(-5deg) rotateX(5deg)',
      }}>
        <div className="relative w-[390px] h-[844px] bg-black rounded-[60px] overflow-hidden"
          style={{
            boxShadow: '0 40px 80px rgba(0,0,0,0.25), inset 0 0 0 8px #1a1a1a, inset 0 0 0 12px #2a2a2a',
          }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-[24px] left-1/2 -translate-x-1/2 w-[120px] h-[37px] bg-black rounded-full z-50" />
          
          {/* Screen Content — clipped to rounded rect */}
          <div className="absolute inset-0 mt-[20px] mb-[20px] mx-[14px] bg-[#F2F2F7] rounded-[46px] overflow-hidden">
            <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
              {children}
            </div>
          </div>

          {/* Side Buttons */}
          <div className="absolute left-[-3px] top-[140px] w-[3px] h-[32px] bg-[#1a1a1a] rounded-l" />
          <div className="absolute left-[-3px] top-[180px] w-[3px] h-[60px] bg-[#1a1a1a] rounded-l" />
          <div className="absolute left-[-3px] top-[248px] w-[3px] h-[60px] bg-[#1a1a1a] rounded-l" />
          <div className="absolute right-[-3px] top-[200px] w-[3px] h-[80px] bg-[#1a1a1a] rounded-r" />
        </div>
      </div>
    </div>
  );
}