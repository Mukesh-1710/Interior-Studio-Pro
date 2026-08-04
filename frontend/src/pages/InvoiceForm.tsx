import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, Room, Item } from '../types';
import axios from 'axios';
import { Plus, ArrowLeft, ArrowRight, Calculator } from 'lucide-react';
import ProjectHeader, { QuotationTab } from '../components/ProjectHeader';
import QuotationDetailsSection from '../components/QuotationDetailsSection';
import RoomSection from '../components/RoomSection';
import TotalsPanel from '../components/TotalsPanel';
import MaterialSpecificationsSection from '../components/MaterialSpecificationsSection';
import CommercialTermsSection from '../components/CommercialTermsSection';

const API_BASE = 'http://localhost:8080/api/projects';

const InvoiceForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<QuotationTab>('details');

    const [project, setProject] = useState<Project>({
        quotationNumber: '',
        date: new Date().toISOString().split('T')[0],
        validUntil: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        clientAddress: '',
        projectName: '',
        projectLocation: '',
        contractType: 'Material + Labour',
        estimatedDuration: '',
        projectScope: JSON.stringify(['Modular Kitchen', 'Wardrobes']),
        rooms: [
            {
                roomName: 'Living Room',
                items: [{ itemName: '', length: 0, width: 0, pieces: 1, totalArea: 0, unit: 'sq.ft', rate: 0, amount: 0 }],
                roomTotal: 0
            }
        ],
        materialSpecifications: [],
        paymentMilestones: [],
        quotationTerms: [],
        subTotal: 0,
        discount: 0,
        taxPercentage: 0,
        taxAmount: 0,
        grandTotal: 0,
        warrantyTerms: '',
        clientSignName: '',
        authorizedSignatory: 'Ramachandran (RR Interiors)'
    });

    useEffect(() => {
        if (id) {
            fetchProject(id);
        }
    }, [id]);

    const fetchProject = async (projectId: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${projectId}`);
            const fetched = response.data;
            
            // Normalize fetched project safely
            setProject({
                ...fetched,
                quotationNumber: fetched.quotationNumber || '',
                date: fetched.date || new Date().toISOString().split('T')[0],
                validUntil: fetched.validUntil || '',
                clientName: fetched.clientName || '',
                clientPhone: fetched.clientPhone || '',
                clientEmail: fetched.clientEmail || '',
                clientAddress: fetched.clientAddress || '',
                projectName: fetched.projectName || '',
                projectLocation: fetched.projectLocation || '',
                contractType: fetched.contractType || 'Material + Labour',
                estimatedDuration: fetched.estimatedDuration || '',
                projectScope: fetched.projectScope || '[]',
                rooms: fetched.rooms && fetched.rooms.length > 0 ? fetched.rooms : [
                    {
                        roomName: 'Main Room',
                        items: [{ itemName: '', length: 0, width: 0, pieces: 1, totalArea: 0, unit: 'sq.ft', rate: 0, amount: 0 }],
                        roomTotal: 0
                    }
                ],
                materialSpecifications: fetched.materialSpecifications || [],
                paymentMilestones: fetched.paymentMilestones || [],
                quotationTerms: fetched.quotationTerms || [],
                subTotal: fetched.subTotal ?? fetched.grandTotal ?? 0,
                discount: fetched.discount ?? 0,
                taxPercentage: fetched.taxPercentage ?? 0,
                taxAmount: fetched.taxAmount ?? 0,
                grandTotal: fetched.grandTotal || 0,
                amountInWords: fetched.amountInWords || '',
                warrantyTerms: fetched.warrantyTerms || '',
                clientSignName: fetched.clientSignName || '',
                authorizedSignatory: fetched.authorizedSignatory || 'Ramachandran (RR Interiors)'
            });
        } catch (error) {
            console.error('Error fetching project:', error);
            alert('Failed to load project details.');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    // FROZEN: Existing calculation logic
    const calculateItem = (item: Item): Item => {
        const rate = item.rate || 0;
        const pieces = item.pieces || 0;
        let totalArea = 0;
        let amount = 0;

        if (item.unit === 'sq.ft') {
            totalArea = (item.length || 0) * (item.width || 0) * pieces;
            amount = totalArea * rate;
        } else if (item.unit === 'pcs') {
            totalArea = pieces;
            amount = pieces * rate;
        }

        return { ...item, totalArea, amount };
    };

    // FROZEN: Existing calculation logic
    const calculateTotals = (updatedProject: Project): Project => {
        const rooms = (updatedProject.rooms || []).map(room => {
            const items = (room.items || []).map(item => calculateItem(item));
            const roomTotal = items.reduce((sum, item) => sum + item.amount, 0);
            return { ...room, items, roomTotal };
        });
        const grandTotal = rooms.reduce((sum, room) => sum + room.roomTotal, 0);
        return { ...updatedProject, rooms, grandTotal };
    };

    const handleProjectChange = (field: keyof Project, value: any) => {
        setProject(prev => ({ ...prev, [field]: value }));
    };

    const handleRoomNameChange = (roomIndex: number, value: string) => {
        const newRooms = [...project.rooms];
        newRooms[roomIndex] = { ...newRooms[roomIndex], roomName: value };
        setProject({ ...project, rooms: newRooms });
    };

    const handleItemChange = (roomIndex: number, itemIndex: number, field: keyof Item, value: any) => {
        const newRooms = [...project.rooms];
        const room = { ...newRooms[roomIndex] };
        const items = [...room.items];
        let item = { ...items[itemIndex] };

        let finalValue = value;
        if (['length', 'width', 'pieces', 'rate'].includes(field as string)) {
            finalValue = field === 'pieces' ? parseInt(value) || 0 : parseFloat(value) || 0;
        }

        item = { ...item, [field]: finalValue };
        items[itemIndex] = item;
        room.items = items;
        newRooms[roomIndex] = room;

        setProject(calculateTotals({ ...project, rooms: newRooms }));
    };

    const addRoom = () => {
        setProject(prev => ({
            ...prev,
            rooms: [...prev.rooms, { roomName: 'Additional Section', items: [], roomTotal: 0 }]
        }));
    };

    const addItem = (roomIndex: number) => {
        const newRooms = [...project.rooms];
        const room = { ...newRooms[roomIndex] };
        room.items = [...room.items, { itemName: '', length: 0, width: 0, pieces: 1, totalArea: 0, unit: 'sq.ft', rate: 0, amount: 0 }];
        newRooms[roomIndex] = room;
        setProject({ ...project, rooms: newRooms });
    };

    const removeItem = (roomIndex: number, itemIndex: number) => {
        const newRooms = [...project.rooms];
        const room = { ...newRooms[roomIndex] };
        room.items = room.items.filter((_, i) => i !== itemIndex);
        newRooms[roomIndex] = room;
        setProject(calculateTotals({ ...project, rooms: newRooms }));
    };

    const removeRoom = (roomIndex: number) => {
        const newRooms = project.rooms.filter((_, i) => i !== roomIndex);
        setProject(calculateTotals({ ...project, rooms: newRooms }));
    };

    const handleSave = async () => {
        try {
            let response;
            if (id) {
                response = await axios.put(`${API_BASE}/${id}`, project);
            } else {
                response = await axios.post(API_BASE, project);
                // After creating, navigate to edit URL for the newly created project
                if (response.data.id) {
                    navigate(`/projects/${response.data.id}`, { replace: true });
                }
            }
            setProject(response.data);
            alert('Quotation saved successfully!');
        } catch (error: any) {
            console.error('Save error:', error);
            const msg = error.response?.data?.message || 'Failed to save quotation.';
            alert(msg);
        }
    };

    const handleDownloadPdf = async () => {
        if (!project.id) {
            alert('Please save the quotation before exporting PDF.');
            return;
        }
        try {
            const response = await axios.get(`${API_BASE}/${project.id}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Quotation_${project.quotationNumber || project.clientName || 'RR_Interiors'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Could not generate PDF.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium italic">Loading quotation details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <ProjectHeader
                project={project}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onChange={handleProjectChange}
                onSave={handleSave}
                onDownload={handleDownloadPdf}
            />

            <main className="max-w-6xl mx-auto px-4 py-8 pb-32">
                {/* Back to Dashboard Navigation */}
                <div className="flex items-center justify-between mb-6 no-print">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold uppercase tracking-widest text-xs transition-all"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>Status: <strong className="text-slate-700">{project.id ? 'Saved' : 'Draft'}</strong></span>
                        <span>•</span>
                        <span>Contract: <strong className="text-slate-700">{project.contractType || 'Material + Labour'}</strong></span>
                    </div>
                </div>

                {/* TAB 1: QUOTATION DETAILS */}
                {activeTab === 'details' && (
                    <QuotationDetailsSection
                        project={project}
                        onChange={handleProjectChange}
                        onSave={handleSave}
                        onContinueToEstimation={() => setActiveTab('estimation')}
                    />
                )}

                {/* TAB 2: ESTIMATION & MEASUREMENT (FROZEN EXISTING WORKFLOW) */}
                {activeTab === 'estimation' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Section Banner */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                    <Calculator size={20} />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Room Measurements & Item Estimates</h2>
                                    <p className="text-xs text-slate-500 font-medium">Add rooms, dimensions (Length × Width × Nos / Pcs), and rates</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                >
                                    ← Quotation Details
                                </button>
                                <button
                                    onClick={addRoom}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-blue-100"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                    Add Section
                                </button>
                            </div>
                        </div>

                        {/* Rooms List */}
                        <div className="space-y-6">
                            {project.rooms.map((room, roomIdx) => (
                                <RoomSection
                                    key={roomIdx}
                                    room={room}
                                    roomIdx={roomIdx}
                                    onRoomNameChange={handleRoomNameChange}
                                    onRemoveRoom={removeRoom}
                                    onItemChange={handleItemChange}
                                    onAddItem={addItem}
                                    onRemoveItem={removeItem}
                                />
                            ))}
                        </div>

                        {/* Add Room Button */}
                        <div className="flex justify-center pt-4 no-print">
                            <button
                                onClick={addRoom}
                                className="group flex flex-col items-center gap-3 px-12 py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50 hover:bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 shadow-sm transition-all">
                                    <Plus size={24} strokeWidth={3} />
                                </div>
                                <span className="font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest text-xs transition-all">
                                    Add New Estimate Section / Room
                                </span>
                            </button>
                        </div>

                        {/* Estimation Bottom Navigation */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200 no-print">
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-wider">
                                    Estimation & Measurements Complete
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                    Proceed to specify materials, brands, finishes, and hardware
                                </p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('details')}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
                                >
                                    <ArrowLeft size={16} />
                                    Quotation Details
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('materials')}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                                >
                                    Continue to Materials & Hardware
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: MATERIALS & HARDWARE */}
                {activeTab === 'materials' && (
                    <MaterialSpecificationsSection
                        project={project}
                        onChange={handleProjectChange}
                        onSave={handleSave}
                        onBackToEstimation={() => setActiveTab('estimation')}
                        onContinueToCommercialTerms={() => setActiveTab('commercials')}
                    />
                )}

                {/* TAB 4: COMMERCIAL TERMS */}
                {activeTab === 'commercials' && (
                    <CommercialTermsSection
                        project={project}
                        onChange={handleProjectChange}
                        onSave={handleSave}
                        onBackToMaterials={() => setActiveTab('materials')}
                        onDownloadPdf={handleDownloadPdf}
                    />
                )}
            </main>

            <footer className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-t border-slate-100 no-print">
                © 2026 RR Interiors • Professional Estimation & Quotation System
            </footer>

            <TotalsPanel grandTotal={project.grandTotal} onDownload={handleDownloadPdf} />
        </div>
    );
};

export default InvoiceForm;
