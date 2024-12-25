import { Wallet, Timer, PiggyBank } from "lucide-react";
import { Card } from "@/components/ui/card";

const WalletStats = () => {
  return (
    <div className="mb-4 md:mb-8">
      <div className="grid grid-cols-3 gap-2 md:gap-[2vw]">
        <Card className="p-2 md:p-[2vw] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 md:gap-[1vw]">
              <Wallet className="w-4 h-4 md:w-[4vw] md:h-[4vw] max-w-8 max-h-8 min-w-4 min-h-4 text-blue-500" />
              <span className="text-sm md:text-[2.5vw] max-text-xl min-text-sm font-bold text-blue-500">2 CFA</span>
            </div>
            <p className="text-xs md:text-[1.8vw] max-text-sm min-text-xs text-gray-600 mt-1 md:mt-[0.5vw]">Disponible(s)</p>
          </div>
          <div className="bg-blue-100 p-1 md:p-[1vw] max-p-2 min-p-1 rounded-full">
            <svg className="w-3 h-3 md:w-[2vw] md:h-[2vw] max-w-4 max-h-4 min-w-3 min-h-3 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Card>

        <Card className="p-2 md:p-[2vw] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 md:gap-[1vw]">
              <Timer className="w-4 h-4 md:w-[4vw] md:h-[4vw] max-w-8 max-h-8 min-w-4 min-h-4 text-amber-500" />
              <span className="text-sm md:text-[2.5vw] max-text-xl min-text-sm font-bold text-amber-500">5 500 CFA</span>
            </div>
            <p className="text-xs md:text-[1.8vw] max-text-sm min-text-xs text-gray-600 mt-1 md:mt-[0.5vw]">1 Demande(s) en attente</p>
          </div>
          <div className="bg-amber-100 p-1 md:p-[1vw] max-p-2 min-p-1 rounded-full">
            <svg className="w-3 h-3 md:w-[2vw] md:h-[2vw] max-w-4 max-h-4 min-w-3 min-h-3 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Card>

        <Card className="p-2 md:p-[2vw] flex items-center justify-between">
          <div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 md:gap-[1vw]">
                <PiggyBank className="w-4 h-4 md:w-[4vw] md:h-[4vw] max-w-8 max-h-8 min-w-4 min-h-4 text-green-500" />
                <span className="text-sm md:text-[2.5vw] max-text-xl min-text-sm font-bold text-green-500">72 000 CFA</span>
              </div>
              <p className="text-xs md:text-[1.8vw] max-text-sm min-text-xs text-gray-600 mt-1 md:mt-[0.5vw]">7 Demande(s) validée(s)</p>
              <div className="flex items-center gap-1 md:gap-[0.5vw] text-xs md:text-[1.8vw] max-text-sm min-text-xs text-gray-500 mt-1 md:mt-[0.5vw]">
                <span>0 CFA En transit</span>
                <svg className="w-3 h-3 md:w-[2vw] md:h-[2vw] max-w-4 max-h-4 min-w-3 min-h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex items-center gap-1 md:gap-[0.5vw] text-xs md:text-[1.8vw] max-text-sm min-text-xs text-blue-500">
                <span>72 000 CFA Transféré(s)</span>
                <svg className="w-3 h-3 md:w-[2vw] md:h-[2vw] max-w-4 max-h-4 min-w-3 min-h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WalletStats;