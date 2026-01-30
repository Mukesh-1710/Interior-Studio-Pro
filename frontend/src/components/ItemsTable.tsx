import React from 'react';
import { Item } from '../types';
import { Trash2 } from 'lucide-react';

interface ItemsTableProps {
    items: Item[];
    roomIdx: number;
    onItemChange: (roomIdx: number, itemIdx: number, field: keyof Item, value: any) => void;
    onRemoveItem: (roomIdx: number, itemIdx: number) => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, roomIdx, onItemChange, onRemoveItem }) => {
    return (
        <div style={{ marginTop: '16px' }}>
            <div className="table-header no-print">
                <div>#</div>
                <div>Description</div>
                <div>Unit</div>
                <div>Dimensions</div>
                <div style={{ textAlign: 'right' }}>Qty</div>
                <div style={{ textAlign: 'right' }}>Rate</div>
                <div style={{ textAlign: 'right' }}>Amount</div>
                <div></div>
            </div>

            <div className="item-list">
                {items.map((item, itemIdx) => (
                    <div key={itemIdx} className="item-row">
                        <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                            {itemIdx + 1}
                        </div>
                        <div>
                            <input
                                type="text"
                                value={item.itemName}
                                onChange={(e) => onItemChange(roomIdx, itemIdx, 'itemName', e.target.value)}
                                placeholder="Item name..."
                                style={{ padding: '4px 8px' }}
                            />
                        </div>
                        <div>
                            <select
                                value={item.unit}
                                onChange={(e) => onItemChange(roomIdx, itemIdx, 'unit', e.target.value)}
                                style={{ padding: '4px 8px' }}
                            >
                                <option value="sq.ft">sq.ft</option>
                                <option value="r.ft">r.ft</option>
                                <option value="pcs">pcs</option>
                                <option value="ls">ls</option>
                            </select>
                        </div>
                        <div>
                            {item.unit === 'sq.ft' ? (
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        value={item.length || ''}
                                        onChange={(e) => onItemChange(roomIdx, itemIdx, 'length', e.target.value)}
                                        style={{ padding: '4px 4px', textAlign: 'right' }}
                                        placeholder="L"
                                    />
                                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>×</span>
                                    <input
                                        type="number"
                                        value={item.width || ''}
                                        onChange={(e) => onItemChange(roomIdx, itemIdx, 'width', e.target.value)}
                                        style={{ padding: '4px 4px', textAlign: 'right' }}
                                        placeholder="W"
                                    />
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#e2e8f0' }}>—</div>
                            )}
                        </div>
                        <div>
                            <input
                                type="number"
                                value={item.qty || ''}
                                onChange={(e) => onItemChange(roomIdx, itemIdx, 'qty', e.target.value)}
                                style={{ padding: '4px 8px', textAlign: 'right' }}
                                placeholder="0"
                                disabled={item.unit === 'sq.ft'}
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                value={item.rate || ''}
                                onChange={(e) => onItemChange(roomIdx, itemIdx, 'rate', e.target.value)}
                                style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 500 }}
                                placeholder="0"
                            />
                        </div>
                        <div className="amount">
                            ₹{(item.amount || 0).toLocaleString()}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={() => onRemoveItem(roomIdx, itemIdx)}
                                className="no-print"
                                style={{ padding: '4px', border: 'none', background: 'transparent', color: '#cbd5e1' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemsTable;
