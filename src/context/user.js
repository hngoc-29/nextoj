'use client';
import React, { useState, createContext, useContext } from 'react';


// Create the UserContext
const UserContext = createContext(undefined);

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export default function UserProvider({ children }) {
    const [user, setUser] = useState({
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
