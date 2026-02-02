import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, Room, Item } from '../types';
import axios from 'axios';
import { Plus, ArrowLeft } from 'lucide-react';
import ProjectHeader from '../components/ProjectHeader';
import RoomSection from '../components/RoomSection';
import TotalsPanel from '../components/TotalsPanel';

const API_BASE = 'http://localhost:8080/api/projects';

const InvoiceForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [project, setProject] = useState<Project>({
        projectName: '',
        clientName: '',
        clientPhone: '',
        date: new Date().toISOString().split('T')[0],
        rooms: [
            {
                roomName: 'Living Room',
                items: [{ itemName: '', length: 0, width: 0, pieces: 1, totalArea: 0, unit: 'sq.ft', rate: 0, amount: 0 }],
                roomTotal: 0
            }
        ],
        grandTotal: 0
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
            setProject(response.data);
        } catch (error) {
            console.error('Error fetching project:', error);
            alert('Failed to load project details.');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

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

    const calculateTotals = (updatedProject: Project): Project => {
        const rooms = updatedProject.rooms.map(room => {
            const items = room.items.map(item => calculateItem(item));
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
                // After creating, redirect to edit mode for the new project
                if (response.data.id) {
                    navigate(`/projects/${response.data.id}`);
                }
            }
            setProject(response.data);
            alert('Project saved successfully.');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save project.');
        }
    };

    const handleDownloadPdf = async () => {
        if (!project.id) {
            alert("Save your project before exporting PDF.");
            return;
        }
        try {
            const response = await axios.get(`${API_BASE}/${project.id}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Estimate_${project.clientName || 'Interior'}.pdf`);
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
                    <p className="text-slate-500 font-medium italic">Loading invoice details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <ProjectHeader
                project={project}
                onChange={handleProjectChange}
                onSave={handleSave}
                onDownload={handleDownloadPdf}
            />

            <main className="max-w-6xl mx-auto px-4 py-8 pb-32">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold uppercase tracking-widest text-xs transition-all no-print"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </button>

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

                <div className="flex justify-center pt-8 no-print">
                    <button
                        onClick={addRoom}
                        className="group flex flex-col items-center gap-3 px-12 py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300"
                    >
                        <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 shadow-sm transition-all">
                            <Plus size={24} strokeWidth={3} />
                        </div>
                        <span className="font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest text-xs transition-all">Add New Estimate Section</span>
                    </button>
                </div>
            </main>

            <footer className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-t border-slate-100 no-print">
                © 2026 Interior Studio Pro • Professional Estimation Tool
            </footer>

            <TotalsPanel grandTotal={project.grandTotal} onDownload={handleDownloadPdf} />
        </div>
    );
};

export default InvoiceForm;
