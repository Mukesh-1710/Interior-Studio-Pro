import React from 'react';
import { Item } from '../types';
import ItemRow from './ItemRow';

interface ItemsTableProps {
    items: Item[];
    roomIdx: number;
    onItemChange: (roomIdx: number, itemIdx: number, field: keyof Item, value: any) => void;
    onRemoveItem: (roomIdx: number, itemIdx: number) => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, roomIdx, onItemChange, onRemoveItem }) => {
    return (
        <div className="mt-4 bg-white dark:bg-[#0B0F14]/50 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="grid grid-cols-[30px_1fr_100px_60px_60px_60px_80px_100px_100px_110px_40px] gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors">
                <div>#</div>
                <div>Description</div>
                <div>Unit</div>
                <div className="text-right">L</div>
                <div className="text-right">W</div>
                <div className="text-right">Nos</div>
                <div className="text-right">Area</div>
                <div className="text-right">Total Area</div>
                <div className="text-right">Rate</div>
                <div className="text-right">Amount</div>
                <div></div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {items.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                        No items added yet. Click "Add Item" to start.
                    </div>
                ) : (
                    items.map((item, itemIdx) => (
                        <ItemRow
                            key={itemIdx}
                            item={item}
                            roomIdx={roomIdx}
                            itemIdx={itemIdx}
                            onItemChange={onItemChange}
                            onRemoveItem={onRemoveItem}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ItemsTable;
