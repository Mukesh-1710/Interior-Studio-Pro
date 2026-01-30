import React from 'react';
import { FileDown } from 'lucide-react';

interface TotalsCardProps {
    grandTotal: number;
    onDownload: () => void;
}

const TotalsCard: React.FC<TotalsCardProps> = ({ grandTotal, onDownload }) => {
    return (
        <div className="total-bar no-print">
            <div className="total-bar-content">
                <div>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Total Project Valuation</p>
                    <p style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb' }}>₹{grandTotal.toLocaleString()}</p>
                </div>

                <button
                    onClick={onDownload}
                    className="primary"
                    style={{ padding: '12px 24px', fontSize: '15px' }}
                >
                    <FileDown size={20} />
                    <span>Export PDF Document</span>
                </button>
            </div>
        </div>
    );
};

export default TotalsCard;
