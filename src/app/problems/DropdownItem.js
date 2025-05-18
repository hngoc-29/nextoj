'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

export default function DropdownItem({ label, children }) {
    const [open, setOpen] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const textRef = useRef(typeof children === 'string' ? children : '');

    useEffect(() => {
        textRef.current = typeof children === 'string' ? children : '';
        setDisplayedText('');
    }, [children]);

    useEffect(() => {
        let interval;
        if (open && textRef.current) {
            setDisplayedText('');
            let i = 0;
            interval = setInterval(() => {
                setDisplayedText((prev) => {
                    if (i < textRef.current.length) {
                        const next = prev + textRef.current.charAt(i);
                        i++;
                        return next;
                    } else {
                        clearInterval(interval);
                        return textRef.current;
                    }
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [open, children]);

    return (
        <div>
            <button
                onClick={() => setOpen((x) => !x)}
                className="flex items-center gap-x-1.5 w-full"
            >
                <ChevronRight
                    size={20}
                    strokeWidth={3}
                    className={`transition-transform duration-300 ${open ? 'rotate-90' : 'rotate-0'}`}
                />
                <span className="font-bold text-[15px]">{label}</span>
            </button>

            {open && (
                <div className="pl-6 pt-1 text-gray-600">
                    <span>
                        {typeof children === 'string' ? displayedText : children}
                    </span>
                </div>
            )}
        </div>
    );
}
