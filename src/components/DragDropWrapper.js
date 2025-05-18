import React, { useState, useRef } from 'react';

export default function DragDropWrapper({ onFileDrop, children }) {
    const [dragActive, setDragActive] = useState(false);
    const dragCounter = useRef(0);

    const handleDragEnter = (e) => {
        e.preventDefault();
        dragCounter.current += 1;
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        dragCounter.current -= 1;
        if (dragCounter.current === 0) setDragActive(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        dragCounter.current = 0;
        const file = e.dataTransfer.files?.[0];
        if (file && onFileDrop) onFileDrop(file);
    };

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ width: '100%', height: '100%' }}
        >
            {children}
            {dragActive && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex flex-col items-center justify-center">
                    <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                    </svg>
                    <div className="text-white text-xl mt-4 font-semibold">Thả file vào đây để tải lên</div>
                </div>
            )}
        </div>
    );
}