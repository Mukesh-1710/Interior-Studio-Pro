import React from 'react';
import { Download } from 'lucide-react';

interface TotalsPanelProps {
    grandTotal: number;
    onDownload: () => void;
}

const TotalsPanel: React.FC<TotalsPanelProps> = ({ grandTotal, onDownload }) => {
    return (
        <div className="fixed bottom-8 right-8 z-20 no-print">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col gap-4 min-w-[300px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total Estimate</p>
                    <div className="text-4xl font-black text-slate-900 flex items-baseline gap-1">
                        <span className="text-xl text-slate-400 font-medium">₹</span>
                        {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                </div>

                <div className="h-px bg-slate-100" />

                <button
                    onClick={onDownload}
                    className="w-full bg-blue-600 text-white rounded-xl py-4 font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                    <Download size={20} strokeWidth={3} />
                    Generate Invoice
                </button>
            </div>
        </div>
    );
};

export default TotalsPanel;
