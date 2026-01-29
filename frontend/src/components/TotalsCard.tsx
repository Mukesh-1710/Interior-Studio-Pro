import React from 'react';
import { IndianRupee, Sparkles } from 'lucide-react';

interface TotalsCardProps {
    grandTotal: number;
}

const TotalsCard: React.FC<TotalsCardProps> = ({ grandTotal }) => {
    return (
        <div className="relative group overflow-hidden">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative premium-card rounded-3xl p-8 flex flex-col items-end space-y-3">
                <div className="flex items-center gap-2 text-indigo-400">
                    <Sparkles size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Estimated Grand Total</span>
                </div>
                <h3 className="text-5xl font-extrabold text-white tracking-tighter flex items-center gap-2">
                    <span className="text-3xl text-indigo-500 font-bold">₹</span>
                    {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium italic pt-2">Includes all materials, labor, and service costs.</p>
            </div>
        </div>
    );
};

export default TotalsCard;
