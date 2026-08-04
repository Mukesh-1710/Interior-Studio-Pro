import React, { useState } from 'react';
import { Project } from '../types';
import { 
    FileText, 
    User, 
    Building2, 
    Layers, 
    CheckCircle2, 
    Calendar, 
    Phone, 
    Mail, 
    MapPin, 
    Clock, 
    Plus, 
    X, 
    Hammer, 
    PackageCheck, 
    KeyRound, 
    ArrowRight,
    Save
} from 'lucide-react';

interface QuotationDetailsSectionProps {
    project: Project;
    onChange: (field: keyof Project, value: any) => void;
    onSave: () => void;
    onContinueToEstimation: () => void;
}

const PREDEFINED_SCOPE_OPTIONS = [
    'Modular Kitchen',
    'Wardrobes',
    'Living Room TV Unit',
    'Pooja Unit',
    'Doors & Frames',
    'Windows & Grills',
    'False Ceiling',
    'Wall Panelling & Fluted Panels',
    'Staircase Handrails',
    'Crockery & Bar Unit',
    'Shoe Rack & Foyer',
    'Dressing Table & Mirror Panelling',
    'Study Table & Bookshelf'
];

const CONTRACT_TYPES = [
    {
        id: 'Material + Labour',
        title: 'Material + Labour',
        subtitle: 'Complete turnkey execution including materials & workmanship',
        icon: PackageCheck,
        badge: 'Recommended for RR Interiors',
        color: 'blue'
    },
    {
        id: 'Labour Only',
        title: 'Labour Only',
        subtitle: 'Skilled carpentry & installation; materials supplied by client',
        icon: Hammer,
        badge: 'Client Supplied Materials',
        color: 'amber'
    },
    {
        id: 'Turnkey',
        title: 'Turnkey',
        subtitle: 'Comprehensive end-to-end design, procurement, and handover',
        icon: KeyRound,
        badge: 'Full Project Delivery',
        color: 'emerald'
    }
];

const QuotationDetailsSection: React.FC<QuotationDetailsSectionProps> = ({
    project,
    onChange,
    onSave,
    onContinueToEstimation
}) => {
    const [customScopeInput, setCustomScopeInput] = useState('');

    // Parse projectScope JSON string safely
    const currentScopeList: string[] = React.useMemo(() => {
        if (!project.projectScope) return [];
        try {
            const parsed = JSON.parse(project.projectScope);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return project.projectScope ? [project.projectScope] : [];
        }
    }, [project.projectScope]);

    const updateScopeList = (newList: string[]) => {
        onChange('projectScope', JSON.stringify(newList));
    };

    const toggleScopeItem = (item: string) => {
        if (currentScopeList.includes(item)) {
            updateScopeList(currentScopeList.filter(s => s !== item));
        } else {
            updateScopeList([...currentScopeList, item]);
        }
    };

    const handleAddCustomScope = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = customScopeInput.trim();
        if (trimmed && !currentScopeList.includes(trimmed)) {
            updateScopeList([...currentScopeList, trimmed]);
            setCustomScopeInput('');
        }
    };

    const handleRemoveScope = (itemToRemove: string) => {
        updateScopeList(currentScopeList.filter(s => s !== itemToRemove));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* SECTION 1 — QUOTATION INFORMATION */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 p-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">1. Quotation Information</h2>
                            <p className="text-xs text-slate-500 font-medium">Quotation numbering and timeline validity</p>
                        </div>
                    </div>
                    {project.quotationNumber && (
                        <div className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-xs rounded-lg">
                            {project.quotationNumber}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                            Quotation Number
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={project.quotationNumber || ''}
                                onChange={(e) => onChange('quotationNumber', e.target.value)}
                                placeholder="Auto-generated on Save (e.g. RR/2026/QT-018)"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 font-mono"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5">Leave blank to automatically assign the next sequence number.</p>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                            Quotation Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={project.date || ''}
                                onChange={(e) => onChange('date', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                            <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                            Valid Until
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={project.validUntil || ''}
                                onChange={(e) => onChange('validUntil', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                            <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5">Defaults to 30 days from quotation issue date.</p>
                    </div>
                </div>
            </div>

            {/* SECTION 2 — CLIENT DETAILS */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 p-8">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                        <User size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">2. Client Details</h2>
                        <p className="text-xs text-slate-500 font-medium">Customer contact information and site billing address</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                            Client Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={project.clientName || ''}
                                onChange={(e) => onChange('clientName', e.target.value)}
                                placeholder="e.g. Dr. Senthil Nathan"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={project.clientPhone || ''}
                                onChange={(e) => onChange('clientPhone', e.target.value)}
                                placeholder="+91 98400 12345"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={project.clientEmail || ''}
                                onChange={(e) => onChange('clientEmail', e.target.value)}
                                placeholder="client@example.com"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-normal"
                            />
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                        Client / Site Address
                    </label>
                    <div className="relative">
                        <textarea
                            rows={3}
                            value={project.clientAddress || ''}
                            onChange={(e) => onChange('clientAddress', e.target.value)}
                            placeholder="Flat / Villa No, Apartment Complex, Street, City, Pincode"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                        />
                        <MapPin className="absolute left-3.5 top-4 text-slate-400" size={16} />
                    </div>
                </div>
            </div>

            {/* SECTION 3 — PROJECT DETAILS */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 p-8">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">3. Project Details</h2>
                        <p className="text-xs text-slate-500 font-medium">Project scope description, site location, and estimated execution timeline</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                            Project Name / Title
                        </label>
                        <input
                            type="text"
                            value={project.projectName || ''}
                            onChange={(e) => onChange('projectName', e.target.value)}
                            placeholder="e.g. Senthil Luxury Residence - 4BHK"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                            Project Location / Area
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={project.projectLocation || ''}
                                onChange={(e) => onChange('projectLocation', e.target.value)}
                                placeholder="e.g. Anna Nagar West, Chennai"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                            />
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                            Estimated Duration
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={project.estimatedDuration || ''}
                                onChange={(e) => onChange('estimatedDuration', e.target.value)}
                                placeholder="e.g. 45 - 60 Working Days"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                            />
                            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4 — CONTRACT TYPE */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 p-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                            <PackageCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">4. Contract Type</h2>
                            <p className="text-xs text-slate-500 font-medium">Select commercial execution agreement model</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Current: <strong className="text-slate-900">{project.contractType || 'Material + Labour'}</strong>
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CONTRACT_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = (project.contractType || 'Material + Labour') === type.id;
                        return (
                            <div
                                key={type.id}
                                onClick={() => onChange('contractType', type.id)}
                                className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                                    isSelected
                                        ? 'border-blue-600 bg-blue-50/40 shadow-lg shadow-blue-50 ring-2 ring-blue-500/20'
                                        : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                            isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-slate-600 border border-slate-200'
                                        }`}>
                                            <Icon size={22} />
                                        </div>
                                        {isSelected && (
                                            <CheckCircle2 size={22} className="text-blue-600" />
                                        )}
                                    </div>
                                    <h3 className="font-black text-base text-slate-900 mb-1">{type.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{type.subtitle}</p>
                                </div>
                                <div>
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {type.badge}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 5 — PROJECT SCOPE */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 p-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">5. Project Scope of Work</h2>
                            <p className="text-xs text-slate-500 font-medium">Select included items or add custom areas of execution</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                        {currentScopeList.length} Items Selected
                    </span>
                </div>

                {/* Predefined Scope Chips */}
                <div className="mb-6">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-3">
                        Select Scope Items
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                        {PREDEFINED_SCOPE_OPTIONS.map((item) => {
                            const isSelected = currentScopeList.includes(item);
                            return (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => toggleScopeItem(item)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                        isSelected
                                            ? 'bg-slate-900 text-white shadow-md shadow-slate-200 hover:bg-black'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                    }`}
                                >
                                    {item}
                                    {isSelected ? (
                                        <CheckCircle2 size={14} className="text-blue-400" />
                                    ) : (
                                        <Plus size={14} className="text-slate-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Add Custom Scope Form */}
                <form onSubmit={handleAddCustomScope} className="mb-6 flex gap-3">
                    <input
                        type="text"
                        value={customScopeInput}
                        onChange={(e) => setCustomScopeInput(e.target.value)}
                        placeholder="Add custom scope item (e.g. CNC Jali Partition, Terrace Pergola)..."
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!customScopeInput.trim()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-md shadow-blue-100"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Add Custom Scope
                    </button>
                </form>

                {/* Active Selected Scope Display */}
                {currentScopeList.length > 0 && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                            Included in Quotation Scope ({currentScopeList.length})
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {currentScopeList.map((item) => (
                                <span
                                    key={item}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-bold shadow-sm"
                                >
                                    {item}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveScope(item)}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                        title="Remove scope item"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ACTION BUTTONS FOOTER */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200">
                <div>
                    <h4 className="font-black text-sm uppercase tracking-wider">Quotation Details Configured</h4>
                    <p className="text-xs text-slate-400 font-medium">Proceed to room-by-room measurement and rates estimation</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={onSave}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
                    >
                        <Save size={16} />
                        Save Quotation
                    </button>
                    <button
                        type="button"
                        onClick={onContinueToEstimation}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all"
                    >
                        Continue to Estimation
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuotationDetailsSection;
