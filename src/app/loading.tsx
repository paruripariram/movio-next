'use client'

import { useEffect } from "react";

export default function Loading() {
    useEffect(() => {
        document.title = "Movio";
    }, []);
    return (
        <div className="flex flex-col items-center justify-center min-h-40 col-span-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
            <p className="text-sm text-gray-500 mt-2">Please, wait...</p>
        </div>
    );
}
