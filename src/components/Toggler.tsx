"use client";

import React from "react";

interface TogglerOption {
    value: string;
    label: string | React.ReactNode;
}
interface TogglerProps {
    options: TogglerOption[];
    value: string;
    optionHandler: (value: string) => void;
}

export default function Toggler({
    options,
    value,
    optionHandler,
}: TogglerProps) {
    const activeIndex = options.findIndex((opt) => opt.value === value);

    const sliderWidth = 100 / options.length;
    return (
        <div className="flex items-center justify-between h-10 bg-bgcolor rounded-full relative">
            <div
                className={`absolute h-full bg-back-link-color rounded-full z-2 transition-transform duration-300 ease-in-out`}
                style={{
                    width: `${sliderWidth}%`,
                    transform: `translateX(${activeIndex * 100}%)`,
                }}
            ></div>
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => optionHandler(option.value)}
                    className={`relative z-3 rounded-full flex-1 h-full flex items-center justify-center font-extrabold transition-colors duration-300 ${value === option.value ? "text-primary" : "text-gray-500"}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
