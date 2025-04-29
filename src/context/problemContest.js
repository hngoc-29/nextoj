'use client';
import React, { useState, createContext, useContext } from 'react';


// Create the UserContext
const ProblemContestContext = createContext(undefined);

export function useProblemContest() {
    const context = useContext(ProblemContestContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export default function problemContestProvider({ children }) {
    const [problemContest, setProblemContest] = useState([]);

    return (
        <ProblemContestContext.Provider value={{ problemContest, setProblemContest }}>
            {children}
        </ProblemContestContext.Provider>
    );
}
