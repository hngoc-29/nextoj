'use client';
import React, { useState, createContext, useContext } from 'react';


// Create the UserContext
const UserContestContext = createContext(undefined);

export function useUserContest() {
    const context = useContext(UserContestContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export default function UserContestProvider({ children }) {
    const [userContest, setUserContest] = useState([]);

    return (
        <UserContestContext.Provider value={{ userContest, setUserContest }}>
            {children}
        </UserContestContext.Provider>
    );
}
