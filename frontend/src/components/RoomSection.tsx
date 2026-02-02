import React from 'react';
import { Room, Item } from '../types';
import ItemsTable from './ItemsTable';
import { Plus, X, LayoutGrid } from 'lucide-react';

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
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 group transition-all hover:shadow-md">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                        <LayoutGrid size={20} />
                    </div>
                    <div className="flex-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                            Estimate Section {roomIdx + 1}
                        </span>
                        <input
                            type="text"
                            value={room.roomName}
                            onChange={(e) => onRoomNameChange(roomIdx, e.target.value)}
                            className="text-lg font-bold text-slate-900 bg-transparent border-0 p-0 focus:ring-0 w-full placeholder:text-slate-300"
                            placeholder="e.g. Living Room Cabinets"
                        />
                    </div>
                </div>
                <button
                    onClick={() => onRemoveRoom(roomIdx)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all no-print"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-6">
                <ItemsTable
                    items={room.items}
                    roomIdx={roomIdx}
                    onItemChange={onItemChange}
                    onRemoveItem={onRemoveItem}
                />

                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => onAddItem(roomIdx)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 no-print"
                    >
                        <Plus size={18} />
                        Add New Item
                    </button>

                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Section Total</p>
                        <p className="text-2xl font-black text-slate-900">
                            <span className="text-slate-400 text-sm font-medium mr-1">₹</span>
                            {(room.roomTotal || 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoomSection;
