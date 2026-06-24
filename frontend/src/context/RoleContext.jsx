import { createContext, useState, useContext, useEffect } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    // "Comprador" o "Subastador"
    const [currentView, setCurrentView] = useState('Comprador');

    const toggleView = () => {
        setCurrentView(prev => prev === 'Comprador' ? 'Subastador' : 'Comprador');
    };

    return (
        <RoleContext.Provider value={{ currentView, setCurrentView, toggleView }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => useContext(RoleContext);
