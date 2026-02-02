import React from 'react';
import { Item } from '../types';
import { Trash2 } from 'lucide-react';

interface ItemRowProps {
    item: Item;
    roomIdx: number;
    itemIdx: number;
    onItemChange: (roomIdx: number, itemIdx: number, field: keyof Item, value: any) => void;
    onRemoveItem: (roomIdx: number, itemIdx: number) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, roomIdx, itemIdx, onItemChange, onRemoveItem }) => {
    const isSqft = item.unit === 'sq.ft';
    const areaPerItem = isSqft ? (item.length || 0) * (item.width || 0) : 0;

    return (
        <div className="grid grid-cols-[30px_1fr_100px_60px_60px_60px_80px_100px_100px_110px_40px] items-center gap-2 p-2 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
            <div className="text-xs font-bold text-slate-400">{itemIdx + 1}</div>

            <div>
                <input
                    type="text"
                    value={item.itemName}
                    onChange={(e) => onItemChange(roomIdx, itemIdx, 'itemName', e.target.value)}
                    placeholder="Item Description"
                    className="w-full px-2 py-1 border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 bg-transparent"
                />
            </div>

            <div>
                <select
                    value={item.unit}
                    onChange={(e) => onItemChange(roomIdx, itemIdx, 'unit', e.target.value)}
                    className="w-full px-1 py-1 text-sm border-0 bg-transparent focus:ring-0 cursor-pointer font-medium text-slate-600"
                >
                    <option value="sq.ft">sq.ft</option>
                    <option value="pcs">pcs</option>
                </select>
            </div>

            {isSqft ? (
                <>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            value={item.length || ''}
                            onChange={(e) => onItemChange(roomIdx, itemIdx, 'length', e.target.value)}
                            placeholder="L"
                            className="w-full px-1 py-1 text-right border-0 bg-slate-100/50 rounded focus:bg-white focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            value={item.width || ''}
                            onChange={(e) => onItemChange(roomIdx, itemIdx, 'width', e.target.value)}
                            placeholder="W"
                            className="w-full px-1 py-1 text-right border-0 bg-slate-100/50 rounded focus:bg-white focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className="text-center text-slate-200">—</div>
                    <div className="text-center text-slate-200">—</div>
                </>
            )}

            <div>
                <input
                    type="number"
                    value={item.pieces || ''}
                    onChange={(e) => onItemChange(roomIdx, itemIdx, 'pieces', e.target.value)}
                    placeholder="Nos"
                    className="w-full px-1 py-1 text-right border-0 bg-slate-100/50 rounded focus:bg-white focus:ring-1 focus:ring-blue-500 font-semibold"
                />
            </div>

            <div className="text-right text-sm text-slate-500 font-mono">
                {isSqft ? areaPerItem.toFixed(2) : '—'}
            </div>

            <div className="text-right text-sm text-slate-700 font-bold font-mono">
                {item.totalArea ? item.totalArea.toFixed(2) : (item.pieces || 0)}
            </div>

            <div>
                <input
                    type="number"
                    value={item.rate || ''}
                    onChange={(e) => onItemChange(roomIdx, itemIdx, 'rate', e.target.value)}
                    placeholder="Rate"
                    className="w-full px-1 py-1 text-right border-0 bg-slate-100/50 rounded focus:bg-white focus:ring-1 focus:ring-blue-500 font-medium"
                />
            </div>

            <div className="text-right text-sm font-bold text-slate-900">
                ₹{(item.amount || 0).toLocaleString()}
            </div>

            <div className="flex justify-center">
                <button
                    onClick={() => onRemoveItem(roomIdx, itemIdx)}
                    className="p-1 text-slate-300 hover:text-red-500 transition-colors no-print"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default ItemRow;
