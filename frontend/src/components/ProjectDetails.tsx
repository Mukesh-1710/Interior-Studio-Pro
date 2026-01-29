import React from 'react';
import { Project } from '../types';
import { Layout, Calendar } from 'lucide-react';

interface ProjectDetailsProps {
    project: Project;
    onChange: (field: keyof Project, value: any) => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onChange }) => {
    return (
        <div className="bg-white rounded-2xl shadow-premium border border-white p-8 space-y-8">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-lg">
                    <Layout size={20} className="text-indigo-600" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Project Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Estimate Name</label>
                    <input
                        type="text"
                        value={project.projectName}
                        onChange={(e) => onChange('projectName', e.target.value)}
                        placeholder="e.g. Skyline Penthouse Phase 1"
                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm font-bold text-slate-800"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Client Identifier</label>
                    <input
                        type="text"
                        value={project.clientName}
                        onChange={(e) => onChange('clientName', e.target.value)}
                        placeholder="e.g. Highline Properties Ltd"
                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm font-bold text-slate-800"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Estimation Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={project.date}
                            onChange={(e) => onChange('date', e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm font-bold text-slate-800 appearance-none"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
