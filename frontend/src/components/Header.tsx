import React from 'react';
import { Download, Save, Layout as LayoutIcon, Sparkles } from 'lucide-react';

interface HeaderProps {
    onSave: () => void;
    onDownload: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSave, onDownload }) => {
    return (
        <header className="sticky top-6 z-50 flex justify-between items-center glass px-8 py-4 rounded-2xl border border-white/10 shadow-2xl mb-12 no-print">
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-slate-900 p-2.5 rounded-xl text-white">
                        <LayoutIcon size={22} className="text-indigo-400" />
                    </div>
                </div>
                <div>
                    <h1 className="text-xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-tight flex items-center gap-2">
                        Interior Studio <span className="text-indigo-400">Pro</span>
                        <Sparkles size={14} className="text-indigo-500" />
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-0.5">Commercial Estimation Suite</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onSave}
                    className="px-5 py-2.5 rounded-xl text-slate-300 font-bold hover:text-white hover:bg-white/5 transition-all text-sm flex items-center gap-2 border border-white/5"
                >
                    <Save size={18} /> Save Draft
                </button>
                <button
                    onClick={onDownload}
                    className="glow-btn bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all text-sm flex items-center gap-2"
                >
                    <Download size={18} /> Export PDF
                </button>
            </div>
        </header>
    );
};

export default Header;
