'use client'

import { Search } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
    return (
        <>
            <div className="relative">
                <Search className="text-primary absolute left-8 top-1/2 -translate-y-1/2" />

                <input
                    value={value}
                    onChange={onChange}
                    type="text"
                    placeholder="Enter movie name, producer or genre..."
                    className="text-xl w-full pl-20 rounded-2xl bg-input-color h-20 p-2 text-white caret-primary transition duration-200 ease-in-out placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:outline-none tracking-widest;"
                />
            </div>
        </>
    );
}