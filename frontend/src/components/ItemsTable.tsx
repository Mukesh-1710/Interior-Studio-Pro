import React from 'react';
import { Item } from '../types';
import { Trash2, MoveRight } from 'lucide-react';

interface ItemsTableProps {
    items: Item[];
    roomIdx: number;
    onItemChange: (roomIdx: number, itemIdx: number, field: keyof Item, value: any) => void;
    onRemoveItem: (roomIdx: number, itemIdx: number) => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, roomIdx, onItemChange, onRemoveItem }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
                <thead>
                    <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <th className="px-4 py-2 text-center w-12">#</th>
                        <th className="px-4 py-2 text-left">Item Description</th>
                        <th className="px-4 py-2 text-center w-24">Unit</th>
                        <th className="px-4 py-2 text-center w-48">Dimensions</th>
                        <th className="px-4 py-2 text-center w-24">Qty</th>
                        <th className="px-4 py-2 text-right w-32">Rate (₹)</th>
                        <th className="px-4 py-2 text-right w-40">Total (₹)</th>
                        <th className="px-4 py-2 text-center no-print w-10"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, itemIdx) => (
                        <tr key={itemIdx} className="group glass/20 transition-all duration-300 hover:scale-[1.01]">
                            <td className="px-4 py-4 text-center text-slate-500 font-mono text-xs bg-white/5 rounded-l-2xl">
                                {String(itemIdx + 1).padStart(2, '0')}
                            </td>
                            <td className="px-4 py-4 bg-white/5">
                                <input
                                    type="text"
                                    value={item.itemName}
                                    onChange={(e) => onItemChange(roomIdx, itemIdx, 'itemName', e.target.value)}
                                    placeholder="Enter item description..."
                                    className="w-full bg-transparent focus:ring-0 outline-none text-sm font-semibold text-white placeholder:text-slate-700"
                                />
                            </td>
                            <td className="px-4 py-4 text-center bg-white/5">
                                <select
                                    value={item.unit}
                                    onChange={(e) => onItemChange(roomIdx, itemIdx, 'unit', e.target.value)}
                                    className="bg-slate-800/80 rounded-lg px-2 py-1 font-bold text-indigo-400 text-[10px] outline-none cursor-pointer appearance-none text-center border border-white/5"
                                >
                                    <option value="sq.ft">SQ.FT</option>
                                    <option value="no.">NOS</option>
                                </select>
                            </td>
                            <td className="px-4 py-4 text-center bg-white/5 font-mono text-[11px]">
                                {item.unit === 'sq.ft' ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <input
                                            type="number"
                                            value={item.length || ''}
                                            onChange={(e) => onItemChange(roomIdx, itemIdx, 'length', e.target.value)}
                                            className="w-14 bg-slate-800/80 border border-white/5 rounded-xl p-2 text-center outline-none text-white focus:border-indigo-500/50"
                                        />
                                        <span className="text-slate-600">×</span>
                                        <input
                                            type="number"
                                            value={item.width || ''}
                                            onChange={(e) => onItemChange(roomIdx, itemIdx, 'width', e.target.value)}
                                            className="w-14 bg-slate-800/80 border border-white/5 rounded-xl p-2 text-center outline-none text-white focus:border-indigo-500/50"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-slate-700 italic">—</span>
                                )}
                            </td>
                            <td className="px-4 py-4 text-center bg-white/5">
                                <input
                                    type="number"
                                    disabled={item.unit === 'sq.ft'}
                                    value={item.qty || ''}
                                    onChange={(e) => onItemChange(roomIdx, itemIdx, 'qty', e.target.value)}
                                    className={`w-16 rounded-xl p-2 text-center text-sm font-bold ${item.unit === 'sq.ft' ? 'bg-transparent text-slate-600' : 'bg-slate-800/80 border border-white/5 text-white'}`}
                                />
                            </td>
                            <td className="px-4 py-4 text-right bg-white/5">
                                <input
                                    type="number"
                                    value={item.rate || ''}
                                    onChange={(e) => onItemChange(roomIdx, itemIdx, 'rate', e.target.value)}
                                    className="w-full bg-transparent text-right outline-none font-bold text-slate-300 focus:text-white"
                                />
                            </td>
                            <td className="px-4 py-4 text-right bg-white/5 font-bold text-indigo-400 text-sm">
                                {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-4 text-center bg-white/5 rounded-r-2xl no-print">
                                <button
                                    onClick={() => onRemoveItem(roomIdx, itemIdx)}
                                    className="p-2 text-slate-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemsTable;
