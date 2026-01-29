import React from 'react';
import { Project } from '../types';
import { Calendar, User, Briefcase } from 'lucide-react';

interface ProjectOverviewCardProps {
    project: Project;
    onChange: (field: keyof Project, value: any) => void;
}

const ProjectOverviewCard: React.FC<ProjectOverviewCardProps> = ({ project, onChange }) => {
    return (
        <div className="premium-card rounded-3xl p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <Briefcase size={14} />
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Project Name</label>
                    </div>
                    <input
                        type="text"
                        value={project.projectName}
                        onChange={(e) => onChange('projectName', e.target.value)}
                        placeholder="e.g. Skyline Residence"
                        className="w-full px-5 py-3 bg-slate-800/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all outline-none text-base font-semibold text-white placeholder:text-slate-600"
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <User size={14} />
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Client Name</label>
                    </div>
                    <input
                        type="text"
                        value={project.clientName}
                        onChange={(e) => onChange('clientName', e.target.value)}
                        placeholder="e.g. Alice Johnson"
                        className="w-full px-5 py-3 bg-slate-800/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all outline-none text-base font-semibold text-white placeholder:text-slate-600"
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <Calendar size={14} />
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Estimate Date</label>
                    </div>
                    <input
                        type="date"
                        value={project.date}
                        onChange={(e) => onChange('date', e.target.value)}
                        className="w-full px-5 py-3 bg-slate-800/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all outline-none text-base font-semibold text-white [color-scheme:dark]"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectOverviewCard;
