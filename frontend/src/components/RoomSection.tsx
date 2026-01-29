import React from 'react';
import { Room, Item } from '../types';
import { Trash2, Plus, Box } from 'lucide-react';
import ItemsTable from './ItemsTable';

interface RoomSectionProps {
    room: Room;
    roomIdx: number;
    onRoomNameChange: (idx: number, name: string) => void;
    onRemoveRoom: (idx: number) => void;
    onItemChange: (roomIdx: number, itemIdx: number, field: keyof Item, value: any) => void;
    onAddItem: (roomIdx: number) => void;
    onRemoveItem: (roomIdx: number, itemIdx: number) => void;
}

const RoomSection: React.FC<RoomSectionProps> = ({
    room, roomIdx, onRoomNameChange, onRemoveRoom, onItemChange, onAddItem, onRemoveItem
}) => {
    return (
        <div className="premium-card rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group/card">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover/card:opacity-10 transition-opacity">
                <Box size={120} className="text-white" />
            </div>

            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        value={room.roomName}
                        onChange={(e) => onRoomNameChange(roomIdx, e.target.value)}
                        className="text-2xl font-black text-white bg-transparent outline-none focus:ring-0 w-full placeholder:text-slate-800"
                        placeholder="Section Name"
                    />
                    <div className="h-1 w-12 bg-indigo-500 rounded-full mt-2"></div>
                </div>
                <button
                    onClick={() => onRemoveRoom(roomIdx)}
                    className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all no-print flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                >
                    <Trash2 size={18} />
                    <span className="hidden md:inline">Remove Section</span>
                </button>
            </div>

            <ItemsTable
                items={room.items}
                roomIdx={roomIdx}
                onItemChange={onItemChange}
                onRemoveItem={onRemoveItem}
            />

            <div className="flex justify-between items-end no-print pt-6">
                <button
                    onClick={() => onAddItem(roomIdx)}
                    className="group flex items-center gap-3 px-6 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-2xl transition-all border border-indigo-500/20"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-bold text-sm tracking-wide">Add New Item</span>
                </button>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Section Subtotal</p>
                    <p className="text-3xl font-black text-white tracking-tight">
                        <span className="text-indigo-500 text-xl">₹</span>
                        {room.roomTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoomSection;
