'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

export default function DropdownItem({ label, children }) {
    const [open, setOpen] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const textRef = useRef(String(children));
    const doneRef = useRef(false);

    useEffect(() => {
        if (open && !doneRef.current) {
            setDisplayedText('');
            let i = 0;
            const interval = setInterval(() => {
                if (i < textRef.current.length) {
                    setDisplayedText((prev) => prev + textRef.current.charAt(i));
                    i++;
                } else {
                    clearInterval(interval);
                    doneRef.current = true;  // đánh dấu đã gõ xong
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [open]);

    return (
        <div>
            <button
                onClick={() => setOpen((x) => !x)}
                className="flex items-center gap-x-1.5 w-full"
            >
                <ChevronRight
                    size={20}
                    strokeWidth={3}
                    className={`transition-transform duration-300 ${open ? 'rotate-90' : 'rotate-0'
                        }`}
                />
                <span className="font-bold text-[15px]">{label}</span>
            </button>

            {open && (
                <div className="pl-6 pt-1 text-gray-600">
                    {doneRef.current ? (
                        <span>{textRef.current}</span>   // nếu đã gõ xong, show luôn full text
                    ) : (
                        <span>{displayedText}</span>
                    )}
                </div>
            )}
        </div>
    );
}
