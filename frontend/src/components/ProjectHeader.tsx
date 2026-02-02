import React from 'react';
import { Project } from '../types';
import { Save, Download } from 'lucide-react';

interface ProjectHeaderProps {
    project: Project;
    onChange: (field: keyof Project, value: string) => void;
    onSave: () => void;
    onDownload: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onChange, onSave, onDownload }) => {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm no-print">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
                            INTERIOR <span className="text-blue-600">INVOICE</span> PRO
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">Professional Estimation & Measurement System</p>
                    </div>

                    <div className="flex flex-1 max-w-3xl gap-4">
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Project Name</label>
                            <input
                                type="text"
                                value={project.projectName}
                                onChange={(e) => onChange('projectName', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Site A, etc."
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Client Name</label>
                            <input
                                type="text"
                                value={project.clientName}
                                onChange={(e) => onChange('clientName', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter client name"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                            <input
                                type="text"
                                value={project.clientPhone}
                                onChange={(e) => onChange('clientPhone', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="+91 00000 00000"
                            />
                        </div>
                        <div className="w-32">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date</label>
                            <input
                                type="date"
                                value={project.date}
                                onChange={(e) => onChange('date', e.target.value)}
                                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onSave}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                        >
                            <Save size={18} />
                            Save
                        </button>
                        <button
                            onClick={onDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            <Download size={18} />
                            PDF
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ProjectHeader;
