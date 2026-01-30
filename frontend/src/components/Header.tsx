import React from 'react';
import { Save, FileDown } from 'lucide-react';

interface HeaderProps {
    onSave: () => void;
    onDownload: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSave, onDownload }) => {
    return (
        <header className="section flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1>
                    Interior Studio Pro
                </h1>
                <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                    Professional Billing & Estimation
                </p>
            </div>

            <div className="flex items-center gap-3 no-print">
                <button
                    onClick={onDownload}
                >
                    <FileDown size={18} />
                    <span>Export Document</span>
                </button>
                <button
                    onClick={onSave}
                    className="primary"
                >
                    <Save size={18} />
                    <span>Save Changes</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
