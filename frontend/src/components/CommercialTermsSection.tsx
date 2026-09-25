import React, { useState, useEffect } from 'react';
import { Project, PaymentMilestone, QuotationTerm } from '../types';
import {
    Receipt,
    Percent,
    DollarSign,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Plus,
    Trash2,
    Edit3,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    FileText,
    Shield,
    UserCheck,
    Save,
    ArrowLeft,
    Download,
    HelpCircle
} from 'lucide-react';

interface CommercialTermsSectionProps {
    project: Project;
    onChange: (field: keyof Project, value: any) => void;
    onSave: () => void;
    onBackToMaterials: () => void;
    onDownloadPdf?: () => void;
}

// 10 Curated Editable Starting Terms for RR Interiors
const STANDARD_TERMS_TEMPLATE: string[] = [
    'Quotation validity is as mentioned in the quotation details (30 days from date of issue unless specified otherwise).',
    'Work will be executed according to the approved scope of work, architectural drawings, and finalized site measurements.',
    'Any additional work or modifications requested after quote approval will be treated as extra scope and billed separately.',
    'Final site measurements and core carcass dimensions will be re-confirmed on site prior to factory/carpentry production.',
    'All material, laminate, hardware, and finish selections must be formally approved by the client before commencing fabrication.',
    'Project timelines may be adjusted based on site readiness, power/water access, client approvals, or material market availability.',
    'Any civil, plumbing, or electrical modifications outside the agreed scope must be executed or authorized prior to woodwork installation.',
    'Client-provided materials, appliances, sinks, fittings, or accessories must be delivered at the site before the required installation phase.',
    'The quotation does not include any items or services explicitly excluded from the approved quotation scope.',
    'Final handover and key handover will be executed upon 100% completion of the agreed scope and complete settlement of outstanding payments.'
];

// Standard 4-Stage Payment Milestone Template (30% - 40% - 20% - 10%)
const STANDARD_MILESTONES_TEMPLATE: Omit<PaymentMilestone, 'id'>[] = [
    {
        milestoneName: 'Advance on Booking / Design Sign-off',
        percentage: 30,
        amount: 0,
        status: 'Pending',
        sortOrder: 0
    },
    {
        milestoneName: 'Work Progress / Material Procurement & Factory Cut',
        percentage: 40,
        amount: 0,
        status: 'Pending',
        sortOrder: 1
    },
    {
        milestoneName: 'Site Delivery & Assembly / Installation Phase',
        percentage: 20,
        amount: 0,
        status: 'Pending',
        sortOrder: 2
    },
    {
        milestoneName: 'Final Finishing, Snag Rectification & Handover',
        percentage: 10,
        amount: 0,
        status: 'Pending',
        sortOrder: 3
    }
];

const DEFAULT_WARRANTY_TEXT =
    'RR Interiors provides a comprehensive workmanship warranty against manufacturing and installation defects on all carpentry work as agreed for this specific project. Hardware and board materials carry respective manufacturer warranties. Warranty coverage is subject to standard usage, adherence to maintenance guidelines, and timely settlement of quotation commercials.';

const DEFAULT_ACCEPTANCE_STATEMENT =
    'I/We acknowledge that the scope of work, quotation value, material specifications, payment terms, and conditions stated in this quotation have been reviewed, understood, and formally accepted.';

const CommercialTermsSection: React.FC<CommercialTermsSectionProps> = ({
    project,
    onChange,
    onSave,
    onBackToMaterials,
    onDownloadPdf
}) => {
    // Commercial Fields State
    const subtotal = Number(project.subTotal ?? project.grandTotal ?? 0);
    const discount = Number(project.discount ?? 0);
    const taxPercentage = Number(project.taxPercentage ?? 0);

    // Calculated amounts
    const netAmount = Math.max(0, subtotal - discount);
    const taxAmount = Number(project.taxAmount ?? ((netAmount * taxPercentage) / 100));
    const finalGrandTotal = netAmount + taxAmount;

    // Milestone Modal State
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [editingMilestoneIndex, setEditingMilestoneIndex] = useState<number | null>(null);
    const [milestoneForm, setMilestoneForm] = useState<PaymentMilestone>({
        milestoneName: '',
        percentage: 10,
        amount: 0,
        status: 'Pending'
    });

    // Term Modal State
    const [isTermModalOpen, setIsTermModalOpen] = useState(false);
    const [editingTermIndex, setEditingTermIndex] = useState<number | null>(null);
    const [termFormText, setTermFormText] = useState('');

    // Discount quick mode (Fixed Amount vs Percentage)
    const [discountMode, setDiscountMode] = useState<'AMOUNT' | 'PERCENT'>('AMOUNT');
    const [discountPercentInput, setDiscountPercentInput] = useState<number>(() => {
        return subtotal > 0 && discount > 0 ? Number(((discount / subtotal) * 100).toFixed(2)) : 0;
    });

    const milestones = project.paymentMilestones || [];
    const terms = project.quotationTerms || [];

    // Milestone total percentage
    const totalMilestonePercentage = milestones.reduce((sum, m) => sum + (Number(m.percentage) || 0), 0);
    const isMilestonesValid = Math.abs(totalMilestonePercentage - 100) < 0.01;

    // Helper: format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Handle Discount Changes
    const handleDiscountAmountChange = (val: number) => {
        const cleanVal = Math.max(0, Math.min(val, subtotal));
        onChange('discount', cleanVal);
        // Recalculate tax amount with new net
        const newNet = Math.max(0, subtotal - cleanVal);
        const newTaxAmt = Number(((newNet * taxPercentage) / 100).toFixed(2));
        onChange('taxAmount', newTaxAmt);
        if (subtotal > 0) {
            setDiscountPercentInput(Number(((cleanVal / subtotal) * 100).toFixed(2)));
        }
    };

    const handleDiscountPercentChange = (pct: number) => {
        const cleanPct = Math.max(0, Math.min(pct, 100));
        setDiscountPercentInput(cleanPct);
        const calculatedDiscount = Number(((subtotal * cleanPct) / 100).toFixed(2));
        onChange('discount', calculatedDiscount);
        // Recalculate tax amount with new net
        const newNet = Math.max(0, subtotal - calculatedDiscount);
        const newTaxAmt = Number(((newNet * taxPercentage) / 100).toFixed(2));
        onChange('taxAmount', newTaxAmt);
    };

    // Handle Tax Changes
    const handleTaxPercentageChange = (pct: number) => {
        const cleanPct = Math.max(0, Math.min(pct, 100));
        onChange('taxPercentage', cleanPct);
        const newTaxAmt = Number(((netAmount * cleanPct) / 100).toFixed(2));
        onChange('taxAmount', newTaxAmt);
    };

    // --- MILESTONES HANDLERS ---
    const handleOpenAddMilestone = () => {
        setEditingMilestoneIndex(null);
        // Suggest remaining percentage
        const remaining = Math.max(0, 100 - totalMilestonePercentage);
        setMilestoneForm({
            milestoneName: '',
            percentage: remaining > 0 ? remaining : 10,
            amount: Number(((finalGrandTotal * (remaining > 0 ? remaining : 10)) / 100).toFixed(2)),
            status: 'Pending'
        });
        setIsMilestoneModalOpen(true);
    };

    const handleOpenEditMilestone = (index: number) => {
        setEditingMilestoneIndex(index);
        setMilestoneForm({ ...milestones[index] });
        setIsMilestoneModalOpen(true);
    };

    const handleSaveMilestone = (e: React.FormEvent) => {
        e.preventDefault();
        if (!milestoneForm.milestoneName?.trim()) {
            alert('Please enter a milestone name.');
            return;
        }

        const pct = Math.max(0, Math.min(Number(milestoneForm.percentage) || 0, 100));
        const amt = Number(((finalGrandTotal * pct) / 100).toFixed(2));

        const updated = [...milestones];
        if (editingMilestoneIndex !== null) {
            updated[editingMilestoneIndex] = {
                ...milestoneForm,
                percentage: pct,
                amount: amt,
                sortOrder: editingMilestoneIndex
            };
        } else {
            updated.push({
                ...milestoneForm,
                percentage: pct,
                amount: amt,
                sortOrder: updated.length
            });
        }

        onChange('paymentMilestones', updated);
        setIsMilestoneModalOpen(false);
    };

    const handleDeleteMilestone = (index: number) => {
        if (window.confirm(`Delete milestone "${milestones[index].milestoneName || 'this item'}"?`)) {
            const updated = milestones.filter((_, idx) => idx !== index).map((m, idx) => ({ ...m, sortOrder: idx }));
            onChange('paymentMilestones', updated);
        }
    };

    const handleMoveMilestone = (index: number, direction: 'UP' | 'DOWN') => {
        const targetIndex = direction === 'UP' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= milestones.length) return;

        const updated = [...milestones];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        const reordered = updated.map((m, idx) => ({ ...m, sortOrder: idx }));
        onChange('paymentMilestones', reordered);
    };

    const handleLoadStandardMilestones = () => {
        if (milestones.length > 0) {
            if (!window.confirm('Replace existing payment milestones with the standard 4-stage schedule (30% - 40% - 20% - 10%)?')) {
                return;
            }
        }
        const templateWithAmounts: PaymentMilestone[] = STANDARD_MILESTONES_TEMPLATE.map((m, idx) => ({
            ...m,
            amount: Number(((finalGrandTotal * (m.percentage || 0)) / 100).toFixed(2)),
            sortOrder: idx
        }));
        onChange('paymentMilestones', templateWithAmounts);
    };

    // --- TERMS HANDLERS ---
    const handleOpenAddTerm = () => {
        setEditingTermIndex(null);
        setTermFormText('');
        setIsTermModalOpen(true);
    };

    const handleOpenEditTerm = (index: number) => {
        setEditingTermIndex(index);
        setTermFormText(terms[index]?.termText || '');
        setIsTermModalOpen(true);
    };

    const handleSaveTerm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!termFormText.trim()) {
            alert('Please enter term text.');
            return;
        }

        const updated = [...terms];
        if (editingTermIndex !== null) {
            updated[editingTermIndex] = {
                ...updated[editingTermIndex],
                termText: termFormText.trim(),
                sortOrder: editingTermIndex
            };
        } else {
            updated.push({
                termText: termFormText.trim(),
                sortOrder: updated.length
            });
        }

        onChange('quotationTerms', updated);
        setIsTermModalOpen(false);
    };

    const handleDeleteTerm = (index: number) => {
        if (window.confirm('Delete this quotation term clause?')) {
            const updated = terms.filter((_, idx) => idx !== index).map((t, idx) => ({ ...t, sortOrder: idx }));
            onChange('quotationTerms', updated);
        }
    };

    const handleMoveTerm = (index: number, direction: 'UP' | 'DOWN') => {
        const targetIndex = direction === 'UP' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= terms.length) return;

        const updated = [...terms];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        const reordered = updated.map((t, idx) => ({ ...t, sortOrder: idx }));
        onChange('quotationTerms', reordered);
    };

    const handleLoadStandardTerms = () => {
        if (terms.length > 0) {
            if (!window.confirm('Replace current terms with the 10 standard interior quotation terms?')) {
                return;
            }
        }
        const standardTerms: QuotationTerm[] = STANDARD_TERMS_TEMPLATE.map((text, idx) => ({
            termText: text,
            sortOrder: idx
        }));
        onChange('quotationTerms', standardTerms);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* TOP BANNER */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-colors duration-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                        <Receipt size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Commercial Terms & Cost Summary
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Step 4 of 4 • Finalize commercial breakdown, payment milestones, terms, warranty & sign-off
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onBackToMaterials}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                        <ArrowLeft size={14} />
                        Materials & Hardware
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-blue-100"
                    >
                        <Save size={14} />
                        Save Quotation
                    </button>
                </div>
            </div>

            {/* SECTION 1: COST SUMMARY & COMMERCIAL ADJUSTMENTS */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6 transition-colors duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs border border-emerald-100 dark:border-emerald-800/50">
                            1
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                Cost Summary & Taxes
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                Subtotal derived directly from Room & Item measurements
                            </p>
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hidden sm:inline-block">
                        Authoritative Backend Calculation
                    </span>
                </div>

                {/* Grid: Inputs and Result Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left 6 cols: Adjustments Controls (Discount & Tax) */}
                    <div className="lg:col-span-6 space-y-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <Percent size={14} className="text-blue-600" />
                            Commercial Adjustments
                        </h4>

                        {/* Discount Input */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Quotation Discount
                                </label>
                                <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                                    <button
                                        type="button"
                                        onClick={() => setDiscountMode('AMOUNT')}
                                        className={`px-2 py-0.5 rounded ${
                                            discountMode === 'AMOUNT' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        Fixed ₹
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDiscountMode('PERCENT')}
                                        className={`px-2 py-0.5 rounded ${
                                            discountMode === 'PERCENT' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        Percentage %
                                    </button>
                                </div>
                            </div>

                            {discountMode === 'AMOUNT' ? (
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-xs font-black text-slate-400">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max={subtotal}
                                        value={discount || ''}
                                        onChange={(e) => handleDiscountAmountChange(parseFloat(e.target.value) || 0)}
                                        placeholder="0"
                                        className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.5"
                                        value={discountPercentInput || ''}
                                        onChange={(e) => handleDiscountPercentChange(parseFloat(e.target.value) || 0)}
                                        placeholder="0"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs font-black text-slate-400">%</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                                <span>Applied discount: <strong className="text-slate-700">{formatCurrency(discount)}</strong></span>
                                {subtotal > 0 && discount > 0 && (
                                    <span>({((discount / subtotal) * 100).toFixed(1)}% of subtotal)</span>
                                )}
                            </div>
                        </div>

                        {/* Tax Percentage Selector */}
                        <div className="space-y-2 pt-2 border-t border-slate-200/60">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                                <span>Applicable GST / Tax Rate</span>
                                <span className="text-[11px] font-normal text-slate-500 lowercase">
                                    applied on net amount
                                </span>
                            </label>

                            {/* Preset Pills */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {[0, 5, 12, 18, 28].map((rate) => (
                                    <button
                                        key={rate}
                                        type="button"
                                        onClick={() => handleTaxPercentageChange(rate)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                                            taxPercentage === rate
                                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        {rate === 0 ? '0% (Exempt)' : `${rate}%`}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Tax input */}
                            <div className="relative pt-1">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={taxPercentage || ''}
                                    onChange={(e) => handleTaxPercentageChange(parseFloat(e.target.value) || 0)}
                                    placeholder="Custom Tax %"
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                                <span className="absolute right-3 top-3.5 text-xs font-black text-slate-400">%</span>
                            </div>
                        </div>
                    </div>

                    {/* Right 6 cols: Commercial Ledger Breakdown */}
                    <div className="lg:col-span-6 flex flex-col justify-between p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-md space-y-4">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Commercial Breakdown
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                    INR (₹)
                                </span>
                            </div>

                            <div className="space-y-3 pt-3 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-300">Quotation Subtotal (Base Estimate)</span>
                                    <span className="font-mono font-bold text-white text-sm">
                                        {formatCurrency(subtotal)}
                                    </span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex items-center justify-between text-emerald-400">
                                        <span>— Special Discount</span>
                                        <span className="font-mono font-bold">
                                            - {formatCurrency(discount)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-1 border-t border-slate-700/40 text-slate-300">
                                    <span>Net Taxable Amount</span>
                                    <span className="font-mono font-bold text-white">
                                        {formatCurrency(netAmount)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-slate-300">
                                    <span>+ GST / Tax ({taxPercentage}%)</span>
                                    <span className="font-mono font-bold text-blue-300">
                                        + {formatCurrency(taxAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Final Payable Total Card */}
                        <div className="pt-4 border-t border-slate-700">
                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
                                        Final Payable Amount
                                    </span>
                                    <span className="text-2xl font-black font-mono text-white tracking-tight">
                                        {formatCurrency(finalGrandTotal)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                                        {taxPercentage > 0 ? 'Inclusive of GST' : 'Zero Tax / Direct'}
                                    </span>
                                </div>
                            </div>

                            {/* Amount in Words */}
                            <div className="mt-3 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[11px] text-slate-300 font-medium italic">
                                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 not-italic block mb-0.5">
                                    Amount in Words:
                                </span>
                                {project.amountInWords || 'Amount in words generated upon save'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: PAYMENT MILESTONES */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs border border-blue-100 dark:border-blue-800/50">
                            2
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                Payment Milestones Schedule
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                Define project payment stages linked to deliverables (Must total 100%)
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleLoadStandardMilestones}
                            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                        >
                            <RefreshCw size={13} />
                            Load Standard Schedule
                        </button>
                        <button
                            type="button"
                            onClick={handleOpenAddMilestone}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-blue-100"
                        >
                            <Plus size={14} strokeWidth={3} />
                            Add Milestone
                        </button>
                    </div>
                </div>

                {/* Schedule Total Percentage Meter */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isMilestonesValid ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/50' : 'bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-900/50'}`} />
                        <div>
                            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                Total Scheduled: {totalMilestonePercentage}%
                            </span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {isMilestonesValid
                                    ? 'Payment schedule is balanced at 100% of final payable value.'
                                    : `Schedule requires exactly 100% (currently ${totalMilestonePercentage > 100 ? `${totalMilestonePercentage - 100}% over` : `${100 - totalMilestonePercentage}% remaining`}).`}
                            </p>
                        </div>
                    </div>
                    <div>
                        {isMilestonesValid ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/30 px-3 py-1.5 rounded-xl">
                                <CheckCircle2 size={14} />
                                100% Complete
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-900/30 px-3 py-1.5 rounded-xl">
                                <AlertCircle size={14} />
                                Must Equal 100%
                            </span>
                        )}
                    </div>
                </div>

                {/* Milestones List */}
                {milestones.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                            No Payment Milestones Added
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            Load the standard 4-stage schedule (30% / 40% / 20% / 10%) or create custom project payment stages.
                        </p>
                        <button
                            type="button"
                            onClick={handleLoadStandardMilestones}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all inline-flex items-center gap-1.5"
                        >
                            <RefreshCw size={13} />
                            Load Standard Schedule
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {milestones.map((milestone, idx) => {
                            const milestoneAmt = Number(((finalGrandTotal * (milestone.percentage || 0)) / 100).toFixed(2));
                            return (
                                <div
                                    key={idx}
                                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all gap-4 shadow-sm hover:shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 font-mono font-black text-xs flex items-center justify-center border border-slate-200">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                                                {milestone.milestoneName || 'Unnamed Milestone'}
                                            </h4>
                                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                                                <span className="font-bold text-slate-600">Stage {idx + 1}</span>
                                                <span>•</span>
                                                <span className="bg-slate-100 text-slate-700 px-2 py-0.2 rounded font-mono font-bold">
                                                    {milestone.percentage}%
                                                </span>
                                                <span>•</span>
                                                <span className="text-blue-600 font-mono font-bold">
                                                    {formatCurrency(milestoneAmt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 justify-end">
                                        {/* Status Badge */}
                                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                                            milestone.status === 'Completed'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : milestone.status === 'In Progress'
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}>
                                            {milestone.status || 'Pending'}
                                        </span>

                                        {/* Reorder Buttons */}
                                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                                            <button
                                                type="button"
                                                disabled={idx === 0}
                                                onClick={() => handleMoveMilestone(idx, 'UP')}
                                                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Move Up"
                                            >
                                                <ArrowUp size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={idx === milestones.length - 1}
                                                onClick={() => handleMoveMilestone(idx, 'DOWN')}
                                                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Move Down"
                                            >
                                                <ArrowDown size={13} />
                                            </button>
                                        </div>

                                        {/* Edit Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditMilestone(idx)}
                                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            title="Edit Milestone"
                                        >
                                            <Edit3 size={15} />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteMilestone(idx)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete Milestone"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* SECTION 3: TERMS & CONDITIONS */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs border border-indigo-100 dark:border-indigo-800/50">
                            3
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                Terms & Conditions
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                Commercial, execution, and handover clauses governing this quotation
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleLoadStandardTerms}
                            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                        >
                            <RefreshCw size={13} />
                            Load Standard Terms
                        </button>
                        <button
                            type="button"
                            onClick={handleOpenAddTerm}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-indigo-100"
                        >
                            <Plus size={14} strokeWidth={3} />
                            Add Clause
                        </button>
                    </div>
                </div>

                {terms.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <FileText size={32} className="mx-auto text-slate-300 mb-2" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                            No Terms & Conditions Defined
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            Load standard interior execution terms or add custom project-specific clauses.
                        </p>
                        <button
                            type="button"
                            onClick={handleLoadStandardTerms}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all inline-flex items-center gap-1.5"
                        >
                            <RefreshCw size={13} />
                            Load Standard Terms (10 Clauses)
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {terms.map((term, idx) => (
                            <div
                                key={idx}
                                className="flex items-start justify-between p-3.5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all gap-3 group"
                            >
                                <div className="flex items-start gap-3 flex-1">
                                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-500 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                        {idx + 1}
                                    </span>
                                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                                        {term.termText}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    {/* Reorder Buttons */}
                                    <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200">
                                        <button
                                            type="button"
                                            disabled={idx === 0}
                                            onClick={() => handleMoveTerm(idx, 'UP')}
                                            className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move Up"
                                        >
                                            <ArrowUp size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={idx === terms.length - 1}
                                            onClick={() => handleMoveTerm(idx, 'DOWN')}
                                            className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move Down"
                                        >
                                            <ArrowDown size={12} />
                                        </button>
                                    </div>

                                    {/* Edit Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEditTerm(idx)}
                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        title="Edit Term"
                                    >
                                        <Edit3 size={14} />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteTerm(idx)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete Term"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECTION 4: WARRANTY & WORKMANSHIP */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs border border-amber-100">
                            4
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                Warranty & Workmanship
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                Define project-specific warranty and after-sales service policy
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onChange('warrantyTerms', DEFAULT_WARRANTY_TEXT)}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-900 uppercase tracking-wider flex items-center gap-1"
                    >
                        <RefreshCw size={11} />
                        Restore Standard Template
                    </button>
                </div>

                <div className="space-y-2">
                    <textarea
                        rows={4}
                        value={project.warrantyTerms ?? DEFAULT_WARRANTY_TEXT}
                        onChange={(e) => onChange('warrantyTerms', e.target.value)}
                        placeholder="Enter project-specific warranty coverage details..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 leading-relaxed outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 px-1">
                        <Shield size={12} className="text-amber-500 shrink-0" />
                        This warranty statement will appear in the official printed quotation document.
                    </p>
                </div>
            </div>

            {/* SECTION 5: CLIENT ACCEPTANCE */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-black text-xs border border-teal-100">
                            5
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                Client Acceptance & Sign-off Details
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                Formal authorization information for quotation approval
                            </p>
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        Formal Quotation Sign-off
                    </span>
                </div>

                {/* Acceptance Declaration Statement */}
                <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block mb-1">
                        Acknowledgment & Acceptance Statement
                    </span>
                    <p className="text-xs text-teal-900 italic font-medium">
                        "{DEFAULT_ACCEPTANCE_STATEMENT}"
                    </p>
                </div>

                {/* Sign-off Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Auto-populated Client Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <UserCheck size={13} className="text-teal-600" />
                            Client / Authorized Name
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={project.clientName || 'Not specified in Tab 1'}
                            className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none cursor-not-allowed"
                            title="Reflected automatically from Quotation Details"
                        />
                        <span className="text-[10px] text-slate-400 px-1">Auto-populated from Tab 1</span>
                    </div>

                    {/* Authorized Signatory (RR Interiors) */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            RR Interiors Signatory
                        </label>
                        <input
                            type="text"
                            value={project.authorizedSignatory || 'Ramachandran (RR Interiors)'}
                            onChange={(e) => onChange('authorizedSignatory', e.target.value)}
                            placeholder="Ramachandran (RR Interiors)"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        />
                        <span className="text-[10px] text-slate-400 px-1">Agency representative</span>
                    </div>

                    {/* Acceptance / Issue Date */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar size={13} className="text-teal-600" />
                            Acceptance / Issue Date
                        </label>
                        <input
                            type="date"
                            value={project.date || new Date().toISOString().split('T')[0]}
                            onChange={(e) => onChange('date', e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        />
                        <span className="text-[10px] text-slate-400 px-1">Date of sign-off</span>
                    </div>
                </div>
            </div>

            {/* MILESTONE ADD/EDIT MODAL */}
            {isMilestoneModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                {editingMilestoneIndex !== null ? 'Edit Payment Milestone' : 'Add Payment Milestone'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsMilestoneModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveMilestone} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Milestone Stage Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Advance on Booking, Work Progress, etc."
                                    value={milestoneForm.milestoneName || ''}
                                    onChange={(e) => setMilestoneForm(prev => ({ ...prev, milestoneName: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Percentage (%) *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        step="0.5"
                                        required
                                        value={milestoneForm.percentage || ''}
                                        onChange={(e) => {
                                            const p = parseFloat(e.target.value) || 0;
                                            setMilestoneForm(prev => ({
                                                ...prev,
                                                percentage: p,
                                                amount: Number(((finalGrandTotal * p) / 100).toFixed(2))
                                            }));
                                        }}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Calculated Amount
                                    </label>
                                    <div className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-700">
                                        {formatCurrency(Number(((finalGrandTotal * (milestoneForm.percentage || 0)) / 100).toFixed(2)))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Milestone Status
                                </label>
                                <select
                                    value={milestoneForm.status || 'Pending'}
                                    onChange={(e) => setMilestoneForm(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed / Paid</option>
                                </select>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsMilestoneModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-200"
                                >
                                    {editingMilestoneIndex !== null ? 'Update Milestone' : 'Add Milestone'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TERM ADD/EDIT MODAL */}
            {isTermModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                {editingTermIndex !== null ? 'Edit Term Clause' : 'Add Term Clause'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsTermModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveTerm} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Term / Condition Clause *
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Enter term text..."
                                    value={termFormText}
                                    onChange={(e) => setTermFormText(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsTermModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-200"
                                >
                                    {editingTermIndex !== null ? 'Update Term' : 'Add Term'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SECTION 6: WORKFLOW BOTTOM NAVIGATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200 no-print">
                <div>
                    <h4 className="font-black text-sm uppercase tracking-wider">
                        Quotation Configuration Complete
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                        All 4 tabs configured • Ready for saving and PDF generation
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={onBackToMaterials}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
                    >
                        <ArrowLeft size={16} />
                        Materials & Hardware
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                    >
                        <Save size={16} />
                        Save Commercial Terms
                    </button>
                    {onDownloadPdf && (
                        <button
                            type="button"
                            onClick={onDownloadPdf}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                        >
                            <Download size={16} />
                            Generate PDF
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommercialTermsSection;
