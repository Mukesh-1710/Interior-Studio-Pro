import React from 'react';
import { Project } from '../types';

interface ProjectOverviewCardProps {
    project: Project;
    onChange: (field: keyof Project, value: string) => void;
}

const ProjectOverviewCard: React.FC<ProjectOverviewCardProps> = ({ project, onChange }) => {
    return (
        <section className="section">
            <div className="project-info">
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Client Name</label>
                    <input
                        type="text"
                        value={project.clientName}
                        onChange={(e) => onChange('clientName', e.target.value)}
                        placeholder="e.g. John Doe"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Client Phone</label>
                    <input
                        type="text"
                        value={project.clientPhone}
                        onChange={(e) => onChange('clientPhone', e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Estimate Date</label>
                    <input
                        type="date"
                        value={project.date}
                        onChange={(e) => onChange('date', e.target.value)}
                    />
                </div>
            </div>
        </section>
    );
};

export default ProjectOverviewCard;
