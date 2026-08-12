"use client";

import { GenreStatus } from "@/types";
import { X } from "lucide-react";

interface GenreCheckboxProps {
    genreId: number;
    name: string;
    status: GenreStatus;
    onChange: (genreId: number, nextStatus: GenreStatus) => void;
}

const getNextStatus = (currentStatus: GenreStatus) => {
    switch (currentStatus) {
        case "neutral":
            return "include";
        case "include":
            return "exclude";
        case "exclude":
            return "neutral";
        default:
            return "neutral";
    }
};

export default function GenreCheckbox({
    genreId,
    name,
    status,
    onChange,
}: GenreCheckboxProps) {
    const nextStatus = getNextStatus(status);

    return (
        <div
            onClick={() => onChange(genreId, nextStatus)}
            className="group cursor-pointer flex items-center gap-2"
        >
            <div
                className={`w-4 h-4 rounded-md transition-all duration-300 ${status === "include" ? "bg-primary" : status === "exclude" ? "bg-red-300" : "bg-gray-500"} flex items-center justify-center`}
            >
                {status === "exclude" && <X className="w-4 h-4 text-red-500" />}
            </div>
            <span>{name}</span>
        </div>
    );
}
