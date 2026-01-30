import React, { useState } from 'react';
import { Project, Room, Item } from './types';
import axios from 'axios';
import { Plus } from 'lucide-react';
import Layout from './components/Layout';
import Header from './components/Header';
import ProjectOverviewCard from './components/ProjectOverviewCard';
import RoomSection from './components/RoomSection';
import TotalsCard from './components/TotalsCard';

const API_BASE = 'http://localhost:8080/api/projects';

const App: React.FC = () => {
    const [project, setProject] = useState<Project>({
        projectName: '',
        clientName: '',
        clientPhone: '',
        date: new Date().toISOString().split('T')[0],
        rooms: [
            {
                roomName: 'Main Area',
                items: [{ itemName: '', length: 0, width: 0, qty: 0, unit: 'sq.ft', rate: 0, amount: 0 }],
                roomTotal: 0
            }
        ],
        grandTotal: 0
    });

    const calculateItem = (item: Item): Item => {
        let qty = item.qty;
        if (item.unit === 'sq.ft') {
            qty = (item.length || 0) * (item.width || 0);
        }
        const amount = (qty || 0) * (item.rate || 0);
        return { ...item, qty, amount };
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
        if (['length', 'width', 'qty', 'rate'].includes(field as string)) {
            finalValue = parseFloat(value) || 0;
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
        room.items = [...room.items, { itemName: '', length: 0, width: 0, qty: 0, unit: 'sq.ft', rate: 0, amount: 0 }];
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
            const response = await axios.post(API_BASE, project);
            setProject(response.data);
            alert('Draft saved successfully.');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save project.');
        }
    };

    const handleDownloadPdf = async () => {
        if (!project.id) {
            alert("Save your draft before exporting PDF.");
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

    return (
        <Layout>
            <Header onSave={handleSave} onDownload={handleDownloadPdf} />

            <main style={{ paddingBottom: '100px' }}>
                <ProjectOverviewCard project={project} onChange={handleProjectChange} />

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
                        style={{ padding: '12px 32px', borderStyle: 'dashed', borderWidth: '2px', background: '#f8fafc', color: '#64748b' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#64748b'; }}
                    >
                        <Plus size={20} />
                        <span style={{ fontWeight: 700 }}>Add New Estimate Section</span>
                    </button>
                </div>
            </main>

            <footer className="app-footer no-print">
                <p>© 2026 Interior Studio Pro • Professional Estimation Tool</p>
            </footer>

            <TotalsCard grandTotal={project.grandTotal} onDownload={handleDownloadPdf} />
        </Layout>
    );
};

export default App;
