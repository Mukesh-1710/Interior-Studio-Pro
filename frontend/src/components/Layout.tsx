import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="app">
            {children}
        </div>
    );
};

export default Layout;
