import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Project } from '../types';
import { Plus, Edit2, FileText, Search, Clock, Trash2, Building, Download } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api/projects';

const InvoiceDashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(API_BASE);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this quotation?')) return;

        try {
            await axios.delete(`${API_BASE}/${id}`);
            fetchProjects(); // Refresh list
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete quotation.');
        }
    };

    const handleDownloadPdf = async (e: React.MouseEvent, projectId: number, clientName?: string) => {
        e.stopPropagation();
        try {
            const response = await axios.get(`${API_BASE}/${projectId}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Quotation_${clientName || 'RR_Interiors'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('PDF error:', error);
            alert('Could not download PDF.');
        }
    };

    const filteredProjects = projects.filter(p =>
        (p.projectName && p.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.clientName && p.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.quotationNumber && p.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.projectLocation && p.projectLocation.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Dashboard Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                            <span className="font-black text-lg tracking-tight">RR</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">RR Interiors</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-0.5">Quotation & Estimation System</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/new')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        <Plus size={18} strokeWidth={3} />
                        New Quotation
                    </button>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Stats / Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Quotations</p>
                        <p className="text-3xl font-black text-slate-900">{projects.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Estimated Value</p>
                        <p className="text-3xl font-black text-blue-600">
                            {formatCurrency(projects.reduce((sum, p) => sum + (p.grandTotal || 0), 0))}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Updated</p>
                            <p className="text-sm font-bold text-slate-900">
                                {projects.length > 0 ? (projects[0].date || 'Recent') : 'N/A'}
                            </p>
                        </div>
                        <Clock className="text-slate-300" size={24} />
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search quotation #, project, client, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200">
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Quotation #</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Project & Client</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Contract Type</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Quotations...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching quotations found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg inline-block">
                                                    {project.quotationNumber || `QT-${project.id}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                                        {project.projectName || 'Interior Estimation'}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs font-bold text-slate-700">{project.clientName || 'Unassigned'}</span>
                                                        {project.clientPhone && (
                                                            <span className="text-[10px] text-slate-400">• {project.clientPhone}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                                    {project.contractType || 'Material + Labour'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-xs font-medium text-slate-500">{project.date}</p>
                                            </td>
                                            <td className="px-6 py-5 text-right font-black text-slate-900 tabular-nums">
                                                {formatCurrency(project.grandTotal || 0)}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/projects/${project.id}`)}
                                                        className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 px-3.5 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all hover:shadow-md"
                                                    >
                                                        <Edit2 size={13} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => project.id && handleDownloadPdf(e, project.id, project.clientName)}
                                                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Export PDF"
                                                    >
                                                        <Download size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => project.id && handleDelete(project.id)}
                                                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Quotation"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InvoiceDashboard;
