import React, { useState } from 'react';
import { Project, MaterialSpecification } from '../types';
import { 
    Hammer, 
    Plus, 
    Trash2, 
    Edit2, 
    ArrowUp, 
    ArrowDown, 
    Sparkles, 
    Layers, 
    Search, 
    CheckCircle2, 
    Package, 
    UserCheck, 
    X, 
    Save, 
    ArrowLeft,
    ArrowRight,
    Check
} from 'lucide-react';

interface MaterialSpecificationsSectionProps {
    project: Project;
    onChange: (field: keyof Project, value: any) => void;
    onSave: () => void;
    onBackToEstimation: () => void;
    onContinueToCommercialTerms?: () => void;
}

export const PREDEFINED_CATEGORIES = [
    'Board / Core Materials',
    'Plywood',
    'MDF',
    'HDHMR',
    'Laminates',
    'Acrylic',
    'Veneer',
    'Edge Banding',
    'Hinges',
    'Drawer Channels',
    'Handles',
    'Kitchen Accessories',
    'Glass',
    'Mirrors',
    'Adhesives',
    'Screws / Fasteners',
    'Other Hardware',
    'Other'
];

const APPLICATION_SUGGESTIONS = [
    'Kitchen Carcass',
    'Kitchen Shutters',
    'Kitchen Drawers',
    'Wardrobe Carcass',
    'Wardrobe Shutters',
    'Wardrobe Drawers',
    'TV Unit',
    'Pooja Unit',
    'Crockery Unit',
    'Shoe Rack',
    'Vanity Unit',
    'Study Table',
    'Wall Panelling',
    'General Carpentry'
];

export const STANDARD_TEMPLATES: Omit<MaterialSpecification, 'id'>[] = [
    {
        category: 'Plywood',
        itemName: 'BWP Plywood (IS:710 Grade)',
        application: 'Kitchen Carcass & Wet Areas',
        brand: '',
        modelSeries: '710 BWP Marine Grade',
        specification: 'Boiling Waterproof Marine Grade, Calibrated Core, Termite & Borer Proof',
        thickness: '18mm / 16mm',
        finish: 'Raw Calibrated Surface',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'Heavy-duty water-resistant plywood for complete kitchen carcass and sink areas.'
    },
    {
        category: 'Plywood',
        itemName: 'MR Grade / Commercial Plywood (IS:303)',
        application: 'Wardrobe Carcass & Dry Units',
        brand: '',
        modelSeries: 'IS:303 MR Grade',
        specification: 'Moisture Resistant, Anti-Fungal Treated, High Density Core',
        thickness: '18mm',
        finish: 'Raw Sanded Surface',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'Premium MR Grade plywood for bedroom wardrobes and storage cabinets.'
    },
    {
        category: 'HDHMR',
        itemName: 'HDHMR Board (Moisture Resistant)',
        application: 'Shutters & Precision CNC Panels',
        brand: '',
        modelSeries: 'High Density 850+ kg/m³',
        specification: 'High Density High Moisture Resistance Board, Uniform Density for Routing',
        thickness: '18mm',
        finish: 'Smooth Pre-Sanded',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'Ideal for painted shutters, grooved patterns, and modular shutter surfaces.'
    },
    {
        category: 'Laminates',
        itemName: 'High Pressure Decorative Laminate (Outer)',
        application: 'All External Exposed Faces & Shutters',
        brand: '',
        modelSeries: '1.0mm Premium Series',
        specification: '1.0mm Thick High Pressure Decorative Laminate, Scratch & Heat Resistant',
        thickness: '1.0mm',
        finish: 'Suede / Matte / Textured',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'External aesthetic surface finish as per client approved catalogue shade.'
    },
    {
        category: 'Laminates',
        itemName: 'Liner / Balancing Laminate (Inner)',
        application: 'Internal Carcass & Drawer Interiors',
        brand: '',
        modelSeries: '0.8mm Off-White / Fabric Series',
        specification: '0.8mm Inner Balancing Liner Laminate for hygienic and clean interior',
        thickness: '0.8mm',
        finish: 'Off-White / Fabric Textured',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'Internal balancing laminate for all shelves, inner cabinets, and drawer boxes.'
    },
    {
        category: 'Edge Banding',
        itemName: 'PVC Edge Banding Tape',
        application: 'All Exposed Board Edges & Shutters',
        brand: '',
        modelSeries: 'Matching Shade Series',
        specification: '2mm Heavy Duty PVC Edge Banding for Shutters / 0.8mm for Internal Carcass',
        thickness: '2mm / 0.8mm',
        finish: 'Factory Machine-glued Hot Melt',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'Machine pressed with waterproof hot melt glue for seamless edge sealing.'
    },
    {
        category: 'Hinges',
        itemName: 'Soft-Close Concealed Hinges (3D Adjustment)',
        application: 'Kitchen & Wardrobe Shutters',
        brand: '',
        modelSeries: '110° Soft-Close Clip-On',
        specification: 'Hydraulic soft-close mechanism, 80,000+ cycle tested, 3-dimensional adjustment',
        thickness: 'N/A',
        finish: 'Nickel Plated / SS Finish',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'Zero-noise soft-closing concealed clip-on hinges with mounting plates.'
    },
    {
        category: 'Drawer Channels',
        itemName: 'Soft-Close Telescopic / Tandem Drawer Channels',
        application: 'Kitchen & Wardrobe Drawers',
        brand: '',
        modelSeries: 'Full Extension Soft-Close (45kg)',
        specification: 'Telescopic full-extension soft-close ball bearing slides / slim tandem box',
        thickness: 'N/A',
        finish: 'Zinc Coated / Anthracite Grey',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'Smooth silent closing heavy-duty drawer runners supporting up to 45kg load.'
    },
    {
        category: 'Handles',
        itemName: 'Architectural Hardware Handles / Profile Handles',
        application: 'All Shutters, Wardrobes & Drawers',
        brand: '',
        modelSeries: 'Modern Sleek Profile / Concealed Edge',
        specification: 'Aluminium G-Profile / J-Profile / SS 304 Pull Handles',
        thickness: 'N/A',
        finish: 'Matte Black / Brush Brass / SS Matte',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'Ergonomic designer handles selected as per client architectural style.'
    },
    {
        category: 'Kitchen Accessories',
        itemName: 'Modular SS 304 Wire Baskets & Organizers',
        application: 'Kitchen Base Units',
        brand: '',
        modelSeries: 'SS 304 Grade Modular Series',
        specification: 'Cutlery Basket, Plain Basket, Thali Basket, Bottle Pullout with Partition',
        thickness: 'N/A',
        finish: 'Chrome Plated SS 304',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'Rust-proof food-grade SS 304 baskets with anti-slip PVC mats.'
    },
    {
        category: 'Adhesives',
        itemName: 'Synthetic Resin & Waterproof Adhesives',
        application: 'All Woodwork & Laminate Pasting',
        brand: '',
        modelSeries: 'D3 Waterproof Synthetic Resin',
        specification: 'High bond strength, bubble-free adhesion, moisture-resistant woodworking glue',
        thickness: 'N/A',
        finish: 'Standard',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'Premium grade wood adhesive ensuring lifelong bond integrity.'
    },
    {
        category: 'Screws / Fasteners',
        itemName: 'Corrosion-Resistant Screws & Wall Fasteners',
        application: 'Unit Assembly & Wall Mounting',
        brand: '',
        modelSeries: 'Star Head Hardened Screws',
        specification: 'Zinc coated anti-rust wood screws, heavy-duty wall grip plugs & brackets',
        thickness: 'N/A',
        finish: 'Zinc Plated',
        quantity: '',
        supplyResponsibility: 'RR_INTERIORS_SUPPLIED',
        remarks: 'High shear strength structural fasteners for secure wall installation.'
    }
];

const MaterialSpecificationsSection: React.FC<MaterialSpecificationsSectionProps> = ({
    project,
    onChange,
    onSave,
    onBackToEstimation,
    onContinueToCommercialTerms
}) => {
    const specs = project.materialSpecifications || [];

    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState<MaterialSpecification>({
        category: 'Plywood',
        itemName: '',
        application: '',
        brand: '',
        modelSeries: '',
        specification: '',
        thickness: '',
        finish: '',
        quantity: '',
        supplyResponsibility: project.contractType === 'Labour Only' ? 'CLIENT_SUPPLIED' : 'RR_INTERIORS_SUPPLIED',
        remarks: '',
        sortOrder: 0
    });

    const isLabourOnly = project.contractType === 'Labour Only';

    const handleOpenAddModal = () => {
        setEditingIndex(null);
        setFormData({
            category: 'Plywood',
            itemName: '',
            application: '',
            brand: '',
            modelSeries: '',
            specification: '',
            thickness: '',
            finish: '',
            quantity: '',
            supplyResponsibility: isLabourOnly ? 'CLIENT_SUPPLIED' : 'RR_INTERIORS_SUPPLIED',
            remarks: '',
            sortOrder: specs.length
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (index: number) => {
        setEditingIndex(index);
        setFormData({ ...specs[index] });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const handleFormChange = (field: keyof MaterialSpecification, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveSpecification = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.itemName || !formData.itemName.trim()) {
            alert('Please enter an Item / Material Name.');
            return;
        }

        const newSpecs = [...specs];
        if (editingIndex !== null) {
            // Edit existing
            newSpecs[editingIndex] = {
                ...formData,
                sortOrder: formData.sortOrder !== undefined ? formData.sortOrder : editingIndex
            };
        } else {
            // Add new
            newSpecs.push({
                ...formData,
                sortOrder: newSpecs.length
            });
        }

        onChange('materialSpecifications', newSpecs);
        handleCloseModal();
    };

    const handleDeleteSpecification = (index: number) => {
        const itemToDelete = specs[index];
        const confirmMsg = `Are you sure you want to remove "${itemToDelete.itemName || 'this specification'}"?`;
        if (window.confirm(confirmMsg)) {
            const newSpecs = specs.filter((_, i) => i !== index).map((spec, i) => ({
                ...spec,
                sortOrder: i
            }));
            onChange('materialSpecifications', newSpecs);
        }
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newSpecs = [...specs];
        const temp = newSpecs[index - 1];
        newSpecs[index - 1] = newSpecs[index];
        newSpecs[index] = temp;
        // Update sortOrder
        const updated = newSpecs.map((s, idx) => ({ ...s, sortOrder: idx }));
        onChange('materialSpecifications', updated);
    };

    const handleMoveDown = (index: number) => {
        if (index >= specs.length - 1) return;
        const newSpecs = [...specs];
        const temp = newSpecs[index + 1];
        newSpecs[index + 1] = newSpecs[index];
        newSpecs[index] = temp;
        // Update sortOrder
        const updated = newSpecs.map((s, idx) => ({ ...s, sortOrder: idx }));
        onChange('materialSpecifications', updated);
    };

    const handleLoadStandardTemplates = () => {
        if (specs.length > 0) {
            const choice = window.confirm(
                `Your quotation already contains ${specs.length} specifications.\n\nClick OK to APPEND the standard template items, or Cancel to keep current specifications unchanged.`
            );
            if (!choice) return;
        }

        const defaultResponsibility = isLabourOnly ? 'CLIENT_SUPPLIED' : 'RR_INTERIORS_SUPPLIED';
        const templateItems: MaterialSpecification[] = STANDARD_TEMPLATES.map((item, idx) => ({
            ...item,
            supplyResponsibility: defaultResponsibility,
            sortOrder: specs.length + idx
        }));

        onChange('materialSpecifications', [...specs, ...templateItems]);
    };

    // Filter specifications
    const filteredSpecs = specs.filter(spec => {
        const matchesCategory = selectedCategoryFilter === 'ALL' || spec.category === selectedCategoryFilter;
        const matchesSearch = !searchTerm.trim() || 
            (spec.itemName && spec.itemName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (spec.brand && spec.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (spec.application && spec.application.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (spec.specification && spec.specification.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (spec.category && spec.category.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const rrSuppliedCount = specs.filter(s => s.supplyResponsibility !== 'CLIENT_SUPPLIED').length;
    const clientSuppliedCount = specs.filter(s => s.supplyResponsibility === 'CLIENT_SUPPLIED').length;

    // Available categories in current specs for dynamic filter tabs
    const categoriesInUse = Array.from(new Set(specs.map(s => s.category).filter(Boolean)));

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* HERO / SECTION BANNER */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center text-white shadow-lg shadow-slate-200 shrink-0 mt-0.5">
                        <Hammer size={24} className="text-blue-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                MATERIAL & HARDWARE SPECIFICATIONS
                            </h2>
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-wider rounded-md">
                                Tab 3
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Specify the materials, brands, finishes, and hardware included in this quotation.
                        </p>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto">
                    <button
                        type="button"
                        onClick={handleLoadStandardTemplates}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-slate-200 active:scale-95"
                        title="Load standard interior material presets"
                    >
                        <Sparkles size={16} className="text-blue-600" />
                        Load Standard Template
                    </button>
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-200 active:scale-95"
                    >
                        <Plus size={18} strokeWidth={3} />
                        + Add Specification
                    </button>
                </div>
            </div>

            {/* QUICK STATS & SUMMARY PILLS */}
            {specs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-sm">
                            <Layers size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Specifications</p>
                            <p className="text-xl font-black text-slate-900">{specs.length} Items</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-white p-4 flex items-center gap-3.5 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-sm">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">RR Interiors Supplied</p>
                            <p className="text-xl font-black text-blue-900">{rrSuppliedCount} Items</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white p-4 flex items-center gap-3.5 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-sm">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">Client Supplied</p>
                            <p className="text-xl font-black text-amber-900">{clientSuppliedCount} Items</p>
                        </div>
                    </div>
                </div>
            )}

            {/* SEARCH & CATEGORY FILTER BAR */}
            {specs.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by material name, brand, application, or specification..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Category Dropdown Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Category:</span>
                            <select
                                value={selectedCategoryFilter}
                                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
                            >
                                <option value="ALL">All Categories ({specs.length})</option>
                                {categoriesInUse.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat} ({specs.filter(s => s.category === cat).length})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quick Category Pills */}
                    {categoriesInUse.length > 1 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
                            <button
                                type="button"
                                onClick={() => setSelectedCategoryFilter('ALL')}
                                className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                    selectedCategoryFilter === 'ALL'
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                All ({specs.length})
                            </button>
                            {categoriesInUse.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategoryFilter(cat!)}
                                    className={`px-3 py-1 rounded-lg text-[11px] font-bold tracking-tight transition-all whitespace-nowrap ${
                                        selectedCategoryFilter === cat
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {cat} ({specs.filter(s => s.category === cat).length})
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* EMPTY STATE */}
            {specs.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Hammer size={32} />
                    </div>
                    <h3 className="text-base font-black text-slate-800 uppercase tracking-tight mb-1">
                        No material or hardware specifications have been added yet.
                    </h3>
                    <p className="text-xs text-slate-500 font-medium max-w-md mx-auto mb-6">
                        Add project-specific material specifications or load the standard RR Interiors starter template to document plywood grades, hardware brands, and finishes.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={handleLoadStandardTemplates}
                            className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                        >
                            <Sparkles size={16} className="text-blue-400" />
                            Load Standard Template
                        </button>
                        <button
                            type="button"
                            onClick={handleOpenAddModal}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-200 active:scale-95"
                        >
                            <Plus size={18} strokeWidth={3} />
                            + Add Specification
                        </button>
                    </div>
                </div>
            ) : filteredSpecs.length === 0 ? (
                /* Filter Empty State */
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
                    <p className="text-sm font-bold text-slate-600 mb-2">No specifications match your search or filter.</p>
                    <button
                        type="button"
                        onClick={() => { setSearchTerm(''); setSelectedCategoryFilter('ALL'); }}
                        className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-wider"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                /* SPECIFICATIONS LIST / TABLE */
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                                Project Specification Schedule
                            </span>
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-md">
                                {filteredSpecs.length} {filteredSpecs.length === 1 ? 'Item' : 'Items'}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                            Descriptive quotation specifications (does not modify estimation totals)
                        </p>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {filteredSpecs.map((spec) => {
                            const originalIndex = specs.findIndex(s => s === spec);
                            const isRRSupplied = spec.supplyResponsibility !== 'CLIENT_SUPPLIED';

                            return (
                                <div 
                                    key={spec.id ? `spec-${spec.id}` : `spec-idx-${originalIndex}`}
                                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
                                >
                                    {/* Left: Index & Core Identity */}
                                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs shrink-0 mt-0.5">
                                            #{originalIndex + 1}
                                        </div>

                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-md">
                                                    {spec.category || 'General'}
                                                </span>

                                                <h4 className="text-sm font-black text-slate-900 tracking-tight">
                                                    {spec.itemName}
                                                </h4>

                                                {/* Responsibility Pill */}
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                                                    isRRSupplied
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isRRSupplied ? 'bg-blue-600' : 'bg-amber-600'}`}></span>
                                                    {isRRSupplied ? 'RR Interiors Supplied' : 'Client Supplied'}
                                                </span>
                                            </div>

                                            {/* Details Matrix */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                                                {spec.application && (
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Application:</span>
                                                        <span className="font-bold text-slate-800">{spec.application}</span>
                                                    </div>
                                                )}
                                                {spec.brand && (
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Brand / Series:</span>
                                                        <span className="font-bold text-blue-700">
                                                            {spec.brand} {spec.modelSeries ? `(${spec.modelSeries})` : ''}
                                                        </span>
                                                    </div>
                                                )}
                                                {spec.thickness && (
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Thickness:</span>
                                                        <span className="font-bold text-slate-800">{spec.thickness}</span>
                                                    </div>
                                                )}
                                                {spec.finish && (
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Finish:</span>
                                                        <span className="font-bold text-slate-800">{spec.finish}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Specification Description & Remarks */}
                                            {(spec.specification || spec.remarks) && (
                                                <div className="text-xs text-slate-600 pt-1 space-y-0.5">
                                                    {spec.specification && (
                                                        <p className="font-medium">
                                                            <strong className="text-slate-500 font-semibold">Spec: </strong>
                                                            {spec.specification}
                                                        </p>
                                                    )}
                                                    {spec.remarks && (
                                                        <p className="text-slate-400 italic text-[11px]">
                                                            Note: {spec.remarks}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Quantity & Reordering & Actions */}
                                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                                        {spec.quantity && (
                                            <div className="text-right px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Quantity</span>
                                                <span className="text-xs font-black text-slate-800">{spec.quantity}</span>
                                            </div>
                                        )}

                                        {/* Reorder Buttons */}
                                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                                            <button
                                                type="button"
                                                onClick={() => handleMoveUp(originalIndex)}
                                                disabled={originalIndex === 0}
                                                className={`p-1.5 rounded-lg transition-all ${
                                                    originalIndex === 0
                                                        ? 'text-slate-300 cursor-not-allowed'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm'
                                                }`}
                                                title="Move Up"
                                            >
                                                <ArrowUp size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleMoveDown(originalIndex)}
                                                disabled={originalIndex === specs.length - 1}
                                                className={`p-1.5 rounded-lg transition-all ${
                                                    originalIndex === specs.length - 1
                                                        ? 'text-slate-300 cursor-not-allowed'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm'
                                                }`}
                                                title="Move Down"
                                            >
                                                <ArrowDown size={14} />
                                            </button>
                                        </div>

                                        {/* Edit & Delete Action Buttons */}
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditModal(originalIndex)}
                                                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all"
                                                title="Edit Specification"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSpecification(originalIndex)}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                                                title="Delete Specification"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* SPECIFICATION ADD / EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                    <Hammer size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-black uppercase tracking-tight">
                                        {editingIndex !== null ? 'Edit Material Specification' : 'Add Material Specification'}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Project Material & Hardware Details
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSaveSpecification} className="p-6 space-y-5">
                            {/* Row 1: Category & Item Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.category || 'Plywood'}
                                        onChange={(e) => handleFormChange('category', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    >
                                        {PREDEFINED_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                        Item / Material Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. BWP Plywood, Soft-Close Hinge"
                                        value={formData.itemName || ''}
                                        onChange={(e) => handleFormChange('itemName', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row 2: Application & Brand */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                        Application / Location
                                    </label>
                                    <input
                                        type="text"
                                        list="application-suggestions"
                                        placeholder="e.g. Kitchen Carcass, Wardrobe Shutters"
                                        value={formData.application || ''}
                                        onChange={(e) => handleFormChange('application', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                    <datalist id="application-suggestions">
                                        {APPLICATION_SUGGESTIONS.map((app) => (
                                            <option key={app} value={app} />
                                        ))}
                                    </datalist>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                        Brand (Editable)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Century / Greenply / Hettich / Hafele"
                                        value={formData.brand || ''}
                                        onChange={(e) => handleFormChange('brand', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {/* Row 3: Model / Series & Specification */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                        Model / Series (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 110° Soft Close, Full Extension"
                                        value={formData.modelSeries || ''}
                                        onChange={(e) => handleFormChange('modelSeries', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                        Technical Specification
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. BWP Grade (IS:710), 45kg load capacity"
                                        value={formData.specification || ''}
                                        onChange={(e) => handleFormChange('specification', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {/* Row 4: Thickness, Finish, Quantity */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                        Thickness
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 18mm, 1mm, 6mm"
                                        value={formData.thickness || ''}
                                        onChange={(e) => handleFormChange('thickness', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                        Finish / Surface
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Matte, Glossy, SS Finish"
                                        value={formData.finish || ''}
                                        onChange={(e) => handleFormChange('finish', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                        Quantity (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 10 pairs, 5 sheets"
                                        value={formData.quantity || ''}
                                        onChange={(e) => handleFormChange('quantity', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {/* Row 5: Material Responsibility */}
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-2">
                                    Material Supply Responsibility <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleFormChange('supplyResponsibility', 'RR_INTERIORS_SUPPLIED')}
                                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                                            formData.supplyResponsibility !== 'CLIENT_SUPPLIED'
                                                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-100 text-blue-900'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-wider">RR Interiors Supplied</p>
                                            <p className="text-[11px] text-slate-500 font-medium">Provided and installed by RR Interiors</p>
                                        </div>
                                        {formData.supplyResponsibility !== 'CLIENT_SUPPLIED' && (
                                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleFormChange('supplyResponsibility', 'CLIENT_SUPPLIED')}
                                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                                            formData.supplyResponsibility === 'CLIENT_SUPPLIED'
                                                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-100 text-amber-900'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-wider">Client Supplied</p>
                                            <p className="text-[11px] text-slate-500 font-medium">Purchased & supplied by client</p>
                                        </div>
                                        {formData.supplyResponsibility === 'CLIENT_SUPPLIED' && (
                                            <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Row 6: Remarks */}
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                    Remarks / Notes (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Add any specific installation instructions, brand notes, or client requirements..."
                                    value={formData.remarks || ''}
                                    onChange={(e) => handleFormChange('remarks', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-200 active:scale-95 flex items-center gap-2"
                                >
                                    <CheckCircle2 size={16} />
                                    {editingIndex !== null ? 'Update Specification' : 'Add Specification'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* BOTTOM NAVIGATION FOOTER */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200">
                <div>
                    <h4 className="font-black text-sm uppercase tracking-wider">
                        Materials & Hardware Configured ({specs.length} Specifications)
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                        All specification entries are synchronized with the project aggregate
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={onBackToEstimation}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
                    >
                        <ArrowLeft size={16} />
                        Estimation
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
                    >
                        <Save size={16} />
                        Save
                    </button>
                    {onContinueToCommercialTerms && (
                        <button
                            type="button"
                            onClick={onContinueToCommercialTerms}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                        >
                            Continue to Commercial Terms
                            <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MaterialSpecificationsSection;
