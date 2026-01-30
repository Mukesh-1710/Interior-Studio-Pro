import React from 'react';
import { Room, Item } from '../types';
import ItemsTable from './ItemsTable';
import { Plus, X } from 'lucide-react';

interface RoomSectionProps {
    room: Room;
    roomIdx: number;
    onRoomNameChange: (roomIdx: number, value: string) => void;
    onRemoveRoom: (roomIdx: number) => void;
    onItemChange: (roomIdx: number, itemIdx: number, field: keyof Item, value: any) => void;
    onAddItem: (roomIdx: number) => void;
    onRemoveItem: (roomIdx: number, itemIdx: number) => void;
}

const RoomSection: React.FC<RoomSectionProps> = ({
    room,
    roomIdx,
    onRoomNameChange,
    onRemoveRoom,
    onItemChange,
    onAddItem,
    onRemoveItem,
}) => {
    return (
        <section className="section">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <span style={{ fontSize: '11px', fontWeight: 700, background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        Section {roomIdx + 1}
                    </span>
                    <input
                        type="text"
                        value={room.roomName}
                        onChange={(e) => onRoomNameChange(roomIdx, e.target.value)}
                        className="section-input-title"
                        placeholder="Section Name"
                    />
                </div>
                <button
                    onClick={() => onRemoveRoom(roomIdx)}
                    className="no-print"
                    style={{ padding: '6px', border: 'none', background: 'transparent', color: '#cbd5e1' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                >
                    <X size={20} />
                </button>
            </div>

            <ItemsTable
                items={room.items}
                roomIdx={roomIdx}
                onItemChange={onItemChange}
                onRemoveItem={onRemoveItem}
            />

            <div className="flex items-center justify-between mt-8">
                <button
                    onClick={() => onAddItem(roomIdx)}
                    className="add-btn no-print"
                >
                    <Plus size={16} />
                    <span>Add Item</span>
                </button>
                <div className="text-right">
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Section Total</p>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>₹{(room.roomTotal || 0).toLocaleString()}</p>
                </div>
            </div>
        </section>
    );
};

export default RoomSection;
