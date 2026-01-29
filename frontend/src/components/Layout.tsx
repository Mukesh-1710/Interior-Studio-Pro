import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen pt-8 px-4 md:px-8 max-w-7xl mx-auto selection:bg-indigo-500/30 selection:text-indigo-200">
            {children}
        </div>
    );
};

export default Layout;
