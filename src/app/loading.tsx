"use client";

import { useEffect } from "react";

export default function Loading() {
    useEffect(() => {
        document.title = "Movio";
    }, []);
    return (
        <div className="flex flex-col items-center justify-center flex-1 w-full col-span-full">
            <div className="animate-spin rounded-full h-36 w-36 border-12 border-gray-200 border-t-blue-500"></div>
            <p className="text-xl text-gray-500 mt-2">
                Пожалуйста, подождите...
            </p>
        </div>
    );
}
