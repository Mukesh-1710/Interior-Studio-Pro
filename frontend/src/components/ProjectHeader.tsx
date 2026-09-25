import React from 'react';
import { Project } from '../types';
import { Save, Download, FileText, Calculator, Hammer, Receipt, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type QuotationTab = 'details' | 'estimation' | 'materials' | 'commercials';

interface ProjectHeaderProps {
    project: Project;
    activeTab: QuotationTab;
    onTabChange: (tab: QuotationTab) => void;
    onChange: (field: keyof Project, value: string) => void;
    onSave: () => void;
    onDownload: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
    project, 
    activeTab, 
    onTabChange, 
    onChange, 
    onSave, 
    onDownload 
}) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm no-print transition-colors duration-200">
            <div className="max-w-6xl mx-auto px-4">
                {/* Top Row: Brand, Quick Metadata & Primary Actions */}
                <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-slate-900 to-slate-700 dark:from-blue-600 dark:to-blue-400 rounded-xl flex items-center justify-center text-white shadow-md dark:shadow-none">
                            <span className="font-black text-base tracking-tighter">RR</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                    RR INTERIORS
                                </h1>
                                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 text-[10px] font-black uppercase tracking-wider rounded-md">
                                    {project.contractType || 'Material + Labour'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                {project.quotationNumber ? (
                                    <span className="font-mono text-slate-600 dark:text-slate-300 font-bold">{project.quotationNumber}</span>
                                ) : (
                                    'New Quotation Draft'
                                )}
                                {project.clientName ? ` • ${project.clientName}` : ''}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 self-end md:self-auto">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button
                            onClick={onSave}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black dark:hover:bg-slate-700 transition-all shadow-md shadow-slate-200 dark:shadow-none active:scale-95"
                        >
                            <Save size={16} />
                            Save Quotation
                        </button>
                        <button
                            onClick={onDownload}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md shadow-blue-200 dark:shadow-none active:scale-95"
                        >
                            <Download size={16} />
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Navigation Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
                    <button
                        onClick={() => onTabChange('details')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                            activeTab === 'details'
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <FileText size={16} />
                        1. Quotation Details
                    </button>

                    <button
                        onClick={() => onTabChange('estimation')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                            activeTab === 'estimation'
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Calculator size={16} />
                        2. Estimation & Measurement
                        {project.rooms && project.rooms.length > 0 && (
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                activeTab === 'estimation' ? 'bg-blue-700 dark:bg-blue-800 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}>
                                {project.rooms.length} {project.rooms.length === 1 ? 'Room' : 'Rooms'}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => onTabChange('materials')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                            activeTab === 'materials'
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Hammer size={16} />
                        3. Materials & Hardware
                        {project.materialSpecifications && project.materialSpecifications.length > 0 && (
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                activeTab === 'materials' ? 'bg-blue-700 dark:bg-blue-800 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}>
                                {project.materialSpecifications.length} {project.materialSpecifications.length === 1 ? 'Item' : 'Items'}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => onTabChange('commercials')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                            activeTab === 'commercials'
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Receipt size={16} />
                        4. Commercial Terms
                        {project.paymentMilestones && project.paymentMilestones.length > 0 && (
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                activeTab === 'commercials' ? 'bg-blue-700 dark:bg-blue-800 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}>
                                {project.paymentMilestones.length} Stages
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ProjectHeader;
