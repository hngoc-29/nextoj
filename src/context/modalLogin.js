'use client';
import React, { useState, createContext, useContext } from 'react';

// Create the UserContext
const LoginContext = createContext(undefined);

export function useIsOpen() {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error('useIsOpen must be used within a LoadingProvider');
    }
    return context;
}

export default function LoadingProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <LoginContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </LoginContext.Provider>
    );
}
