"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
    return (
        <div className="relative w-full p-0.5">
            <Search className="text-primary absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6" />

            <input
                value={value}
                onChange={onChange}
                type="text"
                placeholder="Введите название фильма или сериала"
                className="text-sm md:text-xl w-full pl-11 md:pl-20 pr-4 rounded-xl md:rounded-2xl bg-input-color h-12 md:h-20 text-white caret-primary transition duration-200 ease-in-out placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:outline-none tracking-normal md:tracking-widest"
            />
        </div>
    );
}
